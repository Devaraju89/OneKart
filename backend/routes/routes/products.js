const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all products
// @route   GET /api/products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name email');
        res.status(200).json({ status: 'success', data: products });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Get single product
// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email');
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }
        res.status(200).json({ status: 'success', data: product });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Add product
// @route   POST /api/products
router.post('/', protect, authorize('farmer', 'admin'), async (req, res) => {
    try {
        req.body.seller = req.user.id;
        const product = await Product.create(req.body);
        res.status(201).json({ status: 'success', data: product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Update product
// @route   PUT /api/products/:id
router.put('/:id', protect, authorize('farmer', 'admin'), async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        // Make sure user is product owner
        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ status: 'error', message: 'Not authorized' });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ status: 'success', data: product });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
router.delete('/:id', protect, authorize('farmer', 'admin'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        // Make sure user is product owner
        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ status: 'error', message: 'Not authorized' });
        }

        await product.deleteOne();
        res.status(200).json({ status: 'success', message: 'Product removed' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;
