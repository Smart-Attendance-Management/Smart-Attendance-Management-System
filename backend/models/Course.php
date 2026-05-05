<?php
class Course {
    private $conn;
    private $table = "courses";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " (course_name, course_code) VALUES (:course_name, :course_code)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':course_name', $data['course_name']);
        $stmt->bindParam(':course_code', $data['course_code']);
        return $stmt->execute();
    }

    public function getAll() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
