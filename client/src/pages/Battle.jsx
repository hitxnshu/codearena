import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Users, Clock, Play, Loader2 } from 'lucide-react';
import axios from 'axios';

const Battle = () => {
  const { id: battleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [socket, setSocket] = useState(null);
  const [code, setCode] = useState('// Write your solution here\n');
  const [opponent, setOpponent] = useState(null);
  const [battleStatus, setBattleStatus] = useState('waiting'); // waiting, active, finished
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const editorRef = useRef(null);

  // Initialize socket and fetch battle details
  useEffect(() => {
    // Basic auth check
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
      // If we are already the host, the joined user is our opponent
      if (joinedUser.id !== user.id) {
        setOpponent(joinedUser);
        setBattleStatus('active');
        newSocket.emit('startBattle', { battleId });
      }
    });

    newSocket.on('battleStarted', () => {
      setBattleStatus('active');
    });

    newSocket.on('codeUpdate', (newCode) => {
      // We could display this, but for a battle, usually you don't see opponent's exact code live.
      // But for Day 3 scope, let's log it or show a "typing" indicator.
      // For now, we will just keep our own code in state.
    });

    // Fetch initial battle state to see if there's already an opponent
    const fetchBattle = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/battles/open`); // This fetches open, but we need specific.
        // Actually, we don't have a GET /api/battles/:id yet. 
        // For now, rely on socket events for basic state.
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
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

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}><Loader2 className="spin" size={32} /></div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-color)' }}>
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

        <div>
          <button className="btn" style={{ background: 'var(--success)', gap: '0.5rem' }}>
            <Play size={16} /> Run Code
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Problem Panel */}
        <div style={{ width: '40%', padding: '1.5rem', overflowY: 'auto', borderRight: '1px solid #334155' }}>
          {battleStatus === 'waiting' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', textAlign: 'center' }}>
              <Loader2 className="spin" size={48} style={{ marginBottom: '1rem' }} />
              <h3>Waiting for opponent...</h3>
              <p>Share this URL or wait for someone to join from the lobby.</p>
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
                readOnly: battleStatus === 'waiting'
              }}
            />
          </div>
          {/* Console / Output Area */}
          <div style={{ height: '30%', background: '#1e1e1e', borderTop: '1px solid #334155', padding: '1rem' }}>
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Output Console</h4>
            <div style={{ fontFamily: 'monospace', color: 'var(--text-color)' }}>
              {battleStatus === 'waiting' ? 'Compiler will be ready when battle starts...' : 'Ready.'}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Battle;
