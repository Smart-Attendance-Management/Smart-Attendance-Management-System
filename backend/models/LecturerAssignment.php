<?php
class LecturerAssignment {
    private $conn;
    private $table = "lecturer_assignments";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " (lecturer_id, course_id, year, section) VALUES (:lecturer_id, :course_id, :year, :section)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':lecturer_id', $data['lecturer_id']);
        $stmt->bindParam(':course_id', $data['course_id']);
        $stmt->bindParam(':year', $data['year']);
        $stmt->bindParam(':section', $data['section']);
        return $stmt->execute();
    }

    public function getByLecturer($lecturer_id) {
        $query = "SELECT la.*, c.course_name, c.course_code 
                  FROM " . $this->table . " la 
                  JOIN courses c ON la.course_id = c.id 
                  WHERE la.lecturer_id = :lecturer_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':lecturer_id', $lecturer_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
