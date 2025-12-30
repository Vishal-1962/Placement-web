// backend/routes/company.js
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Define the Create Company Route ---
// This route is: POST /api/companies
// It is protected and only for Admins (TPO).
router.post(
  '/',
  protect, // 1. Check if logged in
  authorize('Admin'), // 2. Check if user is an Admin
  async (req, res) => {
    try {
      // 3. Get all the data from the TPO's form
      const {
        companyName,
        jobDescription,
        min_sgpa,
        min_tenthPercent,
        min_twelfthPercent,
        allowedDepts,
        allowedBacklogs,
        applicationDeadline,
      } = req.body;

      // 4. Create the new company in the database
      const newCompany = new Company({
        companyName,
        jobDescription,
        min_sgpa,
        min_tenthPercent,
        min_twelfthPercent,
        allowedDepts,
        allowedBacklogs,
        applicationDeadline,
        postedBy: req.user.id, // req.user.id comes from our "protect" middleware
      });

      const savedCompany = await newCompany.save();
      
      // 5. Send back the new company as confirmation
      res.status(201).json(savedCompany);

    } catch (error) {
      console.error('Error creating company:', error);
      res.status(500).json({ message: 'Server error while creating company.' });
    }
  }
);

// We will add routes to GET companies here later.

// --- Define the Get All Companies Route ---
// This route is: GET /api/companies
// It is protected for logged-in users (all roles can see it)
router.get(
  '/',
  protect, // 1. Check if logged in
  async (req, res) => {
    try {
      // 2. Find all companies that are NOT archived
      const companies = await Company.find({ isArchived: false })
        .sort({ applicationDeadline: 1 }); // Sort by deadline

      // 3. Send the list of companies
      res.status(200).json(companies);
    } catch (error)
    {
      console.error('Error fetching companies:', error);
      res.status(500).json({ message: 'Server error while fetching companies.' });
    }
  }
);
module.exports = router;