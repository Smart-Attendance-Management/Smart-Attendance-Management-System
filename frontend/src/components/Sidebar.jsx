import { GraduationCap, LayoutDashboard, BookOpen, Users, ClipboardList, LogOut, ChevronRight } from 'lucide-react';
import Avatar from './ui/Avatar.jsx';

const NAV_CONFIGS = {
  superadmin: [
    { icon: LayoutDashboard, label: 'Overview',         id: 'overview' },
    { icon: Users,          label: 'Lecturer Management', id: 'lecturers' },
    { icon: BookOpen,       label: 'Course Management', id: 'courses' },
    { icon: ClipboardList,  label: 'Sessions',          id: 'sessions' },
  ],
  lecturer: [
    { icon: LayoutDashboard, label: 'Overview',         id: 'overview' },
    { icon: BookOpen,       label: 'My Courses',        id: 'courses' },
    { icon: ClipboardList,  label: 'Attendance',        id: 'attendance' },
    { icon: Users,          label: 'Students',          id: 'students' },
  ],
  student: [
    { icon: LayoutDashboard, label: 'My Dashboard',     id: 'overview' },
    { icon: ClipboardList,  label: 'Mark Attendance',   id: 'mark' },
    { icon: BookOpen,       label: 'My Courses',        id: 'courses' },
  ],
};

const USER_INFO = {
  superadmin: { name: 'Admin Portal', email: 'superadmin@university.edu', role: 'Super Admin' },
  lecturer:   { name: 'Dr. Sarah Smith', email: 'sarah.smith@university.edu', role: 'Lecturer' },
  student:    { name: 'Alice Johnson', email: 'alice.j@student.edu', role: 'Student' },
};

export default function Sidebar({ role, activePage, setActivePage, onLogout }) {
  const navItems = NAV_CONFIGS[role] || [];
  const user = USER_INFO[role];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #009688, #00796b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <GraduationCap size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#1a1a2e', lineHeight: 1.2 }}>Smart</div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#009688', lineHeight: 1.2 }}>Attendance</div>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div style={{ padding: '12px 20px 8px' }}>
        <span className="badge badge-teal" style={{ fontSize: 11, letterSpacing: '0.5px' }}>
          {user.role}
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item${activePage === item.id ? ' active' : ''}`}
            style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => setActivePage(item.id)}
          >
            <item.icon size={18} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {activePage === item.id && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={user.name} size={38} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          </div>
          <button
            title="Sign out"
            onClick={onLogout}
            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 4, borderRadius: 6 }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
