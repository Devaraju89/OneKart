const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Seller = require('./models/Seller');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkAndCreate = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/onekart';
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const email = 'dev@gmail.com';
        const password = 'password123';

        // Check if exists
        let user = await User.findOne({ email });
        let admin = await Admin.findOne({ email });
        let seller = await Seller.findOne({ email });

        if (user) console.log('Found in Users');
        if (admin) console.log('Found in Admins');
        if (seller) console.log('Found in Sellers');

        if (!user && !admin && !seller) {
            console.log(`User ${email} does not exist. Creating as CUSTOMER...`);
            user = await User.create({
                name: 'Dev User',
                email: email,
                password: password,
                role: 'customer',
                mobile: '9876543210'
            });
            console.log(`Created Customer: ${email} / ${password}`);
        } else {
            console.log('User already exists. Ensuring password is known...');
            // Optional: Update password if found
            if (user) {
                user.password = password;
                await user.save();
                console.log('Updated User password.');
            }
        }

        process.exit();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

checkAndCreate();
