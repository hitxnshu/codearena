import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Swords, Trophy, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
        <div className="auth-card glass" style={{ padding: '2rem', width: 'auto', maxWidth: 'none' }}>
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

        {/* Action Card */}
        <div className="auth-card glass" style={{ padding: '2rem', width: 'auto', maxWidth: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Swords size={48} color="var(--success)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Ready for battle?</h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
            Join a room and prove your coding skills in real-time 1v1 matches.
          </p>
          <button className="btn" style={{ fontSize: '1.125rem', padding: '1rem 2rem', background: 'var(--success)', width: '100%' }}>
            Find a Match
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;
