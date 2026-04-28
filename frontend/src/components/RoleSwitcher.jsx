import { ShieldCheck, GraduationCap, Smartphone } from 'lucide-react';

const ROLES = [
  { id: 'superadmin', label: 'Super Admin', Icon: ShieldCheck },
  { id: 'lecturer',   label: 'Lecturer',    Icon: GraduationCap },
  { id: 'student',    label: 'Student',     Icon: Smartphone },
];

export default function RoleSwitcher({ role, setRole }) {
  return (
    <div className="role-bar">
      <span style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, letterSpacing: '0.4px', paddingLeft: 8, paddingRight: 4, whiteSpace: 'nowrap' }}>
        VIEW AS
      </span>
      {ROLES.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`role-btn${role === id ? ' active' : ''}`}
          onClick={() => setRole(id)}
          title={`Switch to ${label} view`}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon size={13} />
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
