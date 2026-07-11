// Students page — full CRUD with search.

import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { validateForm } from '../utils/validation.js';
import Spinner from '../components/Spinner.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const EMPTY = { studentId: '', name: '', department: '', phone: '' };

export default function StudentsPage() {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setStudents(await api.getStudents());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      s.name?.toLowerCase().includes(q) ||
      s.studentId?.toLowerCase().includes(q) ||
      s.department?.toLowerCase().includes(q) ||
      s.phone?.includes(q)
    );
  }, [students, search]);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(s) {
    setEditing(s);
    setForm({ studentId: s.studentId, name: s.name, department: s.department, phone: s.phone });
    setErrors({});
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateForm(form, {
      studentId: { required: true, label: 'Student ID' },
      name: { required: true, label: 'Student Name' },
      department: { required: true, label: 'Department' },
      phone: { required: true, label: 'Phone Number', pattern: /^[0-9]{10}$/, message: 'Enter a valid 10-digit phone' },
    });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      if (editing) {
        await api.updateStudent(editing._id, form);
        setStudents((s) => s.map((x) => (x._id === editing._id ? { ...x, ...form } : x)));
        toast.show('Student updated successfully', 'success');
      } else {
        const created = await api.addStudent({ ...form, _id: 's' + Date.now() });
        setStudents((s) => [...s, created]);
        toast.show('Student added successfully', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      toast.show(err.message || 'Failed to save student', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await api.deleteStudent(deleteId);
      setStudents((s) => s.filter((x) => x._id !== deleteId));
      toast.show('Student deleted', 'success');
    } catch (err) {
      toast.show(err.message || 'Failed to delete', 'error');
    } finally {
      setDeleteId(null);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Student Management</h1>
          <p>Add, update, and manage student records</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Student</button>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: '16px 22px' }}>
          <div className="toolbar" style={{ marginBottom: 0 }}>
            <input
              className="search-input"
              placeholder="Search by name, ID, department, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="5" className="table-empty">No students found</td></tr>
              ) : filtered.map((s) => (
                <tr key={s._id}>
                  <td><strong>{s.studentId}</strong></td>
                  <td>{s.name}</td>
                  <td><span className="badge badge-blue">{s.department}</span></td>
                  <td>{s.phone}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Edit</button>{' '}
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(s._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Student' : 'Add Student'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Student ID <span className="req">*</span></label>
                <input
                  className={`form-control ${errors.studentId ? 'error' : ''}`}
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  placeholder="STU-001"
                />
                {errors.studentId && <div className="form-error">{errors.studentId}</div>}
              </div>
              <div className="form-group">
                <label>Department <span className="req">*</span></label>
                <input
                  className={`form-control ${errors.department ? 'error' : ''}`}
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="Computer Science"
                />
                {errors.department && <div className="form-error">{errors.department}</div>}
              </div>
            </div>
            <div className="form-group">
              <label>Student Name <span className="req">*</span></label>
              <input
                className={`form-control ${errors.name ? 'error' : ''}`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label>Phone Number <span className="req">*</span></label>
              <input
                className={`form-control ${errors.phone ? 'error' : ''}`}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="9876543210"
                maxLength="10"
              />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <span className="spinner-inline" /> : editing ? 'Update' : 'Add Student'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Student?"
          message="Are you sure you want to delete this student? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
