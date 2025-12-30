// src/components/PublicHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Basic CSS for this simple header
const headerStyle = {
  backgroundColor: '#2C3E50', // Deep Indigo
  padding: '1rem 2rem',
  color: 'white',
};

const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '1.5rem',
};

const PublicHeader = () => {
  return (
    <header style={headerStyle}>
      <h1 style={{ margin: 0 }}>
        <Link to="/" style={navLinkStyle}>
          Placement Portal
        </Link>
      </h1>
    </header>
  );
};

export default PublicHeader;