// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Student', 'Faculty', 'Admin'], // Defines the allowed roles
    default: 'Student',
  },
  // --- NEW FIELD ---
  profileImageUrl: {
    type: String,
    default: '', // Default to an empty string (no image)
  },
  // --- END NEW FIELD ---
}, { timestamps: true }); // Add timestamps

// This part "hashes" the password before saving a new user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// This adds a new function to our model to check the password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!enteredPassword) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);