// src/components/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader'; // Import the header we just made

const mainStyle = {
  padding: '2rem',
};

const PublicLayout = () => {
  return (
    <div>
      <PublicHeader />
      <main style={mainStyle}>
        <Outlet /> {/* This will render the LoginPage */}
      </main>
    </div>
  );
};

export default PublicLayout;