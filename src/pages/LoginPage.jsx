// Login page — admin authentication with simple validation.

import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { validateForm } from '../utils/validation.js';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateForm({ email, password }, {
      email: { required: true, label: 'Email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
      password: { required: true, label: 'Password' },
    });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await login(email, password);
      toast.show('Login successful! Welcome back.', 'success');
    } catch (err) {
      toast.show(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">📚</div>
        <h1>LibManager</h1>
        <p className="subtitle">Sign in to manage your library</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email <span className="req">*</span></label>
            <input
              type="text"
              className={`form-control ${errors.email ? 'error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@library.com"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Password <span className="req">*</span></label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
            {loading ? <span className="spinner-inline" /> : 'Sign In'}
          </button>
        </form>

        <div className="login-hint">
          Demo credentials: <strong>admin@library.com</strong> / <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
}
