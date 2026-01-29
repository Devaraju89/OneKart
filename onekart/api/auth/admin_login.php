<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Max-Age: 86400");
    http_response_code(204);
    exit;
}
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");

require __DIR__ . '/../../middlewares/JWT.php';
require __DIR__ . '/../../config/Database.php';

$data = json_decode(file_get_contents("php://input"), true);

// DEBUG LOGGING
file_put_contents("debug_admin_login.log", date("Y-m-d H:i:s") . " - Admin Login Input: " . print_r($data, true) . "\n", FILE_APPEND);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if(empty($username) || empty($password)){
    echo json_encode(["status" => "error", "message" => "Username and password are required"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM admins WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $admin = $result->fetch_assoc();
    if (password_verify($password, $admin['password'])) {
        $jwtInstance = new JWT();
        $payload = [
            "id" => $admin['id'],
            "username" => $admin['username'],
            "role" => "admin"
        ];
        $token = $jwtInstance->createJWT($payload);
        echo json_encode([
            "status" => "success",
            "message" => "Admin login successful",
            "token" => $token,
            "admin" => [
                "id" => $admin['id'],
                "username" => $admin['username'],
                "role" => "admin"
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Incorrect password"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Admin not found"]);
}

$stmt->close();
$conn->close();
?>
