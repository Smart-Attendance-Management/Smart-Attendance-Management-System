<?php
require_once __DIR__ . '/../helpers/Response.php';

class RoleMiddleware {
    public static function restrictTo($roles) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['role']) || !in_array($_SESSION['role'], $roles)) {
            Response::send(403, "Access denied. You do not have the required permissions.");
        }
    }
}
?>
