import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2>Play with Luck</h2>
      <ul>
        <li>
          <NavLink to="/" activeClassName="active">Live Betting</NavLink>
        </li>
        <li>
          <NavLink to="/leaderboard" activeClassName="active">Leaderboard</NavLink>
        </li>
        <li>
          <NavLink to="/messages" activeClassName="active">Messages</NavLink>
        </li>
        <li>
          <NavLink to="/about-us" activeClassName="active">About Us</NavLink>
        </li>
        <li>
          <NavLink to="/coupon" activeClassName="active">Coupon</NavLink>
        </li>
      </ul>
      <div className="auth-buttons">
        <button className="auth-btn" onClick={() => navigate('/login')}>Login</button>
        <button className="auth-btn" onClick={() => navigate('/register')}>Register</button>
      </div>
    </div>
  );
};

export default Sidebar;
