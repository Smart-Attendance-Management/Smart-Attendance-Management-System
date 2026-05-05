<?php
class AttendanceRecord {
    private $conn;
    private $table = "attendance_records";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " (student_id, course_id, session_id, status) 
                  VALUES (:student_id, :course_id, :session_id, :status)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':student_id', $data['student_id']);
        $stmt->bindParam(':course_id', $data['course_id']);
        $stmt->bindParam(':session_id', $data['session_id']);
        $stmt->bindParam(':status', $data['status']);
        return $stmt->execute();
    }

    public function checkDuplicate($student_id, $session_id) {
        $query = "SELECT id FROM " . $this->table . " WHERE student_id = :student_id AND session_id = :session_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':student_id', $student_id);
        $stmt->bindParam(':session_id', $session_id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getHistoryByStudent($student_id) {
        $query = "SELECT ar.*, c.course_name, c.course_code, s.session_code, s.created_at as session_date 
                  FROM " . $this->table . " ar 
                  JOIN courses c ON ar.course_id = c.id 
                  JOIN attendance_sessions s ON ar.session_id = s.id 
                  WHERE ar.student_id = :student_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':student_id', $student_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getReportBySession($session_id) {
        $query = "SELECT ar.*, u.full_name, st.student_id as student_reg_id 
                  FROM " . $this->table . " ar 
                  JOIN students st ON ar.student_id = st.id 
                  JOIN users u ON st.user_id = u.id 
                  WHERE ar.session_id = :session_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $session_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
