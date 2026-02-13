import mongoose from 'mongoose';
import Book from '../models/Book.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const updateStockQuantity = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get all books
        const allBooks = await Book.find({});
        console.log(`📚 Found ${allBooks.length} books in database`);

        // Calculate 80% of books
        const targetCount = Math.floor(allBooks.length * 0.8);
        console.log(`🎯 Will update ${targetCount} books (80%) to have stock`);

        // Shuffle books randomly
        const shuffledBooks = allBooks.sort(() => Math.random() - 0.5);

        // Update first 80% to have stock (random quantity between 10-100)
        const booksToUpdate = shuffledBooks.slice(0, targetCount);
        const booksToSetZero = shuffledBooks.slice(targetCount);

        let updatedCount = 0;
        let zeroCount = 0;

        // Set stock for 80%
        for (const book of booksToUpdate) {
            const randomStock = Math.floor(Math.random() * 91) + 10; // 10-100
            await Book.findByIdAndUpdate(book._id, { stockQuantity: randomStock });
            updatedCount++;
        }

        // Set stock to 0 for remaining 20%
        for (const book of booksToSetZero) {
            await Book.findByIdAndUpdate(book._id, { stockQuantity: 0 });
            zeroCount++;
        }

        console.log(`✅ Updated ${updatedCount} books with stock (10-100 units)`);
        console.log(`✅ Set ${zeroCount} books to out of stock (0 units)`);

        // Verify
        const inStockCount = await Book.countDocuments({ stockQuantity: { $gt: 0 } });
        const outOfStockCount = await Book.countDocuments({ stockQuantity: 0 });

        console.log('\n📊 Final Statistics:');
        console.log(`   In Stock: ${inStockCount} (${((inStockCount / allBooks.length) * 100).toFixed(1)}%)`);
        console.log(`   Out of Stock: ${outOfStockCount} (${((outOfStockCount / allBooks.length) * 100).toFixed(1)}%)`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating stock quantities:', error);
        process.exit(1);
    }
};

updateStockQuantity();
