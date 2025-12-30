// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole }) => {
  const { isAuthenticated, user } = useAuth();

  // 1. Check if the user is logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if the user object has loaded
  // If we are authenticated but the user object isn't loaded yet,
  // show a loading message (this prevents the null.role crash)
  if (!user) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  // 3. Check if the loaded user has the correct role
  if (allowedRole && user.role !== allowedRole) {
    // If they have the wrong role, send them to the home page
    return <Navigate to="/" replace />;
  }

  // 4. If all checks pass, show the page
  return <Outlet />;
};

export default ProtectedRoute;