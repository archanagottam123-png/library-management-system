// =============================================================
// AUTH CONTEXT
// -------------------------------------------------------------
// Stores the logged-in admin user in React state + localStorage.
// A simple, beginner-friendly auth pattern (no JWT library).
// =============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on first load.
  useEffect(() => {
    const stored = localStorage.getItem('lms_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  async function login(email, password) {
    const data = await api.login(email, password);
    const u = data.user || { name: 'Admin', email };
    setUser(u);
    localStorage.setItem('lms_user', JSON.stringify(u));
    if (data.token) localStorage.setItem('lms_token', data.token);
    return u;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('lms_user');
    localStorage.removeItem('lms_token');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
