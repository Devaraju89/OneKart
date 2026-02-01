const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['User', 'Seller', 'Admin']
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'recipientModel'
    },
    recipientModel: {
        type: String,
        required: true,
        enum: ['User', 'Seller', 'Admin']
    },
    senderRole: String,
    recipientRole: String,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    repliedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inquiry'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Inquiry', inquirySchema);
