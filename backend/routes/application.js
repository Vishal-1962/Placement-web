// backend/routes/application.js
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const StudentProfile = require('../models/StudentProfile');
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/authMiddleware');

// This is a re-creation of our frontend eligibility logic,
// but on the backend. NEVER trust the frontend.
// This is our final security check.
const checkEligibilityOnBackend = (profile, company) => {
  if (!profile || !company) return false;
  if (!profile.tenthPercent || !profile.twelfthPercent) return false;
  if (profile.sgpa < company.min_sgpa) return false;
  if (profile.tenthPercent < company.min_tenthPercent) return false;
  if (profile.twelfthPercent < company.min_twelfthPercent) return false;
  if (profile.activeBacklogs > company.allowedBacklogs) return false;
  if (!company.allowedDepts.includes(profile.department)) return false;
  return true;
};

// --- Define the "Apply to Company" Route ---
// This route is: POST /api/applications/:companyId
// It is protected just for Students.
router.post(
  '/:companyId',
  protect, // 1. Check if logged in
  authorize('Student'), // 2. Check if user is a Student
  async (req, res) => {
    try {
      const { companyId } = req.params;
      const studentId = req.user.id; // From "protect" middleware

      // 3. Find the student's profile and the company
      const profile = await StudentProfile.findOne({ user: studentId });
      const company = await Company.findById(companyId);

      if (!profile || !company) {
        return res.status(404).json({ message: 'Profile or Company not found.' });
      }

      // 4. FINAL SECURITY CHECK: Re-check eligibility on the backend
      const isEligible = checkEligibilityOnBackend(profile, company);
      if (!isEligible) {
        return res.status(403).json({ message: 'You are not eligible for this company.' });
      }

      // 5. Check if they already applied
      const existingApplication = await Application.findOne({
        student: studentId,
        company: companyId,
      });
      if (existingApplication) {
        return res.status(400).json({ message: 'You have already applied to this company.' });
      }

      // 6. All checks passed! Create the application.
      const newApplication = new Application({
        student: studentId,
        company: companyId,
        profile: profile._id, // Save a reference to their profile
      });

      await newApplication.save();
      res.status(201).json({ message: 'Application submitted successfully!', application: newApplication });

    } catch (error) {
      console.error('Error applying to company:', error);
      res.status(500).json({ message: 'Server error while applying.' });
    }
  }
);

// --- Define the "Get My Applications" Route ---
// This route is: GET /api/applications/my-applications
// It is protected just for Students.
router.get(
  '/my-applications',
  protect,
  authorize('Student'),
  async (req, res) => {
    try {
      // Find all applications for the logged-in student
      const applications = await Application.find({ student: req.user.id })
        .populate('company', 'companyName jobDescription'); // Get company details

      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// --- Define the "Get Applicants for a Company" Route ---
// This route is: GET /api/applications/:companyId/applicants
// It is protected for Faculty and Admins.
router.get(
  '/:companyId/applicants',
  protect,
  authorize('Faculty', 'Admin'), // Only TPO/HOD can see applicants
  async (req, res) => {
    try {
      const { companyId } = req.params;

      // 1. Find all applications for this one company
      const applications = await Application.find({ company: companyId })
        // 2. "Populate" (join) the related data
        .populate('student', 'email') // Get the student's email from the User model
        .populate('profile'); // Get the *entire* profile from StudentProfile

      // 3. Send the full list
      res.status(200).json(applications);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

module.exports = router;