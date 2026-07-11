// Book model — stores library book records.

import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  available: { type: Number, required: true, default: 1 },
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);
