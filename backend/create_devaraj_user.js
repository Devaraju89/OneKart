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

        const email = 'devarajk@gmail.com';
        const password = '123456'; // Default 6 character password as typed in screenshot

        // 1. Create/Ensure Customer
        let customer = await User.findOne({ email });
        if (!customer) {
            console.log(`Creating Customer...`);
            await User.create({
                name: 'Devaraju Customer',
                email: email,
                password: password,
                mobile: '8179402925'
            });
            console.log(`Customer created successfully!`);
        } else {
            customer.password = password;
            await customer.save();
            console.log(`Customer password updated!`);
        }

        // 2. Create/Ensure Seller/Farmer
        let seller = await Seller.findOne({ email });
        if (!seller) {
            console.log(`Creating Seller...`);
            await Seller.create({
                name: 'Devaraju Farmer',
                email: email,
                password: password,
                mobile: '8179402925',
                businessName: 'Devaraju Organic Estates',
                address: 'Lovely Professional University, Punjab',
                status: 'active'
            });
            console.log(`Seller created successfully!`);
        } else {
            seller.password = password;
            await seller.save();
            console.log(`Seller password updated!`);
        }

        // 3. Create/Ensure Admin
        let admin = await Admin.findOne({ email });
        if (!admin) {
            console.log(`Creating Admin...`);
            await Admin.create({
                name: 'Devaraju Admin',
                email: email,
                password: password
            });
            console.log(`Admin created successfully!`);
        } else {
            admin.password = password;
            await admin.save();
            console.log(`Admin password updated!`);
        }

        console.log('Credentials configured successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

checkAndCreate();
