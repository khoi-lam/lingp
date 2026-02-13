import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const ensureAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'final_admin@gmail.com';
        const password = '12345678';
        const name = 'Final Admin';

        let user = await User.findOne({ email });

        if (user) {
            console.log('User exists, updating password and role...');
            user.password = password;
            user.role = 'admin';
            await user.save();
            console.log('Admin user updated successfully');
        } else {
            console.log('User does not exist, creating new admin...');
            await User.create({
                email,
                password,
                name,
                role: 'admin'
            });
            console.log('Admin user created successfully');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

ensureAdmin();
