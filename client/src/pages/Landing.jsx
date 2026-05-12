import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Terminal, Trophy, Users, Shield, Zap, Code, Crosshair, Crown } from 'lucide-react';
import Navbar from '../components/Navbar';

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
      <Navbar />
      
      {/* Animated Background */}
      <div className="hero-background">
        <div className="grid-overlay"></div>
        <div className="code-blocks">
          <div className="code-line" style={{ animationDelay: '0s', top: '15%', left: '5%' }}>
            const battle = new CodeArena()
          </div>
          <div className="code-line" style={{ animationDelay: '0.5s', top: '35%', right: '8%' }}>
            if (winner) rank.climb()
          </div>
          <div className="code-line" style={{ animationDelay: '1s', bottom: '25%', left: '12%' }}>
            await match.start()
          </div>
          <div className="code-line" style={{ animationDelay: '1.5s', bottom: '15%', right: '15%' }}>
            let champion = true
          </div>
        </div>
        <div className="orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }} />
        <div className="orb orb-2" style={{ transform: `translateY(${scrollY * 0.4}px)` }} />
        <div className="orb orb-3" style={{ transform: `translateY(${scrollY * -0.3}px)` }} />
      </div>

      {/* 1. Hero Section & 4. Live Battle Preview */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-brand">
              <Terminal size={24} className="brand-icon" />
              <span>CodeArena</span>
            </div>
            
            <h1 className="hero-title">
              Battle Developers.<br/>
              <span className="highlight-gradient">Climb Rankings.</span><br/>
              Become Legendary.
            </h1>
            
            <p className="hero-subtitle">
              This is competitive coding for the modern generation. Engage in real-time battles, prove your skills, and dominate the global leaderboard.
            </p>
            
            <div className="hero-actions">
              <button className="btn cta-primary" onClick={() => navigate('/signup')}>
                <Zap size={20} />
                Start Battle
              </button>
              <button className="btn cta-secondary" onClick={() => navigate('/login')}>
                <Play size={20} />
                Watch Live Match
              </button>
            </div>
          </div>

          <div className="hero-visual">
            {/* Live Battle Preview */}
            <div className="battle-preview-card glass">
              <div className="preview-header">
                <div className="live-badge">
                  <span className="live-dot"></span> LIVE
                </div>
                <div className="timer-display">04:59</div>
              </div>

              <div className="preview-problem">
                <span className="difficulty hard">Hard</span>
                <span className="problem-name">Reverse Linked List II</span>
              </div>

              <div className="preview-competitors">
                <div className="competitor">
                  <div className="comp-avatar bg-gradient-1">JD</div>
                  <div className="comp-info">
                    <span className="comp-name">JohnDev</span>
                    <div className="comp-bar-bg">
                      <div className="comp-bar-fill fill-1" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <span className="comp-score">7/10</span>
                </div>

                <div className="vs-badge">VS</div>

                <div className="competitor reverse">
                  <span className="comp-score">4/10</span>
                  <div className="comp-info right">
                    <span className="comp-name">CodeMaster</span>
                    <div className="comp-bar-bg">
                      <div className="comp-bar-fill fill-2" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div className="comp-avatar bg-gradient-2">CM</div>
                </div>
              </div>

              <div className="preview-submissions">
                <div className="sub-feed">
                  <span className="sub-time">12s ago</span>
                  <span className="sub-user">JohnDev</span>
                  <span className="sub-action success">Passed Test Case 7</span>
                </div>
                <div className="sub-feed">
                  <span className="sub-time">45s ago</span>
                  <span className="sub-user">CodeMaster</span>
                  <span className="sub-action error">Runtime Error</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Stats Section */}
      <section className="stats-section">
        <div className="stats-grid glass">
          <div className="stat-item">
            <span className="stat-value">247</span>
            <span className="stat-label">Active Battles</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">1,429</span>
            <span className="stat-label">Online Users</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">12</span>
            <span className="stat-label">Tournaments Today</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">Top 1%</span>
            <span className="stat-label">Top Coders Active</span>
          </div>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <h2>Next-Gen Platform Features</h2>
          <p>Everything you need to compete at the highest level.</p>
        </div>
        
        <div className="feature-cards">
          <div className="feature-card glass">
            <div className="f-icon-wrap"><Zap className="f-icon" /></div>
            <h3>Real-time Battles</h3>
            <p>Go head-to-head with opponents in lightning-fast coding environments. Every keystroke matters.</p>
          </div>
          <div className="feature-card glass">
            <div className="f-icon-wrap"><Code className="f-icon" /></div>
            <h3>AI Code Analysis</h3>
            <p>Get instant feedback on your code complexity, potential bugs, and optimization suggestions.</p>
          </div>
          <div className="feature-card glass">
            <div className="f-icon-wrap"><Crosshair className="f-icon" /></div>
            <h3>Ranked Matchmaking</h3>
            <p>Our ELO-based system ensures you always face challengers of similar skill levels.</p>
          </div>
          <div className="feature-card glass">
            <div className="f-icon-wrap"><Users className="f-icon" /></div>
            <h3>Multiplayer Coding</h3>
            <p>Team up with friends for 2v2 or squad-based algorithmic challenges.</p>
          </div>
          <div className="feature-card glass">
            <div className="f-icon-wrap"><Trophy className="f-icon" /></div>
            <h3>Tournaments</h3>
            <p>Compete in weekly grand tournaments for exclusive badges, XP, and global recognition.</p>
          </div>
        </div>
      </section>

      {/* 5. Leaderboard Section */}
      <section className="leaderboard-section">
        <div className="section-header">
          <h2>Global Leaderboard</h2>
          <p>The elite warriors of CodeArena.</p>
        </div>

        <div className="leaderboard-container glass">
          <div className="lb-header">
            <span>Rank</span>
            <span>Player</span>
            <span>Rating</span>
            <span>Streak</span>
            <span>Country</span>
          </div>
          
          <div className="lb-rows">
            {[
              { rank: 1, name: 'AlexDev', rating: 2840, streak: 12, country: '🇺🇸', trend: 'up' },
              { rank: 2, name: 'JaneCode', rating: 2795, streak: 8, country: '🇬🇧', trend: 'up' },
              { rank: 3, name: '0xDragon', rating: 2750, streak: 3, country: '🇯🇵', trend: 'down' },
              { rank: 4, name: 'ScriptNinja', rating: 2690, streak: 5, country: '🇮🇳', trend: 'up' },
              { rank: 5, name: 'ByteMaster', rating: 2655, streak: 2, country: '🇩🇪', trend: 'down' }
            ].map((player) => (
              <div key={player.rank} className={`lb-row ${player.rank <= 3 ? 'top-3' : ''}`}>
                <div className="lb-rank">
                  {player.rank === 1 && <Crown size={18} className="gold" />}
                  {player.rank === 2 && <Crown size={18} className="silver" />}
                  {player.rank === 3 && <Crown size={18} className="bronze" />}
                  {player.rank > 3 && <span>#{player.rank}</span>}
                </div>
                <div className="lb-player">
                  <div className={`avatar-sm bg-${player.rank}`}>{player.name.charAt(0)}</div>
                  <span className="lb-name">{player.name}</span>
                </div>
                <div className="lb-rating">{player.rating} ELO</div>
                <div className="lb-streak">
                  <Zap size={14} className="streak-icon" /> {player.streak}
                </div>
                <div className="lb-country">{player.country}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
