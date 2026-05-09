import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Zap, Users } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="hero-background">
        <div className="code-blocks">
          <div className="code-line" style={{ animationDelay: '0s', top: '10%', left: '5%' }}>
            const battle = await join()
          </div>
          <div className="code-line" style={{ animationDelay: '0.5s', top: '25%', right: '8%' }}>
            if (winner) ✓ rank++
          </div>
          <div className="code-line" style={{ animationDelay: '1s', bottom: '20%', left: '12%' }}>
            function codeWar() { }
          </div>
          <div className="code-line" style={{ animationDelay: '1.5s', bottom: '35%', right: '5%' }}>
            let champion = solve()
          </div>
        </div>

        {/* Gradient Orbs */}
        <div className="orb orb-1" style={{ transform: `translateY(${scrollY * 0.3}px)` }} />
        <div className="orb orb-2" style={{ transform: `translateY(${scrollY * 0.5}px)` }} />
      </div>

      {/* Hero Content */}
      <section className="hero-section">
        <div className="hero-left">
          <div className="hero-tagline">
            <span className="tagline-accent">⚡ The Ultimate Coding Arena</span>
          </div>

          <h1 className="hero-title">
            <span className="title-line">Compete Against</span>
            <span className="title-line highlight">Elite Developers</span>
            <span className="title-line">In Real-Time Battles</span>
          </h1>

          <p className="hero-description">
            Join thousands of coders battling for supremacy. Solve problems faster, climb the rankings, and prove you're the best. Every match is a chance to earn glory and dominate the leaderboard.
          </p>

          <div className="hero-actions">
            <button 
              className="btn cta-primary"
              onClick={() => navigate('/signup')}
            >
              <Zap size={22} />
              Start Your First Battle
            </button>
            <button 
              className="btn cta-secondary"
              onClick={() => navigate('/login')}
            >
              <Play size={22} />
              Watch Live Battles
            </button>
          </div>

          <div className="hero-metrics">
            <div className="metric">
              <span className="metric-value">10K+</span>
              <span className="metric-label">Active Warriors</span>
            </div>
            <div className="metric">
              <span className="metric-value">50K+</span>
              <span className="metric-label">Daily Battles</span>
            </div>
            <div className="metric">
              <span className="metric-value">4.8★</span>
              <span className="metric-label">Community Rating</span>
            </div>
          </div>
        </div>

        {/* Hero Right - Battle Showcase */}
        <div className="hero-right">
          <div className="battle-showcase glass">
            <div className="showcase-header">
              <div className="live-indicator">
                <div className="pulse-dot" />
                <span>LIVE BATTLE</span>
              </div>
              <div className="battle-timer">3:27</div>
            </div>

            <div className="showcase-divider" />

            <div className="showcase-players">
              <div className="showcase-player left-player">
                <div className="player-badge rank-1">1st</div>
                <div className="player-avatar" />
                <div className="player-details">
                  <p className="player-name">AlexDev</p>
                  <p className="player-rating">2840 ELO</p>
                </div>
              </div>

              <div className="battle-vs">VS</div>

              <div className="showcase-player right-player">
                <div className="player-details">
                  <p className="player-name">JaneCode</p>
                  <p className="player-rating">2680 ELO</p>
                </div>
                <div className="player-avatar" />
                <div className="player-badge rank-2">2nd</div>
              </div>
            </div>

            <div className="showcase-divider" />

            <div className="showcase-problem">
              <div className="problem-header">
                <span className="problem-difficulty">Medium</span>
                <span className="problem-title">Array Sum Challenge</span>
              </div>
              <div className="problem-progress">
                <div className="progress-bar">
                  <div className="progress-fill" />
                </div>
              </div>
              <div className="progress-labels">
                <span>AlexDev: 7/10</span>
                <span>JaneCode: 5/10</span>
              </div>
            </div>

            <div className="showcase-footer">
              <button className="btn showcase-btn" onClick={() => navigate('/login')}>
                Join This Battle
              </button>
            </div>
          </div>

          <div className="floating-cards">
            <div className="floating-card card-1 glass">
              <div className="card-icon">🏆</div>
              <p>Rank Up Fast</p>
            </div>
            <div className="floating-card card-2 glass">
              <div className="card-icon">⚡</div>
              <p>Live Competition</p>
            </div>
            <div className="floating-card card-3 glass">
              <div className="card-icon">🎯</div>
              <p>Prove Your Skills</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why CodeArena?</h2>
        
        <div className="features-grid">
          <div className="feature-card glass">
            <div className="feature-icon">
              <Zap size={32} />
            </div>
            <h3>Instant Matchmaking</h3>
            <p>Get paired with equally skilled opponents in seconds. No waiting, just pure coding action.</p>
          </div>

          <div className="feature-card glass">
            <div className="feature-icon">
              <Users size={32} />
            </div>
            <h3>Live Competition</h3>
            <p>Solve problems in real-time against real developers. Watch your code execute instantly.</p>
          </div>

          <div className="feature-card glass">
            <div className="feature-icon">
              <Play size={32} />
            </div>
            <h3>Earn Your Rank</h3>
            <p>Climb the global leaderboard with every victory. Track your progress and dominate the rankings.</p>
          </div>
        </div>
      </section>

      <style>{`
        .hero-badge {
          display: inline-block;
          padding: 0.65rem 1.25rem;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: var(--primary);
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-size: clamp(3rem, 6vw, 5rem);
          line-height: 1.05;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: linear-gradient(135deg, #8b5cf6, #22c55e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          max-width: 560px;
          font-size: 1.1rem;
          color: var(--text-muted);
          line-height: 1.8;
          margin-bottom: 2.5rem;
        }

        .hero-ctas {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 3.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #8b5cf6, #22c55e);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(59, 130, 246, 0.35);
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .stat strong {
          font-size: 1.8rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .stat span {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .battle-preview {
          border-radius: 28px;
          padding: 1.75rem;
          min-width: 320px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .preview-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--success);
        }

        .live-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--success);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .timer {
          font-family: monospace;
          font-weight: 600;
          color: var(--text-muted);
        }

        .preview-content {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .player {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .player-2 {
          flex-direction: row-reverse;
        }

        .player-avatar {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(34, 197, 94, 0.4));
        }

        .avatar-1 {
          background: linear-gradient(135deg, rgba(124, 58, 246, 0.5), rgba(59, 130, 246, 0.3));
        }

        .avatar-2 {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.5), rgba(59, 130, 246, 0.3));
        }

        .player-info {
          min-width: 0;
        }

        .player-name {
          margin: 0;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .player-rating {
          margin: 0.25rem 0 0;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .player-score {
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--primary);
        }

        .vs-divider {
          font-weight: 700;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .hero-tagline {
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .tagline-accent {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.7rem 1.25rem;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.25);
          color: var(--primary);
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .hero-title {
          font-size: clamp(2.8rem, 5vw, 4.2rem);
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
        }

        .title-line {
          display: block;
        }

        .title-line.highlight {
          background: linear-gradient(135deg, #8b5cf6, #22c55e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          max-width: 520px;
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-muted);
          margin-bottom: 2.5rem;
        }

        .hero-actions {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }

        .cta-primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #22c55e 100%);
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 1.8rem;
          font-size: 1rem;
          font-weight: 600;
          box-shadow: 0 12px 30px rgba(139, 92, 246, 0.3);
        }

        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(139, 92, 246, 0.4);
        }

        .cta-secondary {
          background: rgba(255, 255, 255, 0.08);
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          color: white;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 1.8rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .cta-secondary:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(59, 130, 246, 0.35);
        }

        .hero-metrics {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 2rem;
        }

        .metric {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .metric-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary);
        }

        .metric-label {
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        .battle-showcase {
          border-radius: 28px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          min-height: 480px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .showcase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--success);
        }

        .pulse-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--success);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .battle-timer {
          font-family: monospace;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-muted);
        }

        .showcase-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
        }

        .showcase-players {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 1.2rem;
          align-items: center;
        }

        .showcase-player {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }

        .left-player {
          flex-direction: row;
        }

        .right-player {
          flex-direction: row-reverse;
        }

        .player-badge {
          position: absolute;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .rank-1 {
          background: rgba(251, 146, 60, 0.2);
          color: #fb923c;
          right: -15px;
          bottom: -10px;
        }

        .rank-2 {
          background: rgba(168, 85, 247, 0.2);
          color: #a855f7;
          left: -15px;
          bottom: -10px;
        }

        .showcase-player .player-avatar {
          width: 56px;
          height: 56px;
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(34, 197, 94, 0.3));
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .player-details {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .player-name {
          margin: 0;
          font-weight: 700;
          font-size: 1rem;
          color: white;
        }

        .player-rating {
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .battle-vs {
          font-weight: 700;
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .showcase-problem {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .problem-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          justify-content: space-between;
        }

        .problem-difficulty {
          display: inline-block;
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          background: rgba(251, 146, 60, 0.15);
          color: #fb923c;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .problem-title {
          font-weight: 700;
          color: white;
        }

        .problem-progress {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          width: 65%;
          background: linear-gradient(90deg, #8b5cf6, #22c55e);
          border-radius: 999px;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .showcase-footer {
          display: flex;
          gap: 1rem;
        }

        .showcase-btn {
          flex: 1;
          background: linear-gradient(135deg, #8b5cf6, #22c55e);
          border: none;
        }

        .floating-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .floating-card {
          padding: 1.25rem;
          border-radius: 20px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .card-icon {
          font-size: 2rem;
        }

        .floating-card p {
          margin: 0;
          font-weight: 600;
          font-size: 0.95rem;
          color: white;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
        }

        .hero-right {
          display: flex;
          flex-direction: column;
        }

        .features-section {
          width: min(1180px, 100%);
          margin: 4rem auto 2rem;
          padding: 0 1rem;
          text-align: center;
        }

        .features-section h2 {
          font-size: 2.5rem;
          margin-bottom: 3rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
        }

        .feature-card {
          padding: 2rem;
          border-radius: 24px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.15);
          margin-bottom: 1.25rem;
          color: var(--primary);
        }

        .feature-card h3 {
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
        }

        .feature-card p {
          color: var(--text-muted);
          line-height: 1.7;
        }
        @media (max-width: 1024px) {
          .hero-section {
            grid-template-columns: 1fr;
          }

          .battle-showcase {
            margin-top: 2rem;
          }

          .hero-metrics {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .floating-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;
