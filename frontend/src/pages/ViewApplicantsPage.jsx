// src/pages/ViewApplicantsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApplicantsForCompany } from '../api';
import * as XLSX from 'xlsx'; // 1. Import the Excel library

// --- Styles ---
const containerStyle = {
  maxWidth: '1000px',
  margin: '2rem auto',
  padding: '2rem',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};

// 2. Add style for our new button
const exportBtnStyle = {
  backgroundColor: '#17a2b8', // A nice teal color
  color: 'white',
  padding: '0.6rem 1.2rem',
  border: 'none',
  borderRadius: '4px',
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '1rem',
  marginLeft: '2rem',
};

const headerBoxStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '2rem',
};

const thStyle = {
  backgroundColor: '#f4f7f6',
  padding: '0.75rem 1rem',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
};

const tdStyle = {
  padding: '0.75rem 1rem',
  borderBottom: '1px solid #eee',
};
// --- End Styles ---

const ViewApplicantsPage = () => {
  const { companyId } = useParams();
  const { token } = useAuth();
  
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // We'll add companyName to state
  const [companyName, setCompanyName] = useState(''); 

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const { data } = await getApplicantsForCompany(companyId, token);
        setApplicants(data);
        
        // A small check to get the company name from the first applicant
        if (data.length > 0) {
          // We need to update our backend to get this!
          // For now, let's just use the ID
        }

      } catch (err) {
        console.error('Error fetching applicants:', err);
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [companyId, token]);

  // 3. This is the new function to handle the export
  const handleExport = () => {
    // 4. We re-format the data to be Excel-friendly
    const dataToExport = applicants.map(app => ({
      StudentID: app.profile.studentId,
      FullName: app.profile.fullName,
      Email: app.student.email,
      Department: app.profile.department,
      SGPA: app.profile.sgpa,
      '10th %': app.profile.tenthPercent,
      '12th %': app.profile.twelfthPercent,
      ActiveBacklogs: app.profile.activeBacklogs,
      PhoneNumber: app.profile.phoneNumber,
      ResumeURL: app.profile.resumeUrl,
    }));

    // 5. Create the Excel "worksheet" and "workbook"
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applicants');

    // 6. Trigger the download!
    XLSX.writeFile(wb, `Applicants_List.xlsx`);
  };

  if (loading) {
    return <div style={containerStyle}>Loading applicants...</div>;
  }

  if (error) {
    return <div style={containerStyle}><p style={{color: 'red'}}>Error: {error}</p></div>;
  }

  return (
    <div style={containerStyle}>
      <div style={headerBoxStyle}>
        <div>
          <h2>Applicants List</h2>
          <p>Found {applicants.length} applicant(s).</p>
        </div>
        
        {/* 7. Add the button to the page */}
        <button 
          style={exportBtnStyle} 
          onClick={handleExport}
          disabled={applicants.length === 0}
        >
          Export to Excel
        </button>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Student ID</th>
            <th style={thStyle}>Full Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>SGPA</th>
            <th style={thStyle}>10th %</th>
            <th style={thStyle}>12th %</th>
            <th style={thStyle}>Backlogs</th>
          </tr>
        </thead>
        <tbody>
          {applicants.length === 0 ? (
            <tr>
              <td colSpan="8" style={{...tdStyle, textAlign: 'center'}}>No applicants yet.</td>
            </tr>
          ) : (
            applicants.map(app => (
              <tr key={app._id}>
                <td style={tdStyle}>{app.profile.studentId}</td>
                <td style={tdStyle}>{app.profile.fullName}</td>
                <td style={tdStyle}>{app.student.email}</td>
                <td style={tdStyle}>{app.profile.department}</td>
                <td style={tdStyle}>{app.profile.sgpa}</td>
                <td style={tdStyle}>{app.profile.tenthPercent}</td>
                <td style={tdStyle}>{app.profile.twelfthPercent}</td>
                <td style={tdStyle}>{app.profile.activeBacklogs}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewApplicantsPage;