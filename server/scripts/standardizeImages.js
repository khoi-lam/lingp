import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from '../models/Book.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const standardizeImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const newImageUrl = 'http://localhost:5000/uploads/standard_book_cover.png';

        const result = await Book.updateMany(
            {},
            { $set: { images: [newImageUrl] } }
        );

        console.log(`Updated ${result.modifiedCount} books with the new image.`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

standardizeImages();
