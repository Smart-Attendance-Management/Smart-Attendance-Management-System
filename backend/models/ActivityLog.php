<?php
class ActivityLog {
    private $conn;
    private $table = "activity_logs";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " (user_id, action, description, ip_address) 
                  VALUES (:user_id, :action, :description, :ip_address)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $data['user_id']);
        $stmt->bindParam(':action', $data['action']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':ip_address', $data['ip_address']);
        return $stmt->execute();
    }
}
?>
