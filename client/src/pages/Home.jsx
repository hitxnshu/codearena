import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Swords, Trophy, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openBattles, setOpenBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchOpenBattles();
    // Refresh battle list every 5 seconds
    const interval = setInterval(fetchOpenBattles, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOpenBattles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/battles/open');
      setOpenBattles(res.data);
    } catch (err) {
      console.error('Error fetching battles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBattle = async () => {
    setCreating(true);
    try {
      const res = await axios.post('http://localhost:5000/api/battles/create');
      navigate(`/battle/${res.data._id}`);
    } catch (err) {
      console.error('Error creating battle:', err);
      alert('Failed to create battle');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinBattle = async (battleId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/battles/join/${battleId}`);
      navigate(`/battle/${res.data._id}`);
    } catch (err) {
      console.error('Error joining battle:', err);
      if (err.response?.status === 400 && err.response.data.message === 'You are already in this battle') {
        navigate(`/battle/${battleId}`);
      } else {
        alert(err.response?.data?.message || 'Failed to join battle');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 className="auth-title" style={{ margin: 0, textAlign: 'left' }}>CodeArena</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Welcome, <strong>{user.name}</strong></span>
          <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #334155' }}>
            <LogOut size={16} style={{ marginRight: '8px' }} /> Logout
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Profile Stats Card */}
        <div className="auth-card glass" style={{ padding: '2rem', width: 'auto', maxWidth: 'none', alignSelf: 'start' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '50%' }}>
              <Trophy size={24} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Your Rating</h2>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {user.rating} ELO
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Battles</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{user.stats?.totalBattles || 0}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Wins</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--success)' }}>{user.stats?.wins || 0}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Losses</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--error)' }}>{user.stats?.losses || 0}</div>
            </div>
          </div>
        </div>

        {/* Matchmaking Card */}
        <div className="auth-card glass" style={{ padding: '2rem', width: 'auto', maxWidth: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Swords color="var(--success)" /> Open Battles
            </h2>
            <button 
              onClick={handleCreateBattle} 
              disabled={creating}
              className="btn" 
              style={{ background: 'var(--primary)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              {creating ? <Loader2 size={16} className="spin" /> : 'Create Room'}
            </button>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', padding: '1rem', minHeight: '200px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Loading battles...</div>
            ) : openBattles.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                No open battles right now. Create one to get started!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {openBattles.map((battle) => (
                  <div key={battle._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.8)', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{battle.players[0]?.name}'s Room</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Rating: {battle.players[0]?.rating}</div>
                    </div>
                    <button 
                      onClick={() => handleJoinBattle(battle._id)}
                      className="btn" 
                      style={{ background: 'var(--success)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            )}
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

export default Home;
