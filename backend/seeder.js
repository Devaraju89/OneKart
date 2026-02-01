const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users');
const admins = require('./data/admins');
const sellers = require('./data/sellers');
const products = require('./data/products');

const User = require('./models/User');
const Admin = require('./models/Admin');
const Seller = require('./models/Seller');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Admin.deleteMany();
        await Seller.deleteMany();

        await User.create(users);
        await Admin.create(admins);
        const createdSellers = await Seller.create(sellers);

        const sampleProducts = products.map((product) => {
            const seller = createdSellers[product.sellerIndex || 0];
            return { ...product, seller: seller._id };
        });

        await Product.create(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Admin.deleteMany();
        await Seller.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
