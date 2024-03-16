// db.js
const mongoose = require('mongoose');
require('dotenv').config();

// Define an asynchronous function called connectDB
const connectDB = async () => {
  try {
    // Check the NODE_ENV environment variable
    if (process.env.NODE_ENV === 'production') {
      // If the environment is production, use the MongoDB Atlas connection string
      await mongoose.connect(process.env.MONGODB_ATLAS, {
      });

      console.log('Connected to the Atlas database');
    } else {
      // If the environment is development or any other value, use the local MongoDB connection string
      await mongoose.connect(process.env.MONGODB_LOCAL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log('Connected to the local database');
    }

    // If the connection is successful, log a success message

  } catch (error) {
    // If an error occurs during connection, log the error message
    console.error('Error connecting to the database:', error.message);
  }
};

// Export the connectDB function so it can be used in other parts of the application
module.exports = connectDB;