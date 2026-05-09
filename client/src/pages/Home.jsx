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

      <main className="home-main">
        <section className="hero-panel glass">
          <div className="hero-copy">
            <span className="eyebrow">Play It The Way You Want</span>
            <h1>Play, create and own your own gaming team anywhere, anytime.</h1>
            <p>Jump into fast-paced coding battles, build your squad, and compete with challengers on a sleek pro platform.</p>
            <div className="hero-actions">
              <button className="btn hero-btn" onClick={handleCreateBattle} disabled={creating}>
                {creating ? <Loader2 size={16} className="spin" /> : 'Go to Gaming World'}
              </button>
              <button className="text-btn" type="button" onClick={() => document.getElementById('battles-section')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Teams
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-card glass">
              <div className="hero-visual-glow" />
              <div className="hero-visual-graphic">
                <div className="hero-visual-top" />
                <div className="hero-visual-screen">
                  <div className="screen-line" />
                  <div className="screen-line short" />
                  <div className="screen-chip" />
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
