import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad, Bell, User, Star } from 'lucide-react';

const Navbar = ({ onAction }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="site-navbar glass">
      <div className="navbar-left">
        <div className="brand-badge" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          <Gamepad size={20} />
          <span>CodeArena</span>
        </div>
        <ul className="navbar-links">
          <li><button type="button" onClick={() => navigate('/')} className={`link-button ${isActive('/')}`}>Battle</button></li>
          <li><button type="button" className="link-button">Tournaments</button></li>
          <li><button type="button" className="link-button">Leaderboard</button></li>
          <li><button type="button" className="link-button">Problems</button></li>
          <li><button type="button" className="link-button">Profile</button></li>
        </ul>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <div className="nav-xp-badge">
              <Star size={14} className="xp-icon" />
              <div className="xp-text">
                <span className="rank-name">Silver</span>
                <span className="xp-points">{user.rating || 1200} ELO</span>
              </div>
            </div>
            
            <button className="icon-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="avatar-dropdown">
              <div className="avatar-circle">
                {user.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
              </div>
              <div className="dropdown-menu">
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <button type="button" className="text-btn" onClick={() => navigate('/login')}>Login</button>
            <button type="button" className="btn nav-cta" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
