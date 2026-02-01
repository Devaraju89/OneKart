const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { protect } = require('../middleware/auth');

// @desc    Send a message/inquiry
// @route   POST /api/inquiries
router.post('/', protect, async (req, res) => {
    try {
        const { recipient, product, order, subject, message, repliedTo, recipientRole } = req.body;

        // Map roles to Models
        const roleToModel = {
            'customer': 'User',
            'farmer': 'Seller',
            'admin': 'Admin'
        };

        const senderModel = roleToModel[req.user.role];
        const recipientModel = roleToModel[recipientRole] || 'Seller';

        const inquiry = await Inquiry.create({
            sender: req.user.id,
            senderModel,
            senderRole: req.user.role,
            recipient,
            recipientModel,
            recipientRole: recipientRole || 'farmer',
            product,
            order,
            subject,
            message,
            repliedTo
        });

        res.status(201).json({ status: 'success', data: inquiry });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Get all inquiries for the logged in user (sent or received)
// @route   GET /api/inquiries
router.get('/', protect, async (req, res) => {
    try {
        const inquiries = await Inquiry.find({
            $or: [{ sender: req.user.id }, { recipient: req.user.id }]
        });

        // Patch legacy documents that are missing model references
        const patchPromises = inquiries.map(async (msg) => {
            let changed = false;
            if (!msg.senderModel) {
                // If it's the current user sending, we know their role
                if (msg.sender.toString() === req.user.id) {
                    msg.senderModel = req.user.role === 'farmer' ? 'Seller' : (req.user.role === 'admin' ? 'Admin' : 'User');
                    msg.senderRole = req.user.role;
                    changed = true;
                } else {
                    // It's the other party, we assume customer if sent to us
                    msg.senderModel = 'User';
                    msg.senderRole = 'customer';
                    changed = true;
                }
            }
            if (!msg.recipientModel) {
                if (msg.recipient.toString() === req.user.id) {
                    msg.recipientModel = req.user.role === 'farmer' ? 'Seller' : (req.user.role === 'admin' ? 'Admin' : 'User');
                    msg.recipientRole = req.user.role;
                    changed = true;
                } else if (msg.product) {
                    // Likely sent to a farmer for products
                    msg.recipientModel = 'Seller';
                    msg.recipientRole = 'farmer';
                    changed = true;
                } else {
                    // Default fallback
                    msg.recipientModel = 'User';
                    msg.recipientRole = 'customer';
                    changed = true;
                }
            }
            if (!msg.senderRole && msg.senderModel) {
                msg.senderRole = msg.senderModel === 'Seller' ? 'farmer' : (msg.senderModel === 'Admin' ? 'admin' : 'customer');
                changed = true;
            }
            if (!msg.recipientRole && msg.recipientModel) {
                msg.recipientRole = msg.recipientModel === 'Seller' ? 'farmer' : (msg.recipientModel === 'Admin' ? 'admin' : 'customer');
                changed = true;
            }
            if (changed) await msg.save();
        });
        await Promise.all(patchPromises);

        const populatedInquiries = await Inquiry.find({
            $or: [{ sender: req.user.id }, { recipient: req.user.id }]
        })
            .populate('sender', 'name email role')
            .populate('recipient', 'name email role')
            .populate('product', 'name image_url')
            .sort({ createdAt: -1 });

        res.status(200).json({ status: 'success', data: populatedInquiries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Mark inquiry as read
// @route   PUT /api/inquiries/:id/read
router.put('/:id/read', protect, async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ status: 'error', message: 'Message not found' });
        }

        if (inquiry.recipient.toString() !== req.user.id) {
            return res.status(401).json({ status: 'error', message: 'Not authorized' });
        }

        inquiry.isRead = true;
        await inquiry.save();

        res.status(200).json({ status: 'success', data: inquiry });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;
