// Auth controller — login & register (simple, no JWT library).

import User from '../models/User.js';

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Simple token (base64 of user id + timestamp) — no JWT library per requirements.
    const token = Buffer.from(`${user._id}:${Date.now()}`).toString('base64');
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/register
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password });
    const token = Buffer.from(`${user._id}:${Date.now()}`).toString('base64');
    res.status(201).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
}
