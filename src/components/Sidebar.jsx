// Sidebar navigation — blue gradient, responsive (slides in on mobile).

import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'books', label: 'Books', icon: '📚' },
  { key: 'students', label: 'Students', icon: '🎓' },
  { key: 'issue', label: 'Issue Book', icon: '📤' },
  { key: 'return', label: 'Return Book', icon: '📥' },
];

export default function Sidebar({ current, onNavigate, open }) {
  const { logout } = useAuth();

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">📚</div>
        <div>
          <div className="sidebar-title">LibManager</div>
          <div className="sidebar-subtitle">Library Management</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${current === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={logout} style={{ width: '100%' }}>
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
