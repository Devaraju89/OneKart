const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env from current directory
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('--- SEED SCRIPT START ---');
console.log('MONGO_URI:', process.env.MONGO_URI);

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/onekart';
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Define minimal schemas if models cause issues, but better to require them
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');
const Seller = require('./models/Seller');

const seed = async () => {
    await connectDB();

    try {
        // Create or Find User
        let user = await User.findOne({ email: 'customer@test.com' });
        if (!user) {
            console.log('Creating Test Customer...');
            user = await User.create({
                name: 'Test Customer',
                email: 'customer@test.com',
                password: 'password123',
                role: 'customer'
            });
        }

        // Create or Find Seller
        let seller = await Seller.findOne({ email: 'farmer@test.com' });
        if (!seller) {
            console.log('Creating Test Farmer...');
            seller = await Seller.create({
                name: 'Green Valley Farms',
                email: 'farmer@test.com',
                password: 'password123',
                role: 'farmer',
                status: 'active'
            });
        }

        // Create or Find Product
        let product = await Product.findOne({ name: 'Fresh Apples' });
        if (!product) {
            console.log('Creating Test Product...');
            product = await Product.create({
                user: seller._id, // legacy field
                seller: seller._id,
                name: 'Fresh Apples',
                image: '/images/apple.jpg',
                description: 'Crisp and sweet',
                brand: 'Farm Fresh',
                category: 'Fruits',
                price: 150,
                countInStock: 100,
                rating: 4.5,
                numReviews: 12
            });
        }

        console.log('Creating Test Order...');
        const order = await Order.create({
            user: user._id,
            orderItems: [
                {
                    name: product.name,
                    quantity: 5,
                    image: product.image,
                    price: product.price,
                    product: product._id,
                    seller: seller._id
                }
            ],
            shippingAddress: {
                address: '456 Orchard Lane',
                city: 'Shimla',
                postalCode: '171001',
                country: 'India',
                mobile: '9876543210'
            },
            paymentMethod: 'UPI',
            itemsPrice: 750,
            taxPrice: 37.5,
            shippingPrice: 0,
            totalPrice: 787.5,
            isPaid: true,
            paidAt: Date.now(),
            isDelivered: false,
            status: 'Processing'
        });

        console.log('--- ORDER CREATED SUCCESSFULLY ---');
        console.log('Order ID:', order._id);

        process.exit();
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seed();
