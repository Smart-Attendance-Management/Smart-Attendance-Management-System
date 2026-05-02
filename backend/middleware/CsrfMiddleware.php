<?php
require_once __DIR__ . '/../helpers/Response.php';

class CsrfMiddleware {
    public static function validate() {
        $method = $_SERVER['REQUEST_METHOD'];
        $mutationMethods = ['POST', 'PUT', 'DELETE'];

        if (in_array($method, $mutationMethods)) {
            $clientToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
            $sessionToken = $_SESSION['csrf_token'] ?? null;

            if (!$clientToken || $clientToken !== $sessionToken) {
                Response::send(403, "Invalid CSRF token.");
            }
        }
    }
}
?>
