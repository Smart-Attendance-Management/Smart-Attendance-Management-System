require_once __DIR__ . '/../helpers/Logger.php';

class StudentController {
    private $studentModel;
    private $studentCourseModel;
    private $sessionModel;
    private $recordModel;
    private $assignmentModel;
    private $currentStudentId;
    private $studentProfile;

    public function __construct() {
        $userData = AuthMiddleware::check();
        RoleMiddleware::restrictTo(['student']);
        
        $database = new Database();
        $db = $database->getConnection();
        
        $this->studentModel = new Student($db);
        $this->studentCourseModel = new StudentCourse($db);
        $this->sessionModel = new AttendanceSession($db);
        $this->recordModel = new AttendanceRecord($db);
        $this->assignmentModel = new LecturerAssignment($db);

        $this->studentProfile = $this->studentModel->findByUserId($userData['user_id']);
        if (!$this->studentProfile) {
            Response::send(404, "Student profile not found.");
        }
        $this->currentStudentId = $this->studentProfile['id'];
    }

    public function getMyCourses() {
        $courses = $this->studentCourseModel->getCoursesByStudent($this->currentStudentId);
        Response::send(200, "Enrolled courses retrieved.", $courses);
    }

    public function markAttendance($data) {
        if (!isset($data['session_code'])) Response::send(400, "Session code is required.");

        $session = $this->sessionModel->findByCode($data['session_code']);
        if (!$session) {
            Logger::log("ATTENDANCE_FRAUD", "Invalid session code: " . $data['session_code']);
            Response::send(404, "Invalid or inactive session code.");
        }

        $now = time();
        $startTime = strtotime($session['start_time']);
        $endTime = strtotime($session['end_time']);
        $gracePeriod = $session['grace_period'] * 60; // to seconds

        // Check time window
        if ($now < $startTime) {
            Response::send(403, "This session has not started yet.");
        }
        if ($now > $endTime) {
            $this->sessionModel->updateStatus($session['id'], 'inactive');
            Response::send(403, "This session has ended.");
        }

        // Determine if late (beyond grace period)
        $status = 'present';
        if ($now > ($startTime + $gracePeriod)) {
            $status = 'late';
        }

        // Get assignment details to verify course/year/section
        $assignment = $this->assignmentModel->findById($session['lecturer_assignment_id']);
        
        // Validation: Must belong to same course, year, and section
        if ($assignment['year'] != $this->studentProfile['year'] || 
            $assignment['section'] != $this->studentProfile['section']) {
            Response::send(403, "You do not belong to the year/section for this session.");
        }

        // Check if student is enrolled in this course
        $enrolledCourses = $this->studentCourseModel->getCoursesByStudent($this->currentStudentId);
        $isEnrolled = false;
        foreach ($enrolledCourses as $course) {
            if ($course['course_id'] == $assignment['course_id']) {
                $isEnrolled = true;
                break;
            }
        }

        if (!$isEnrolled) {
            Response::send(403, "You are not enrolled in this course.");
        }

        // Check for duplicate attendance
        if ($this->recordModel->checkDuplicate($this->currentStudentId, $session['id'])) {
            Response::send(409, "Attendance already marked for this session.");
        }

        // Determine status (e.g., late if more than 15 mins after session start)
        $status = 'present';
        // Logic could be added here based on $session['created_at']

        $recordData = [
            'student_id' => $this->currentStudentId,
            'course_id' => $assignment['course_id'],
            'session_id' => $session['id'],
            'status' => $status
        ];

        if ($this->recordModel->create($recordData)) {
            Logger::log("ATTENDANCE_MARKED", "Student " . $this->currentStudentId . " marked attendance for session " . $session['id'] . " as $status.");
            Response::send(201, "Attendance marked successfully as $status.");
        }
        Response::send(500, "Failed to mark attendance.");
    }

    public function getAttendanceHistory() {
        $history = $this->recordModel->getHistoryByStudent($this->currentStudentId);
        
        // Calculate percentages per course
        $courses = $this->studentCourseModel->getCoursesByStudent($this->currentStudentId);
        $report = [];
        foreach ($courses as $c) {
            $courseId = $c['course_id'];
            $courseName = $c['course_name'];
            
            $attended = 0;
            foreach ($history as $h) {
                if ($h['course_id'] == $courseId) $attended++;
            }
            
            // Total sessions for this course (simplified: based on lecturer assignments)
            // In a real system, you'd count total active sessions for this course/year/section
            $report[] = [
                "course_name" => $courseName,
                "attended_count" => $attended,
                "history" => array_filter($history, function($h) use ($courseId) { return $h['course_id'] == $courseId; })
            ];
        }

        Response::send(200, "Attendance history retrieved.", $report);
    }
}
?>
