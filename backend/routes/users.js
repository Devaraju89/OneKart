const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Seller = require('../models/Seller');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all users (Customers, Sellers, Admins)
// @route   GET /api/users
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find({});
        const sellers = await Seller.find({});
        // Optionally fetch admins if you want them in the list too, though usually hidden or separate
        // For now, let's just combine users and sellers as requested for "Community Directory"

        // Normalize data structure if needed, or just return them
        // Adding a 'role' field is handled by schema default, but let's ensure consistency
        const allUsers = [
            ...users.map(u => ({ ...u.toObject(), role: 'customer' })),
            ...sellers.map(s => ({ ...s.toObject(), role: 'farmer' }))
        ];

        res.status(200).json({ status: 'success', data: allUsers });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Get all sellers
// @route   GET /api/users/sellers
router.get('/sellers', protect, authorize('admin'), async (req, res) => {
    try {
        const sellers = await Seller.find({});
        res.status(200).json({ status: 'success', data: sellers });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Get pending seller requests
// @route   GET /api/users/pending
router.get('/pending', protect, authorize('admin'), async (req, res) => {
    try {
        const sellers = await Seller.find({ status: 'pending' });
        res.status(200).json({ status: 'success', data: sellers });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Approve seller
// @route   PUT /api/users/seller/:id/approve
router.put('/seller/:id/approve', protect, authorize('admin'), async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id);
        if (!seller) {
            return res.status(404).json({ status: 'error', message: 'Seller not found' });
        }
        seller.status = 'active';
        await seller.save();
        res.status(200).json({ status: 'success', message: 'Seller approved' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Delete user (Customer or Seller)
// @route   DELETE /api/users/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        // Try deleting from User
        let result = await User.findByIdAndDelete(req.params.id);
        if (!result) {
            // Try deleting from Seller
            result = await Seller.findByIdAndDelete(req.params.id);
        }

        if (!result) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        res.status(200).json({ status: 'success', message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Get counts for dashboard stats
// @route   GET /api/users/stats
router.get('/stats', protect, authorize('admin'), async (req, res) => {
    try {
        const customerCount = await User.countDocuments({});
        const sellerCount = await Seller.countDocuments({ status: 'active' });
        const pendingCount = await Seller.countDocuments({ status: 'pending' });

        res.status(200).json({
            status: 'success',
            data: {
                customers: customerCount,
                sellers: sellerCount,
                pending: pendingCount
            }
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;
