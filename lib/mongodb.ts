import mongoose from 'mongoose';

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DB,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    throw err;
  }
};
