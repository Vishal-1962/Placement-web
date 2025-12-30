// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

// --- Register Route ---
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = new User({ email, password, role });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Login Route (Final, Clean Version) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const plainUser = user.toObject();
    res.json({
      token,
      user: {
        id: plainUser._id,
        email: plainUser.email,
        role: plainUser.role,
        profileImageUrl: plainUser.profileImageUrl,
      },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Change Password Route ---
router.post('/change-password', protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Please provide old and new passwords.' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) return res.status(401).json({ message: 'Invalid old password.' });
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Change Password Error:', error.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// --- Update Profile (Image Upload) Route ---
router.post(
  '/update-profile',
  protect,
  upload.single('profileImage'),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found.' });
      if (req.file) {
        user.profileImageUrl = req.file.path;
      }
      const updatedUser = await user.save();
      res.status(200).json({
        message: 'Profile updated successfully.',
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          role: updatedUser.role,
          profileImageUrl: updatedUser.profileImageUrl,
        },
      });
    } catch (error) {
      // THIS IS THE FIX, as you diagnosed.
      console.error('--- IMAGE UPLOAD ERROR ---');
      console.error('Error Message:', error.message);
      res.status(500).json({ message: 'Server error while uploading image.' });
    }
  }
);

// DELETE /api/auth/profile-image
router.delete(
  '/profile-image',
  protect, // Ensure the user is logged in
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Clear the image URL
      user.profileImageUrl = '';
      const updatedUser = await user.save();

      // Send back the updated user info
      res.status(200).json({
        message: 'Profile picture removed successfully.',
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          role: updatedUser.role,
          profileImageUrl: updatedUser.profileImageUrl, // This will be empty
        },
      });

    } catch (error) {
      console.error('Remove Image Error:', error.message);
      res.status(500).json({ message: 'Server error while removing picture.' });
    }
  }
);
// backend/routes/auth.js (Add before module.exports)

// --- NEW "Get All Users" Route (for TPO Admin) ---
// GET /api/auth/users
router.get(
    '/users',
    protect,
    authorize('Admin'), // Only Admin can see this list
    async (req, res) => {
        try {
            // Find all users who are NOT students
            const users = await User.find({ role: { $ne: 'Student' } }).select('-password');
            res.status(200).json(users);
        } catch (error) {
            console.error('Get Users Error:', error.message);
            res.status(500).json({ message: 'Server error fetching users.' });
        }
    }
);

// --- NEW "Delete User" Route (for TPO Admin) ---
// DELETE /api/auth/users/:id
router.delete(
    '/users/:id',
    protect,
    authorize('Admin'), // Only Admin can delete users
    async (req, res) => {
        try {
            const userToDelete = await User.findById(req.params.id);

            if (!userToDelete) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Prevent Admin from deleting themselves
            if (userToDelete.role === 'Admin' && userToDelete._id.toString() === req.user.id.toString()) {
                 return res.status(403).json({ message: 'Cannot delete your own Admin account.' });
            }

            await userToDelete.deleteOne();
            res.status(200).json({ message: 'User deleted successfully.' });

        } catch (error) {
            console.error('Delete User Error:', error.message);
            res.status(500).json({ message: 'Server error deleting user.' });
        }
    }
);
module.exports = router;