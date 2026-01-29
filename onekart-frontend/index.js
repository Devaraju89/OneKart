const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Define routes matching the application structure
const routes = {
    '/': 'index.html',
    '/login': 'auth/login.html',
    '/cart': 'cart.html',
    '/register': 'auth/register.html',
    '/seller/dashboard': 'seller/dashboard.html',
    '/seller/myproducts': 'seller/myproducts.html',
    '/seller/orders': 'seller/orders.html',
    '/addproduct': 'seller/addproduct.html',
    '/admin/dashboard': 'admin/dashboard.html',
    '/admin/users': 'admin/users.html',
    '/admin/seller-requests': 'admin/seller-requests.html',
    '/admin/products': 'admin/products.html',
    '/admin/orders': 'admin/orders.html',
    '/admin/settings': 'admin/settings.html',
    '/placeorder': 'placeorder.html',
    '/myorders': 'myorders.html',
    '/track-order': 'track-order.html',
};

// Handle explicit routes
Object.keys(routes).forEach(route => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', routes[route]));
    });
});

// Handle dynamic routes
app.get('/seller/editproduct/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/seller/editproduct.html'));
});

app.get('/seller/reviews/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/seller/reviews.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('==========================================');
    console.log('      OneKart Frontend Server (Node.js)');
    console.log('==========================================');
    console.log(`Local:            http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});
