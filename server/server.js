// =============================================================
// SERVER ENTRY POINT
// -------------------------------------------------------------
// Starts the Express server and connects to MongoDB.
// Run with: npm run server  (or npm run server:dev for auto-reload)
// =============================================================

import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start listening.
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
