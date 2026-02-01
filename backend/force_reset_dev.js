const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User'); // Adjust path as needed

const forceReset = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/onekart';
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const email = 'dev@gmail.com';
        const newPassword = 'password123';

        // 1. Manually Hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 2. Direct Update (Bypassing Hooks)
        const result = await User.updateOne(
            { email: email },
            { $set: { password: hashedPassword } }
        );

        console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

        if (result.matchedCount === 0) {
            console.log('User not found! Creating now...');
            await User.create({
                name: 'Dev User',
                email: email,
                password: newPassword, // Will be hashed by hook
                role: 'customer',
                mobile: '9876543210'
            });
            console.log('User created.');
        } else {
            console.log(`Password for ${email} FORCE RESET to: ${newPassword}`);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

forceReset();
