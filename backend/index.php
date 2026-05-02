require_once __DIR__ . '/config/loader.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/helpers/Response.php';
require_once __DIR__ . '/middleware/CsrfMiddleware.php';

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,
X-CSRF-TOKEN");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
exit();
}

// Start Session
session_start();

// CSRF Validation (except for login which generates the token)
if (strpos($_SERVER['REQUEST_URI'], '/login') === false) {
CsrfMiddleware::validate();
}

// Get the request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Strip the base path (e.g., /attendance-system/backend/)
$basePath = '/attendance-system/backend/index.php';
if (strpos($uri, $basePath) === 0) {
$uri = substr($uri, strlen($basePath));
}
// Also handle cases where index.php is hidden via .htaccess or similar
$uri = parse_url($uri, PHP_URL_PATH);
if ($uri == '') $uri = '/';

$routeKey = "$method $uri";
$routes = require_once __DIR__ . '/routes/api.php';

if (isset($routes[$routeKey])) {
list($controllerName, $action) = explode('@', $routes[$routeKey]);

$controllerFile = __DIR__ . "/controllers/$controllerName.php";
if (file_exists($controllerFile)) {
require_once $controllerFile;
$controller = new $controllerName();

// Handle input data
$input = json_decode(file_get_contents("php://input"), true);

// Execute action
$controller->$action($input);
} else {
Response::send(500, "Controller $controllerName not found.");
}
} else {
Response::send(404, "Route $routeKey not found.");
}
?>