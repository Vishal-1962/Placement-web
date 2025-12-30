// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Components
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout'; // 1. Import the new layout
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import HODDashboard from './pages/HODDashboard';
import TPOAdminDashboard from './pages/TPOAdminDashboard';
import ViewApplicantsPage from './pages/ViewApplicantsPage';
import SettingsPage from './pages/SettingsPage';
import MyProfile from './pages/MyProfile';
import ManageUsersPage from './pages/ManageUsersPage';

function App() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<LandingPage />} />
      
      {/* 2. WRAP the login page in the new PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        {/* We can add a "Forgot Password" page here later */}
      </Route>


      {/* --- Protected Student Routes --- */}
      <Route element={<ProtectedRoute allowedRole="Student" />}>
        <Route path="/student-dashboard" element={<Layout />}>
          <Route index element={<StudentDashboard />} />
        </Route>
        <Route path="/my-profile" element={<Layout />}> 
          <Route index element={<MyProfile />} />
        </Route>
      </Route>

      {/* --- Protected Faculty (HOD) Route --- */}
      <Route element={<ProtectedRoute allowedRole="Faculty" />}>
        <Route path="/hod-dashboard" element={<Layout />}>
          <Route index element={<HODDashboard />} />
        </Route>
      </Route>

      {/* --- Protected TPO (Admin) Route --- */}
      <Route element={<ProtectedRoute allowedRole="Admin" />}>
        <Route path="/tpo-dashboard" element={<Layout />}>
          <Route index element={<TPOAdminDashboard />} />
          <Route path="company/:companyId" element={<ViewApplicantsPage />} />
        </Route>
        <Route path="/manage-users" element={<Layout />}> 
          <Route index element={<ManageUsersPage />} />
        </Route>
      </Route>
      
      {/* --- Protected General Routes (All roles can see) --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/settings" element={<Layout />}>
          <Route index element={<SettingsPage />} />
        </Route>
      </Route>
      
    </Routes>
  );
}

export default App;