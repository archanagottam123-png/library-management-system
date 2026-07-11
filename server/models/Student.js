// Student model — stores student records.

import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
