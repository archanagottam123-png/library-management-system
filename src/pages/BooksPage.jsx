// Books page — full CRUD, search, filter by category & author & availability.

import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { validateForm } from '../utils/validation.js';
import Spinner from '../components/Spinner.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const EMPTY = { bookId: '', name: '', author: '', category: '', quantity: '', available: '' };

export default function BooksPage() {
  const toast = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterAvail, setFilterAvail] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Load books on mount
  useEffect(() => {
    (async () => {
      try {
        setBooks(await api.getBooks());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Derived lists for filter dropdowns
  const categories = useMemo(() => [...new Set(books.map((b) => b.category).filter(Boolean))], [books]);
  const authors = useMemo(() => [...new Set(books.map((b) => b.author).filter(Boolean))], [books]);

  // Apply search + filters
  const filtered = useMemo(() => {
    return books.filter((b) => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        b.name?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.bookId?.toLowerCase().includes(q);
      const matchCat = !filterCat || b.category === filterCat;
      const matchAuthor = !filterAuthor || b.author === filterAuthor;
      const matchAvail = !filterAvail ||
        (filterAvail === 'available' && Number(b.available) > 0) ||
        (filterAvail === 'unavailable' && Number(b.available) === 0);
      return matchSearch && matchCat && matchAuthor && matchAvail;
    });
  }, [books, search, filterCat, filterAuthor, filterAvail]);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(book) {
    setEditing(book);
    setForm({ ...book, quantity: String(book.quantity), available: String(book.available) });
    setErrors({});
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateForm(form, {
      bookId: { required: true, label: 'Book ID' },
      name: { required: true, label: 'Book Name' },
      author: { required: true, label: 'Author' },
      category: { required: true, label: 'Category' },
      quantity: { required: true, label: 'Quantity', min: 0 },
      available: { required: true, label: 'Available Copies', min: 0 },
    });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    const payload = { ...form, quantity: Number(form.quantity), available: Number(form.available) };
    try {
      if (editing) {
        await api.updateBook(editing._id, payload);
        setBooks((b) => b.map((x) => (x._id === editing._id ? { ...x, ...payload } : x)));
        toast.show('Book updated successfully', 'success');
      } else {
        const created = await api.addBook({ ...payload, _id: 'b' + Date.now() });
        setBooks((b) => [...b, created]);
        toast.show('Book added successfully', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      toast.show(err.message || 'Failed to save book', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await api.deleteBook(deleteId);
      setBooks((b) => b.filter((x) => x._id !== deleteId));
      toast.show('Book deleted', 'success');
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
          <h1>Book Management</h1>
          <p>Add, update, search and manage your book collection</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: '16px 22px' }}>
          <div className="toolbar" style={{ marginBottom: 0 }}>
            <input
              className="search-input"
              placeholder="Search by name, author, or book ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterAuthor} onChange={(e) => setFilterAuthor(e.target.value)}>
              <option value="">All Authors</option>
              {authors.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={filterAvail} onChange={(e) => setFilterAvail(e.target.value)}>
              <option value="">All Availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Name</th>
                <th>Author</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Available</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="8" className="table-empty">No books found</td></tr>
              ) : filtered.map((b) => (
                <tr key={b._id}>
                  <td><strong>{b.bookId}</strong></td>
                  <td>{b.name}</td>
                  <td>{b.author}</td>
                  <td><span className="badge badge-blue">{b.category}</span></td>
                  <td>{b.quantity}</td>
                  <td>{b.available}</td>
                  <td>
                    {Number(b.available) > 0
                      ? <span className="badge badge-green">Available</span>
                      : <span className="badge badge-red">Out</span>}
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(b)}>Edit</button>{' '}
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(b._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Book' : 'Add Book'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Book ID <span className="req">*</span></label>
                <input
                  className={`form-control ${errors.bookId ? 'error' : ''}`}
                  value={form.bookId}
                  onChange={(e) => setForm({ ...form, bookId: e.target.value })}
                  placeholder="BK-001"
                />
                {errors.bookId && <div className="form-error">{errors.bookId}</div>}
              </div>
              <div className="form-group">
                <label>Category <span className="req">*</span></label>
                <input
                  className={`form-control ${errors.category ? 'error' : ''}`}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Programming"
                />
                {errors.category && <div className="form-error">{errors.category}</div>}
              </div>
            </div>
            <div className="form-group">
              <label>Book Name <span className="req">*</span></label>
              <input
                className={`form-control ${errors.name ? 'error' : ''}`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Clean Code"
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label>Author <span className="req">*</span></label>
              <input
                className={`form-control ${errors.author ? 'error' : ''}`}
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="Robert C. Martin"
              />
              {errors.author && <div className="form-error">{errors.author}</div>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Quantity <span className="req">*</span></label>
                <input
                  type="number"
                  min="0"
                  className={`form-control ${errors.quantity ? 'error' : ''}`}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  placeholder="5"
                />
                {errors.quantity && <div className="form-error">{errors.quantity}</div>}
              </div>
              <div className="form-group">
                <label>Available Copies <span className="req">*</span></label>
                <input
                  type="number"
                  min="0"
                  className={`form-control ${errors.available ? 'error' : ''}`}
                  value={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.value })}
                  placeholder="5"
                />
                {errors.available && <div className="form-error">{errors.available}</div>}
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <span className="spinner-inline" /> : editing ? 'Update' : 'Add Book'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Book?"
          message="Are you sure you want to delete this book? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
