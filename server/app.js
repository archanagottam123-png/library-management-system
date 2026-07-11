// =============================================================
// EXPRESS APP SETUP
// -------------------------------------------------------------
// Configures middleware (CORS, JSON parsing) and mounts routes.
// Kept separate from server.js so the app can be tested in isolation.
// =============================================================

import express from 'express';
import cors from 'cors';
import bookRoutes from './routes/bookRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check (used by the frontend to detect if backend is running)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/issues', issueRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

export default app;
