const mongoose = require('mongoose');
//require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://vs3943943:NiziNPQMVYP8KRfo@coding-app.grqf0.mongodb.net/');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
