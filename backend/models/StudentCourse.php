<?php
class StudentCourse {
    private $conn;
    private $table = "student_courses";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function enroll($data) {
        $query = "INSERT INTO " . $this->table . " (student_id, course_id) VALUES (:student_id, :course_id)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':student_id', $data['student_id']);
        $stmt->bindParam(':course_id', $data['course_id']);
        return $stmt->execute();
    }

    public function getCoursesByStudent($student_id) {
        $query = "SELECT sc.*, c.course_name, c.course_code 
                  FROM " . $this->table . " sc 
                  JOIN courses c ON sc.course_id = c.id 
                  WHERE sc.student_id = :student_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':student_id', $student_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
