import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          💼 BusinessApp
        </Link>
        <div className="nav-menu">
          {!user ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          ) : (
            <>
              <span className="nav-user">Hi, {user.name}! {user.isAdmin ? '👑 Admin' : ''}</span>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              {user.isAdmin && <Link to="/admin" className="nav-link">Admin Panel</Link>}
              <button onClick={handleLogout} className="nav-logout">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;