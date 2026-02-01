const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Seller = require('../models/Seller');
const { protect } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, mobile } = req.body;

        // Backend Validation
        if (!name || !email || !password || !role || !mobile) {
            return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: 'error', message: 'Please provide a valid email address' });
        }

        if (password.length < 6) {
            return res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters long' });
        }

        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({ status: 'error', message: 'Mobile number must be exactly 10 digits' });
        }

        let user;
        let model;
        let status = 'active';

        if (role === 'farmer') {
            model = Seller;
            status = 'pending';
        } else if (role === 'admin') {
            model = Admin;
        } else {
            model = User;
        }

        // Check if user exists in any collection
        const userExists = await User.findOne({ email }) || await Seller.findOne({ email }) || await Admin.findOne({ email });
        if (userExists) {
            return res.status(400).json({ status: 'error', message: 'User already exists' });
        }

        const userData = { name, email, password };
        if (role === 'farmer') {
            userData.mobile = mobile;
            userData.status = status;
        } else if (role === 'customer') {
            userData.mobile = mobile;
        }

        user = await model.create(userData);

        if (status === 'pending') {
            return res.status(201).json({
                status: 'pending',
                message: 'Account created! Your seller profile is pending admin approval.',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: 'error', message: 'Please provide a valid email format' });
        }

        console.log(`Login attempt for: ${email}`);
        // Try to find in each collection
        let user = await User.findOne({ email }).select('+password');
        let role = 'customer';

        if (!user) {
            console.log('Not found in Users, checking Sellers...');
            user = await Seller.findOne({ email }).select('+password');
            role = 'farmer';
        }

        if (!user) {
            console.log('Not found in Sellers, checking Admins...');
            user = await Admin.findOne({ email }).select('+password');
            role = 'admin';
        }

        if (!user) {
            console.log('User not found in any collection for email:', email);
            return res.status(401).json({ status: 'error', message: `Login Failed: User not found in any role for ${email}` });
        }

        console.log(`User found: ${user.email}, Role: ${role}`);

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        console.log(`Password match result: ${isMatch}`);

        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: `Login Failed: Password mismatch. User: ${user.email}, Role: ${role}` });
        }

        if (role === 'farmer' && user.status === 'pending') {
            return res.status(403).json({ status: 'error', message: 'Account pending approval' });
        }

        const token = jwt.sign({ id: user._id, role: role, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ status: 'success', data: user });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
    try {
        let model;
        if (req.user.role === 'farmer') model = Seller;
        else if (req.user.role === 'admin') model = Admin;
        else model = User;

        const user = await model.findById(req.user.id);

        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = req.body.password;
        if (req.body.mobile && (req.user.role === 'farmer' || req.user.role === 'customer')) {
            user.mobile = req.body.mobile;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            status: 'success',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;
