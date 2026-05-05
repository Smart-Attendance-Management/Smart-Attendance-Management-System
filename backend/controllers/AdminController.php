require_once __DIR__ . '/../helpers/Validator.php';
require_once __DIR__ . '/../helpers/Logger.php';

class AdminController {
    private $db;
    private $userModel;
    private $courseModel;
    private $studentModel;
    private $studentCourseModel;
    private $lecturerAssignmentModel;
    private $validator;

    public function __construct() {
        AuthMiddleware::check();
        RoleMiddleware::restrictTo(['super_admin']);
        
        $database = new Database();
        $this->db = $database->getConnection();
        $this->userModel = new User($this->db);
        $this->courseModel = new Course($this->db);
        $this->studentModel = new Student($this->db);
        $this->studentCourseModel = new StudentCourse($this->db);
        $this->lecturerAssignmentModel = new LecturerAssignment($this->db);
        $this->validator = new Validator();
    }

    public function createLecturer($data) {
        if (!$this->validator->validate($data, ['email' => 'required|email', 'full_name' => 'required'])) {
            Response::send(400, "Validation failed", null, null, $this->validator->getErrors());
        }
        $data['role'] = 'lecturer';
        $userId = $this->userModel->create($data);
        if ($userId) {
            Logger::log("CREATE_LECTURER", "Lecturer $userId created.");
            Response::send(201, "Lecturer account created successfully.", ["id" => $userId]);
        }
        Response::send(500, "Failed to create lecturer.");
    }

    public function createStudent($data) {
        $this->db->beginTransaction();
        try {
            if (!$this->validator->validate($data, ['email' => 'required|email', 'student_id' => 'required'])) {
                Response::send(400, "Validation failed", null, null, $this->validator->getErrors());
            }
            $data['role'] = 'student';
            $userId = $this->userModel->create($data);
            if ($userId) {
                $studentData = [
                    'user_id' => $userId,
                    'student_id' => $data['student_id'],
                    'year' => $data['year'],
                    'section' => $data['section']
                ];
                if ($this->studentModel->create($studentData)) {
                    $this->db->commit();
                    Logger::log("CREATE_STUDENT", "Student $userId created.");
                    Response::send(201, "Student account created successfully.", ["id" => $userId]);
                }
            }
            throw new Exception("Failed to create student details.");
        } catch (Exception $e) {
            $this->db->rollBack();
            Response::send(500, $e->getMessage());
        }
    }

    public function createCourse($data) {
        if ($this->courseModel->create($data)) {
            Logger::log("CREATE_COURSE", "Course " . $data['course_code'] . " created.");
            Response::send(201, "Course created successfully.");
        }
        Response::send(500, "Failed to create course.");
    }

    public function assignLecturer($data) {
        if ($this->lecturerAssignmentModel->create($data)) {
            Logger::log("ASSIGN_LECTURER", "Lecturer " . $data['lecturer_id'] . " assigned to course " . $data['course_id']);
            Response::send(201, "Lecturer assigned to course successfully.");
        }
        Response::send(500, "Failed to assign lecturer.");
    }

    public function assignStudentCourse($data) {
        if ($this->studentCourseModel->enroll($data)) {
            Logger::log("ASSIGN_STUDENT", "Student " . $data['student_id'] . " enrolled in course " . $data['course_id']);
            Response::send(201, "Student enrolled in course successfully.");
        }
        Response::send(500, "Failed to enroll student.");
    }

    public function getAllUsers() {
        $users = $this->userModel->getAll();
        Response::send(200, "Users retrieved successfully.", $users);
    }

    public function updateUser($data) {
        if (!isset($data['id'])) Response::send(400, "User ID is required.");
        if ($this->userModel->update($data['id'], $data)) {
            Logger::log("UPDATE_USER", "User " . $data['id'] . " updated.");
            Response::send(200, "User updated successfully.");
        }
        Response::send(500, "Failed to update user.");
    }

    public function deleteUser($data) {
        if (!isset($data['id'])) Response::send(400, "User ID is required.");
        if ($this->userModel->delete($data['id'])) {
            Logger::log("DELETE_USER", "User " . $data['id'] . " deleted.");
            Response::send(200, "User deleted successfully.");
        }
        Response::send(500, "Failed to delete user.");
    }
}
?>
