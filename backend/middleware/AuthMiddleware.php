<?php
require_once __DIR__ . '/../helpers/Response.php';

class AuthMiddleware {
    public static function check() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['user_id'])) {
            Response::send(401, "Unauthorized access. Please login.");
        }

        return $_SESSION;
    }
}
?>
