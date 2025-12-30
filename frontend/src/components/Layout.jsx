// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // 1. Must import Header

const mainStyle = {
  padding: '2rem',
};

const Layout = () => {
  return (
    <div>
      {/* 2. Must render the Header component */}
      <Header /> 
      <main style={mainStyle}>
        {/* This renders the actual page content */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;