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
file_put_contents("debug_login.log", date("Y-m-d H:i:s") . " - Login Input: " . print_r($data, true) . "\n", FILE_APPEND);

$email = isset($data['email']) ? trim($data['email']) : '';
$password = $data['password'] ?? '';

if(empty($email) || empty($password)){
    file_put_contents("debug_login.log", "Error: Missing email or password\n", FILE_APPEND);
    echo json_encode(["status" => "error", "message" => "Email and password are required"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        if ($user['role'] === 'farmer' && $user['status'] === 'pending') {
            echo json_encode(["status" => "error", "message" => "Your account is pending admin approval. Please wait for verification."]);
            exit;
        }
        if ($user['status'] === 'rejected') {
            echo json_encode(["status" => "error", "message" => "Your seller account request was rejected. Please contact support."]);
            exit;
        }
        $jwtInstance = new JWT();
        $payload = [
            "email" => $user['email'],
            "role" => $user['role'],
        ];
        $token = $jwtInstance->createJWT($payload);
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "token" => $token,
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "role" => $user['role']
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Incorrect password"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "User not found"]);
}
$stmt->close();
$conn->close();
?>
