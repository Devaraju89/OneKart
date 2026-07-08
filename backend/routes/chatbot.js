const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const Order = require('../models/Order');

// A concise helper to parse/search products locally in case of API fallback
const searchLocalProducts = (query, products) => {
    const term = query.toLowerCase();
    const matches = products.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
    if (matches.length > 0) {
        return `I found the following listings in our estate records for "${query}":\n\n` + 
            matches.slice(0, 3).map(p => 
                `🌿 **${p.name}**\n` +
                `- Price: ₹${p.price} per ${p.unit}\n` +
                `- Category: ${p.category}\n` +
                `- Available Stock: ${p.quantity} ${p.unit}\n` +
                `- Description: ${p.description}\n` +
                `- Seller: ${p.seller?.name || 'Organic Estate'}`
            ).join('\n\n');
    }
    return null;
};

// A helper to locate matching orders
const searchLocalOrders = (query, orders) => {
    if (!orders || orders.length === 0) {
        return "I found no records of your harvest orders in our ledgers. Pray, ensure you are logged into your estate account.";
    }

    const term = query.toLowerCase();
    // Try to find by order ID or specific product name in the order items
    let matchedOrder = null;

    if (orders.length === 1) {
        matchedOrder = orders[0];
    } else {
        matchedOrder = orders.find(o => 
            o._id.toString().toLowerCase().includes(term) ||
            o.orderItems.some(item => item.name.toLowerCase().includes(term))
        ) || orders[0]; // Default to most recent order if query is general
    }

    if (matchedOrder) {
        const itemsList = matchedOrder.orderItems.map(item => `• ${item.name} (${item.quantity} ${item.unit || 'kg'})`).join('\n');
        return `Here is the ledger entry for Order ID **${matchedOrder._id}**:\n\n` +
            `📅 **Date**: ${new Date(matchedOrder.createdAt).toLocaleDateString()}\n` +
            `📦 **Items**:\n${itemsList}\n` +
            `💰 **Total price**: ₹${matchedOrder.totalPrice}\n` +
            `🚚 **Current status**: **${matchedOrder.status}**\n` +
            `🎫 **Tracking number**: ${matchedOrder.trackingNumber || 'Not generated yet'}\n` +
            `💳 **Payment**: ${matchedOrder.paymentMethod} (${matchedOrder.isPaid ? 'Paid' : 'Unpaid'})`;
    }

    return null;
};

router.post('/', async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ success: false, message: 'Invalid messages array' });
    }

    // 1. Soft-Authenticate User (via JWT token)
    let userOrders = [];
    let userId = null;
    let userRole = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
            userRole = decoded.role;
        } catch (err) {
            console.log('Soft Auth token invalid');
        }
    }

    try {
        // 2. Fetch Context Data from DB
        const products = await Product.find({}).populate('seller', 'name businessName');

        if (userId) {
            if (userRole === 'admin') {
                userOrders = await Order.find({}).sort({ createdAt: -1 });
            } else if (userRole === 'farmer') {
                userOrders = await Order.find({ 'orderItems.seller': userId }).sort({ createdAt: -1 });
            } else {
                userOrders = await Order.find({ user: userId }).sort({ createdAt: -1 });
            }
        }

        const lastMessage = messages[messages.length - 1].content;

        // 3. Format Context for System Prompt
        const productsListText = products.map(p => 
            `- [Product ID: ${p._id}] Name: ${p.name}, Price: ₹${p.price}/${p.unit}, Category: ${p.category}, Stock: ${p.quantity} ${p.unit}, Seller: ${p.seller?.name || 'Unknown'}, Description: ${p.description}`
        ).join('\n');

        const ordersListText = userOrders.map(o => 
            `- [Order ID: ${o._id}] Date: ${new Date(o.createdAt).toLocaleDateString()}, Items: ${o.orderItems.map(item => `${item.name} (${item.quantity} ${item.unit || 'kg'})`).join(', ')}, Total: ₹${o.totalPrice}, Status: ${o.status}, Tracking Number: ${o.trackingNumber || 'Not Shipped yet'}, Payment: ${o.paymentMethod}`
        ).join('\n');

        const SYSTEM_PROMPT = `You are the OneKart Estate Guardian Assistant, a traditional, wise, and helpful AI assistant for OneKart (a heritage organic farmstead marketplace established in 2025).

Context from Database:
----------------------------------------
AVAILABLE PRODUCTS IN THE ESTATE:
${productsListText || 'No products listed yet.'}

USER'S HARVEST ORDER RECORD:
${userId ? (ordersListText || 'User has not placed any orders yet.') : 'User is a Guest (not logged in).'}
----------------------------------------

Your duties are:
- If the user asks about ANY products (price, availability, category, description, search), analyze the product list in the context and reply with exact details.
- If the user asks about order status, tracking, or order details, search their orders list in the context and provide their order item, status, total price, and tracking number.
- Explain the Organic Product Vetting Flow: Farmer registers -> Admin activates farmer -> Farmer lists product -> Admin audits quality -> Product goes live.
- Explain Order Tracking states: Pending -> Confirmed -> Processing -> Shipped (tracking reference number added) -> Out for Delivery -> Delivered.
- Refund rules: Cancelled orders go to "Processing" refund status. Once the user provides their UPI ID, the Admin processes the refund and marks it "Completed".

Tone: Polite, helpful, and mirrors the traditional heritage theme of OneKart. Keep replies concise, clean, and direct. Avoid extra markup.`;

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            // No API key: perform local parsing immediately
            return res.status(200).json({ success: true, reply: fallbackLocalAI(lastMessage, products, userOrders) });
        }

        // 4. Contact Anthropic API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                system: SYSTEM_PROMPT,
                messages: messages.map(m => ({
                    role: m.role === 'assistant' ? 'assistant' : 'user',
                    content: m.content
                }))
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.warn('Anthropic API limit/credit error (using Local AI fallback):', data);
            return res.status(200).json({ success: true, reply: fallbackLocalAI(lastMessage, products, userOrders) });
        }

        const reply = data.content?.[0]?.text || '';
        return res.status(200).json({ success: true, reply });

    } catch (error) {
        console.error('Chatbot API Route Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Fallback search algorithm if Claude fails or has no credits
function fallbackLocalAI(query, products, orders) {
    const lowerQuery = query.toLowerCase();

    // Check product queries
    const productResponse = searchLocalProducts(query, products);
    if (productResponse) return productResponse;

    // Check order queries
    if (lowerQuery.includes('order') || lowerQuery.includes('track') || lowerQuery.includes('status') || lowerQuery.includes('shipment') || lowerQuery.includes('my orders')) {
        return searchLocalOrders(query, orders);
    }

    // Check cancel/refund
    if (lowerQuery.includes('refund') || lowerQuery.includes('cancel') || lowerQuery.includes('money')) {
        return `Should a harvest order be Cancelled, our refund books are processed as follows:
1. The refund status transitions to **Processing**.
2. The purchaser provides their UPI ID for payment transfer.
3. The Admin processes and completes the refund, marking it as **Completed**.`;
    }

    // Check vetting flow
    if (lowerQuery.includes('vetting') || lowerQuery.includes('process') || lowerQuery.includes('listing') || lowerQuery.includes('flow')) {
        return `Here is the strict Vetting & Publication ledger for all organic harvests:
1. **Farmer Onboarding**: The farmer registers details (business name, address, mobile).
2. **Admin Approval**: The OneKart Admin team reviews the application and activates the account.
3. **Product Listing**: The verified farmer lists their crop.
4. **Purity Audit**: The Admin team audits the product details to verify organic authenticity.
5. **Marketplace Publication**: Once approved, the product goes live.`;
    }

    return `Greetings from the OneKart Organic Estate! I can assist you with the following:
- **Product Vetting**: Details on how we audit and list organic crops.
- **Product Search**: Type any product name (e.g., "Spinach", "Tomatoes", "Milk") to check its price and stock.
- **Order Tracking**: Type "Order" or "Track" to view your recent harvest delivery status.
- **Refunds**: Guidance on cancelled orders.`;
}

module.exports = router;
