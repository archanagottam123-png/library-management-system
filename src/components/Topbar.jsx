// Top navbar — shows page title, user info, and mobile menu toggle.

import { useAuth } from '../context/AuthContext.jsx';

export default function Topbar({ title, onMenu }) {
  const { user } = useAuth();
  const initial = (user?.name || user?.email || 'A').charAt(0).toUpperCase();

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="menu-toggle" onClick={onMenu}>☰</button>
        <span className="topbar-title">{title}</span>
      </div>
      <div className="topbar-user">
        <div className="user-info">
          <div className="user-name">{user?.name || 'Admin'}</div>
          <div className="user-role">Administrator</div>
        </div>
        <div className="user-avatar">{initial}</div>
      </div>
    </header>
  );
}
