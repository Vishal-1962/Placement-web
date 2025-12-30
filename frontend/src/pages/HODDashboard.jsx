// src/pages/HODDashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadStudents } from '../api'; // 1. Import our new API function

// ... (Your CSS styles should be here, unchanged)
const uploadBoxStyle = {
  marginTop: '2rem',
  padding: '2rem',
  backgroundColor: '#fff',
  border: '2px dashed #ccc',
  borderRadius: '8px',
  textAlign: 'center',
};

const uploadBtnStyle = {
  backgroundColor: '#28a745', // Tech Green
  color: 'white',
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '1rem',
};
// ... (End of styles)

const HODDashboard = () => {
  const { user, token } = useAuth(); // 2. Get the user's token from context
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // For a loading state

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(''); // Clear message when new file is selected
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    setLoading(true); // Set loading state
    setMessage('Uploading...');

    try {
      // 3. Call the REAL API function
      const response = await uploadStudents(file, token);

      // 4. Show the success report from the backend
      const { created, updated, errors } = response.data;
      setMessage(
        `Upload successful! Created: ${created}, Updated: ${updated}, Errors: ${errors}`
      );
      setFile(null); // Clear the file input
    } catch (error) {
      // 5. Show an error message
      console.error('Upload error:', error);
      setMessage(
        error.response?.data?.message || 'Upload failed. Please try again.'
      );
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div>
      <h2>HOD Coordinator Dashboard</h2>
      {user && <h3>Welcome, {user.email} (Faculty)</h3>}

      <div style={uploadBoxStyle}>
        <h3>Upload Student Data</h3>
        <p>Please upload the .csv or .xlsx file for your department.</p>

        <input
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleFileChange}
          key={file ? file.name : 'empty'} // Helps reset the input field
        />

        <button
          style={uploadBtnStyle}
          onClick={handleUpload}
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Uploading...' : 'Upload File'}
        </button>

        {message && (
          <p style={{ marginTop: '1rem', color: message.includes('failed') ? 'red' : 'green' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default HODDashboard;