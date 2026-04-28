// ============================================================
//  DUMMY DATA – Smart Attendance System
// ============================================================

export const COURSES = [
  { id: 'c1', code: 'CSC401', name: 'Advanced Web Development', credits: 3, dept: 'Computer Science' },
  { id: 'c2', code: 'CSC303', name: 'Database Systems', credits: 3, dept: 'Computer Science' },
  { id: 'c3', code: 'CSC215', name: 'Data Structures & Algorithms', credits: 3, dept: 'Computer Science' },
  { id: 'c4', code: 'CSC502', name: 'Machine Learning Fundamentals', credits: 3, dept: 'Computer Science' },
  { id: 'c5', code: 'MTH301', name: 'Numerical Methods', credits: 2, dept: 'Mathematics' },
  { id: 'c6', code: 'CSC310', name: 'Computer Networks', credits: 3, dept: 'Computer Science' },
];

export const LECTURERS = [
  {
    id: 'l1',
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@university.edu',
    dept: 'Computer Science',
    avatar: 'SS',
    courseIds: ['c1', 'c2'],
  },
  {
    id: 'l2',
    name: 'Prof. James Okafor',
    email: 'j.okafor@university.edu',
    dept: 'Computer Science',
    avatar: 'JO',
    courseIds: ['c3', 'c4'],
  },
  {
    id: 'l3',
    name: 'Dr. Amara Nwosu',
    email: 'a.nwosu@university.edu',
    dept: 'Mathematics',
    avatar: 'AN',
    courseIds: ['c5'],
  },
  {
    id: 'l4',
    name: 'Mr. Kevin Mensah',
    email: 'k.mensah@university.edu',
    dept: 'Computer Science',
    avatar: 'KM',
    courseIds: ['c6'],
  },
];

export const STUDENTS = [
  { id: 's1', name: 'Alice Johnson', email: 'alice.j@student.edu', matric: 'UNI/2021/001', avatar: 'AJ' },
  { id: 's2', name: 'Brian Eze',      email: 'brian.e@student.edu', matric: 'UNI/2021/002', avatar: 'BE' },
  { id: 's3', name: 'Clara Adeyemi',  email: 'clara.a@student.edu', matric: 'UNI/2021/003', avatar: 'CA' },
  { id: 's4', name: 'David Owusu',    email: 'd.owusu@student.edu', matric: 'UNI/2021/004', avatar: 'DO' },
  { id: 's5', name: 'Ella Mbeki',     email: 'ella.m@student.edu',  matric: 'UNI/2021/005', avatar: 'EM' },
  { id: 's6', name: 'Felix Kojo',     email: 'felix.k@student.edu', matric: 'UNI/2021/006', avatar: 'FK' },
];

export const ATTENDANCE_RECORDS = {
  // courseId -> studentId -> array of { date, status }
  c1: {
    s1: [
      { date: '2026-04-01 09:00', status: 'present' },
      { date: '2026-04-08 09:00', status: 'present' },
      { date: '2026-04-15 09:00', status: 'absent' },
      { date: '2026-04-22 09:00', status: 'present' },
    ],
    s2: [
      { date: '2026-04-01 09:00', status: 'present' },
      { date: '2026-04-08 09:00', status: 'absent' },
      { date: '2026-04-15 09:00', status: 'absent' },
      { date: '2026-04-22 09:00', status: 'present' },
    ],
    s3: [
      { date: '2026-04-01 09:00', status: 'present' },
      { date: '2026-04-08 09:00', status: 'present' },
      { date: '2026-04-15 09:00', status: 'present' },
      { date: '2026-04-22 09:00', status: 'present' },
    ],
    s4: [
      { date: '2026-04-01 09:00', status: 'absent' },
      { date: '2026-04-08 09:00', status: 'present' },
      { date: '2026-04-15 09:00', status: 'present' },
      { date: '2026-04-22 09:00', status: 'absent' },
    ],
    s5: [
      { date: '2026-04-01 09:00', status: 'present' },
      { date: '2026-04-08 09:00', status: 'present' },
      { date: '2026-04-15 09:00', status: 'absent' },
      { date: '2026-04-22 09:00', status: 'present' },
    ],
    s6: [
      { date: '2026-04-01 09:00', status: 'absent' },
      { date: '2026-04-08 09:00', status: 'absent' },
      { date: '2026-04-15 09:00', status: 'present' },
      { date: '2026-04-22 09:00', status: 'present' },
    ],
  },
  c2: {
    s1: [
      { date: '2026-04-02 11:00', status: 'present' },
      { date: '2026-04-09 11:00', status: 'present' },
      { date: '2026-04-16 11:00', status: 'present' },
    ],
    s2: [
      { date: '2026-04-02 11:00', status: 'absent' },
      { date: '2026-04-09 11:00', status: 'present' },
      { date: '2026-04-16 11:00', status: 'present' },
    ],
    s3: [
      { date: '2026-04-02 11:00', status: 'present' },
      { date: '2026-04-09 11:00', status: 'absent' },
      { date: '2026-04-16 11:00', status: 'present' },
    ],
    s4: [
      { date: '2026-04-02 11:00', status: 'present' },
      { date: '2026-04-09 11:00', status: 'present' },
      { date: '2026-04-16 11:00', status: 'absent' },
    ],
  },
  c3: {
    s2: [
      { date: '2026-04-03 14:00', status: 'present' },
      { date: '2026-04-10 14:00', status: 'present' },
      { date: '2026-04-17 14:00', status: 'present' },
      { date: '2026-04-24 14:00', status: 'absent' },
    ],
    s4: [
      { date: '2026-04-03 14:00', status: 'present' },
      { date: '2026-04-10 14:00', status: 'absent' },
      { date: '2026-04-17 14:00', status: 'present' },
      { date: '2026-04-24 14:00', status: 'present' },
    ],
    s5: [
      { date: '2026-04-03 14:00', status: 'absent' },
      { date: '2026-04-10 14:00', status: 'absent' },
      { date: '2026-04-17 14:00', status: 'absent' },
      { date: '2026-04-24 14:00', status: 'present' },
    ],
    s6: [
      { date: '2026-04-03 14:00', status: 'present' },
      { date: '2026-04-10 14:00', status: 'present' },
      { date: '2026-04-17 14:00', status: 'present' },
      { date: '2026-04-24 14:00', status: 'present' },
    ],
  },
  c4: {
    s1: [
      { date: '2026-04-04 10:00', status: 'present' },
      { date: '2026-04-11 10:00', status: 'absent' },
      { date: '2026-04-18 10:00', status: 'present' },
    ],
    s3: [
      { date: '2026-04-04 10:00', status: 'present' },
      { date: '2026-04-11 10:00', status: 'present' },
      { date: '2026-04-18 10:00', status: 'present' },
    ],
    s6: [
      { date: '2026-04-04 10:00', status: 'absent' },
      { date: '2026-04-11 10:00', status: 'present' },
      { date: '2026-04-18 10:00', status: 'absent' },
    ],
  },
};

// Student s1 (Alice) is logged-in student
export const CURRENT_STUDENT = STUDENTS[0];

// Lecturer l1 (Dr. Sarah Smith) is the logged-in lecturer
export const CURRENT_LECTURER = LECTURERS[0];

// Helper: compute attendance percentage
export function calcAttendance(records) {
  if (!records || records.length === 0) return 0;
  const present = records.filter(r => r.status === 'present').length;
  return Math.round((present / records.length) * 100);
}

// Generate a random 6-digit session ID
export function generateSessionId() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Enrolled students per course (derived from ATTENDANCE_RECORDS)
export function getEnrolledStudents(courseId) {
  const rec = ATTENDANCE_RECORDS[courseId] || {};
  return Object.keys(rec).map(sid => STUDENTS.find(s => s.id === sid)).filter(Boolean);
}

// Active sessions dummy
export const ACTIVE_SESSIONS = [
  { courseId: 'c1', sessionId: '552109', startedAt: '09:15 AM', location: '3.2km within campus' },
];
