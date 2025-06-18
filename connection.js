// backend/connection.js
const mongoose = require('mongoose');
require('dotenv').config();              // ① .env 읽기

const connectDB = async () => {
  const uri = process.env.MONGO_PROD_URI;  // ② 정확히 같은 변수명

  try {
    await mongoose.connect(uri, {        // ③ 옵션 간단히
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅  MongoDB connected');
  } catch (err) {
    console.error('❌  DB connection error:', err.message);
    process.exit(1);                     // 실패 시 프로세스 종료
  }
};

module.exports = connectDB;
