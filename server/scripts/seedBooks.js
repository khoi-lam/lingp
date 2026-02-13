import fs from 'fs';
import path from 'path';
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

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Download image from URL
const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filepath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve(filepath);
            });

            fileStream.on('error', (err) => {
                fs.unlink(filepath, () => { });
                reject(err);
            });
        }).on('error', reject);
    });
};

// Seed books from JSON
const seedBooks = async () => {
    try {
        await connectDB();

        // Read JSON file
        const jsonPath = path.join(__dirname, 'scraper/fahasa_books.json');

        if (!fs.existsSync(jsonPath)) {
            console.error('❌ fahasa_books.json not found!');
            console.log('Please run: python server/scripts/scraper/fahasa_scraper.py');
            process.exit(1);
        }

        const booksData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        console.log(`📚 Found ${booksData.length} books to seed`);

        // Ensure uploads directory exists
        const uploadsDir = path.join(__dirname, '../uploads/books');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Get or create default categories
        let vnCategory = await Category.findOne({ name: 'Trong nước' });
        if (!vnCategory) {
            vnCategory = await Category.create({
                name: 'Trong nước',
                type: 'origin',
                description: 'Sách trong nước'
            });
        }

        let literatureGenre = await Category.findOne({ name: 'Văn học' });
        if (!literatureGenre) {
            literatureGenre = await Category.create({
                name: 'Văn học',
                type: 'genre',
                description: 'Thể loại văn học'
            });
        }

        // Seed each book
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < booksData.length; i++) {
            const bookData = booksData[i];

            try {
                console.log(`\n[${i + 1}/${booksData.length}] Processing: ${bookData.title.substring(0, 50)}...`);

                // Download image
                let imagePath = null;
                if (bookData.image_url) {
                    try {
                        const imageFilename = `book_${Date.now()}_${i}.jpg`;
                        const imageFullPath = path.join(uploadsDir, imageFilename);

                        await downloadImage(bookData.image_url, imageFullPath);
                        imagePath = `/uploads/books/${imageFilename}`;
                        console.log(`  ✓ Image downloaded`);
                    } catch (imgError) {
                        console.log(`  ⚠️  Image download failed: ${imgError.message}`);
                    }
                }

                // Create book
                const book = await Book.create({
                    title: bookData.title,
                    author: bookData.author,
                    price: bookData.price,
                    description: bookData.description,
                    publisher: bookData.publisher,
                    images: imagePath ? [imagePath] : [],
                    categories: {
                        origins: [vnCategory._id],
                        genres: [literatureGenre._id]
                    },
                    stock: bookData.stock || 50,
                    soldCount: bookData.soldCount || 0
                });

                console.log(`  ✅ Book created: ${book._id}`);
                successCount++;

            } catch (error) {
                console.log(`  ❌ Failed to create book: ${error.message}`);
                failCount++;
            }
        }

        console.log(`\n🎉 Seeding complete!`);
        console.log(`✅ Success: ${successCount} books`);
        console.log(`❌ Failed: ${failCount} books`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

// Run seeder
seedBooks();
