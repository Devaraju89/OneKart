const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

// Check for keys
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("FATAL: Razorpay keys missing in .env");
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ status: 'error', message: 'Amount is required' });
        }

        const options = {
            amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: "order_rcptid_" + Date.now(),
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ status: 'error', message: "Unable to create Razorpay order" });
        }

        res.json({
            status: 'success',
            data: order,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// @desc    Verify Payment Signature (Optional but recommended security step)
// @route   POST /api/payment/verify
router.post('/verify', async (req, res) => {
    try {
        const crypto = require('crypto');
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            res.json({ status: 'success', message: 'Payment verified' });
        } else {
            res.status(400).json({ status: 'error', message: 'Invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Verification failed' });
    }
});

module.exports = router;
