import mongoose from 'mongoose';
import fetch from 'node-fetch'; // or use global fetch in Node 18+
import Book from './models/Book.js';
import BookEmbedding from './models/BookEmbedding.js';
import dotenv from 'dotenv';

dotenv.config();

const HF_API_KEY = process.env.HF_API_KEY;

const generateEmbedding = async (text) => {
    try {
        const response = await fetch(
            'https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: text,
                    options: { wait_for_model: true }
                })
            }
        );

        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        return null;
    }
};

async function sync() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const books = await Book.find();
        console.log(`Checking ${books.length} books...`);

        for (const book of books) {
            const combinedText = `${book.title} ${book.author} ${book.description || ''}`;
            const embedding = await generateEmbedding(combinedText);

            if (embedding) {
                await BookEmbedding.findOneAndUpdate(
                    { bookId: book._id },
                    {
                        embedding,
                        textHash: 'system_update',
                        lastUpdated: new Date()
                    },
                    { upsert: true }
                );
                console.log(`Synced: ${book.title}`);
            }
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

sync();
