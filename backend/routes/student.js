// backend/routes/student.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const { protect, authorize } = require('../middleware/authMiddleware');

// Set up multer to store files in memory (not on disk)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Define the Upload Route ---
// This route is: POST /api/students/upload
// It is protected and only for Faculty and Admins.
router.post(
  '/upload',
  protect, // First, check if user is logged in
  authorize('Faculty', 'Admin'), // Next, check if user is Faculty or Admin
  upload.single('studentFile'), // 'studentFile' must match the form-data key
  async (req, res) => {
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // 1. Read the file from memory
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    // 2. Process each row in the Excel file
    for (const row of data) {
      try {
        // We assume the Excel columns are named:
        // StudentID, FullName, Email, Department, SGPA, ActiveBacklogs
        const { StudentID, FullName, Email, Department, SGPA, ActiveBacklogs } = row;

        if (!Email || !StudentID || !FullName || !Department) {
          console.log('Skipping row due to missing data:', row);
          errorCount++;
          continue; // Skip rows with missing essential data
        }

        // 3. Find if a User (login) already exists
        let user = await User.findOne({ email: Email });
        
        if (!user) {
          // If no user, create one with a default password
          // (The HOD will need to tell students this)
          const defaultPassword = 'changeme123';
          user = new User({
            email: Email,
            password: defaultPassword,
            role: 'Student',
          });
          await user.save();
        }

        // 4. Find if a StudentProfile already exists
        let profile = await StudentProfile.findOne({ studentId: StudentID });

        if (profile) {
          // If profile exists, update it
          profile.sgpa = SGPA || 0;
          profile.activeBacklogs = ActiveBacklogs || 0;
          profile.fullName = FullName;
          profile.department = Department;
          await profile.save();
          updatedCount++;
        } else {
          // If no profile, create a new one
          profile = new StudentProfile({
            user: user._id,
            studentId: StudentID,
            fullName: FullName,
            department: Department,
            sgpa: SGPA || 0,
            activeBacklogs: ActiveBacklogs || 0,
          });
          await profile.save();
          createdCount++;
        }
      } catch (error) {
        console.error('Error processing row:', row, error);
        errorCount++;
      }
    } // End of for...loop

    // 5. Send a summary report
    res.status(200).json({
      message: 'File processed successfully.',
      created: createdCount,
      updated: updatedCount,
      errors: errorCount,
    });
  }
);

// ... (at the end of backend/routes/student.js, before module.exports)

// --- Define the Get My Profile Route ---
// This route is: GET /api/students/my-profile
// It is protected just for Students.
router.get(
  '/my-profile',
  protect, // 1. Check if logged in
  authorize('Student'), // 2. Check if user is a Student
  async (req, res) => {
    try {
      // req.user.id comes from our "protect" middleware
      const profile = await StudentProfile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found. Please complete your profile.' });
      }
      
      res.status(200).json(profile);
    } catch (error) {
      console.error('Error fetching student profile:', error);
      res.status(500).json({ message: 'Server error while fetching profile.' });
    }
  }
);

// --- Define the Update My Profile Route ---
// This route is: PUT /api/students/my-profile
// It is protected just for Students.
router.put(
  '/my-profile',
  protect,
  authorize('Student'),
  async (req, res) => {
    try {
      // 1. Get the data the student is allowed to change
      const { phoneNumber, tenthPercent, twelfthPercent, resumeUrl } = req.body;

      // 2. Find their profile
      let profile = await StudentProfile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found.' });
      }

      // 3. Update only the fields they are allowed to
      // (We specifically DO NOT allow them to change SGPA, Dept, etc.)
      profile.phoneNumber = phoneNumber || profile.phoneNumber;
      profile.tenthPercent = tenthPercent || profile.tenthPercent;
      profile.twelfthPercent = twelfthPercent || profile.twelfthPercent;
      profile.resumeUrl = resumeUrl || profile.resumeUrl;

      const updatedProfile = await profile.save();
      
      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error('Error updating student profile:', error);
      res.status(500).json({ message: 'Server error while updating profile.' });
    }
  }
);
module.exports = router;