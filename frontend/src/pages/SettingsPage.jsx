// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  changePassword, 
  updateProfile,
  removeProfilePicture,
} from '../api';

// --- Styles ---
const pageContainerStyle = {
  maxWidth: '800px',
  margin: '2rem auto',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '2rem',
};
const formContainerStyle = {
  padding: '2rem',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};
const formGroupStyle = { marginBottom: '1.5rem' };
const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#555' };
const inputStyle = { width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' };
const submitBtnStyle = { width: '100%', padding: '0.75rem', border: 'none', borderRadius: '4px', backgroundColor: '#3498DB', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' };
const profileImageStyle = {
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  objectFit: 'cover',
  display: 'block',
  margin: '0 auto 1rem',
  border: '4px solid #eee',
};

// --- Main Settings Component ---
const SettingsPage = () => {
  return (
    <div style={pageContainerStyle}>
      <GeneralSettings />
    </div>
  );
};

// --- General Settings Component (All Users) ---
const GeneralSettings = () => {
  const { user, token, updateUserContext } = useAuth();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passMessage, setPassMessage] = useState('');

  const [file, setFile] = useState(null);
  const [picMessage, setPicMessage] = useState('');
  const [picLoading, setPicLoading] = useState(false);

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    setPassMessage('Saving...');
    try {
      const passwordData = { oldPassword, newPassword };
      await changePassword(passwordData, token);
      setPassMessage('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      setPassMessage(error.response?.data?.message || 'Failed to change password.');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePicSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setPicMessage('Please select a file first.');
      return;
    }
    setPicLoading(true);
    setPicMessage('Saving...');
    try {
      const { data } = await updateProfile(file, token);
      setPicMessage(data.message);
      updateUserContext(data.user);
      setFile(null);
      document.getElementById('profileImageInput').value = '';
    } catch (error) {
      setPicMessage(error.response?.data?.message || 'Failed to update image.');
    } finally {
      setPicLoading(false);
    }
  };

  const handleRemovePic = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;
    setPicLoading(true);
    setPicMessage('Removing...');
    try {
      const { data } = await removeProfilePicture(token);
      setPicMessage(data.message);
      updateUserContext(data.user);
    } catch (error) {
      setPicMessage(error.response?.data?.message || 'Failed to remove picture.');
    } finally {
      setPicLoading(false);
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2>Account Settings</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        Logged in as: <strong>{user.email}</strong> (Role: {user.role})
      </p>

      {/* Profile Picture */}
      <form onSubmit={handlePicSubmit}>
        <h3>Profile Picture</h3>
        <img
          src={user.profileImageUrl || 'https://via.placeholder.com/150'}
          alt="Profile"
          style={profileImageStyle}
        />
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="profileImageInput">
            Upload New Picture
          </label>
          <input
            style={inputStyle}
            type="file"
            id="profileImageInput"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
          />
        </div>
        <button
          style={submitBtnStyle}
          type="submit"
          disabled={picLoading || file === null}
        >
          {picLoading ? 'Uploading...' : 'Save Profile Picture'}
        </button>
        {user.profileImageUrl && (
          <button
            type="button"
            onClick={handleRemovePic}
            style={{ ...submitBtnStyle, backgroundColor: '#E74C3C', marginTop: '0.5rem' }}
            disabled={picLoading}
          >
            Remove Profile Picture
          </button>
        )}
        {picMessage && (
          <p
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              color: picMessage.includes('successfully') ? 'green' : 'red',
            }}
          >
            {picMessage}
          </p>
        )}
      </form>

      {/* Change Password */}
      <form onSubmit={handlePassSubmit} style={{ marginTop: '2rem' }}>
        <h3>Change Password</h3>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="oldPassword">
            Old Password
          </label>
          <input
            style={inputStyle}
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="newPassword">
            New Password
          </label>
          <input
            style={inputStyle}
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button style={submitBtnStyle} type="submit">
          Change Password
        </button>
        {passMessage && (
          <p
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              color: passMessage.includes('successfully') ? 'green' : 'red',
            }}
          >
            {passMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default SettingsPage;
