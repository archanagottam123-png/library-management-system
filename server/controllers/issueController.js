// Issue controller — issue & return books with fine calculation.

import Issue from '../models/Issue.js';
import Book from '../models/Book.js';

const FINE_PER_DAY = 10;

// GET /api/issues
export async function getIssues(req, res, next) {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    next(err);
  }
}

// POST /api/issues
export async function createIssue(req, res, next) {
  try {
    const { bookId, studentId, studentName, issueDate, returnDate } = req.body;
    if (!bookId || !studentId || !issueDate || !returnDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const book = await Book.findOne({ _id: bookId });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.available <= 0) {
      return res.status(400).json({ message: 'Book is not available for issue' });
    }
    // Create issue record
    const issue = await Issue.create({
      bookId: book._id,
      bookName: book.name,
      studentId,
      studentName,
      issueDate,
      returnDate,
      returned: false,
      fine: 0,
    });
    // Decrement available copies
    book.available -= 1;
    await book.save();
    res.status(201).json(issue);
  } catch (err) {
    next(err);
  }
}

// PUT /api/issues/:id/return
export async function returnBook(req, res, next) {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue record not found' });
    if (issue.returned) {
      return res.status(400).json({ message: 'Book already returned' });
    }
    // Calculate fine for late return
    const due = new Date(issue.returnDate);
    const today = new Date();
    let fine = 0;
    if (today > due) {
      const days = Math.floor((today - due) / (1000 * 60 * 60 * 24));
      fine = days * FINE_PER_DAY;
    }
    issue.returned = true;
    issue.fine = fine;
    await issue.save();
    // Increment available copies
    const book = await Book.findById(issue.bookId);
    if (book) {
      book.available += 1;
      await book.save();
    }
    res.json({ success: true, fine, issue });
  } catch (err) {
    next(err);
  }
}
