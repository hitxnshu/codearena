import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Users, Clock, Play, Loader2, CheckCircle, XCircle, Send, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import confetti from 'canvas-confetti';

const Battle = () => {
  const { id: battleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [socket, setSocket] = useState(null);
  const [code, setCode] = useState('function twoSum(nums, target) {\n  // Write your solution here\n  \n}');
  const [opponent, setOpponent] = useState(null);
  const [battleStatus, setBattleStatus] = useState('waiting'); // waiting, active, finished
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [executing, setExecuting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [winner, setWinner] = useState(null);
  
  const editorRef = useRef(null);

  // Initialize socket and fetch battle details
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

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

    const fetchBattle = async () => {
      setLoading(false);
    };
    
    fetchBattle();

    return () => newSocket.disconnect();
  }, [battleId, user, navigate]);

  // Timer logic
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
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3b82f6', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3b82f6', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleEditorChange = (value) => {
    setCode(value);
    if (socket) {
      socket.emit('codeUpdate', { battleId, code: value });
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRunCode = async () => {
    if (battleStatus !== 'active') return;
    setExecuting(true);
    setResults(null);
    
    try {
      const res = await axios.post('http://localhost:5000/api/execute', { code, problemId: 'simple-two-sum' });
      setResults({ ...res.data, isSubmit: false });
    } catch (err) {
      setResults({ error: err.response?.data?.message || 'Execution failed', isSubmit: false });
    } finally {
      setExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    if (battleStatus !== 'active') return;
    setSubmitting(true);
    setResults(null);
    
    try {
      const res = await axios.post('http://localhost:5000/api/execute', { code, problemId: 'simple-two-sum' });
      setResults({ ...res.data, isSubmit: true });
      
      if (res.data.passedAll) {
        socket.emit('submitCode', { battleId, user });
      }
    } catch (err) {
      setResults({ error: err.response?.data?.message || 'Submission failed', isSubmit: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}><Loader2 className="spin" size={32} /></div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-color)', position: 'relative' }}>
      
      {/* Victory Overlay Modal */}
      {battleStatus === 'finished' && (
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
          zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: winner === user.name ? 'var(--success)' : 'var(--error)'
        }}>
          <div className="auth-card glass" style={{ textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(30, 41, 59, 0.9)' }}>
            {winner === user.name ? <Trophy size={80} style={{ marginBottom: '1rem' }} /> : <XCircle size={80} style={{ marginBottom: '1rem' }} />}
            <h2 className={winner === user.name ? "win-animation" : ""} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              {winner === user.name ? 'Victory!' : `${winner} Won!`}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The battle has ended. Your rating has been updated.</p>
            <button className="btn" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }} onClick={() => navigate('/')}>Return to Lobby</button>
          </div>
        </div>
      )}

      {/* Header Panel */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: 'var(--bg-color-light)', borderBottom: '1px solid #334155' }}>
        <h2 className="auth-title" style={{ margin: 0, fontSize: '1.5rem' }}>CodeArena Battle</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color={battleStatus === 'active' ? 'var(--success)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {formatTime(timer)}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(15, 23, 42, 0.5)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.rating} ELO</div>
            </div>
            <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>VS</span>
            <div>
              <div style={{ fontWeight: 'bold', color: opponent ? 'var(--error)' : 'var(--text-muted)' }}>
                {opponent ? opponent.name : 'Waiting...'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {opponent ? `${opponent.rating} ELO` : '--'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn" 
            style={{ background: '#334155', color: 'white', gap: '0.5rem' }} 
            onClick={handleRunCode}
            disabled={executing || submitting || battleStatus !== 'active'}
          >
            {executing ? <Loader2 size={16} className="spin" /> : <Play size={16} />}
            {executing ? 'Running...' : 'Run Code'}
          </button>
          
          <button 
            className="btn" 
            style={{ background: 'var(--success)', gap: '0.5rem' }} 
            onClick={handleSubmitCode}
            disabled={executing || submitting || battleStatus !== 'active'}
          >
            {submitting ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', pointerEvents: battleStatus === 'finished' ? 'none' : 'auto' }}>
        
        {/* Problem Panel */}
        <div style={{ width: '40%', padding: '1.5rem', overflowY: 'auto', borderRight: '1px solid #334155' }}>
          {battleStatus === 'waiting' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', textAlign: 'center' }}>
              <Loader2 className="spin" size={48} style={{ marginBottom: '1rem' }} />
              <h3>Waiting for opponent...</h3>
              <p>Wait for someone to join from the lobby.</p>
            </div>
          ) : (
            <div>
              <h2 style={{ marginBottom: '1rem' }}>Two Sum</h2>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Easy</span>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.
                You may assume that each input would have exactly one solution, and you may not use the same element twice.
              </p>
              
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Example 1:</h4>
                <code style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary)' }}>Input: nums = [2,7,11,15], target = 9</code>
                <code style={{ display: 'block', color: 'var(--success)' }}>Output: [0,1]</code>
              </div>
            </div>
          )}
        </div>

        {/* Editor Panel */}
        <div style={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                padding: { top: 16 },
                readOnly: battleStatus !== 'active'
              }}
            />
          </div>
          {/* Console / Output Area */}
          <div style={{ height: '35%', background: '#1e1e1e', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0.5rem 1rem', background: '#2d2d2d', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.875rem' }}>
              Test Results
            </div>
            
            <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
              {battleStatus === 'waiting' && <div style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>Compiler will be ready when battle starts...</div>}
              
              {!results && battleStatus === 'active' && <div style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>You must run your code first.</div>}

              {results && !results.error && !results.results?.some(r => r.error) && (
                <div style={{ fontFamily: 'monospace' }}>
                  <div style={{ marginBottom: '1rem', color: results.passedAll ? 'var(--success)' : 'var(--error)', fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {results.passedAll ? 'Accepted' : 'Wrong Answer'}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {results.results.map((res, idx) => (
                      <div key={idx} style={{ flex: '0 0 auto', width: '280px', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderTop: `4px solid ${res.passed ? 'var(--success)' : 'var(--error)'}` }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          Test Case {res.testCase} {res.passed ? <CheckCircle size={16} color="var(--success)" /> : <XCircle size={16} color="var(--error)" />}
                        </div>
                        
                        <div style={{ fontSize: '0.875rem' }}>
                          <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Input:</div>
                          <div style={{ marginBottom: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>{JSON.stringify(res.input)}</div>
                          
                          <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Expected Output:</div>
                          <div style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>{JSON.stringify(res.expected)}</div>
                          
                          <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Your Output:</div>
                          <div style={{ color: res.passed ? 'var(--success)' : 'var(--error)', background: res.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                            {JSON.stringify(res.output)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(results?.error || results?.results?.some(r => r.error)) && (
                <div style={{ fontFamily: 'monospace' }}>
                  <div style={{ marginBottom: '1rem', color: 'var(--error)', fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={20} /> {results?.error ? 'Execution Error' : 'Runtime / Syntax Error'}
                  </div>
                  <div style={{ color: 'var(--error)', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', whiteSpace: 'pre-wrap', fontSize: '1.1rem' }}>
                    {results?.error || results?.results?.find(r => r.error)?.error}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .win-animation {
          animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          transform: scale(0);
        }
        @keyframes pop {
          to { transform: scale(1); }
        }
        
        /* Custom scrollbar for horizontal test cases */
        ::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2); 
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2); 
        }
      `}</style>
    </div>
  );
};

export default Battle;
