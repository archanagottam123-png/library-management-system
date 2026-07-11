// Built-in sample data so the UI is explorable even without the backend.
// When the Express server is running, real data from MongoDB is used instead.

export const SAMPLE_DATA = {
  books: [
    { _id: 'b1', bookId: 'BK-001', name: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Programming', quantity: 5, available: 5 },
    { _id: 'b2', bookId: 'BK-002', name: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', quantity: 4, available: 2 },
    { _id: 'b3', bookId: 'BK-003', name: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', quantity: 6, available: 6 },
    { _id: 'b4', bookId: 'BK-004', name: 'Design Patterns', author: 'Erich Gamma', category: 'Software Engineering', quantity: 3, available: 1 },
    { _id: 'b5', bookId: 'BK-005', name: 'Database System Concepts', author: 'Abraham Silberschatz', category: 'Database', quantity: 4, available: 4 },
    { _id: 'b6', bookId: 'BK-006', name: 'Operating System Concepts', author: 'Abraham Silberschatz', category: 'Operating Systems', quantity: 5, available: 3 },
    { _id: 'b7', bookId: 'BK-007', name: 'Computer Networks', author: 'Andrew S. Tanenbaum', category: 'Networking', quantity: 4, available: 4 },
    { _id: 'b8', bookId: 'BK-008', name: 'Artificial Intelligence', author: 'Stuart Russell', category: 'AI', quantity: 3, available: 2 },
  ],
  students: [
    { _id: 's1', studentId: 'STU-001', name: 'Aarav Sharma', department: 'Computer Science', phone: '9876543210' },
    { _id: 's2', studentId: 'STU-002', name: 'Diya Patel', department: 'Information Technology', phone: '9876543211' },
    { _id: 's3', studentId: 'STU-003', name: 'Kabir Singh', department: 'Electronics', phone: '9876543212' },
    { _id: 's4', studentId: 'STU-004', name: 'Ananya Gupta', department: 'Computer Science', phone: '9876543213' },
    { _id: 's5', studentId: 'STU-005', name: 'Reyansh Verma', department: 'Mechanical', phone: '9876543214' },
  ],
  issues: [
    { _id: 'i1', bookId: 'b2', bookName: 'Clean Code', studentId: 's1', studentName: 'Aarav Sharma', issueDate: '2025-06-15', returnDate: '2025-06-29', returned: false, fine: 0 },
    { _id: 'i2', bookId: 'b4', bookName: 'Design Patterns', studentId: 's3', studentName: 'Kabir Singh', issueDate: '2025-06-20', returnDate: '2025-07-04', returned: false, fine: 0 },
    { _id: 'i3', bookId: 'b6', bookName: 'Operating System Concepts', studentId: 's2', studentName: 'Diya Patel', issueDate: '2025-06-10', returnDate: '2025-06-24', returned: true, fine: 20 },
    { _id: 'i4', bookId: 'b8', bookName: 'Artificial Intelligence', studentId: 's4', studentName: 'Ananya Gupta', issueDate: '2025-06-25', returnDate: '2025-07-09', returned: false, fine: 0 },
  ],
};
