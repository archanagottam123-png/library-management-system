// Book controller — CRUD for books.

import Book from '../models/Book.js';

// GET /api/books
export async function getBooks(req, res, next) {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    next(err);
  }
}

// GET /api/books/:id
export async function getBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
}

// POST /api/books
export async function createBook(req, res, next) {
  try {
    const { bookId, name, author, category, quantity, available } = req.body;
    if (!bookId || !name || !author || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const book = await Book.create({
      bookId, name, author, category,
      quantity: Number(quantity) || 1,
      available: Number(available) || Number(quantity) || 1,
    });
    res.status(201).json(book);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Book ID already exists' });
    }
    next(err);
  }
}

// PUT /api/books/:id
export async function updateBook(req, res, next) {
  try {
    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      { ...req.body, quantity: Number(req.body.quantity), available: Number(req.body.available) },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Book not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/books/:id
export async function deleteBook(req, res, next) {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Book not found' });
    res.json({ success: true, message: 'Book deleted' });
  } catch (err) {
    next(err);
  }
}
