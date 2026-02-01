const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all products
// @route   GET /api/products
router.get('/', async (req, res) => {
    try {
        const { keyword, category, minPrice, maxPrice, sort } = req.query;

        const query = {};

        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let productsQuery = Product.find(query).populate('seller', 'name email');

        // Sorting
        if (sort === 'price_asc') productsQuery = productsQuery.sort('price');
        else if (sort === 'price_desc') productsQuery = productsQuery.sort('-price');
        else if (sort === 'rating') productsQuery = productsQuery.sort('-rating');
        else productsQuery = productsQuery.sort('-createdAt');

        const products = await productsQuery;
        res.status(200).json({ status: 'success', data: products });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Get all reviews for products owned by a specific seller
// @route   GET /api/products/seller/reviews
router.get('/seller/reviews', protect, authorize('farmer'), async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user.id });
        const allReviews = products.flatMap(p => p.reviews.map(r => ({
            ...r.toObject(),
            productName: p.name,
            productId: p._id
        })));

        res.status(200).json({ status: 'success', data: allReviews });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Get single product
// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'name email')
            .populate('reviews.user', 'name'); // Populate reviewer name if needed

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

        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ status: 'error', message: 'Not authorized' });
        }

        await product.deleteOne();
        res.status(200).json({ status: 'success', message: 'Product removed' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
    const { rating, comment } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // 1. Check if user is the seller (Revoke self-review)
            if (product.seller.toString() === req.user._id.toString()) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Sellers cannot provide feedback for their own products.'
                });
            }

            // 2. Check if user has a delivered order for this product
            const hasDeliveredOrder = await Order.findOne({
                user: req.user._id,
                status: 'Delivered',
                'orderItems.product': req.params.id
            });

            if (!hasDeliveredOrder) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Feedback is exclusive to members who have received this product.'
                });
            }

            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ status: 'error', message: 'Product already reviewed' });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ status: 'success', message: 'Review added' });
        } else {
            res.status(404).json({ status: 'error', message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;
