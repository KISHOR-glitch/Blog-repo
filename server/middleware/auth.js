// JWT Authentication Middleware
// This middleware verifies JWT tokens and adds user information to the request

const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    // Format: "Bearer token_here"
    const token = req.headers.authorization?.split(' ')[1];

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token using JWT secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request object so it can be used in route handlers
    req.user = decoded;

    // Call next middleware or route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
