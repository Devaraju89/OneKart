const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const testLogin = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/onekart';
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const email = 'customer@test.com';
        const password = 'password123';

        console.log(`Attempting login for ${email} with password: ${password}`);

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('❌ User not found in DB');
            process.exit(1);
        }

        console.log(`✅ User found: ${user.email}`);
        console.log(`Stored Hashed Password: ${user.password}`);

        const isMatch = await user.matchPassword(password);

        if (isMatch) {
            console.log('✅ Password MATCHES! Login Logic is correct.');
        } else {
            console.log('❌ Password DOES NOT MATCH. Hashing issue?');
        }

        process.exit();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

testLogin();
