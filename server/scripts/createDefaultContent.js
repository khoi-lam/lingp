import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from '../models/Content.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const createDefaultContent = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Create default hero banner if it doesn't exist
        const heroBanner = await Content.findOne({ type: 'hero-banner' });

        if (!heroBanner) {
            await Content.create({
                type: 'hero-banner',
                content: {
                    images: [
                        'https://via.placeholder.com/1200x400/C81E2B/FFFFFF?text=Welcome+to+Bookstore',
                        'https://via.placeholder.com/1200x400/333333/FFFFFF?text=Discover+Amazing+Books'
                    ]
                }
            });
            console.log('✅ Created default hero banner');
        } else {
            console.log('ℹ️  Hero banner already exists');
        }

        // Create default about-us if it doesn't exist
        const aboutUs = await Content.findOne({ type: 'about-us' });

        if (!aboutUs) {
            await Content.create({
                type: 'about-us',
                content: {
                    data: '<h1>Về chúng tôi</h1><p>Chào mừng đến với Bookstore!</p>'
                }
            });
            console.log('✅ Created default about-us content');
        } else {
            console.log('ℹ️  About-us content already exists');
        }

        console.log('✅ All default content created successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createDefaultContent();
