// Blog Model
// Defines the structure of blog documents in MongoDB

const mongoose = require('mongoose');

// Create a schema for blogs
const blogSchema = new mongoose.Schema(
  {
    // Blog title - required field
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    // Short description/excerpt of the blog
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },

    // Full content of the blog post
    content: {
      type: String,
      required: true,
    },

    // Author ID - reference to User model
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Comments array - will store comment IDs
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],

    // View count (optional - for future analytics)
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create index on author to improve query performance
blogSchema.index({ author: 1 });

// Create and export the Blog model
module.exports = mongoose.model('Blog', blogSchema);
