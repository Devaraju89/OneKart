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
        console.error("ORDER CREATION ERROR:", err);
        res.status(500).json({ status: 'error', message: err.message || 'Server error' });
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('orderItems.seller', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', data: orders });
    } catch (err) {
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

// @desc    Get all orders (Admin/Farmer)
// @route   GET /api/orders
router.get('/', protect, authorize('admin', 'farmer'), async (req, res) => {
    try {
        let orders;
        if (req.user.role === 'admin') {
            orders = await Order.find({})
                .populate('user', 'id name email')
                .populate('orderItems.seller', 'name email')
                .sort({ createdAt: -1 });
        } else {
            // Find orders containing the farmer's items
            orders = await Order.find({ 'orderItems.seller': req.user.id }).populate('user', 'id name').sort({ createdAt: -1 });
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

// @desc    Update order status
// @route   PUT /api/orders/:id/status
router.put('/:id/status', protect, authorize('admin', 'farmer'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            if (req.body.status) order.status = req.body.status;
            if (req.body.refundStatus) order.refundStatus = req.body.refundStatus;

            if (req.body.trackingNumber) {
                order.trackingNumber = req.body.trackingNumber;
            }
            if (req.body.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }
            const updatedOrder = await order.save();
            res.json({ status: 'success', data: updatedOrder });
        } else {
            res.status(404).json({ status: 'error', message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }

        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ status: 'error', message: 'Not authorized' });
        }

        if (order.status === 'Delivered' || order.status === 'Cancelled') {
            return res.status(400).json({ status: 'error', message: `Order already ${order.status}` });
        }

        order.status = 'Cancelled';
        order.cancellationReason = req.body.reason;

        // Refund logic
        if (order.paymentMethod === 'COD') {
            order.refundStatus = 'Not Applicable';
        } else {
            // Prepaid order
            order.refundStatus = 'Processing';
            if (req.body.upiId) {
                order.upiId = req.body.upiId;
            }
        }

        const updatedOrder = await order.save();
        res.status(200).json({ status: 'success', data: updatedOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;
