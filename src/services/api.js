// =============================================================
// API SERVICE
// -------------------------------------------------------------
// A tiny wrapper around the browser `fetch` API.
// In production, every call goes to the Express backend at /api/*.
// If the backend is not running (e.g. in a static preview), the
// frontend falls back to built-in SAMPLE_DATA so the UI is still
// fully explorable.
// =============================================================

import { SAMPLE_DATA } from './sampleData.js';

const API_BASE = '/api';

// Detect once whether the backend is reachable.
let backendAvailable = null;

async function checkBackend() {
  if (backendAvailable !== null) return backendAvailable;
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

// Small helper: read JSON safely
async function parseJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

// Main request helper used by every API method below.
async function request(path, options = {}) {
  const ok = await checkBackend();
  if (!ok) {
    // Backend not running -> return null so callers can use fallback data.
    return null;
  }
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await parseJson(res);
    if (!res.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  } catch (err) {
    backendAvailable = false;
    throw err;
  }
}

// ---------- Auth ----------
export const api = {
  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (data) return data;
    // Fallback: accept the demo admin.
    if (email === 'admin@library.com' && password === 'admin123') {
      return { token: 'demo-token', user: { name: 'Admin', email } };
    }
    throw new Error('Invalid credentials');
  },

  // ---------- Books ----------
  async getBooks() {
    const data = await request('/books');
    return data || SAMPLE_DATA.books;
  },
  async addBook(book) {
    const data = await request('/books', { method: 'POST', body: book });
    return data || book;
  },
  async updateBook(id, book) {
    const data = await request(`/books/${id}`, { method: 'PUT', body: book });
    return data || book;
  },
  async deleteBook(id) {
    const data = await request(`/books/${id}`, { method: 'DELETE' });
    return data || { success: true };
  },

  // ---------- Students ----------
  async getStudents() {
    const data = await request('/students');
    return data || SAMPLE_DATA.students;
  },
  async addStudent(student) {
    const data = await request('/students', { method: 'POST', body: student });
    return data || student;
  },
  async updateStudent(id, student) {
    const data = await request(`/students/${id}`, { method: 'PUT', body: student });
    return data || student;
  },
  async deleteStudent(id) {
    const data = await request(`/students/${id}`, { method: 'DELETE' });
    return data || { success: true };
  },

  // ---------- Issues ----------
  async getIssues() {
    const data = await request('/issues');
    return data || SAMPLE_DATA.issues;
  },
  async issueBook(issue) {
    const data = await request('/issues', { method: 'POST', body: issue });
    return data || issue;
  },
  async returnBook(id, payload) {
    const data = await request(`/issues/${id}/return`, { method: 'PUT', body: payload });
    return data || { success: true };
  },
};
