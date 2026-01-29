<?php
// Enable Error Reporting for debugging (disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS Headers - Allow Frontend to Access Backend
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle Preflight OPTIONS Request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the URL parameter
$url = isset($_GET['url']) ? $_GET['url'] : '';

// Remove trailing slash if present
$url = trim($url); // Trim whitespace
$url = rtrim($url, '/');

file_put_contents("debug_log.txt", "Processed URL: '" . $url . "' (Length: " . strlen($url) . ")\n", FILE_APPEND);

// Simple Router
switch ($url) {
    case '':
        echo "<h1>OneKart API is Running</h1>";
        break;

    // --- AUTHENTICATION ---
    case 'api/login':
        file_put_contents("debug_log.txt", "MATCHED: api/login\n", FILE_APPEND);
        file_put_contents("debug_log.txt", "Routing to login.php...\n", FILE_APPEND);
        if (file_exists('api/auth/login.php')) {
             require 'api/auth/login.php';
        } else {
             echo json_encode(["status" => "error", "message" => "File not found: api/auth/login.php"]);
        }
        break;
    case 'api/register':
        require 'api/auth/register.php';
        break;
    case 'api/getuser':
        require 'api/user/getuser.php';
        break;

    // --- PRODUCTS ---
    case 'api/products/search':
        require 'api/products/search.php';
        break;
    case 'api/products/getall':
        require 'api/products/getall.php';
        break;
    case 'api/products/getone':
        require 'api/products/getone.php';
        break;
    case 'api/products/add':
        require 'api/products/add.php';
        break;
    case 'api/products/update':
        require 'api/products/update.php';
        break;
    case 'api/products/delete':
        require 'api/products/delete.php';
        break;
    case 'api/products/byfarmer':
        require 'api/products/byfarmer.php';
        break;

    // --- CART ---
    case 'api/cart/add':
        require 'api/cart/add.php';
        break;
    case 'api/cart/view':
        require 'api/cart/view.php';
        break;
    case 'api/cart/update':
        require 'api/cart/update.php';
        break;
    case 'api/cart/remove':
        require 'api/cart/remove.php';
        break;

    // --- ORDERS ---
    case 'api/createorder':
        require 'api/payment/createorder.php';
        break;
    case 'api/orders/place':
        require 'api/orders/place.php';
        break;
    case 'api/orders/myorders':
        require 'api/orders/myorders.php';
        break;
    case 'api/orders/farmerorders':
        require 'api/orders/farmerorders.php';
        break;
    case 'api/orders/updatestatus':
        require 'api/orders/updatestatus.php';
        break;
    
    // --- DASHBOARD ---
    case 'api/dashboard/farmer':
        require 'api/dashboard/farmer.php';
        break;
    case 'api/dashboard/adminsummary':
        require 'api/dashboard/adminsummary.php';
        break;
    case 'api/dashboard/userslist':
        require 'api/dashboard/userslist.php';
        break;
    case 'api/admin/seller_requests':
        require 'api/admin/seller_requests.php';
        break;
    case 'api/admin/handle_seller':
        require 'api/admin/handle_seller.php';
        break;
        
    default:
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Endpoint not found: " . $url]);
        break;
}
?>
