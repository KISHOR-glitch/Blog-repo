// Comment Model
// Defines the structure of comment documents in MongoDB

const mongoose = require('mongoose');

// Create a schema for comments
const commentSchema = new mongoose.Schema(
  {
    // Blog ID - reference to Blog model (which blog this comment belongs to)
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },

    // User ID - reference to User model (who made the comment)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Comment text
    text: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create indexes for better query performance
commentSchema.index({ blog: 1 });
commentSchema.index({ author: 1 });

// Create and export the Comment model
module.exports = mongoose.model('Comment', commentSchema);
