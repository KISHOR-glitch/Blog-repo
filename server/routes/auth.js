// Authentication Routes
// Defines endpoints for user registration, login, and profile

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/register - Register a new user
router.post('/register', authController.register);

// POST /api/auth/login - Login user
router.post('/login', authController.login);

// GET /api/auth/me - Get current logged-in user (protected route)
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
