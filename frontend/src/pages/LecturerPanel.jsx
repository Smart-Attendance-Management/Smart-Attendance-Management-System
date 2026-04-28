import { useState } from 'react';
import {
  Play, MapPin, Loader2, Copy, Check, Users, BookOpen,
  UserPlus, Clock, X,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar.jsx';
import Modal from '../components/ui/Modal.jsx';
import {
  ATTENDANCE_RECORDS,
  calcAttendance, generateSessionId, getEnrolledStudents,
} from '../data/dummyData.js';

// ─── Progress Bar ────────────────────────────────────────────────────────────
function ProgressBar({ pct }) {
  const color = pct >= 75 ? '#009688' : pct >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="progress-bar-wrap" style={{ flex: 1 }}>
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, width: 36, textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

// ─── Attendance History Modal ────────────────────────────────────────────────
function HistoryModal({ student, course, onClose }) {
  const records = ATTENDANCE_RECORDS[course.id]?.[student.id] || [];
  return (
    <Modal title={`${student.name} — Attendance Log`} subtitle={course.name} onClose={onClose} width={480}>
      {records.length === 0
        ? <p style={{ textAlign: 'center', color: '#9ca3af', padding: '24px 0' }}>No records found.</p>
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {records.map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 10,
                background: r.status === 'present' ? '#f0fdf4' : '#fff5f5',
                border: `1px solid ${r.status === 'present' ? '#bbf7d0' : '#fecaca'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={14} color={r.status === 'present' ? '#16a34a' : '#dc2626'} />
                  <span style={{ fontSize: 13, color: '#374151' }}>{r.date}</span>
                </div>
                <span className={`badge ${r.status === 'present' ? 'badge-green' : 'badge-red'}`}>
                  {r.status === 'present' ? 'Present' : 'Absent'}
                </span>
              </div>
            ))}
          </div>
        )}
      <div style={{ marginTop: 20 }}>
        <div className="alert alert-info">
          <span style={{ fontWeight: 700 }}>{calcAttendance(records)}%</span>&nbsp;overall attendance rate
        </div>
      </div>
    </Modal>
  );
}

// ─── Enroll Student Modal ─────────────────────────────────────────────────────
function EnrollModal({ course, onClose, students, setStudents }) {
  const [query, setQuery] = useState('');
  const [enrolled, setEnrolled] = useState([]);
  
  // Students NOT in this course
  const available = students.filter(s => !s.courseIds.includes(course.id));
  const filtered = available.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.matric.toLowerCase().includes(query.toLowerCase()) ||
    s.email.toLowerCase().includes(query.toLowerCase())
  );

  const handleEnroll = (studentId) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, courseIds: [...s.courseIds, course.id] };
      }
      return s;
    }));
    setEnrolled(prev => [...prev, studentId]);
  };

  return (
    <Modal title="Enroll Student" subtitle={`Add a student to ${course.code}`} onClose={onClose} width={460}>
      <div className="form-group">
        <input
          className="form-input"
          placeholder="Search registered students…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
      </div>
      <div style={{ maxHeight: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px 0', fontSize: 13 }}>
            No unregistered students match.
          </p>
        )}
        {filtered.map(s => (
          <div key={s.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', borderRadius: 12, border: '1px solid #f0f0f0',
            background: '#fafffe',
          }}>
            <Avatar name={s.name} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{s.name}</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>{s.matric}</div>
            </div>
            {!enrolled.includes(s.id) ? (
              <button
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: 12 }}
                onClick={() => handleEnroll(s.id)}
              >
                <UserPlus size={13} /> Enroll
              </button>
            ) : (
              <span className="badge badge-green">✓ Added</span>
            )}
          </div>
        ))}
      </div>
      {enrolled.length > 0 && (
        <div className="alert alert-success" style={{ marginTop: 16 }}>
          ✓ {enrolled.length} student{enrolled.length > 1 ? 's' : ''} added to course.
        </div>
      )}
    </Modal>
  );
}

// ─── Start Session Panel ──────────────────────────────────────────────────────
function StartSessionPanel({ course }) {
  const [state, setState] = useState('idle'); // idle | gps | active
  const [sessionId, setSessionId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleStart = () => {
    setState('gps');
    setTimeout(() => {
      setSessionId(generateSessionId());
      setState('active');
    }, 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnd = () => { setState('idle'); setSessionId(''); };

  if (state === 'idle') return (
    <button className="btn-primary" onClick={handleStart}>
      <Play size={15} /> Start Session
    </button>
  );

  if (state === 'gps') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 10, background: '#e0f2f1', border: '1px solid #b2dfdb' }}>
      <Loader2 size={18} color="#009688" style={{ animation: 'spin 1s linear infinite' }} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#009688' }}>Capturing GPS Location…</div>
        <div style={{ fontSize: 11, color: '#6b7280' }}>Please wait while we verify your coordinates</div>
      </div>
    </div>
  );

  return (
    <div className="session-id-box" style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 2 }}>SESSION ID — {course.code}</div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 8 }}>{sessionId}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, opacity: 0.7, marginTop: 4 }}>
            <MapPin size={11} /> GPS verified · Session active
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleCopy}
            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 8, padding: '8px 14px', color: '#fff', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
          >
            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy ID</>}
          </button>
          <button
            onClick={handleEnd}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 8, padding: '8px 14px', color: '#fff', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
          >
            <X size={14} /> End
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Course Detail Panel ──────────────────────────────────────────────────────
function CourseDetailPanel({ course, onBack, students, setStudents }) {
  const [showEnroll, setShowEnroll] = useState(false);
  const [historyModal, setHistoryModal] = useState(null);

  const enrolled = getEnrolledStudents(course.id, students);

  return (
    <>
      {showEnroll && (
        <EnrollModal
          course={course}
          onClose={() => setShowEnroll(false)}
          students={students}
          setStudents={setStudents}
        />
      )}
      {historyModal && (
        <HistoryModal
          student={historyModal}
          course={course}
          onClose={() => setHistoryModal(null)}
        />
      )}

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <button className="btn-outline" style={{ padding: '7px 14px', fontSize: 13 }} onClick={onBack}>← Back</button>
        <span style={{ color: '#9ca3af', fontSize: 14 }}>/ {course.name}</span>
      </div>

      {/* Session panel */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: '#009688', fontWeight: 700, letterSpacing: '0.5px' }}>{course.code}</div>
            <div className="section-title">{course.name}</div>
            <div className="section-sub" style={{ marginBottom: 0 }}>{course.dept} · {course.credits} Credits</div>
          </div>
          <StartSessionPanel course={course} />
        </div>
      </div>

      {/* Students table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="section-title">Enrolled Students</div>
            <div className="section-sub" style={{ marginBottom: 0 }}>{enrolled.length} student{enrolled.length !== 1 ? 's' : ''} enrolled</div>
          </div>
          <button className="btn-primary" onClick={() => setShowEnroll(true)}>
            <UserPlus size={16} /> Enroll Student
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Matric No.</th>
                <th>Attendance</th>
                <th style={{ textAlign: 'center' }}>History</th>
              </tr>
            </thead>
            <tbody>
              {enrolled.map(s => {
                const records = ATTENDANCE_RECORDS[course.id]?.[s.id] || [];
                const pct = calcAttendance(records);
                return (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={s.name} size={34} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: 13, color: '#374151' }}>{s.matric}</td>
                    <td style={{ minWidth: 180 }}><ProgressBar pct={pct} /></td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn-outline"
                        style={{ padding: '5px 12px', fontSize: 12 }}
                        onClick={() => setHistoryModal(s)}
                      >
                        <Clock size={13} /> View Log
                      </button>
                    </td>
                  </tr>
                );
              })}
              {enrolled.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af' }}>
                    No students enrolled yet. Click "Enroll Student" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── Lecturer Overview ────────────────────────────────────────────────────────
function LecturerOverview({ user, courses, students, onSelectCourse }) {
  const myCourses = courses.filter(c => (user?.courseIds || []).includes(c.id));
  const totalStudents = myCourses.reduce((acc, c) => acc + getEnrolledStudents(c.id, students).length, 0);

  return (
    <>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #009688 0%, #00796b 100%)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 28, color: '#fff',
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <Avatar name={user.name} size={64} />
        <div>
          <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4, letterSpacing: '0.5px' }}>WELCOME BACK</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{user.name}</div>
          <div style={{ opacity: 0.8, fontSize: 14 }}>{user.dept} · {myCourses.length} Courses · {totalStudents} Students</div>
        </div>
      </div>

      {/* Course grid */}
      <div className="section-title" style={{ marginBottom: 4 }}>My Courses</div>
      <div className="section-sub">Click a course to manage attendance and students</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginTop: 8 }}>
        {myCourses.map((c, i) => {
          const enrolled = getEnrolledStudents(c.id, students);
          const avgPct = enrolled.length === 0 ? 0 : Math.round(
            enrolled.reduce((acc, s) => acc + calcAttendance(ATTENDANCE_RECORDS[c.id]?.[s.id] || []), 0) / enrolled.length
          );
          const colors = ['#009688', '#2563eb', '#7c3aed', '#be185d'];
          const col = colors[i % colors.length];
          return (
            <div key={c.id} className="course-card" onClick={() => onSelectCourse(c)}>
              <div className="course-card-accent" style={{ background: col }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: col, fontWeight: 700, letterSpacing: '0.5px' }}>{c.code}</span>
                <span className="badge badge-teal">{enrolled.length} Students</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>{c.dept}</div>
              <div style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>Avg. Attendance</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: avgPct >= 75 ? '#009688' : '#f59e0b' }}>{avgPct}%</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${avgPct}%`, background: avgPct >= 75 ? '#009688' : '#f59e0b' }} />
                </div>
              </div>
              <div style={{ paddingTop: 14, borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#009688', fontWeight: 600 }}>Manage →</span>
                <button
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: 12 }}
                  onClick={e => { e.stopPropagation(); onSelectCourse(c); }}
                >
                  <Play size={12} /> Open
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Main Lecturer Dashboard ─────────────────────────────────────────────────
export default function LecturerDashboard({ 
  activePage, setActivePage, user, 
  courses, students, setStudents 
}) {
  const myCourses = courses.filter(c => (user?.courseIds || []).includes(c.id));
  const [selectedCourse, setSelectedCourse] = useState(null);

  const titles = {
    overview:   { title: 'My Dashboard', sub: `Welcome, ${user.name}` },
    courses:    { title: 'My Courses', sub: 'Manage sessions and attendance' },
    attendance: { title: 'Attendance Records', sub: 'Full attendance overview' },
    students:   { title: 'Students', sub: 'All students across your courses' },
  };
  const { title, sub } = titles[activePage] || titles.overview;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{title}</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>{sub}</p>
        </div>
        {(activePage === 'overview' || activePage === 'courses') && !selectedCourse && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={15} color="#009688" />
            <span style={{ fontSize: 13, color: '#009688', fontWeight: 600 }}>GPS Ready</span>
          </div>
        )}
      </div>

      <div className="page-body">
        {(activePage === 'overview') && !selectedCourse && (
          <LecturerOverview user={user} courses={courses} students={students} onSelectCourse={c => { setSelectedCourse(c); setActivePage('courses'); }} />
        )}
        {(activePage === 'courses') && (
          selectedCourse
            ? <CourseDetailPanel course={selectedCourse} onBack={() => setSelectedCourse(null)} students={students} setStudents={setStudents} />
            : <LecturerOverview user={user} courses={courses} students={students} onSelectCourse={c => setSelectedCourse(c)} />
        )}
        {activePage === 'attendance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {myCourses.map(c => {
              const enrolled = getEnrolledStudents(c.id, students);
              return (
                <div key={c.id} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <span className="badge badge-teal" style={{ marginBottom: 6, display: 'inline-flex' }}>{c.code}</span>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>{c.name}</div>
                    </div>
                    <button className="btn-outline" style={{ fontSize: 12, padding: '7px 14px' }} onClick={() => { setSelectedCourse(c); setActivePage('courses'); }}>
                      Open Course
                    </button>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Student</th><th>Attendance</th><th>Present</th><th>Total</th></tr>
                      </thead>
                      <tbody>
                        {enrolled.map(s => {
                          const recs = ATTENDANCE_RECORDS[c.id]?.[s.id] || [];
                          const pct = calcAttendance(recs);
                          const present = recs.filter(r => r.status === 'present').length;
                          return (
                            <tr key={s.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <Avatar name={s.name} size={28} />
                                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                                </div>
                              </td>
                              <td style={{ minWidth: 160 }}><ProgressBar pct={pct} /></td>
                              <td><span style={{ fontWeight: 700, color: '#009688' }}>{present}</span></td>
                              <td><span style={{ color: '#6b7280' }}>{recs.length}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {activePage === 'students' && (
          <div className="card">
            <div className="section-title" style={{ marginBottom: 4 }}>All Students</div>
            <div className="section-sub">Students enrolled across all your courses</div>
            <div className="table-wrap" style={{ marginTop: 12 }}>
              <table>
                <thead>
                  <tr><th>Student</th><th>Matric No.</th><th>Email</th><th>Courses</th></tr>
                </thead>
                <tbody>
                  {students.filter(s => myCourses.some(c => s.courseIds.includes(c.id))).map(s => {
                    const enrolled = myCourses.filter(c => s.courseIds.includes(c.id));
                    return (
                      <tr key={s.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Avatar name={s.name} size={34} />
                            <span style={{ fontWeight: 600 }}>{s.name}</span>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{s.matric}</td>
                        <td style={{ color: '#6b7280' }}>{s.email}</td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {enrolled.map(c => <span key={c.id} className="tag">{c.code}</span>)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
