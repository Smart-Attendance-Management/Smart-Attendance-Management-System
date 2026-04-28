import { useState } from 'react';
import './index.css';

import Sidebar        from './components/Sidebar.jsx';
import SuperAdminDashboard from './pages/SuperAdminDashboard.jsx';
import LecturerDashboard   from './pages/LecturerDashboard.jsx';
import StudentDashboard    from './pages/StudentDashboard.jsx';
import LoginPage           from './pages/LoginPage.jsx';

// Default first nav page per role
const DEFAULT_PAGE = {
  superadmin: 'overview',
  lecturer:   'overview',
  student:    'overview',
};

export default function App() {
  const [role, setRole]               = useState('superadmin');
  const [activePage, setActivePage]   = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser]               = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setRole(userData.role);
    setIsAuthenticated(true);
    setActivePage(DEFAULT_PAGE[userData.role] || 'overview');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const Dashboard = {
    superadmin: SuperAdminDashboard,
    lecturer:   LecturerDashboard,
    student:    StudentDashboard,
  }[role];

  return (
    <>
      <div className="app-layout">
        {/* Sidebar */}
        <Sidebar
          role={role}
          activePage={activePage}
          setActivePage={setActivePage}
          onLogout={handleLogout}
        />

        {/* Main content area */}
        <main className="main-content">
          <Dashboard
            activePage={activePage}
            setActivePage={setActivePage}
            user={user}
          />

          {/* Bottom spacer */}
          <div style={{ height: 40 }} />
        </main>
      </div>
    </>
  );
}
