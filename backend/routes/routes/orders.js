const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

// @desc    Create new order
// @route   POST /api/orders
router.post('/', protect, async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No order items' });
        }

        const order = await Order.create({
            user: req.user.id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        res.status(201).json({ status: 'success', data: order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('orderItems.product') // Populate product details
            .populate('orderItems.seller', 'name email mobile'); // Populate seller details

        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }

        // Allow user or admin or seller (if related to them) to see logic can be complex
        // For now, allow user who owns it or admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            // Check if user is a seller of one of the items? 
            // Simplified: just owner or admin for now. user can see their own orders.
            return res.status(401).json({ status: 'error', message: 'Not authorized' });
        }

        res.status(200).json({ status: 'success', data: order });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        res.status(200).json({ status: 'success', data: orders });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Get all orders (Admin/Farmer)
// @route   GET /api/orders
router.get('/', protect, authorize('admin', 'farmer'), async (req, res) => {
    try {
        let orders;
        if (req.user.role === 'admin') {
            orders = await Order.find({}).populate('user', 'id name');
        } else {
            // If farmer, find orders that contain their products
            // This is a bit complex in MongoDB without proper aggregation or structure
            // Simplified: Find all orders where orderItems.seller matches req.user.id
            orders = await Order.find({ 'orderItems.seller': req.user.id }).populate('user', 'id name');
        }
        res.status(200).json({ status: 'success', data: orders });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Update order status to paid
// @route   PUT /api/orders/:id/pay
router.put('/:id/pay', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address
            };

            const updatedOrder = await order.save();
            res.json({ status: 'success', data: updatedOrder });
        } else {
            res.status(404).json({ status: 'error', message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Update order status to delivered
// @route   PUT /api/orders/:id/deliver
router.put('/:id/deliver', protect, authorize('admin', 'farmer'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            order.status = 'Delivered';

            const updatedOrder = await order.save();
            res.json({ status: 'success', data: updatedOrder });
        } else {
            res.status(404).json({ status: 'error', message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;
