import { useState, Fragment } from 'react';
import { Users, BookOpen, Activity, Plus, Search, Edit2, Trash2, Check, UserCircle } from 'lucide-react';
import Avatar from '../components/ui/Avatar.jsx';
import Modal from '../components/ui/Modal.jsx';

// ─── Stat Cards ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, bg, fg }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg }}>
        <Icon size={24} color={fg} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

// ─── Create Lecturer Modal ──────────────────────────────────────────────────────
function CreateLecturerModal({ onClose, onSave, courses }) {
  const [form, setForm] = useState({ name: '', email: '', dept: '', courseIds: [] });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    return e;
  };

  const toggle = (id) => {
    setForm(f => ({
      ...f,
      courseIds: f.courseIds.includes(id)
        ? f.courseIds.filter(c => c !== id)
        : [...f.courseIds, id],
    }));
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
    onClose();
  };

  return (
    <Modal title="Create New Lecturer" subtitle="Add a new lecturer to the system" onClose={onClose}>
      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input
          className={`form-input${errors.name ? ' border-red-400' : ''}`}
          placeholder="e.g. Dr. Jane Doe"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        {errors.name && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Email Address *</label>
        <input
          className={`form-input${errors.email ? ' border-red-400' : ''}`}
          type="email"
          placeholder="lecturer@university.edu"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
        {errors.email && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Department</label>
        <input
          className="form-input"
          placeholder="e.g. Computer Science"
          value={form.dept}
          onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Assign Courses (multi-select)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {courses.map(c => {
            const selected = form.courseIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                style={{
                  padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${selected ? '#009688' : '#e5e7eb'}`,
                  background: selected ? '#e0f2f1' : '#fff',
                  color: selected ? '#009688' : '#6b7280',
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                {selected && <Check size={12} />}
                {c.code}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
        <button className="btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={handleSave}>
          <Plus size={16} /> Create Lecturer
        </button>
      </div>
    </Modal>
  );
}

// ─── Create Student Modal ───────────────────────────────────────────────────────
function CreateStudentModal({ onClose, onSave, courses }) {
  const [form, setForm] = useState({ name: '', email: '', matric: '', courseIds: [] });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name   = 'Name is required';
    if (!form.matric.trim()) e.matric = 'Matric number is required';
    if (!form.email.trim())  e.email  = 'Email is required';
    return e;
  };

  const toggle = (id) => {
    setForm(f => ({
      ...f,
      courseIds: f.courseIds.includes(id)
        ? f.courseIds.filter(c => c !== id)
        : [...f.courseIds, id],
    }));
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
    onClose();
  };

  return (
    <Modal title="Add New Student" subtitle="Register a student and enroll them in courses" onClose={onClose}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            className={`form-input${errors.name ? ' border-red-400' : ''}`}
            placeholder="Alice Johnson"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Matric Number *</label>
          <input
            className={`form-input${errors.matric ? ' border-red-400' : ''}`}
            placeholder="UNI/2021/001"
            value={form.matric}
            onChange={e => setForm(f => ({ ...f, matric: e.target.value.toUpperCase() }))}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email Address *</label>
        <input
          className={`form-input${errors.email ? ' border-red-400' : ''}`}
          type="email"
          placeholder="student@university.edu"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Enroll in Courses</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {courses.map(c => {
            const selected = form.courseIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                style={{
                  padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${selected ? '#009688' : '#e5e7eb'}`,
                  background: selected ? '#e0f2f1' : '#fff',
                  color: selected ? '#009688' : '#6b7280',
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                {selected && <Check size={12} />}
                {c.code}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
        <button className="btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={handleSave}>
          <Plus size={16} /> Add Student
        </button>
      </div>
    </Modal>
  );
}

// ─── Create Course Modal ────────────────────────────────────────────────────────
function CreateCourseModal({ onClose, onSave }) {
  const [form, setForm] = useState({ code: '', name: '', credits: '3', dept: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.code.trim())   e.code  = 'Course code is required';
    if (!form.name.trim())   e.name  = 'Course name is required';
    if (!form.dept.trim())   e.dept  = 'Department is required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
    onClose();
  };

  return (
    <Modal title="Create New Course" subtitle="Add a new course to the curriculum" onClose={onClose}>
      <div className="form-group">
        <label className="form-label">Course Code *</label>
        <input
          className={`form-input${errors.code ? ' border-red-400' : ''}`}
          placeholder="e.g. CSC402"
          value={form.code}
          onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Course Name *</label>
        <input
          className={`form-input${errors.name ? ' border-red-400' : ''}`}
          placeholder="e.g. Advanced Operating Systems"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Credits</label>
          <select 
            className="form-input" 
            value={form.credits}
            onChange={e => setForm(f => ({ ...f, credits: e.target.value }))}
          >
            <option value="1">1 Credit</option>
            <option value="2">2 Credits</option>
            <option value="3">3 Credits</option>
            <option value="4">4 Credits</option>
            <option value="6">6 Credits</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Department *</label>
          <input
            className={`form-input${errors.dept ? ' border-red-400' : ''}`}
            placeholder="e.g. Computer Science"
            value={form.dept}
            onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
        <button className="btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={handleSave}>
          <Plus size={16} /> Create Course
        </button>
      </div>
    </Modal>
  );
}

// ─── Overview Page ──────────────────────────────────────────────────────────────
function OverviewPage({ lecturers, courses, students, onGoTo }) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard icon={Users}    label="Total Lecturers"       value={lecturers.length}     bg="#e0f2f1" fg="#009688" />
        <StatCard icon={UserCircle} label="Total Students"      value={students.length}      bg="#fef3c7" fg="#d97706" />
        <StatCard icon={BookOpen} label="Total Courses"         value={courses.length}       bg="#dbeafe" fg="#2563eb" />
        <StatCard icon={Activity} label="Active Sessions"       value={2}                    bg="#dcfce7" fg="#16a34a" />
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div className="section-title">Lecturer Overview</div>
            <div className="section-sub">All registered lecturers at a glance</div>
          </div>
          <button className="btn-primary" onClick={() => onGoTo('lecturers')}>
            <Users size={16} /> Manage Lecturers
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lecturer</th>
                <th>Email</th>
                <th>Department</th>
                <th>Courses Assigned</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lecturers.map(l => (
                <tr key={l.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={l.name} size={32} />
                      <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{l.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#6b7280' }}>{l.email}</td>
                  <td>{l.dept}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {l.courseIds.map(cid => {
                        const c = courses.find(x => x.id === cid);
                        return c ? <span key={cid} className="tag">{c.code}</span> : null;
                      })}
                    </div>
                  </td>
                  <td><span className="badge badge-green">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="section-title" style={{ marginBottom: 4 }}>Course Registry</div>
        <div className="section-sub">All courses currently in the system</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginTop: 16 }}>
          {courses.map(c => {
            const lect = lecturers.find(l => l.courseIds.includes(c.id));
            return (
              <div key={c.id} className="course-card">
                <div className="course-card-accent" />
                <div style={{ fontSize: 11, color: '#009688', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 6 }}>{c.code}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>{c.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {lect ? (
                    <>
                      <Avatar name={lect.name} size={22} />
                      <span style={{ fontSize: 12, color: '#6b7280' }}>{lect.name}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>Unassigned</span>
                  )}
                </div>
                <div style={{ marginTop: 10 }}>
                  <span className="badge badge-blue">{c.credits} Credits</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Lecturers Management Page ──────────────────────────────────────────────────
function LecturersPage({ lecturers, setLecturers, showCreate, setShowCreate, courses }) {
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  const filtered = lecturers.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setLecturers(prev => prev.filter(l => l.id !== id));
  };

  const handleSave = (form) => {
    setLecturers(prev => [
      ...prev,
      {
        id: `l${Date.now()}`,
        name: form.name,
        email: form.email,
        dept: form.dept || 'Unspecified',
        avatar: form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        courseIds: form.courseIds,
      },
    ]);
  };

  return (
    <>
      {showCreate && (
        <CreateLecturerModal
          onClose={() => setShowCreate(false)}
          onSave={handleSave}
          courses={courses}
        />
      )}

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div>
            <div className="section-title">Lecturer Management</div>
            <div className="section-sub">{filtered.length} lecturer{filtered.length !== 1 ? 's' : ''} found</div>
          </div>
          <div className="input-icon-wrap">
            <Search size={16} className="icon-left" />
            <input
              className="form-input"
              style={{ paddingLeft: 36, width: 220 }}
              placeholder="Search lecturers…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lecturer</th>
                <th>Email</th>
                <th>Department</th>
                <th>Courses</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <Fragment key={l.id}>
                  <tr style={{ cursor: 'pointer' }} onClick={() => setExpandedRow(expandedRow === l.id ? null : l.id)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={l.name} size={36} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{l.name}</div>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>ID: {l.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#6b7280' }}>{l.email}</td>
                    <td>{l.dept}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {l.courseIds.length > 0
                          ? l.courseIds.map(cid => {
                              const c = courses.find(x => x.id === cid);
                              return c ? <span key={cid} className="tag">{c.code}</span> : null;
                            })
                          : <span style={{ color: '#9ca3af', fontSize: 12 }}>None</span>}
                      </div>
                    </td>
                    <td><span className="badge badge-green">Active</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                        <button style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(l.id)} style={{ background: '#fee2e2', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === l.id && (
                    <tr>
                      <td colSpan={6} style={{ background: '#f8fdfc', padding: '16px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#009688', marginBottom: 10 }}>Assigned Courses Detail</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                          {l.courseIds.map(cid => {
                            const c = courses.find(x => x.id === cid);
                            return c ? (
                              <div key={cid} style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', border: '1px solid #e0f2f1' }}>
                                <div style={{ fontSize: 11, color: '#009688', fontWeight: 700 }}>{c.code}</div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{c.name}</div>
                                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{c.dept} • {c.credits} credits</div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── Students Management Page ───────────────────────────────────────────────────
function StudentsPage({ students, setStudents, showCreate, setShowCreate, courses }) {
  const [search, setSearch] = useState('');

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.matric.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (form) => {
    setStudents(prev => [
      ...prev,
      {
        id: `s${Date.now()}`,
        name: form.name,
        email: form.email,
        matric: form.matric,
        avatar: form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        courseIds: form.courseIds,
      },
    ]);
  };

  const handleDelete = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  return (
    <>
      {showCreate && (
        <CreateStudentModal
          onClose={() => setShowCreate(false)}
          onSave={handleSave}
          courses={courses}
        />
      )}

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div>
            <div className="section-title">Student Registry</div>
            <div className="section-sub">{filtered.length} student{filtered.length !== 1 ? 's' : ''} enrolled</div>
          </div>
          <div className="input-icon-wrap">
            <Search size={16} className="icon-left" />
            <input
              className="form-input"
              style={{ paddingLeft: 36, width: 220 }}
              placeholder="Search matric or name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Matric No.</th>
                <th>Enrolled Courses</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={s.name} size={36} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.matric}</span></td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {s.courseIds.map(cid => {
                        const c = courses.find(x => x.id === cid);
                        return c ? <span key={cid} className="tag">{c.code}</span> : null;
                      })}
                      {s.courseIds.length === 0 && <span style={{ color: '#9ca3af', fontSize: 12 }}>No courses assigned</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280' }}><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(s.id)} style={{ background: '#fee2e2', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── Courses Page ───────────────────────────────────────────────────────────────
function CoursesPage({ courses, setCourses, showCreate, setShowCreate, lecturers }) {
  const handleSave = (form) => {
    setCourses(prev => [
      ...prev,
      {
        id: `c${Date.now()}`,
        code: form.code,
        name: form.name,
        credits: parseInt(form.credits),
        dept: form.dept,
      },
    ]);
  };

  return (
    <>
      {showCreate && (
        <CreateCourseModal
          onClose={() => setShowCreate(false)}
          onSave={handleSave}
        />
      )}

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div>
            <div className="section-title">Course Management</div>
            <div className="section-sub">{courses.length} course{courses.length !== 1 ? 's' : ''} available</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {courses.map((c, i) => {
            const lect = lecturers.find(l => l.courseIds.includes(c.id));
            const colors = ['#009688','#2563eb','#7c3aed','#be185d','#ca8a04','#16a34a'];
            const col = colors[i % colors.length];
            return (
              <div key={c.id} className="course-card">
                <div className="course-card-accent" style={{ background: col }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: col, fontWeight: 700, letterSpacing: '0.5px' }}>{c.code}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginTop: 2 }}>{c.name}</div>
                  </div>
                  <span className="badge badge-blue">{c.credits} Cr.</span>
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>{c.dept}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                  {lect ? (
                    <>
                      <Avatar name={lect.name} size={28} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{lect.name}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>Instructor</div>
                      </div>
                    </>
                  ) : (
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>No instructor assigned</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Sessions Page ──────────────────────────────────────────────────────────────
function SessionsPage() {
  const sessions = [
    { id: '552109', course: 'Advanced Web Development', lecturer: 'Dr. Sarah Smith', started: '09:15 AM', students: 18, status: 'active' },
    { id: '341872', course: 'Database Systems', lecturer: 'Dr. Sarah Smith', started: '11:00 AM', students: 22, status: 'closed' },
    { id: '774231', course: 'Machine Learning Fundamentals', lecturer: 'Prof. James Okafor', started: '10:30 AM', students: 15, status: 'active' },
  ];
  return (
    <div className="card">
      <div className="section-title" style={{ marginBottom: 4 }}>Active Sessions</div>
      <div className="section-sub">Real-time overview of all attendance sessions</div>
      <div className="table-wrap" style={{ marginTop: 16 }}>
        <table>
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Course</th>
              <th>Lecturer</th>
              <th>Started At</th>
              <th>Students</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id}>
                <td><span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#009688', fontSize: 15 }}>{s.id}</span></td>
                <td style={{ fontWeight: 600 }}>{s.course}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={s.lecturer} size={28} />{s.lecturer}
                  </div>
                </td>
                <td style={{ color: '#6b7280' }}>{s.started}</td>
                <td>
                  <span style={{ fontWeight: 700, color: '#1a1a2e' }}>{s.students}</span>
                  <span style={{ color: '#9ca3af', fontSize: 12 }}> enrolled</span>
                </td>
                <td>
                  <span className={`badge ${s.status === 'active' ? 'badge-green' : 'badge-yellow'}`}>
                    {s.status === 'active' ? '● Active' : '✓ Closed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main SuperAdmin Dashboard ──────────────────────────────────────────────────
export default function SuperAdminPortal({ 
  activePage, setActivePage,
  lecturers, setLecturers,
  courses, setCourses,
  students, setStudents
}) {
  const [showCreate, setShowCreate] = useState(false);

  const titles = {
    overview:  { title: 'Dashboard Overview', sub: 'Welcome back, Super Admin' },
    lecturers: { title: 'Lecturer Management', sub: 'Manage all lecturers and course assignments' },
    students:  { title: 'Student Management',  sub: 'Manage student enrollment and registry' },
    courses:   { title: 'Course Management', sub: 'All registered courses in the system' },
    sessions:  { title: 'Attendance Sessions', sub: 'Monitor all active and closed sessions' },
  };
  const { title, sub } = titles[activePage] || titles.overview;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{title}</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>{sub}</p>
        </div>
        {(activePage === 'lecturers' || activePage === 'courses' || activePage === 'students') && (
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> New {
              activePage === 'lecturers' ? 'Lecturer' : 
              activePage === 'students' ? 'Student' : 'Course'
            }
          </button>
        )}
      </div>

      <div className="page-body">
        {activePage === 'overview'  && <OverviewPage lecturers={lecturers} courses={courses} students={students} onGoTo={setActivePage} />}
        {activePage === 'lecturers' && (
          <LecturersPage
            lecturers={lecturers}
            setLecturers={setLecturers}
            showCreate={showCreate}
            setShowCreate={setShowCreate}
            courses={courses}
          />
        )}
        {activePage === 'students' && (
          <StudentsPage
            students={students}
            setStudents={setStudents}
            showCreate={showCreate}
            setShowCreate={setShowCreate}
            courses={courses}
          />
        )}
        {activePage === 'courses'   && (
          <CoursesPage 
            courses={courses} 
            setCourses={setCourses} 
            showCreate={showCreate} 
            setShowCreate={setShowCreate}
            lecturers={lecturers}
          />
        )}
        {activePage === 'sessions'  && <SessionsPage />}
      </div>
    </>
  );
}
