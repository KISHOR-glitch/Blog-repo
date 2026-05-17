// User Model
// Defines the structure of user documents in MongoDB

const mongoose = require('mongoose');

// Create a schema for users
const userSchema = new mongoose.Schema(
  {
    // Username field - required and must be unique
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },

    // Email field - required and must be unique
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation regex
    },

    // Password field - required (will be hashed before saving)
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Remove password from the response when converting document to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
