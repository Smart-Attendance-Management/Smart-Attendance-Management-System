<?php
class AttendanceSession {
    private $conn;
    private $table = "attendance_sessions";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " (lecturer_assignment_id, session_code, start_time, end_time, grace_period, expires_at) 
                  VALUES (:lecturer_assignment_id, :session_code, :start_time, :end_time, :grace_period, :expires_at)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':lecturer_assignment_id', $data['lecturer_assignment_id']);
        $stmt->bindParam(':session_code', $data['session_code']);
        $stmt->bindParam(':start_time', $data['start_time']);
        $stmt->bindParam(':end_time', $data['end_time']);
        $stmt->bindParam(':grace_period', $data['grace_period']);
        $stmt->bindParam(':expires_at', $data['expires_at']);
        return $stmt->execute();
    }

    public function isCodeUnique($code) {
        $query = "SELECT id FROM " . $this->table . " WHERE session_code = :code AND status = 'active'";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':code', $code);
        $stmt->execute();
        return !$stmt->fetch();
    }

    public function findByCode($code) {
        $query = "SELECT * FROM " . $this->table . " WHERE session_code = :code AND status = 'active' LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':code', $code);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateStatus($id, $status) {
        $query = "UPDATE " . $this->table . " SET status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getByAssignment($assignment_id) {
        $query = "SELECT * FROM " . $this->table . " WHERE lecturer_assignment_id = :assignment_id ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':assignment_id', $assignment_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
