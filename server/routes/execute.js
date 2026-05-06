const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const vm = require('vm');

// Hardcoded problem for Day 5 (Two Sum)
const twoSumTestCases = [
  { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
  { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
  { input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
];

router.post('/', auth, async (req, res) => {
  const { code, problemId } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }

  // Right now we only support 'simple-two-sum'
  const testCases = twoSumTestCases;
  let passedCount = 0;
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const { input, expected } = testCases[i];
    
    // We expect the user's code to declare a function named twoSum
    // E.g. function twoSum(nums, target) { ... }
    
    const sandbox = {
      nums: input.nums,
      target: input.target,
      console: {
        log: () => {}, // mock console log to prevent clogging
      }
    };

    try {
      const script = new vm.Script(`
        ${code}
        // Call the function with our test case
        twoSum(nums, target);
      `);

      const context = vm.createContext(sandbox);
      const result = script.runInContext(context, { timeout: 2000 }); // 2 second timeout

      // Simple array equality check
      const isCorrect = Array.isArray(result) && 
                        result.length === expected.length && 
                        result.every((val, index) => val === expected[index]);

      results.push({
        testCase: i + 1,
        passed: isCorrect,
        output: result,
        expected: expected,
        input: input
      });

      if (isCorrect) passedCount++;

    } catch (err) {
      results.push({
        testCase: i + 1,
        passed: false,
        error: err.message
      });
    }
  }

  const passedAll = passedCount === testCases.length;

  res.json({
    success: true,
    passedAll,
    passedCount,
    totalCount: testCases.length,
    results
  });
});

module.exports = router;
