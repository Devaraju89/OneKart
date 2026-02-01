const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Seller = require('./models/Seller');

dotenv.config();

const getSellers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const rang = await Seller.findOne({ name: 'Rang' });
        if (rang) {
            rang.status = 'active';
            await rang.save();
            console.log('Seller Rang approved.');
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

getSellers();
