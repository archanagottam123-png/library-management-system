// Issue model — tracks book issues and returns.

import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  bookName: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  issueDate: { type: String, required: true },
  returnDate: { type: String, required: true },
  returned: { type: Boolean, default: false },
  fine: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Issue', issueSchema);
