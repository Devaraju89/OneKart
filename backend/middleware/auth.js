const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Seller = require('../models/Seller');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user;
        if (decoded.role === 'admin') {
            user = await Admin.findById(decoded.id);
        } else if (decoded.role === 'farmer') {
            user = await Seller.findById(decoded.id);
        } else {
            user = await User.findById(decoded.id);
        }

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'User no longer exists' });
        }

        // Attach user and role to request
        req.user = user;
        req.user.role = decoded.role; // Add role from token since it's not in Admin/Seller models

        next();
    } catch (err) {
        return res.status(401).json({ status: 'error', message: 'Not authorized to access this route' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
