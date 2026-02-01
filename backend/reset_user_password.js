const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const resetPassword = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/onekart';
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const email = 'customer@test.com';
        const password = 'password123';

        let user = await User.findOne({ email });

        if (!user) {
            console.log('User not found, creating new...');
            user = new User({
                name: 'Test Customer',
                email: email,
                password: password,
                role: 'customer',
                mobile: '9999999999'
            });
        } else {
            console.log('User found, updating password...');
            user.password = password; // triggers pre('save') hook to hash
        }

        await user.save();
        console.log(`Password for ${email} has been reset to: ${password}`);
        process.exit();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

resetPassword();
