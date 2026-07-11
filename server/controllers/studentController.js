// Student controller — CRUD for students.

import Student from '../models/Student.js';

// GET /api/students
export async function getStudents(req, res, next) {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    next(err);
  }
}

// GET /api/students/:id
export async function getStudent(req, res, next) {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
}

// POST /api/students
export async function createStudent(req, res, next) {
  try {
    const { studentId, name, department, phone } = req.body;
    if (!studentId || !name || !department || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const student = await Student.create({ studentId, name, department, phone });
    res.status(201).json(student);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Student ID already exists' });
    }
    next(err);
  }
}

// PUT /api/students/:id
export async function updateStudent(req, res, next) {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Student not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/students/:id
export async function deleteStudent(req, res, next) {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    next(err);
  }
}
