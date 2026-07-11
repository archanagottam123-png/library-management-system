// Return Book page — return issued books, calculate fine for late returns.

import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import Spinner from '../components/Spinner.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const FINE_PER_DAY = 10; // Rs. 10 per day for overdue returns

export default function ReturnBookPage() {
  const toast = useToast();
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returnTarget, setReturnTarget] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [i, b] = await Promise.all([api.getIssues(), api.getBooks()]);
        setIssues(i);
        setBooks(b);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Calculate fine based on days past return date
  function calcFine(issue) {
    const due = new Date(issue.returnDate);
    const today = new Date();
    const diffMs = today - due;
    if (diffMs <= 0) return 0;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return days * FINE_PER_DAY;
  }

  async function handleReturn() {
    const issue = returnTarget;
    const fine = calcFine(issue);
    try {
      await api.returnBook(issue._id, { fine, returned: true });
      // Mark as returned locally
      setIssues((all) => all.map((x) => (x._id === issue._id ? { ...x, returned: true, fine } : x)));
      // Increment available copies
      setBooks((b) => b.map((x) => (x._id === issue.bookId ? { ...x, available: Number(x.available) + 1 } : x)));
      toast.show(`Book returned${fine > 0 ? ` with fine of Rs. ${fine}` : ''}`, fine > 0 ? 'info' : 'success');
    } catch (err) {
      toast.show(err.message || 'Failed to return book', 'error');
    } finally {
      setReturnTarget(null);
    }
  }

  if (loading) return <Spinner />;

  const active = issues.filter((i) => !i.returned);
  const returned = issues.filter((i) => i.returned);
  const totalFine = returned.reduce((sum, i) => sum + Number(i.fine || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Return Book</h1>
          <p>Process book returns and calculate late fines</p>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-icon amber">📤</div>
          <div><div className="stat-value">{active.length}</div><div className="stat-label">Pending Returns</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div><div className="stat-value">{returned.length}</div><div className="stat-label">Books Returned</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">💰</div>
          <div><div className="stat-value">Rs. {totalFine}</div><div className="stat-label">Total Fine Collected</div></div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><h3>Pending Returns</h3></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Student</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Est. Fine</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {active.length === 0 ? (
                <tr><td colSpan="6" className="table-empty">No pending returns</td></tr>
              ) : active.map((i) => {
                const fine = calcFine(i);
                const overdue = new Date(i.returnDate) < new Date();
                return (
                  <tr key={i._id}>
                    <td>{i.bookName}</td>
                    <td>{i.studentName}</td>
                    <td>{i.issueDate}</td>
                    <td>{i.returnDate}</td>
                    <td>
                      {overdue
                        ? <span className="badge badge-red">Rs. {fine}</span>
                        : <span className="badge badge-green">No fine</span>}
                    </td>
                    <td>
                      <button className="btn btn-success btn-sm" onClick={() => setReturnTarget(i)}>Return</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Returned Books History</h3></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Student</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Fine Collected</th>
              </tr>
            </thead>
            <tbody>
              {returned.length === 0 ? (
                <tr><td colSpan="5" className="table-empty">No returned books yet</td></tr>
              ) : returned.map((i) => (
                <tr key={i._id}>
                  <td>{i.bookName}</td>
                  <td>{i.studentName}</td>
                  <td>{i.issueDate}</td>
                  <td>{i.returnDate}</td>
                  <td>{Number(i.fine) > 0 ? <span className="badge badge-red">Rs. {i.fine}</span> : <span className="badge badge-green">Rs. 0</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {returnTarget && (
        <ConfirmDialog
          title="Return This Book?"
          message={`Return "${returnTarget.bookName}" issued by ${returnTarget.studentName}?${calcFine(returnTarget) > 0 ? ` A fine of Rs. ${calcFine(returnTarget)} will be charged.` : ''}`}
          onConfirm={handleReturn}
          onCancel={() => setReturnTarget(null)}
        />
      )}
    </div>
  );
}
