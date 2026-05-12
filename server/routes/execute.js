const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Hardcoded test cases for evaluation
const twoSumTestCases = [
  { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
  { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
  { input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
];

function generateDriverCode(language, userCode) {
  switch(language) {
    case 'javascript':
      return `
${userCode}

const testCases = [
  { nums: [2, 7, 11, 15], target: 9 },
  { nums: [3, 2, 4], target: 6 },
  { nums: [3, 3], target: 6 }
];

const results = testCases.map(tc => {
  try {
     return twoSum(tc.nums, tc.target);
  } catch(e) {
     return { error: e.message };
  }
});
console.log(JSON.stringify(results));
`;
    case 'cpp':
      return `
#include <iostream>
#include <vector>
using namespace std;

${userCode}

int main() {
    Solution sol;
    try {
      vector<int> nums1 = {2, 7, 11, 15};
      vector<int> res1 = sol.twoSum(nums1, 9);
      
      vector<int> nums2 = {3, 2, 4};
      vector<int> res2 = sol.twoSum(nums2, 6);
      
      vector<int> nums3 = {3, 3};
      vector<int> res3 = sol.twoSum(nums3, 6);

      cout << "["
           << "[" << res1[0] << "," << res1[1] << "],"
           << "[" << res2[0] << "," << res2[1] << "],"
           << "[" << res3[0] << "," << res3[1] << "]"
           << "]" << endl;
    } catch(...) {
      cout << "Runtime Error" << endl;
    }
    return 0;
}
`;
    case 'java':
      return `
import java.util.*;

${userCode}

public class Main {
    public static void main(String[] args) {
        try {
            Solution sol = new Solution();
            int[] nums1 = {2, 7, 11, 15};
            int[] res1 = sol.twoSum(nums1, 9);
            
            int[] nums2 = {3, 2, 4};
            int[] res2 = sol.twoSum(nums2, 6);
            
            int[] nums3 = {3, 3};
            int[] res3 = sol.twoSum(nums3, 6);

            System.out.println("[[" + res1[0] + "," + res1[1] + "],[" + res2[0] + "," + res2[1] + "],[" + res3[0] + "," + res3[1] + "]]");
        } catch(Exception e) {
            System.out.println("Runtime Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
`;
    case 'c':
      return `
#include <stdio.h>
#include <stdlib.h>

${userCode}

int main() {
    int nums1[] = {2, 7, 11, 15};
    int rs1;
    int* res1 = twoSum(nums1, 4, 9, &rs1);

    int nums2[] = {3, 2, 4};
    int rs2;
    int* res2 = twoSum(nums2, 3, 6, &rs2);

    int nums3[] = {3, 3};
    int rs3;
    int* res3 = twoSum(nums3, 2, 6, &rs3);

    printf("[[%d,%d],[%d,%d],[%d,%d]]\\n", res1[0], res1[1], res2[0], res2[1], res3[0], res3[1]);
    
    if(res1) free(res1);
    if(res2) free(res2);
    if(res3) free(res3);
    return 0;
}
`;
    default:
      return userCode;
  }
}

router.post('/', auth, async (req, res) => {
  const { code, language = 'javascript' } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }

  const driverCode = generateDriverCode(language, code);
  
  try {
    // Map frontend language names to Piston API language names
    const languageMap = {
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'javascript': 'javascript'
    };
    
    const pistonLanguage = languageMap[language] || language;

    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language: pistonLanguage,
        version: '*',
        files: [
          {
            name: language === 'java' ? 'Main.java' : (language === 'cpp' ? 'main.cpp' : 'main'),
            content: driverCode
          }
        ],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Piston API Error:", response.status, errorText);
      return res.status(500).json({ 
        message: 'Piston API error',
        details: errorText 
      });
    }

    const data = await response.json();

    if (data.compile && data.compile.code !== 0) {
      return res.json({
        success: false,
        error: "Compilation Error:\n" + data.compile.output
      });
    }

    if (data.run && data.run.code !== 0) {
      return res.json({
        success: false,
        error: "Runtime Error:\n" + data.run.output
      });
    }

    if (!data.run) {
      return res.json({
        success: false,
        error: "Execution Error: Missing run output from compilation engine.\nRaw Response: " + JSON.stringify(data)
      });
    }

    // Try to parse stdout as JSON (an array of arrays representing the 3 outputs)
    let userOutputs;
    try {
      userOutputs = JSON.parse(data.run.stdout.trim());
    } catch(e) {
      // If it doesn't parse to JSON, they probably have print statements messing it up or it segfaulted silently
      return res.json({
        success: false,
        error: "Execution failed to return expected output format. Did you print something to stdout?\n\nRaw Output:\n" + data.run.stdout
      });
    }

    let passedCount = 0;
    const results = [];

    for (let i = 0; i < twoSumTestCases.length; i++) {
      const expected = twoSumTestCases[i].expected;
      const output = userOutputs[i];
      
      let isCorrect = false;
      if (Array.isArray(output) && output.length === expected.length) {
        isCorrect = output.every((val, index) => val === expected[index]);
      } else if (output && output.error) {
        isCorrect = false;
      }

      results.push({
        testCase: i + 1,
        passed: isCorrect,
        output: output,
        expected: expected,
        input: twoSumTestCases[i].input,
        error: output && output.error ? output.error : null
      });

      if (isCorrect) passedCount++;
    }

    res.json({
      success: true,
      passedAll: passedCount === twoSumTestCases.length,
      passedCount,
      totalCount: twoSumTestCases.length,
      results
    });

  } catch (error) {
    console.error("Execution Engine Error:", error);
    res.status(500).json({ 
      message: 'Internal server error evaluating code',
      details: error.message 
    });
  }
});

module.exports = router;
