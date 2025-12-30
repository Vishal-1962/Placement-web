// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This is our main "protect" middleware
exports.protect = async (req, res, next) => {
  let token;

  // 1. Check for the token in the "Authorization" header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get the token (e.g., "Bearer <token>" -> "<token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the same secret as in auth.js

      // 4. Find the user and attach them to the "req" object
      // We exclude the password from being attached
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // 5. User is valid, call the "next" function (which is our API route)
      next();

    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// This is our "authorize" middleware for checking roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // We check if the req.user (from above) has a role in our allowed list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    // Role is allowed, call "next"
    next();
  };
};