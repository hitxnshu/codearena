import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad, CircleDot, ArrowRight } from 'lucide-react';

const Navbar = ({ onAction }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="site-navbar glass">
      <div className="navbar-left">
        <div className="brand-badge">
          <Gamepad size={18} />
          <span>CodeArena</span>
        </div>
        <ul className="navbar-links">
          <li><button type="button" onClick={() => navigate('/')} className="link-button">Battle</button></li>
          <li><button type="button" className="link-button">Tournaments</button></li>
          <li><button type="button" className="link-button">Leaderboard</button></li>
          <li><button type="button" className="link-button">Problems</button></li>
        </ul>
      </div>

      <div className="navbar-right">
        <span className="user-chip">{user?.name}</span>
        <button type="button" className="btn nav-cta" onClick={onAction}>
          Join Your Team <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
        </button>
        <button type="button" className="btn nav-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
