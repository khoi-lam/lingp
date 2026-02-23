import path from 'path';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from '../models/Book.js';
import Category from '../models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
};

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const get = (u) => {
            const protocol = u.startsWith('https') ? https : http;
            protocol.get(u, (res) => {
                if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
                    return get(res.headers.location);
                }
                if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
                const stream = fs.createWriteStream(filepath);
                res.pipe(stream);
                stream.on('finish', () => { stream.close(); resolve(filepath); });
                stream.on('error', reject);
            }).on('error', reject);
        };
        get(url);
    });
};

// Book cover image sources — curated covers for various genres
const COVER_SETS = {
    'ngoai-ngu': [
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop',
    ],
    'sach-giao-khoa': [
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
    ],
    'van-hoc': [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    ],
    'khoa-hoc': [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=600&fit=crop',
    ],
    'manga': [
        'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1611457194403-d3f8c773c9c1?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop',
    ],
    'thieu-nhi': [
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1629992101753-56d196c8adf7?w=400&h=600&fit=crop',
    ],
    default: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop',
    ],
};

const seedImages = async () => {
    try {
        await connectDB();

        const uploadsDir = path.join(__dirname, '../uploads/books');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

        const books = await Book.find({}).populate('categories.genres');
        console.log(`📚 Found ${books.length} books to update`);

        let updated = 0;
        let failed = 0;

        for (let i = 0; i < books.length; i++) {
            const book = books[i];

            // Skip if already has a UNIQUE image (not default) and file exists
            if (book.images?.length > 0 && book.images[0] && !book.images[0].includes('default-book-cover')) {
                const imgPath = path.join(__dirname, '..', book.images[0].replace(/^\//, ''));
                if (fs.existsSync(imgPath)) {
                    console.log(`[${i + 1}/${books.length}] ✓ ${book.title.substring(0, 40)} — already has unique image`);
                    continue;
                }
            }

            try {
                // Pick image based on genre slug
                const genreSlug = book.categories?.genres?.[0]?.slug || 'default';
                const pool = COVER_SETS[genreSlug] || COVER_SETS.default;
                const imgUrl = pool[i % pool.length];

                const filename = `cover_${book._id}.jpg`;
                const filepath = path.join(uploadsDir, filename);
                const relPath = `uploads/books/${filename}`;

                await downloadImage(imgUrl, filepath);
                book.images = [relPath];
                await book.save();

                console.log(`[${i + 1}/${books.length}] ✅ ${book.title.substring(0, 40)} — image saved`);
                updated++;

                // Small delay to avoid rate limiting
                await new Promise(r => setTimeout(r, 300));
            } catch (err) {
                console.log(`[${i + 1}/${books.length}] ❌ ${book.title.substring(0, 40)} — ${err.message}`);
                failed++;
            }
        }

        console.log(`\n🎉 Image seeding complete!`);
        console.log(`✅ Updated: ${updated}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`⏩ Skipped (already had images): ${books.length - updated - failed}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

seedImages();
