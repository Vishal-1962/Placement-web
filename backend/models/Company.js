// backend/models/Company.js
const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  // --- Eligibility Rules ---
  min_sgpa: {
    type: Number,
    required: true,
    default: 0,
  },
  min_tenthPercent: {
    type: Number,
    required: true,
    default: 0,
  },
  min_twelfthPercent: {
    type: Number,
    required: true,
    default: 0,
  },
  allowedDepts: [ // This will be an array of strings
    {
      type: String,
    }
  ],
  allowedBacklogs: {
    type: Number,
    required: true,
    default: 0,
  },
  // --- End of Rules ---
  applicationDeadline: {
    type: Date,
    required: true,
  },
  // Link to the TPO/Admin who posted it
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // We'll use this for the 2nd/3rd year archive feature
  isArchived: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true }); // Automatically adds "createdAt" and "updatedAt"

module.exports = mongoose.model('Company', CompanySchema);