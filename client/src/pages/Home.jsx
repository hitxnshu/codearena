import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Swords, Trophy, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';


const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openBattles, setOpenBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchOpenBattles();
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

  if (!user) return null;

  return (
    <div className="home-page">
      <Navbar onAction={handleCreateBattle} />

      <div className="hero-background" style={{ position: 'fixed', zIndex: -1, pointerEvents: 'none' }}>
        <div className="orb orb-1" style={{ top: '10%' }} />
        <div className="orb orb-2" style={{ bottom: '15%' }} />
      </div>

      <main className="home-main">
        <section className="hero-container" style={{ margin: '2rem auto 4rem', maxWidth: '1200px' }}>
          <div className="hero-content">
            <div className="hero-brand" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>
              <Trophy size={18} className="brand-icon" />
              <span>Welcome Back, {user.name}</span>
            </div>
            
            <h1 className="hero-title" style={{ fontSize: '3.5rem' }}>
              Ready for your next<br/>
              <span className="highlight-gradient">Coding Battle?</span>
            </h1>
            
            <p className="hero-subtitle">
              Jump into fast-paced coding battles, solve algorithmic challenges, and climb the global leaderboard.
            </p>
            
            <div className="hero-actions">
              <button className="btn cta-primary" onClick={handleCreateBattle} disabled={creating} style={{ padding: '0.8rem 1.5rem', gap: '0.5rem' }}>
                {creating ? <Loader2 size={20} className="spin" /> : <Swords size={20} />}
                Create Match
              </button>
              <button className="btn cta-secondary" onClick={() => document.getElementById('battles-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '0.8rem 1.5rem' }}>
                Explore Open Battles
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="battle-preview-card glass" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
              <div className="preview-header">
                <div className="live-badge" style={{ color: '#60a5fa' }}>
                  <span className="live-dot" style={{ background: '#60a5fa' }}></span> STATS
                </div>
                <div className="timer-display">{user.rating || 1200} ELO</div>
              </div>

              <div className="preview-problem">
                <span className="difficulty" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '600' }}>Current Rank</span>
                <span className="problem-name">Silver I</span>
              </div>

              <div className="preview-competitors" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '0' }}>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="comp-name" style={{ color: 'var(--text-muted)' }}>Win Rate</span>
                    <span className="comp-score">
                      {user.stats?.totalBattles ? Math.round((user.stats?.wins / user.stats?.totalBattles) * 100) : 0}%
                    </span>
                  </div>
                  <div className="comp-bar-bg"><div className="comp-bar-fill fill-1" style={{ width: `${user.stats?.totalBattles ? Math.round((user.stats?.wins / user.stats?.totalBattles) * 100) : 0}%` }}></div></div>
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Battles</span>
                    <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>{user.stats?.totalBattles || 0}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Wins</span>
                    <span style={{ fontWeight: '700', fontSize: '1.25rem', color: '#4ade80' }}>{user.stats?.wins || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="battles-section" className="battle-section">
          <div className="battle-summary glass">
            <div className="summary-head">
              <h2>Welcome back, {user.name}</h2>
              <p>Track your progress and jump into the next match.</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <span>Rating</span>
                <strong>{user.rating} ELO</strong>
              </div>
              <div className="stat-card">
                <span>Battles</span>
                <strong>{user.stats?.totalBattles || 0}</strong>
              </div>
              <div className="stat-card">
                <span>Wins</span>
                <strong>{user.stats?.wins || 0}</strong>
              </div>
              <div className="stat-card">
                <span>Losses</span>
                <strong>{user.stats?.losses || 0}</strong>
              </div>
            </div>
          </div>

          <div className="battle-list glass">
            <div className="list-header">
              <h3>Open Battles</h3>
              <button className="btn" onClick={handleCreateBattle} disabled={creating}>
                {creating ? <Loader2 size={16} className="spin" /> : 'Create Room'}
              </button>
            </div>
            <div className="battle-items">
              {loading ? (
                <div className="empty-state">Loading battles...</div>
              ) : openBattles.length === 0 ? (
                <div className="empty-state">No open battles right now. Create one to get started.</div>
              ) : (
                openBattles.map((battle) => (
                  <div key={battle._id} className="battle-item">
                    <div>
                      <p className="battle-owner">{battle.players[0]?.name}'s Room</p>
                      <span>Rating: {battle.players[0]?.rating}</span>
                    </div>
                    <button className="btn small-btn" onClick={() => handleJoinBattle(battle._id)}>
                      Join
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Home;
