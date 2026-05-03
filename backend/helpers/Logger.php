<?php
require_once __DIR__ . '/../models/ActivityLog.php';

class Logger {
    public static function log($action, $description = null) {
        $userId = $_SESSION['user_id'] ?? null;
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $timestamp = date('Y-m-d H:i:s');

        // Server-side error log
        $logMessage = "[$timestamp] [User: $userId] [Action: $action] [IP: $ip] $description";
        error_log($logMessage);

        // Database log (Audit Trail)
        $database = new Database();
        $db = $database->getConnection();
        $activityModel = new ActivityLog($db);
        
        $activityModel->create([
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'ip_address' => $ip
        ]);
    }
}
?>
