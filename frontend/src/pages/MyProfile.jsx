// src/pages/MyProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../api';

// --- Styles (Reused from SettingsPage) ---
const formContainerStyle = {
  maxWidth: '800px',
  margin: '2rem auto',
  padding: '2rem',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};
const formGroupStyle = { marginBottom: '1.5rem' };
const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#555' };
const inputStyle = { width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' };
const readOnlyInputStyle = { ...inputStyle, backgroundColor: '#f4f7f6', cursor: 'not-allowed' };
const submitBtnStyle = { width: '100%', padding: '0.75rem', border: 'none', borderRadius: '4px', backgroundColor: '#28a745', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' };
const profileImageStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  objectFit: 'cover',
  display: 'block',
  margin: '0 auto 1rem',
  border: '4px solid #eee',
};
// --- End of Styles ---

const MyProfile = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    // Academic (read-only)
    fullName: '',
    department: '',
    sgpa: '',
    activeBacklogs: '',
    // Editable
    phoneNumber: '',
    tenthPercent: '',
    twelfthPercent: '',
    resumeUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 1. Fetch the user's current profile when the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getMyProfile(token);
        setFormData({
          fullName: data.fullName,
          department: data.department,
          sgpa: data.sgpa,
          activeBacklogs: data.activeBacklogs,
          phoneNumber: data.phoneNumber || '',
          tenthPercent: data.tenthPercent || '',
          twelfthPercent: data.twelfthPercent || '',
          resumeUrl: data.resumeUrl || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage('Could not load your profile. Contact your HOD.');
      } finally {
        setLoading(false);
      }
    };

    // Only students have a profile to load
    if (user.role === 'Student') {
        fetchProfile();
    } else {
        setLoading(false);
        setMessage('This page is only for students.');
    }
  }, [token, user.role]);

  // 2. Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Handle the "Save" button click
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Saving...');
    try {
      const updateData = {
        phoneNumber: formData.phoneNumber,
        tenthPercent: parseFloat(formData.tenthPercent), // Convert to number
        twelfthPercent: parseFloat(formData.twelfthPercent), // Convert to number
        resumeUrl: formData.resumeUrl,
      };
      
      await updateMyProfile(updateData, token);
      setMessage('Profile updated successfully!');

    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  if (loading) {
    return <div style={{padding: '2rem'}}>Loading profile...</div>;
  }
  
  if (message.includes('Contact your HOD')) {
    return <div style={{padding: '2rem', color: 'red'}}>{message}</div>;
  }

  // Check if student data exists (to prevent errors if HOD hasn't uploaded)
  if (user.role === 'Student' && !formData.fullName) {
    return <div style={{padding: '2rem', color: 'orange'}}>Your academic data has not been uploaded by your HOD yet.</div>;
  }


  return (
    <div style={formContainerStyle}>
      <h2>My Profile</h2>
      <p style={{textAlign: 'center', margin: '0 0 1.5rem'}}>Update your profile details to see eligible job drives.</p>
      
      {/* Profile Picture Display (from Context) */}
      <img 
        src={user.profileImageUrl || 'https://via.placeholder.com/100'} 
        alt="Profile" 
        style={profileImageStyle} 
      />

      <form onSubmit={handleSubmit}>
        
        {/* --- Academic Info (Read-Only) --- */}
        <h4>Academic Info (Verified by HOD)</h4>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div style={formGroupStyle}>
                <label style={labelStyle}>Full Name</label>
                <input style={readOnlyInputStyle} type="text" value={formData.fullName} readOnly />
            </div>
            <div style={formGroupStyle}>
                <label style={labelStyle}>Department</label>
                <input style={readOnlyInputStyle} type="text" value={formData.department} readOnly />
            </div>
            <div style={formGroupStyle}>
                <label style={labelStyle}>Current SGPA</label>
                <input style={readOnlyInputStyle} type="text" value={formData.sgpa} readOnly />
            </div>
            <div style={formGroupStyle}>
                <label style={labelStyle}>Active Backlogs</label>
                <input style={readOnlyInputStyle} type="text" value={formData.activeBacklogs} readOnly />
            </div>
        </div>


        {/* --- Personal Info (Editable) --- */}
        <h4 style={{marginTop: '2rem'}}>Personal Info (Editable)</h4>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div style={formGroupStyle}>
                <label style={labelStyle} htmlFor="tenthPercent">10th Percentage*</label>
                <input style={inputStyle} type="number" step="0.01" name="tenthPercent" value={formData.tenthPercent} onChange={handleChange} required />
            </div>
            <div style={formGroupStyle}>
                <label style={labelStyle} htmlFor="twelfthPercent">12th Percentage*</label>
                <input style={inputStyle} type="number" step="0.01" name="twelfthPercent" value={formData.twelfthPercent} onChange={handleChange} required />
            </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="phoneNumber">Phone Number</label>
          <input style={inputStyle} type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="resumeUrl">Resume Link (Google Drive, etc.)</label>
          <input style={inputStyle} type="url" name="resumeUrl" placeholder="https://..." value={formData.resumeUrl} onChange={handleChange} />
        </div>
        
        <button style={submitBtnStyle} type="submit">Save Profile</button>

        {message && <p style={{textAlign: 'center', marginTop: '1rem', color: message.includes('successfully') ? 'green' : 'red'}}>{message}</p>}
      </form>
    </div>
  );
};

export default MyProfile;