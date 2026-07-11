// =============================================================
// DATABASE CONFIG
// -------------------------------------------------------------
// Connects to MongoDB using Mongoose.
// The connection string comes from the MONGO_URI env variable
// (see server/.env.example). Falls back to a local default.
// =============================================================

import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/library_db';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
}

export default connectDB;
