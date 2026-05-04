<?php
class Student {
    private $conn;
    private $table = "students";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " (user_id, student_id, year, section) VALUES (:user_id, :student_id, :year, :section)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $data['user_id']);
        $stmt->bindParam(':student_id', $data['student_id']);
        $stmt->bindParam(':year', $data['year']);
        $stmt->bindParam(':section', $data['section']);
        return $stmt->execute();
    }

    public function findByUserId($user_id) {
        $query = "SELECT * FROM " . $this->table . " WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getByClass($year, $section) {
        $query = "SELECT s.*, u.full_name, u.email 
                  FROM " . $this->table . " s 
                  JOIN users u ON s.user_id = u.id 
                  WHERE s.year = :year AND s.section = :section";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':year', $year);
        $stmt->bindParam(':section', $section);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
