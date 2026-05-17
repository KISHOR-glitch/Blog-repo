// Blog Routes
// Defines endpoints for blog CRUD operations

const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/auth');

// GET /api/blogs - Get all blogs (public)
router.get('/', blogController.getAllBlogs);

// GET /api/blogs/user/my-blogs - Get all blogs by current user (protected)
router.get('/user/my-blogs', authMiddleware, blogController.getUserBlogs);

// GET /api/blogs/:id - Get single blog by ID (public)
router.get('/:id', blogController.getBlogById);

// POST /api/blogs - Create new blog (protected)
router.post('/', authMiddleware, blogController.createBlog);

// PUT /api/blogs/:id - Update blog (protected)
router.put('/:id', authMiddleware, blogController.updateBlog);

// DELETE /api/blogs/:id - Delete blog (protected)
router.delete('/:id', authMiddleware, blogController.deleteBlog);

module.exports = router;
