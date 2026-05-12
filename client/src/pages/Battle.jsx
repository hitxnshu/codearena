import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Users, Clock, Play, Loader2, CheckCircle, XCircle, Send, AlertTriangle, Trophy } from 'lucide-react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import Navbar from '../components/Navbar';

const BOILERPLATES = {
  javascript: 'function twoSum(nums, target) {\n  // Write your solution here\n  \n}',
  java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{0, 0};\n    }\n}',
  cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {0, 0};\n    }\n};',
  c: '/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your solution here\n    int* res = malloc(2 * sizeof(int));\n    res[0] = 0; res[1] = 0;\n    return res;\n}'
};

const Battle = () => {
  const { id: battleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [socket, setSocket] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(BOILERPLATES['javascript']);
  const [opponent, setOpponent] = useState(null);
  const [battleStatus, setBattleStatus] = useState('waiting');
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [roomError, setRoomError] = useState(null);
  
  const [executing, setExecuting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [winner, setWinner] = useState(null);
  
  const editorRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    let isMounted = true;
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    const fetchBattle = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/battles/${battleId}`);
        if (!isMounted) return;
        if (res.data.status === 'finished') {
          navigate('/');
          return;
        }
      } catch (err) {
        if (!isMounted) return;
        navigate('/');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBattle();

    newSocket.on('connect', () => {
      newSocket.emit('joinRoom', { battleId, user });
    });

    newSocket.on('playerJoined', (joinedUser) => {
      if (joinedUser.id !== user.id) {
        setOpponent(joinedUser);
        setBattleStatus('active');
        newSocket.emit('startBattle', { battleId });
      }
    });

    newSocket.on('battleStarted', () => {
      setBattleStatus('active');
    });

    newSocket.on('battleEnded', ({ winnerName }) => {
      setBattleStatus('finished');
      setWinner(winnerName);
      if (winnerName === user.name) {
        triggerConfetti();
      }
    });

    newSocket.on('opponentLeft', () => {
      setRoomError('Opponent disconnected. Returning to lobby...');
      setBattleStatus('finished');
      setTimeout(() => navigate('/'), 2500);
    });

    newSocket.on('roomError', ({ message }) => {
      setRoomError(message || 'Battle is unavailable. Redirecting...');
      setBattleStatus('finished');
      setTimeout(() => navigate('/'), 2500);
    });

    return () => {
      isMounted = false;
      if (newSocket.connected) {
        newSocket.emit('leaveRoom', { battleId, user });
        newSocket.disconnect();
      }
    };
  }, [battleId, user, navigate]);

  useEffect(() => {
    let interval;
    if (battleStatus === 'active') {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [battleStatus]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#3b82f6', '#10b981'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#3b82f6', '#10b981'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(BOILERPLATES[newLang]);
  };

  const handleEditorChange = (value) => {
    setCode(value);
    if (socket) {
      socket.emit('codeUpdate', { battleId, code: value });
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const executeCode = async (isSubmit) => {
    if (battleStatus !== 'active') return;
    isSubmit ? setSubmitting(true) : setExecuting(true);
    setResults(null);
    
    try {
      const res = await axios.post('http://localhost:5000/api/execute', { 
        code, 
        language, 
        problemId: 'simple-two-sum' 
      });
      setResults({ ...res.data, isSubmit });
      
      if (isSubmit && res.data.passedAll) {
        socket.emit('submitCode', { battleId, user });
      }
    } catch (err) {
      setResults({ error: err.response?.data?.message || 'Execution failed', isSubmit });
    } finally {
      isSubmit ? setSubmitting(false) : setExecuting(false);
    }
  };

  if (loading) {
    return <div className="page-loader"><Loader2 className="spin" size={36} /></div>;
  }

  return (
    <div className="battle-page">
      <Navbar onAction={() => navigate('/')} />

      {roomError && (
        <div className="battle-alert glass">
          <p>{roomError}</p>
        </div>
      )}

      {battleStatus === 'finished' && (
        <div className="overlay-panel">
          <div className="finish-card glass">
            {roomError ? <AlertTriangle size={80} /> : winner === user.name ? <Trophy size={80} /> : <XCircle size={80} />}
            <h2>{roomError ? 'Battle unavailable' : winner === user.name ? 'Victory!' : `${winner} Won!`}</h2>
            <p>{roomError ? roomError : 'The battle has ended. Your rating has been updated.'}</p>
            <button className="btn" onClick={() => navigate('/')}>Return to Lobby</button>
          </div>
        </div>
      )}

      <main className="battle-main">
        <section className="battle-info glass">
          <div>
            <p className="eyebrow">Live Code Duel</p>
            <h1>Battle {battleId.slice(-6).toUpperCase()}</h1>
            <p>Opponent: {opponent?.name || 'Waiting for challenger...'}</p>
          </div>
          <div className="battle-meta">
            <div>
              <span>Status</span>
              <strong>{battleStatus}</strong>
            </div>
            <div>
              <span>Timer</span>
              <strong>{formatTime(timer)}</strong>
            </div>
          </div>
        </section>

        <section className="editor-panel glass">
          <div className="editor-toolbar">
            <div className="editor-tabs">
              <button className={language === 'javascript' ? 'active' : ''} onClick={() => setLanguage('javascript')}>JavaScript</button>
              <button className={language === 'cpp' ? 'active' : ''} onClick={() => setLanguage('cpp')}>C++</button>
              <button className={language === 'java' ? 'active' : ''} onClick={() => setLanguage('java')}>Java</button>
              <button className={language === 'c' ? 'active' : ''} onClick={() => setLanguage('c')}>C</button>
            </div>
            <div className="editor-actions">
              <button className="btn small-btn" onClick={() => executeCode(false)} disabled={!opponent || executing}>Run</button>
              <button className="btn small-btn" onClick={() => executeCode(true)} disabled={!opponent || submitting}>Submit</button>
            </div>
          </div>

          <Editor
            height="520px"
            language={language === 'c' || language === 'cpp' ? 'cpp' : language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              readOnly: battleStatus !== 'active'
            }}
          />
        </section>

        <section className="results-panel glass">
          <div className="results-header">
            <h3>Battle Results</h3>
            <span>{results?.isSubmit ? 'Submit' : 'Run'} output</span>
          </div>
          <div className="results-content">
            {results ? (
              results.error ? (
                <div className="result-error">{results.error}</div>
              ) : (
                <pre>{JSON.stringify(results, null, 2)}</pre>
              )
            ) : (
              <div className="result-empty">Execute code to see results.</div>
            )}
          </div>
        </section>
      </main>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .page-loader {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          color: white;
          background: var(--bg-color);
        }

        .overlay-panel {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .finish-card {
          width: min(560px, calc(100% - 2rem));
          padding: 2rem;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 30px 60px rgba(0,0,0,0.35);
        }

        .battle-main {
          display: grid;
          grid-template-columns: 320px 1.5fr 1fr;
          gap: 1.5rem;
          padding: 1.5rem;
        }

        .battle-info {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 440px;
        }

        .battle-info .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--primary);
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .battle-info h1 {
          margin: 0 0 1rem;
          font-size: 2rem;
          line-height: 1.1;
        }

        .battle-meta {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 1.5rem;
        }

        .battle-meta div span {
          display: block;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .editor-panel {
          display: flex;
          flex-direction: column;
          min-height: 640px;
          overflow: hidden;
        }

        .editor-toolbar {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .editor-tabs button {
          border: none;
          background: rgba(255,255,255,0.04);
          color: white;
          padding: 0.7rem 1rem;
          border-radius: 999px;
          margin-right: 0.5rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .editor-tabs button.active,
        .editor-tabs button:hover {
          background: rgba(59,130,246,0.22);
        }

        .editor-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .results-panel {
          display: flex;
          flex-direction: column;
          min-height: 440px;
          padding: 1.5rem;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .results-header h3 {
          margin: 0;
        }

        .results-content {
          flex: 1;
          padding: 1rem;
          background: rgba(15,23,42,0.55);
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.08);
          overflow: auto;
          color: var(--text-muted);
        }

        .result-error {
          color: var(--error);
          white-space: pre-wrap;
        }

        .result-empty {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default Battle;
