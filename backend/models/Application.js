// backend/models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  // Link to the student who applied
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Link to the company they applied to
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  // Link to their profile at the time of application
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
    required: true,
  },
  // We can add a status later (e.g., "Shortlisted")
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Rejected'],
    default: 'Applied',
  },
}, { timestamps: true }); // Automatically adds "createdAt"

// Prevent a student from applying to the same company twice
ApplicationSchema.index({ student: 1, company: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);