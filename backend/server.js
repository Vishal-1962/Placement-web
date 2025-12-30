// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Set up the Express app
const app = express();
dotenv.config();

// Connect to MongoDB BEFORE loading other routes
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  // This will run only if the connection is successful
  console.log('SUCCESS: Connected to MongoDB database.');
  
  // --- LOAD ROUTES AND START SERVER *AFTER* SUCCESS ---

  // Import Routes
  const authRoutes = require('./routes/auth');
  const studentRoutes = require('./routes/student');
  const companyRoutes = require('./routes/company');
  const applicationRoutes = require('./routes/application');

  // Set up Middleware
  app.use(cors());
  app.use(express.json());

  // Define API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/companies', companyRoutes);
  app.use('/api/applications', applicationRoutes);

  // Define a test route
  app.get('/', (req, res) => {
    res.send('Placement Portal Backend is running!');
  });

  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  
})
.catch((err) => {
  // THIS IS THE FIX. IT WILL NO LONGER SHOW [object Object]
  console.error('--- MONGODB CONNECTION FAILED ---');
  console.error('Error Message:', err.message); 
  console.error('---------------------------------');
  process.exit(1); 
});