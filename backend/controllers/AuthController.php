require_once __DIR__ . '/../helpers/Logger.php';

class AuthController {
    private $userModel;

    public function __construct() {
        $database = new Database();
        $db = $database->getConnection();
        $this->userModel = new User($db);
    }

    public function apiStatus() {
        Response::send(200, "API is running", [
            "version" => "1.0.0",
            "status" => "active",
            "timestamp" => date("Y-m-d H:i:s")
        ]);
    }

    public function login($data) {
        if (!isset($data['email']) || !isset($data['password'])) {
            Response::send(400, "Email and password are required.");
        }

        $user = $this->userModel->findByEmail($data['email']);

        if ($user && password_verify($data['password'], $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['full_name'] = $user['full_name'];
            
            // Generate CSRF Token
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

            Logger::log("LOGIN", "User logged in successfully.");

            Response::send(200, "Login successful.", [
                "id" => $user['id'],
                "full_name" => $user['full_name'],
                "role" => $user['role'],
                "csrf_token" => $_SESSION['csrf_token']
            ]);
        } else {
            Logger::log("FAILED_LOGIN", "Failed login attempt for email: " . ($data['email'] ?? 'unknown'));
            Response::send(401, "Invalid email or password.");
        }
    }

    public function logout() {
        Logger::log("LOGOUT", "User logged out.");
        session_unset();
        session_destroy();
        Response::send(200, "Logged out successfully.");
    }

    public function getMe() {
        if (!isset($_SESSION['user_id'])) {
            Response::send(401, "Not authenticated.");
        }
        Response::send(200, "Current user retrieved.", [
            "id" => $_SESSION['user_id'],
            "full_name" => $_SESSION['full_name'],
            "role" => $_SESSION['role']
        ]);
    }
}
?>
