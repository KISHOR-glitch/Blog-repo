// Comment Controller
// Handles comment operations (Create and Delete)

const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// Add comment to blog (protected route - user must be logged in)
const addComment = async (req, res) => {
  try {
    // Get blog ID from URL params and comment text from request body
    const { id } = req.params;
    const { text } = req.body;

    // Validate input
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    // Check if blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Create new comment
    const comment = new Comment({
      blog: id,
      author: req.user.id, // User ID from JWT token
      text,
    });

    // Save comment to database
    await comment.save();

    // Add comment to blog's comments array
    blog.comments.push(comment._id);
    await blog.save();

    // Populate author info before sending response
    await comment.populate('author', 'username');

    res.status(201).json({
      message: 'Comment added successfully',
      comment,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
};

// Delete comment (protected route - only comment author can delete)
const deleteComment = async (req, res) => {
  try {
    // Get comment ID from URL params
    const { commentId } = req.params;

    // Find comment by ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if current user is the comment author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    // Remove comment from blog's comments array
    await Blog.findByIdAndUpdate(
      comment.blog,
      { $pull: { comments: commentId } }
    );

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
};

module.exports = {
  addComment,
  deleteComment,
};
