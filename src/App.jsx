// =============================================================
// APP ROOT
// -------------------------------------------------------------
// Simple state-based routing (no React Router, per requirements).
// Wraps the app in Auth + Toast providers and renders either the
// Login page or the main dashboard layout depending on auth state.
// =============================================================

import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import Spinner from './components/Spinner.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import BooksPage from './pages/BooksPage.jsx';
import StudentsPage from './pages/StudentsPage.jsx';
import IssueBookPage from './pages/IssueBookPage.jsx';
import ReturnBookPage from './pages/ReturnBookPage.jsx';

function MainApp() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <Spinner />;
  if (!user) return <LoginPage />;

  const pages = {
    dashboard: <DashboardPage onNavigate={setPage} />,
    books: <BooksPage />,
    students: <StudentsPage />,
    issue: <IssueBookPage />,
    return: <ReturnBookPage />,
  };

  const titles = {
    dashboard: 'Dashboard',
    books: 'Book Management',
    students: 'Student Management',
    issue: 'Issue Book',
    return: 'Return Book',
  };

  return (
    <div className="app-shell">
      <Sidebar
        current={page}
        onNavigate={(p) => { setPage(p); setSidebarOpen(false); }}
        open={sidebarOpen}
      />
      <div className="app-main">
        <Topbar title={titles[page]} onMenu={() => setSidebarOpen(!sidebarOpen)} />
        <div className="app-content">{pages[page]}</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}
