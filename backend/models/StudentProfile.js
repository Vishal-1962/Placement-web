// backend/models/StudentProfile.js
const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  // Link to the main User login
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Each user has one profile
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  sgpa: {
    type: Number,
    required: true,
    default: 0,
  },
  activeBacklogs: {
    type: Number,
    required: true,
    default: 0,
  },
  // These will be filled in by the student later
  phoneNumber: {
    type: String,
  },
  tenthPercent: {
    type: Number,
  },
  twelfthPercent: {
    type: Number,
  },
  resumeUrl: {
    type: String,
  },
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);