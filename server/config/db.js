import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        console.log('📦 MongoDB already connected');
        return;
    }

    try {
        const conn = await mongoose.connect(config.mongoUri, {
            // Mongoose 6+ không cần useNewUrlParser và useUnifiedTopology
        });

        isConnected = true;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
    isConnected = false;
});

mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB error: ${err.message}`);
});
