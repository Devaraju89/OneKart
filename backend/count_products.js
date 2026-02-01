const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const countProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Product.countDocuments({});
        require('fs').writeFileSync('product_count.txt', `Total Products: ${count}`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

countProducts();
