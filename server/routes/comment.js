// Comment Routes
// Defines endpoints for comment operations

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');

// POST /api/comments/:id - Add comment to blog (protected)
router.post('/:id', authMiddleware, commentController.addComment);

// DELETE /api/comments/:commentId - Delete comment (protected)
router.delete('/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;
