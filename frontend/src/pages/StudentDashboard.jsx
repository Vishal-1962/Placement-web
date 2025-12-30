// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, getCompanies, getMyApplications, applyToCompany } from '../api';
import { checkEligibility } from '../utils/eligibility';
import '../styles/StudentDashboard.css';
import ProfileImage from '../components/ProfileImage'; // Import the new component
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, token } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [myApplications, setMyApplications] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [profileResponse, companiesResponse, appsResponse] = await Promise.all([
          getMyProfile(token),
          getCompanies(token),
          getMyApplications(token)
        ]);

        setProfile(profileResponse.data);
        setCompanies(companiesResponse.data);
        
        const appliedCompanyIds = new Set(appsResponse.data.map(app => app.company._id));
        setMyApplications(appliedCompanyIds);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleApply = async (companyId) => {
    setApplying(companyId);
    
    try {
      await applyToCompany(companyId, token);
      setMyApplications(prev => new Set(prev).add(companyId));
      
    } catch (err) {
      alert(`Error applying: ${err.response?.data?.message || 'Please try again'}`);
    } finally {
      setApplying(null);
    }
  };

  // --- Render Logic ---

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  if (error && error.includes('Profile not found')) {
    return (
      <div className="profile-warning">
        <h3>Profile Not Found</h3>
        <p>Your HOD has not uploaded your academic data yet. Please contact them.</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // --- CRITICAL FIX: Check if essential profile data is missing/null ---
  if (!profile || profile.tenthPercent === null || profile.twelfthPercent === null) {
    return (
      <div className="profile-warning">
        <h3>Please Complete Your Profile</h3>
        <p>You must add your 10th and 12th percentages to see eligible jobs. You can find the form on the My Profile page.</p>
        <Link to="/my-profile" className="complete-profile-btn">
          Go to My Profile
        </Link>
      </div>
    );
  }

  // --- Main Dashboard: Sort companies into two lists ---
  const eligibleCompanies = [];
  const notEligibleCompanies = [];

  companies.forEach(company => {
    if (checkEligibility(profile, company)) {
      eligibleCompanies.push(company);
    } else {
      notEligibleCompanies.push(company);
    }
  });

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <ProfileImage imageUrl={user?.profileImageUrl} /> 
        <div>
          <h2>Available Drives</h2>
          <p>You are logged in as: <strong>{user?.email}</strong></p>
        </div>
      </div>

      {/* 1. Eligible Companies */}
      <h3 style={{ marginBottom: '1rem' }}>Eligible Companies ({eligibleCompanies.length})</h3> {/* ADDED MARGIN */}
      <div className="company-list">
        {eligibleCompanies.map(company => (
          <CompanyCard 
            key={company._id} 
            company={company}
            isEligible={true}
            hasApplied={myApplications.has(company._id)}
            onApply={() => handleApply(company._id)}
            isApplying={applying === company._id}
          />
        ))}
      </div>

      {/* 2. Not Eligible Companies */}
      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Not Eligible Companies ({notEligibleCompanies.length})</h3> {/* ADDED MARGIN */}
      <div className="company-list">
        {notEligibleCompanies.map(company => (
          <CompanyCard 
            key={company._id} 
            company={company}
            isEligible={false}
          />
        ))}
      </div>
    </div>
  );
};

// --- Helper Component for the Company Card UI (Unchanged) ---
const CompanyCard = ({ company, isEligible, hasApplied, onApply, isApplying }) => {
  return (
    <div className={`company-card ${!isEligible ? 'not-eligible' : ''}`}>
      <div className="card-header">
        <div>
          <h3>{company.companyName}</h3>
          <p>{company.jobDescription}</p>
          <span className="deadline">
            Apply by: {new Date(company.applicationDeadline).toLocaleDateString()}
          </span>
        </div>
        
        {isEligible && (
          <button 
            className="apply-btn"
            onClick={onApply}
            disabled={hasApplied || isApplying}
          >
            {hasApplied ? 'Applied' : (isApplying ? 'Applying...' : 'Apply Now')}
          </button>
        )}
      </div>

      <div className="tags-container">
        {isEligible && <span className="tag eligible">✓ You are eligible</span>}
        <span className="tag">Min SGPA: {company.min_sgpa}</span>
        <span className="tag">Min 10th: {company.min_tenthPercent}</span>
        <span className="tag">Min 12th: {company.min_twelfthPercent}</span>
        <span className="tag">Backlogs: {company.allowedBacklogs}</span>
        <span className="tag">Depts: {company.allowedDepts.join(', ')}</span>
      </div>
    </div>
  );
};

export default StudentDashboard;