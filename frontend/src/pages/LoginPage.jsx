// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../components/LoginForm.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, isAuthenticated, login } = useAuth(); // 2. Get user and isAuthenticated
  const navigate = useNavigate();

  const handleLoginSuccess = (user) => {
    if (!user) return;
    
    if (user.role === 'Student') {
      navigate('/student-dashboard');
    } else if (user.role === 'Faculty') {
      navigate('/hod-dashboard');
    } else if (user.role === 'Admin') {
      navigate('/tpo-dashboard');
    } else {
      navigate('/');
    }
  };

  // 3. NEW: Check if already logged in when the page loads
  useEffect(() => {
    if (isAuthenticated) {
      // Find the user's role and redirect immediately
      handleLoginSuccess(user);
    }
  }, [isAuthenticated, user, navigate]); // Rerun when isAuthenticated or user changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setMessage('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      handleLoginSuccess(loggedInUser);

    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
      
    } finally {
      setLoading(false); 
    }
  };

  // If user is already logged in, show nothing while we redirect
  if (isAuthenticated) {
    return null; 
  }

  return (
    <div className="login-container">
      <h2>Faculty & Student Login</h2>
      <form onSubmit={handleSubmit}>
        {message && (
          <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>
        )}

        <div className="form-group">
          <label htmlFor="email">College Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="login-btn"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
