// Blog Controller
// Handles blog CRUD operations (Create, Read, Update, Delete)

const Blog = require('../models/Blog');
const User = require('../models/User');
const Comment = require('../models/Comment');

// Get all blogs (public route - anyone can view)
const getAllBlogs = async (req, res) => {
  try {
    const { search, category, tag } = req.query;

    // Build query filter
    let filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (tag) filter.tags = { $in: [tag] };

    // Find all blogs and populate author info
    const blogs = await Blog.find(filter)
      .populate('author', 'username') // Include author username
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username',
        },
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({ blogs });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).json({ message: 'Server error fetching blogs' });
  }
};

// Get single blog by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find blog by ID and populate author and comments
    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } }, // Increment view count
      { new: true }
    )
      .populate('author', 'username email') // Include author info
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username',
        },
      });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ blog });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error fetching blog' });
  }
};

// Create new blog (protected route - user must be logged in)
const createBlog = async (req, res) => {
  try {
    // Get blog data from request body
    const { title, description, content, category, tags } = req.body;

    // Validate input
    if (!title || !description || !content) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Parse tags: accept comma-separated string or array
    let parsedTags = [];
    if (tags) {
      parsedTags = Array.isArray(tags)
        ? tags
        : tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    // Create new blog with current user as author
    const blog = new Blog({
      title,
      description,
      content,
      category: category || 'General',
      tags: parsedTags,
      author: req.user.id, // User ID from JWT token
    });

    // Save blog to database
    await blog.save();

    // Populate author info before sending response
    await blog.populate('author', 'username');

    res.status(201).json({
      message: 'Blog created successfully',
      blog,
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error creating blog' });
  }
};

// Update blog (protected route - only blog author can update)
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, category, tags } = req.body;

    // Find blog by ID
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if current user is the blog author
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own blogs' });
    }

    // Update blog fields
    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.content = content || blog.content;
    if (category) blog.category = category;
    if (tags) {
      blog.tags = Array.isArray(tags)
        ? tags
        : tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    // Save updated blog
    await blog.save();

    // Populate author info before sending response
    await blog.populate('author', 'username');

    res.status(200).json({
      message: 'Blog updated successfully',
      blog,
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error updating blog' });
  }
};

// Delete blog (protected route - only blog author can delete)
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Find blog by ID
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if current user is the blog author
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own blogs' });
    }

    // Delete all comments associated with this blog
    await Comment.deleteMany({ blog: id });

    // Delete the blog
    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error deleting blog' });
  }
};

// Get all blogs by current user
const getUserBlogs = async (req, res) => {
  try {
    // Find all blogs by current user
    const blogs = await Blog.find({ author: req.user.id })
      .populate('author', 'username')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ blogs });
  } catch (error) {
    console.error('Get user blogs error:', error);
    res.status(500).json({ message: 'Server error fetching user blogs' });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs,
};
