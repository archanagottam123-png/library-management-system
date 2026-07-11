// Issue Book page — select student + book, set dates, prevent issuing unavailable books.

import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { validateForm } from '../utils/validation.js';
import Spinner from '../components/Spinner.jsx';

export default function IssueBookPage() {
  const toast = useToast();
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ studentId: '', bookId: '', issueDate: '', returnDate: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [b, s, i] = await Promise.all([api.getBooks(), api.getStudents(), api.getIssues()]);
        setBooks(b);
        setStudents(s);
        setIssues(i);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Only books with available copies can be issued
  const availableBooks = books.filter((b) => Number(b.available) > 0);

  function todayPlus(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateForm(form, {
      studentId: { required: true, label: 'Student' },
      bookId: { required: true, label: 'Book' },
      issueDate: { required: true, label: 'Issue Date' },
      returnDate: { required: true, label: 'Return Date' },
    });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const book = books.find((b) => b._id === form.bookId);
    const student = students.find((s) => s._id === form.studentId);
    if (!book || Number(book.available) <= 0) {
      toast.show('This book is not available', 'error');
      return;
    }

    setSaving(true);
    try {
      const issue = {
        _id: 'i' + Date.now(),
        bookId: book._id,
        bookName: book.name,
        studentId: student._id,
        studentName: student.name,
        issueDate: form.issueDate,
        returnDate: form.returnDate,
        returned: false,
        fine: 0,
      };
      await api.issueBook(issue);
      setIssues((i) => [...i, issue]);
      // Decrement available copies locally
      setBooks((b) => b.map((x) => (x._id === book._id ? { ...x, available: Number(x.available) - 1 } : x)));
      setForm({ studentId: '', bookId: '', issueDate: '', returnDate: '' });
      toast.show('Book issued successfully', 'success');
    } catch (err) {
      toast.show(err.message || 'Failed to issue book', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;

  const active = issues.filter((i) => !i.returned).reverse();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Issue Book</h1>
          <p>Issue a book to a student with due date tracking</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><h3>New Issue</h3></div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Select Student <span className="req">*</span></label>
                <select
                  className={`form-control ${errors.studentId ? 'error' : ''}`}
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                >
                  <option value="">-- Choose student --</option>
                  {students.map((s) => <option key={s._id} value={s._id}>{s.studentId} — {s.name}</option>)}
                </select>
                {errors.studentId && <div className="form-error">{errors.studentId}</div>}
              </div>
              <div className="form-group">
                <label>Select Book <span className="req">*</span></label>
                <select
                  className={`form-control ${errors.bookId ? 'error' : ''}`}
                  value={form.bookId}
                  onChange={(e) => setForm({ ...form, bookId: e.target.value })}
                >
                  <option value="">-- Choose book --</option>
                  {availableBooks.map((b) => <option key={b._id} value={b._id}>{b.bookId} — {b.name} ({b.available} avail.)</option>)}
                </select>
                {errors.bookId && <div className="form-error">{errors.bookId}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Issue Date <span className="req">*</span></label>
                <input
                  type="date"
                  className={`form-control ${errors.issueDate ? 'error' : ''}`}
                  value={form.issueDate}
                  onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                />
                {errors.issueDate && <div className="form-error">{errors.issueDate}</div>}
              </div>
              <div className="form-group">
                <label>Return Date <span className="req">*</span></label>
                <input
                  type="date"
                  className={`form-control ${errors.returnDate ? 'error' : ''}`}
                  value={form.returnDate}
                  onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                />
                {errors.returnDate && <div className="form-error">{errors.returnDate}</div>}
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setForm({ studentId: '', bookId: '', issueDate: todayPlus(0), returnDate: todayPlus(14) })}>Quick Fill</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <span className="spinner-inline" /> : 'Issue Book'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Currently Issued Books</h3></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Student</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {active.length === 0 ? (
                <tr><td colSpan="5" className="table-empty">No books currently issued</td></tr>
              ) : active.map((i) => (
                <tr key={i._id}>
                  <td>{i.bookName}</td>
                  <td>{i.studentName}</td>
                  <td>{i.issueDate}</td>
                  <td>{i.returnDate}</td>
                  <td>
                    {new Date(i.returnDate) < new Date()
                      ? <span className="badge badge-red">Overdue</span>
                      : <span className="badge badge-amber">Issued</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
