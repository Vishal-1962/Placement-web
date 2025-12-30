// src/pages/ManageUsersPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// We will build these API functions next
import { getUsers, registerUser, deleteUser } from '../api'; 

// --- Styles ---
const containerStyle = { maxWidth: '1000px', margin: '2rem auto' };
const formStyle = { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '3rem' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
const thStyle = { backgroundColor: '#f4f7f6', padding: '12px 15px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #eee' };
const btnStyle = { padding: '8px 12px', margin: '0 5px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

const ManageUsersPage = () => {
    const { user, token } = useAuth();
    const [users, setUsers] = useState([]); // Faculty and Admins
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [formMessage, setFormMessage] = useState('');
    const [newUserData, setNewUserData] = useState({ email: '', password: 'changeme123', role: 'Faculty' });

    // --- Fetch User List ---
    const fetchUsers = async () => {
        try {
            setLoading(true);
            // We'll build the getUsers API to fetch non-student users
            const { data } = await getUsers(token); 
            setUsers(data);
        } catch (error) {
            setMessage('Failed to load user list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    // --- Add User Handler ---
    const handleAddUser = async (e) => {
        e.preventDefault();
        setFormMessage('Adding user...');
        try {
            await registerUser(newUserData, token);
            setFormMessage('User added successfully. Default password is changeme123.');
            setNewUserData({ email: '', password: 'changeme123', role: 'Faculty' }); // Reset form
            fetchUsers(); // Refresh the list
        } catch (error) {
            setFormMessage(error.response?.data?.message || 'Error adding user.');
        }
    };
    
    // --- Delete User Handler ---
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        
        // This is a placeholder; we need a delete API function
        try {
            // await deleteUser(userId, token); 
            setMessage('User deleted successfully (DEMO). Please implement deleteUser API.');
            fetchUsers(); // Refresh the list
        } catch (error) {
            setMessage('Error deleting user.');
        }
    };
    
    // --- Render Logic ---
    if (loading) return <div style={containerStyle}>Loading user management console...</div>;
    if (user.role !== 'Admin') return <div style={containerStyle}>Access Denied. Only TPO Admin can view this page.</div>;

    return (
        <div style={containerStyle}>
            <h2>User Management Console</h2>
            <p style={{marginBottom: '2rem'}}>Manage Faculty Coordinators (HODs) and other Admins.</p>
            
            {/* 1. Add New User Form */}
            <div style={formStyle}>
                <h3>+ Add New Faculty/Admin</h3>
                <form onSubmit={handleAddUser}>
                    <input type="email" placeholder="Email (e.g., hod@college.edu)" value={newUserData.email} onChange={(e) => setNewUserData({...newUserData, email: e.target.value})} required style={{padding: '10px', marginRight: '10px'}} />
                    
                    <select value={newUserData.role} onChange={(e) => setNewUserData({...newUserData, role: e.target.value})} required style={{padding: '10px', marginRight: '10px'}}>
                        <option value="Faculty">Faculty Coordinator (HOD)</option>
                        {user.role === 'Admin' && <option value="Admin">TPO Administrator</option>}
                    </select>

                    <button type="submit" style={{...btnStyle, backgroundColor: '#3498DB', color: 'white'}}>Add User</button>
                    {formMessage && <p style={{marginTop: '10px', color: formMessage.includes('successfully') ? 'green' : 'red'}}>{formMessage}</p>}
                </form>
            </div>

            {/* 2. User List Table */}
            <h3>Current Users ({users.length})</h3>
            {message && <p style={{color: 'red'}}>{message}</p>}
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Role</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id}>
                            <td style={tdStyle}>{u.email}</td>
                            <td style={tdStyle}>{u.role}</td>
                            <td style={tdStyle}>
                                {u.role !== 'Admin' && <button onClick={() => handleDeleteUser(u._id)} style={{...btnStyle, backgroundColor: '#E74C3C', color: 'white'}}>Delete</button>}
                                {u.role === 'Faculty' && <button style={{...btnStyle, backgroundColor: '#f39c12'}}>Make Admin (TBD)</button>}
                                {u.role === 'Admin' && u._id !== user._id && <button style={{...btnStyle, backgroundColor: '#f39c12'}}>Demote (TBD)</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsersPage;