import { useState } from 'react';
import {
  CheckCircle2, Loader2, MapPin, BookOpen, Clock,
  AlertTriangle, Smartphone, QrCode, TrendingUp,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar.jsx';
import CircularProgress from '../components/ui/CircularProgress.jsx';
import {
  CURRENT_STUDENT, COURSES, ATTENDANCE_RECORDS,
  calcAttendance, ACTIVE_SESSIONS,
} from '../data/dummyData.js';



// ─── Mark Attendance Page ─────────────────────────────────────────────────────
function MarkAttendancePage() {
  const [sessionInput, setSessionInput] = useState('');
  const [state, setState] = useState('idle'); // idle | checking | success | error
  const [marked, setMarked] = useState([]);

  const handleMark = () => {
    if (!sessionInput.trim() || sessionInput.trim().length !== 6) {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
      return;
    }
    // Check if session exists in active sessions
    const found = ACTIVE_SESSIONS.find(s => s.sessionId === sessionInput.trim());
    setState('checking');
    setTimeout(() => {
      if (found || true) { // demo: always succeed after check
        setState('success');
        setMarked(prev => [...prev, sessionInput.trim()]);
      } else {
        setState('error');
      }
    }, 2200);
  };

  const handleReset = () => { setState('idle'); setSessionInput(''); };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      {/* Hero card */}
      <div style={{
        background: 'linear-gradient(135deg, #009688 0%, #00796b 100%)',
        borderRadius: 24, padding: '32px 28px', marginBottom: 24, color: '#fff', textAlign: 'center',
      }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <QrCode size={32} color="#fff" />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Mark Attendance</div>
        <div style={{ fontSize: 14, opacity: 0.85 }}>
          Enter the 6-digit Session ID provided by your lecturer to record your presence.
        </div>
      </div>

      {/* Input card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="form-group">
          <label className="form-label" style={{ fontSize: 14, marginBottom: 10 }}>Session ID</label>
          <input
            className="form-input"
            style={{
              fontSize: 28, fontWeight: 800, letterSpacing: 10, textAlign: 'center',
              fontFamily: 'monospace', padding: '16px 14px',
              border: state === 'error' ? '2px solid #ef4444' : '2px solid #e5e7eb',
            }}
            maxLength={6}
            placeholder="000000"
            value={sessionInput}
            onChange={e => {
              const v = e.target.value.replace(/\D/g, '');
              setSessionInput(v);
              if (state !== 'idle') setState('idle');
            }}
            disabled={state === 'checking' || state === 'success'}
          />
          {state === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: '#dc2626', fontSize: 13 }}>
              <AlertTriangle size={14} /> Invalid session ID. Please enter a valid 6-digit code.
            </div>
          )}
        </div>

        {/* Button / State display */}
        {state === 'idle' && (
          <button
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: 15, justifyContent: 'center', borderRadius: 12 }}
            onClick={handleMark}
          >
            <MapPin size={18} /> Verify Location & Mark Present
          </button>
        )}

        {state === 'checking' && (
          <div style={{
            width: '100%', padding: '14px', borderRadius: 12,
            background: '#e0f2f1', border: '1.5px solid #b2dfdb',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
            <Loader2 size={20} color="#009688" style={{ animation: 'spin 1s linear infinite' }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#009688' }}>Checking Geofence…</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Verifying your GPS coordinates within campus</div>
            </div>
          </div>
        )}

        {state === 'success' && (
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <div style={{ animation: 'popIn 0.4s ease forwards' }}>
              <CheckCircle2 size={64} color="#009688" style={{ marginBottom: 12 }} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#009688', marginBottom: 4 }}>
              Attendance Marked!
            </div>
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
              You're registered as <strong>Present</strong> for Session <strong>{sessionInput}</strong>
            </div>
            <button
              className="btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleReset}
            >
              Mark Another Session
            </button>
          </div>
        )}
      </div>

      {/* Info card */}
      <div className="card" style={{ background: '#f8fdfc', border: '1px solid #e0f2f1' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e0f2f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MapPin size={18} color="#009688" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Location Verification</div>
            <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
              Your GPS coordinates are verified to be within the campus geofence radius (3km). Make sure location permissions are enabled on your device.
            </div>
          </div>
        </div>
      </div>

      {/* Previous sessions */}
      {marked.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>
            ✓ Sessions Marked Today
          </div>
          {marked.map((id, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 10, background: '#f0fdf4',
              border: '1px solid #bbf7d0', marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>{id}</span>
              </div>
              <span className="badge badge-green">Present</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── My Courses Page ──────────────────────────────────────────────────────────
function MyCoursesPage({ student }) {
  const courseIds = student?.courseIds || [];
  const myCourses = COURSES.filter(c => courseIds.includes(c.id));

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {myCourses.map(c => {
        const records = ATTENDANCE_RECORDS[c.id]?.[student.id] || [];
        const pct = calcAttendance(records);
        const present = records.filter(r => r.status === 'present').length;
        const color = pct >= 75 ? '#009688' : pct >= 50 ? '#f59e0b' : '#ef4444';

        return (
          <div key={c.id} className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 11, color: '#009688', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 4 }}>
                  {c.code}
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>{c.name}</div>
                <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 14 }}>{c.dept}</div>

                {/* Attendance breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'Present', value: present, col: '#009688', bg: '#e0f2f1' },
                    { label: 'Absent', value: records.length - present, col: '#ef4444', bg: '#fee2e2' },
                    { label: 'Total', value: records.length, col: '#2563eb', bg: '#dbeafe' },
                    { label: 'Rate', value: `${pct}%`, col: color, bg: color === '#009688' ? '#e0f2f1' : color === '#f59e0b' ? '#fef9c3' : '#fee2e2' },
                  ].map(item => (
                    <div key={item.label} style={{ background: item.bg, borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: item.col }}>{item.value}</div>
                      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Circular progress */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <CircularProgress pct={pct} size={110} stroke={10} />
                <span style={{ fontSize: 12, color: '#9ca3af' }}>Attendance Rate</span>
              </div>
            </div>

            {/* History */}
            {records.length > 0 && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>
                  <Clock size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Attendance History
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {records.map((r, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', borderRadius: 8,
                      background: r.status === 'present' ? '#f0fdf4' : '#fff5f5',
                    }}>
                      <span style={{ fontSize: 12, color: '#374151' }}>{r.date}</span>
                      <span className={`badge ${r.status === 'present' ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 11 }}>
                        {r.status === 'present' ? '✓ Present' : '✗ Absent'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Student Overview Page ────────────────────────────────────────────────────
function StudentOverview({ student, onGoMark }) {
  const courseIds = student?.courseIds || [];
  const myCourses = COURSES.filter(c => courseIds.includes(c.id));
  const totalPresent = myCourses.reduce((acc, c) => {
    const recs = ATTENDANCE_RECORDS[c.id]?.[student.id] || [];
    return acc + recs.filter(r => r.status === 'present').length;
  }, 0);
  const totalClasses = myCourses.reduce((acc, c) => {
    const recs = ATTENDANCE_RECORDS[c.id]?.[student.id] || [];
    return acc + recs.length;
  }, 0);
  const overallPct = totalClasses === 0 ? 0 : Math.round((totalPresent / totalClasses) * 100);

  return (
    <>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #009688 0%, #00796b 100%)',
        borderRadius: 24, padding: '28px 24px', marginBottom: 24, color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <Avatar name={student.name} size={56} />
          <div>
            <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: '0.5px' }}>STUDENT PORTAL</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{student.name}</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>{student.matric}</div>
          </div>
        </div>

        {/* Overall stat row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Courses', value: myCourses.length },
            { label: 'Present', value: totalPresent },
            { label: 'Overall', value: `${overallPct}%` },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 8px' }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{item.value}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick mark button */}
      <button
        className="btn-primary"
        style={{ width: '100%', padding: '16px', fontSize: 15, justifyContent: 'center', borderRadius: 14, marginBottom: 24 }}
        onClick={onGoMark}
      >
        <QrCode size={18} /> Mark Attendance Now
      </button>

      {/* Per-course circular progress */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 4 }}>Course Attendance</div>
        <div className="section-sub">Your current standing in each enrolled course</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 16, marginTop: 12 }}>
          {myCourses.map(c => {
            const records = ATTENDANCE_RECORDS[c.id]?.[student.id] || [];
            const pct = calcAttendance(records);
            return (
              <div key={c.id} style={{
                background: '#fff', borderRadius: 18, padding: '20px 14px',
                border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              }}>
                <CircularProgress pct={pct} size={90} stroke={9} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#009688', fontWeight: 700, letterSpacing: '0.4px' }}>{c.code}</div>
                  <div style={{ fontSize: 12, color: '#374151', fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>{c.name}</div>
                  <div style={{ marginTop: 8 }}>
                    <span className={`badge ${pct >= 75 ? 'badge-green' : pct >= 50 ? 'badge-yellow' : 'badge-red'}`} style={{ fontSize: 10 }}>
                      {pct >= 75 ? 'On Track' : pct >= 50 ? 'At Risk' : 'Critical'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 4 }}>Recent Activity</div>
        <div className="section-sub" style={{ marginBottom: 16 }}>Your last recorded sessions</div>
        {myCourses.flatMap(c =>
          (ATTENDANCE_RECORDS[c.id]?.[student.id] || []).slice(-2).map(r => ({ ...r, courseCode: c.code, courseName: c.name }))
        ).slice(0, 5).map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 10, marginBottom: 8,
            background: r.status === 'present' ? '#f0fdf4' : '#fff5f5',
            border: `1px solid ${r.status === 'present' ? '#bbf7d0' : '#fecaca'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: r.status === 'present' ? '#dcfce7' : '#fee2e2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {r.status === 'present'
                  ? <CheckCircle2 size={16} color="#16a34a" />
                  : <AlertTriangle size={16} color="#dc2626" />}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{r.courseCode}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{r.date}</div>
              </div>
            </div>
            <span className={`badge ${r.status === 'present' ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 11 }}>
              {r.status === 'present' ? 'Present' : 'Absent'}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Main Student Dashboard ───────────────────────────────────────────────────
export default function StudentDashboard({ activePage, setActivePage, user }) {
  const student = user || CURRENT_STUDENT;

  const titles = {
    overview: { title: 'My Dashboard',      sub: `Welcome back, ${student.name.split(' ')[0]}!` },
    mark:     { title: 'Mark Attendance',   sub: 'Enter your session ID to mark present' },
    courses:  { title: 'My Courses',        sub: 'Detailed breakdown of all your courses' },
  };
  const { title, sub } = titles[activePage] || titles.overview;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>{title}</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>{sub}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Smartphone size={15} color="#009688" />
          <span style={{ fontSize: 12, color: '#009688', fontWeight: 600 }}>Mobile Ready</span>
        </div>
      </div>

      <div className="page-body">
        {activePage === 'overview' && <StudentOverview student={student} onGoMark={() => setActivePage('mark')} />}
        {activePage === 'mark'     && <MarkAttendancePage />}
        {activePage === 'courses'  && <MyCoursesPage student={student} />}
      </div>
    </>
  );
}
