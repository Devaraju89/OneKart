<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once(__DIR__ . '/../../config/Database.php');

// Fetch all users with role 'farmer' and status 'pending'
$query = "SELECT id, name, email, mobile, status, created_at FROM user WHERE role = 'farmer' AND status = 'pending' ORDER BY created_at DESC";
$result = $conn->query($query);

$requests = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }
}

echo json_encode([
    "status" => "success",
    "data" => $requests
]);

$conn->close();
?>
