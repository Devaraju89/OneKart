const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, {
    timestamps: true
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    quantity: {
        type: Number,
        required: [true, 'Please add quantity']
    },
    image_url: {
        type: String,
        default: 'no-image.jpg'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    category: {
        type: String,
        default: 'General'
    },
    unit: {
        type: String,
        required: [true, 'Please specify the unit (kg, g, piece, dozen)'],
        enum: ['kg', 'g', 'piece', 'dozen', 'bundle', 'packet', 'liter', 'ml', 'box', 'unit'],
        default: 'kg'
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
