// Main Express Application
// This is the entry point for the backend server

require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const commentRoutes = require('./routes/comment');

// Create Express application
const app = express();

// Connect to MongoDB
connectDB();

// ===== MIDDLEWARE =====

// Enable CORS (Cross-Origin Resource Sharing)
// This allows frontend to make requests to backend from different origin
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse incoming form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder (HTML, CSS, JS, images, etc.)
app.use(express.static('public'));

// ===== API ROUTES =====

// All auth routes: /api/auth/*
app.use('/api/auth', authRoutes);

// All blog routes: /api/blogs/*
app.use('/api/blogs', blogRoutes);

// All comment routes: /api/comments/*
app.use('/api/comments', commentRoutes);

// ===== HEALTH CHECK =====

// GET /api/health - Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// ===== ERROR HANDLING =====

// Catch all 404 errors (route not found)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ===== START SERVER =====

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
