import { useState, useEffect } from 'react';
import './index.css';

import Sidebar        from './components/Sidebar.jsx';
import AdminPortal    from './pages/AdminPortal.jsx';
import LecturerPanel  from './pages/LecturerPanel.jsx';
import StudentPanel   from './pages/StudentPanel.jsx';
import LoginPage      from './pages/LoginPage.jsx';

import { LECTURERS, COURSES, STUDENTS } from './data/dummyData.js';

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
  const [isInitializing, setIsInitializing] = useState(true);

  // Global Data States
  const [lecturers, setLecturers] = useState(() => {
    const saved = localStorage.getItem('attendance_lecturers');
    return saved ? JSON.parse(saved) : LECTURERS;
  });
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('attendance_courses');
    return saved ? JSON.parse(saved) : COURSES;
  });
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('attendance_students');
    return saved ? JSON.parse(saved) : STUDENTS;
  });

  // Check localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('attendance_session');
    if (savedSession) {
      try {
        const userData = JSON.parse(savedSession);
        setUser(userData);
        setRole(userData.role);
        setIsAuthenticated(true);
        setActivePage(DEFAULT_PAGE[userData.role] || 'overview');
      } catch (e) {
        console.error('Failed to parse saved session', e);
        localStorage.removeItem('attendance_session');
      }
    }
    setIsInitializing(false);
  }, []);

  // Persist Global Data
  useEffect(() => {
    localStorage.setItem('attendance_lecturers', JSON.stringify(lecturers));
  }, [lecturers]);
  useEffect(() => {
    localStorage.setItem('attendance_courses', JSON.stringify(courses));
  }, [courses]);
  useEffect(() => {
    localStorage.setItem('attendance_students', JSON.stringify(students));
  }, [students]);

  const handleLogin = (userData) => {
    let fullUser = { ...userData };

    if (userData.role === 'lecturer') {
      const profile = lecturers.find(l => l.email === userData.email);
      if (profile) fullUser = { ...fullUser, ...profile };
    } else if (userData.role === 'student') {
      const profile = students.find(s => s.email === userData.email);
      if (profile) fullUser = { ...fullUser, ...profile };
    } else if (userData.role === 'superadmin') {
      fullUser = { ...fullUser, name: 'Admin Portal', dept: 'Administration' };
    }

    setUser(fullUser);
    setRole(fullUser.role);
    setIsAuthenticated(true);
    setActivePage(DEFAULT_PAGE[fullUser.role] || 'overview');
    
    // Persist to localStorage
    localStorage.setItem('attendance_session', JSON.stringify(fullUser));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('attendance_session');
  };

  if (isInitializing) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fdfc' }}>
        <div className="animate-spin" style={{ width: 40, height: 40, border: '4px solid #009688', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const UserPanelView = {
    superadmin: AdminPortal,
    lecturer:   LecturerPanel,
    student:    StudentPanel,
  }[role];

  return (
    <div className="app-layout">
      <Sidebar
        role={role}
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <UserPanelView
          activePage={activePage}
          setActivePage={setActivePage}
          user={user}
          lecturers={lecturers}
          setLecturers={setLecturers}
          courses={courses}
          setCourses={setCourses}
          students={students}
          setStudents={setStudents}
        />
        <div style={{ height: 40 }} />
      </main>
    </div>
  );
}
