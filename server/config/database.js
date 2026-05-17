// Database configuration file
// This file handles MongoDB connection using Mongoose

const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI;

    // Connection options for better performance
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Connect to MongoDB
    await mongoose.connect(mongoURI, options);
    console.log('MongoDB connected successfully');

    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure code
  }
};

module.exports = connectDB;
