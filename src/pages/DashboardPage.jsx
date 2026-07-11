// Dashboard — stat cards + recent activity from books/students/issues data.

import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import Spinner from '../components/Spinner.jsx';

export default function DashboardPage({ onNavigate }) {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Spinner />;

  const totalBooks = books.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
  const availableBooks = books.reduce((sum, b) => sum + Number(b.available || 0), 0);
  const issuedCount = issues.filter((i) => !i.returned).length;
  const recent = [...issues].reverse().slice(0, 5);

  const stats = [
    { label: 'Total Books', value: totalBooks, icon: '📚', color: 'blue' },
    { label: 'Available Books', value: availableBooks, icon: '✅', color: 'green' },
    { label: 'Issued Books', value: issuedCount, icon: '📤', color: 'amber' },
    { label: 'Total Students', value: students.length, icon: '🎓', color: 'red' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your library at a glance</p>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Activity</h3>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('return')}>View All</button>
        </div>
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
              {recent.length === 0 ? (
                <tr><td colSpan="5" className="table-empty">No recent activity</td></tr>
              ) : recent.map((i) => (
                <tr key={i._id}>
                  <td>{i.bookName}</td>
                  <td>{i.studentName}</td>
                  <td>{i.issueDate}</td>
                  <td>{i.returnDate}</td>
                  <td>
                    {i.returned
                      ? <span className="badge badge-green">Returned</span>
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
