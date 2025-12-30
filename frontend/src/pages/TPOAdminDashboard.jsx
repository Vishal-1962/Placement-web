// src/pages/TPOAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createCompany, getCompanies } from '../api';
import { Link } from 'react-router-dom';
import ProfileImage from '../components/ProfileImage';
// --- Styles (CSS-in-JS) ---
const formContainerStyle = {
  maxWidth: '800px',
  margin: '2rem auto',
  padding: '2rem',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};

const formStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.5rem',
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const fullWidthStyle = {
  gridColumn: '1 / -1',
};

const labelStyle = {
  marginBottom: '0.5rem',
  fontWeight: '600',
  color: '#555',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '1rem',
};

const submitBtnStyle = {
  gridColumn: '1 / -1',
  padding: '0.75rem',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#3498DB',
  color: 'white',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

// --- Styles for the Company List ---
const listContainerStyle = {
  ...formContainerStyle,
  marginTop: '3rem',
};

const companyItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  border: '1px solid #eee',
  borderRadius: '4px',
  marginBottom: '1rem',
};

const viewApplicantsBtnStyle = {
  backgroundColor: '#28a745', // Tech Green
  color: 'white',
  padding: '0.5rem 1rem',
  textDecoration: 'none',
  borderRadius: '4px',
  fontWeight: '600',
};

// --- Style for the new Nav Button ---
const navBtnStyle = {
  backgroundColor: '#3498DB',
  color: 'white',
  padding: '0.75rem 1.5rem',
  borderRadius: '5px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '1rem'
};
// --- End of Styles ---

const TPOAdminDashboard = () => {
  const { user, token } = useAuth();
  
  // State for the "Post Company" form
  const [formData, setFormData] = useState({
    companyName: '',
    jobDescription: '',
    min_sgpa: 0,
    min_tenthPercent: 0,
    min_twelfthPercent: 0,
    allowedDepts: '',
    allowedBacklogs: 0,
    applicationDeadline: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // State for the "Manage Companies" list
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Fetch companies when the page loads
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const { data } = await getCompanies(token);
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCompanies();
  }, [token, message]); // Re-fetch if 'message' changes (i.e., we post a new company)

  // Form handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form handler for posting a new company
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const companyData = {
      ...formData,
      allowedDepts: formData.allowedDepts.split(',').map(dept => dept.trim()),
    };

    try {
      await createCompany(companyData, token);
      setMessage('Company drive posted successfully!');
      // Reset form
      setFormData({
        companyName: '', jobDescription: '', min_sgpa: 0, min_tenthPercent: 0,
        min_twelfthPercent: 0, allowedDepts: '', allowedBacklogs: 0, applicationDeadline: '',
      });
    } catch (error) {
      console.error('Error posting company:', error);
      setMessage(error.response?.data?.message || 'Failed to post company.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <ProfileImage imageUrl={user?.profileImageUrl} /> 
        <div>
          <h2>TPO Super Admin Dashboard</h2>
          {user && <h3>Welcome, {user.email} (Admin)</h3>}
        </div>
      </div>

      {/* --- THIS IS THE NEW NAVIGATION SECTION --- */}
      <div style={{ 
        paddingBottom: '1.5rem', 
        marginBottom: '2rem', 
        borderBottom: '2px solid #ecf0f1' 
      }}>
        <Link to="/manage-users" style={navBtnStyle}>
          Manage Users & Roles
        </Link>
        {/* We can add more admin links here later */}
      </div>
      {/* --- END OF NEW SECTION --- */}


      {/* --- Section 1: Post New Company --- */}
      <div style={formContainerStyle}>
        <h3>Post New Company Drive</h3>
        <form style={formStyle} onSubmit={handleSubmit}>
          {/* Form fields */}
          <div style={{...formGroupStyle, ...fullWidthStyle}}>
            <label style={labelStyle} htmlFor="companyName">Company Name</label>
            <input style={inputStyle} type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
          </div>
          <div style={{...formGroupStyle, ...fullWidthStyle}}>
            <label style={labelStyle} htmlFor="jobDescription">Job Description</label>
            <textarea style={{...inputStyle, height: '100px'}} name="jobDescription" value={formData.jobDescription} onChange={handleChange} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="min_sgpa">Min SGPA</label>
            <input style={inputStyle} type="number" step="0.1" name="min_sgpa" value={formData.min_sgpa} onChange={handleChange} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="allowedBacklogs">Allowed Backlogs</label>
            <input style={inputStyle} type="number" name="allowedBacklogs" value={formData.allowedBacklogs} onChange={handleChange} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="min_tenthPercent">Min 10th %</label>
            <input style={inputStyle} type="number" step="0.1" name="min_tenthPercent" value={formData.min_tenthPercent} onChange={handleChange} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="min_twelfthPercent">Min 12th %</label>
            <input style={inputStyle} type="number" step="0.1" name="min_twelfthPercent" value={formData.min_twelfthPercent} onChange={handleChange} required />
          </div>
          <div style={{...formGroupStyle, ...fullWidthStyle}}>
            <label style={labelStyle} htmlFor="allowedDepts">Allowed Departments (Comma-separated)</label>
            <input style={inputStyle} type="text" name="allowedDepts" placeholder="e.g., CS, Mechanical, IT" value={formData.allowedDepts} onChange={handleChange} />
          </div>
          <div style={{...formGroupStyle, ...fullWidthStyle}}>
            <label style={labelStyle} htmlFor="applicationDeadline">Application Deadline</label>
            <input style={inputStyle} type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} required />
          </div>

          <button style={submitBtnStyle} type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post Company Drive'}
          </button>
          
          {message && <p style={{...fullWidthStyle, color: message.includes('failed') ? 'red' : 'green', textAlign: 'center'}}>{message}</p>}
        </form>
      </div>

      {/* --- Section 2: Manage Drives --- */}
      <div style={listContainerStyle}>
        <h3>Manage Company Drives</h3>
        {loadingCompanies ? (
          <p>Loading companies...</p>
        ) : (
          <div>
            {companies.map(company => (
              <div key={company._id} style={companyItemStyle}>
                <div>
                  <h4 style={{ margin: 0 }}>{company.companyName}</h4>
                  <p style={{ margin: '0.25rem 0', color: '#555' }}>
                    Deadline: {new Date(company.applicationDeadline).toLocaleDateString()}
                  </p>
                </div>
                <Link 
                  to={`/tpo-dashboard/company/${company._id}`} 
                  style={viewApplicantsBtnStyle}
                >
                  View Applicants
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TPOAdminDashboard;