const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({ category: 'Dairy' }).limit(2);
        products.forEach(p => {
            console.log(`Product: ${p.name}`);
            console.log(`URL: ${p.image_url}`);
        });
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
run();
