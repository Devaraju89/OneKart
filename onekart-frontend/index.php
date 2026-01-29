<?php
/**
 * OneKart Frontend Router (PHP Version)
 * This file replaces the Node.js/Express index.js server.
 */

// Get the request URI and trim it
$request = $_SERVER['REQUEST_URI'];
// If the app is in a subdirectory, adjust the base path here
// For example, if accessed via http://localhost/OneKart/onekart-frontend/
$base_path = '/OneKart/onekart-frontend';
$path = str_replace($base_path, '', $request);
$path = parse_url($path, PHP_URL_PATH);

// Define static routes
$routes = [
    '/' => 'public/index.html',
    '/login' => 'public/auth/login.html',
    '/cart' => 'public/cart.html',
    '/register' => 'public/auth/register.html',
    '/seller/dashboard' => 'public/seller/dashboard.html',
    '/seller/myproducts' => 'public/seller/myproducts.html',
    '/seller/orders' => 'public/seller/orders.html',
    '/addproduct' => 'public/seller/addproduct.html',
    '/admin/dashboard' => 'public/admin/dashboard.html',
    '/admin/users' => 'public/admin/users.html',
    '/admin/seller-requests' => 'public/admin/seller-requests.html',
    '/admin/products' => 'public/admin/products.html',
    '/admin/orders' => 'public/admin/orders.html',
    '/admin/settings' => 'public/admin/settings.html',
    '/placeorder' => 'public/placeorder.html',
    '/myorders' => 'public/myorders.html',
    '/track-order' => 'public/track-order.html',
];

// Handle dynamic routes (like /seller/editproduct/:id)
if (preg_match('/^\/seller\/editproduct\/\d+$/', $path)) {
    include __DIR__ . '/public/seller/editproduct.html';
    exit;
}
if (preg_match('/^\/seller\/reviews\/\d+$/', $path)) {
    include __DIR__ . '/public/seller/reviews.html';
    exit;
}

// Check if static route exists
if (isset($routes[$path])) {
    $file = __DIR__ . '/' . $routes[$path];
    if (file_exists($file)) {
        // If it's an HTML file, we can just include it or read it
        if (pathinfo($file, PATHINFO_EXTENSION) === 'html') {
            readfile($file);
        } else {
            include $file;
        }
        exit;
    }
}

// If it's a file that exists in public (like .css, .js, .png), serve it
$public_file = __DIR__ . '/public' . $path;
if ($path !== '/' && file_exists($public_file) && !is_dir($public_file)) {
    $mime_types = [
        'css' => 'text/css',
        'js' => 'application/javascript',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
    ];
    $ext = pathinfo($public_file, PATHINFO_EXTENSION);
    if (isset($mime_types[$ext])) {
        header('Content-Type: ' . $mime_types[$ext]);
    }
    readfile($public_file);
    exit;
}

// Default to 404
http_response_code(404);
echo "404 - Page Not Found";
?>
