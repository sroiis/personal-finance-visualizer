require('dotenv').config({ path: '.env.local' }); // specify file
const mongoose = require('mongoose');

console.log('URI:', process.env.MONGODB_URI);

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected!');
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
}

testConnection();
