
const mongoose = require('mongoose');
require('dotenv').config();          

const connectDB = async () => {
  const uri = process.env.MONGO_PROD_URI; 
  try {
    await mongoose.connect(uri, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅  MongoDB connected');
  } catch (err) {
    console.error('❌  DB connection error:', err.message);
    process.exit(1);      
  }
};

module.exports = connectDB;
