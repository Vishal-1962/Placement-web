// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Basic CSS for the header
const headerStyle = {
  backgroundColor: '#2C3E50', // Deep Indigo
  padding: '1rem 2rem',
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  margin: '0 0.5rem',
  fontWeight: 'bold',
  cursor: 'pointer',
};

// Style for the red logout button
const logoutButtonStyle = {
  ...navLinkStyle,
  backgroundColor: '#E74C3C', // Red
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  marginLeft: '1rem',
};

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Check for confirmation
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  // Determine the correct dashboard path
  let dashboardPath = '/';
  if (user) {
    if (user.role === 'Student') {
      dashboardPath = '/student-dashboard';
    } else if (user.role === 'Faculty') {
      dashboardPath = '/hod-dashboard';
    } else if (user.role === 'Admin') {
      dashboardPath = '/tpo-dashboard';
    }
  }

  return (
    <header style={headerStyle}>
      <h1 style={{ fontSize: '1.5rem' }}>
        <Link to="/" style={navLinkStyle}>
          Placement Portal
        </Link>
      </h1>
      <nav>
        {isAuthenticated ? (
          <>
            <Link to={dashboardPath} style={navLinkStyle}>
              Dashboard
            </Link>
            
            <Link to="/settings" style={navLinkStyle}>
              Settings
            </Link>
            
            {/* THIS IS THE CRITICAL FIX: Adding the My Profile link back for Students */}
            {user.role === 'Student' && (
              <Link to="/my-profile" style={navLinkStyle}>
                My Profile
              </Link>
            )}

            <button onClick={handleLogout} style={logoutButtonStyle}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={navLinkStyle}>
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;