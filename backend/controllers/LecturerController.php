require_once __DIR__ . '/../helpers/Validator.php';
require_once __DIR__ . '/../helpers/Logger.php';

class LecturerController {
    private $assignmentModel;
    private $sessionModel;
    private $recordModel;
    private $studentModel;
    private $currentLecturerId;
    private $validator;

    public function __construct() {
        $userData = AuthMiddleware::check();
        RoleMiddleware::restrictTo(['lecturer', 'super_admin']);
        
        $this->currentLecturerId = $userData['user_id'];
        $database = new Database();
        $db = $database->getConnection();
        
        $this->assignmentModel = new LecturerAssignment($db);
        $this->sessionModel = new AttendanceSession($db);
        $this->recordModel = new AttendanceRecord($db);
        $this->studentModel = new Student($db);
        $this->validator = new Validator();
    }

    public function getMyCourses() {
        $courses = $this->assignmentModel->getByLecturer($this->currentLecturerId);
        Response::send(200, "Courses retrieved successfully.", $courses);
    }

    public function getStudentsByAssignment($data) {
        if (!$this->validator->validate($data, ['assignment_id' => 'required|integer'])) {
            Response::send(400, "Validation failed", null, null, $this->validator->getErrors());
        }
        
        $assignment = $this->assignmentModel->findById($data['assignment_id']);
        if (!$assignment || $assignment['lecturer_id'] != $this->currentLecturerId) {
            Logger::log("UNAUTHORIZED_ACCESS", "Lecturer tried to access unauthorized students list.");
            Response::send(403, "You are not authorized to view students for this assignment.");
        }

        $students = $this->studentModel->getByClass($assignment['year'], $assignment['section']);
        Response::send(200, "Students retrieved successfully.", $students);
    }

    public function createSession($data) {
        if (!$this->validator->validate($data, ['assignment_id' => 'required|integer'])) {
            Response::send(400, "Validation failed", null, null, $this->validator->getErrors());
        }
        
        $assignment = $this->assignmentModel->findById($data['assignment_id']);
        if (!$assignment || $assignment['lecturer_id'] != $this->currentLecturerId) {
            Response::send(403, "You are not authorized to create a session for this course.");
        }

        // Unique code generation
        do {
            $code = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (!$this->sessionModel->isCodeUnique($code));

        $data['session_code'] = $code;
        $data['start_time'] = $data['start_time'] ?? date('Y-m-d H:i:s');
        $data['end_time'] = $data['end_time'] ?? date('Y-m-d H:i:s', strtotime('+2 hours'));
        $data['grace_period'] = $data['grace_period'] ?? 15;
        $data['expires_at'] = $data['end_time'];

        if ($this->sessionModel->create($data)) {
            Logger::log("SESSION_CREATED", "Session $code created for assignment " . $data['assignment_id']);
            Response::send(201, "Attendance session created.", ["code" => $code, "expires_at" => $data['expires_at']]);
        }
        Response::send(500, "Failed to create session.");
    }

    public function closeSession($data) {
        if (!$this->validator->validate($data, ['session_id' => 'required|integer'])) {
            Response::send(400, "Validation failed", null, null, $this->validator->getErrors());
        }
        if ($this->sessionModel->updateStatus($data['session_id'], 'inactive')) {
            Logger::log("SESSION_CLOSED", "Session " . $data['session_id'] . " closed.");
            Response::send(200, "Session closed successfully.");
        }
        Response::send(500, "Failed to close session.");
    }

    public function getAttendanceReport($data) {
        if (!$this->validator->validate($data, ['session_id' => 'required|integer'])) {
            Response::send(400, "Validation failed", null, null, $this->validator->getErrors());
        }

        // Pagination
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        $offset = ($page - 1) * $limit;

        $records = $this->recordModel->getReportBySession($data['session_id']); // Simplified: needs actual pagination SQL
        
        $total = count($records);
        $paginatedData = array_slice($records, $offset, $limit);

        Response::send(200, "Attendance report retrieved.", $paginatedData, [
            "page" => $page,
            "limit" => $limit,
            "total" => $total
        ]);
    }
}
?>
