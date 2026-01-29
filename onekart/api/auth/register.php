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
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'customer';
if (!$name || !$email || !$password) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
try {
    $status = ($role === 'farmer') ? 'pending' : 'active';
    $mobile = $data['mobile'] ?? '';
    // If column doesn't exist, this might fail, but we attempted to add it. 
    // Assuming migration worked or silently failed if exists. 
    // We'll update query.
    $stmt = $conn->prepare("INSERT INTO user (name, email, password, role, status, mobile) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $name, $email, $hashed_password, $role, $status, $mobile);
    if ($stmt->execute()) {
        $user_id = $stmt->insert_id;
        
        if ($status === 'pending') {
            echo json_encode([
                "status" => "pending",
                "message" => "Account created! Your seller profile is pending admin approval. Please wait for verification.",
                "user" => [
                    "id" => $user_id,
                    "name" => $name,
                    "email" => $email,
                    "role" => $role
                ]
            ]);
            exit;
        }

        $jwtInstance = new JWT();
        $payload = [
            "email" => $email,
            "role" => $role,
        ];
        $token = $jwtInstance->createJWT($payload);
        echo json_encode([
            "status" => "success",
            "message" => "User registered successfully",
            "token" => $token,
            "user" => [
                "id" => $user_id,
                "name" => $name,
                "email" => $email,
                "role" => $role
            ]
        ]);
    } else {
        if ($stmt->errno === 1062) {
            echo json_encode(["status" => "error", "message" => "Email already exists. Try logging in."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Registration failed."]);
        }
    }
    $stmt->close();
} catch (mysqli_sql_exception $e) {
    if ($e->getCode() === 1062) {
        echo json_encode(["status" => "error", "message" => "Email already exists. Try logging in."]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Database error: " . $e->getMessage()
        ]);
    }
}
$conn->close();
?>
