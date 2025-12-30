// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load token AND user from localStorage
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))); // 1. Load user

  // Login function
  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      const { token, user } = response.data;

      setToken(token);
      setUser(user);

      // Save BOTH to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // 2. Save user
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);

    // Remove BOTH from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // 3. Remove user
  };

  // --- NEW FUNCTION ---
  // 4. A new function to update the user's info in the context
  const updateUserContext = (newUserData) => {
    setUser(newUserData); // Update the state
    localStorage.setItem('user', JSON.stringify(newUserData)); // Update localStorage
  };
  // --- END NEW FUNCTION ---

  const value = {
    user,
    token,
    login,
    logout,
    updateUserContext, // 5. Pass the new function
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};