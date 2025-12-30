// src/api.js
import axios from 'axios';

// Create an 'instance' of axios with the base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Our backend URL
});

// --- Auth Routes ---
export const login = (email, password) => {
  return API.post('/auth/login', { email, password });
};

export const changePassword = (passwordData, token) => {
  // passwordData will be { oldPassword, newPassword }
  return API.post('/auth/change-password', passwordData, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const updateProfile = (file, token) => {
  // This is our new function to upload a file
  const formData = new FormData();
  formData.append('profileImage', file); // 'profileImage' must match backend

  return API.post('/auth/update-profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  });
};

// --- HOD (Faculty) Routes ---
export const uploadStudents = (file, token) => {
  const formData = new FormData();
  formData.append('studentFile', file); 

  return API.post('/students/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  });
};

// --- TPO (Admin) Routes ---
export const createCompany = (companyData, token) => {
  return API.post('/companies', companyData, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const getApplicantsForCompany = (companyId, token) => {
  return API.get(`/applications/${companyId}/applicants`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

// --- Student Routes ---
export const getCompanies = (token) => {
  return API.get('/companies', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const getMyProfile = (token) => {
  return API.get('/students/my-profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const updateMyProfile = (profileData, token) => {
  // This is for 10th/12th/phone/resume
  return API.put('/students/my-profile', profileData, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const applyToCompany = (companyId, token) => {
  return API.post(`/applications/${companyId}`, {}, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const getMyApplications = (token) => {
  return API.get('/applications/my-applications', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

// A function to call the remove profile picture API
export const removeProfilePicture = (token) => {
  // Use a DELETE request
  return API.delete('/auth/profile-image', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Get all non-student users (Admin, Faculty)
export const getUsers = (token) => {
  return API.get('/auth/users', { headers: { 'Authorization': `Bearer ${token}` } });
};

// Register a new user (Only TPO Admin will use this endpoint)
export const registerUser = (userData, token) => {
  return API.post('/auth/register', userData, { headers: { 'Authorization': `Bearer ${token}` } });
};

// Delete a user (Will need a new backend route)
export const deleteUser = (userId, token) => {
  return API.delete(`/auth/users/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
};

export default API;