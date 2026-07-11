// =============================================================
// SEED SCRIPT
// -------------------------------------------------------------
// Populates MongoDB with sample data for testing.
// Run with: node server/seed.js
// =============================================================

import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Book from './models/Book.js';
import Student from './models/Student.js';
import Issue from './models/Issue.js';

async function seed() {
  await connectDB();

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Book.deleteMany({}),
    Student.deleteMany({}),
    Issue.deleteMany({}),
  ]);

  // Admin user
  await User.create({
    name: 'Admin',
    email: 'admin@library.com',
    password: 'admin123',
  });

  // Books
  const books = await Book.insertMany([
    { bookId: 'BK-001', name: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Programming', quantity: 5, available: 5 },
    { bookId: 'BK-002', name: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', quantity: 4, available: 2 },
    { bookId: 'BK-003', name: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', quantity: 6, available: 6 },
    { bookId: 'BK-004', name: 'Design Patterns', author: 'Erich Gamma', category: 'Software Engineering', quantity: 3, available: 1 },
    { bookId: 'BK-005', name: 'Database System Concepts', author: 'Abraham Silberschatz', category: 'Database', quantity: 4, available: 4 },
    { bookId: 'BK-006', name: 'Operating System Concepts', author: 'Abraham Silberschatz', category: 'Operating Systems', quantity: 5, available: 3 },
    { bookId: 'BK-007', name: 'Computer Networks', author: 'Andrew S. Tanenbaum', category: 'Networking', quantity: 4, available: 4 },
    { bookId: 'BK-008', name: 'Artificial Intelligence', author: 'Stuart Russell', category: 'AI', quantity: 3, available: 2 },
  ]);

  // Students
  const students = await Student.insertMany([
    { studentId: 'STU-001', name: 'Aarav Sharma', department: 'Computer Science', phone: '9876543210' },
    { studentId: 'STU-002', name: 'Diya Patel', department: 'Information Technology', phone: '9876543211' },
    { studentId: 'STU-003', name: 'Kabir Singh', department: 'Electronics', phone: '9876543212' },
    { studentId: 'STU-004', name: 'Ananya Gupta', department: 'Computer Science', phone: '9876543213' },
    { studentId: 'STU-005', name: 'Reyansh Verma', department: 'Mechanical', phone: '9876543214' },
  ]);

  // Issues
  await Issue.insertMany([
    { bookId: books[1]._id, bookName: books[1].name, studentId: students[0]._id, studentName: students[0].name, issueDate: '2025-06-15', returnDate: '2025-06-29', returned: false, fine: 0 },
    { bookId: books[3]._id, bookName: books[3].name, studentId: students[2]._id, studentName: students[2].name, issueDate: '2025-06-20', returnDate: '2025-07-04', returned: false, fine: 0 },
    { bookId: books[5]._id, bookName: books[5].name, studentId: students[1]._id, studentName: students[1].name, issueDate: '2025-06-10', returnDate: '2025-06-24', returned: true, fine: 20 },
    { bookId: books[7]._id, bookName: books[7].name, studentId: students[3]._id, studentName: students[3].name, issueDate: '2025-06-25', returnDate: '2025-07-09', returned: false, fine: 0 },
  ]);

  console.log('Seed data inserted successfully!');
  console.log('Admin login: admin@library.com / admin123');
  mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
