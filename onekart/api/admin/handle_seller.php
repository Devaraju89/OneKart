<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once(__DIR__ . '/../../config/Database.php');

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? '';
$action = $data['action'] ?? ''; // 'approve' or 'reject'

if (!$user_id || !$action) {
    echo json_encode(["status" => "error", "message" => "User ID and action are required"]);
    exit;
}

$status = ($action === 'approve') ? 'active' : 'rejected';

$stmt = $conn->prepare("UPDATE user SET status = ? WHERE id = ? AND role = 'farmer'");
$stmt->bind_param("si", $status, $user_id);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success", 
        "message" => "Seller account " . ($action === 'approve' ? "approved" : "rejected") . " successfully"
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update seller status"]);
}

$stmt->close();
$conn->close();
?>
