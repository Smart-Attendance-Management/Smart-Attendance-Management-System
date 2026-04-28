import { useState } from 'react';
import { Mail, Lock, LogIn, ShieldCheck, UserCircle, GraduationCap, AlertCircle } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      let role = '';
      if (email === 'admin@admin.com' && password === 'admin123') {
        role = 'superadmin';
      } else if (email === 'lecturer@lecturer.com' && password === 'lecturer123') {
        role = 'lecturer';
      } else if (email === 'student@student.com' && password === 'student123') {
        role = 'student';
      }

      if (role) {
        onLogin({ email, role });
      } else {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-card animate-pop">
        <div className="login-header">
          <div className="login-logo">
            <ShieldCheck size={32} color="#009688" />
          </div>
          <h1>Welcome Back</h1>
          <p>Smart Attendance Management System</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrap">
              <Mail size={18} className="icon-left" />
              <input
                type="email"
                className="form-input"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <Lock size={18} className="icon-left" />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', height: 48, fontSize: 16, marginTop: 10 }}
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin" style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
            ) : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Demo Credentials:</p>
          <div className="demo-chips">
            <div className="demo-chip" title="admin@admin.com / admin123">
              <ShieldCheck size={12} /> Admin
            </div>
            <div className="demo-chip" title="lecturer@lecturer.com / lecturer123">
              <UserCircle size={12} /> Lecturer
            </div>
            <div className="demo-chip" title="student@student.com / student123">
              <GraduationCap size={12} /> Student
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
