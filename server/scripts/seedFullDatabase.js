import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from '../models/Book.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Vietnamese book data
const bookTitles = [
    'Đắc Nhân Tâm', 'Nhà Giả Kim', 'Tuổi Trẻ Đáng Giá Bao Nhiêu', 'Cà Phê Cùng Tony',
    'Sapiens: Lược Sử Loài Người', 'Atomic Habits', 'Tôi Tài Giỏi, Bạn Cũng Thế',
    'Nghệ Thuật Tinh Tế Của Việc Đếch Quan Tâm', 'Đời Ngắn Đừng Ngủ Dài',
    'Quẳng Gánh Lo Đi Và Vui Sống', 'Tư Duy Nhanh Và Chậm', 'Chiến Binh Cầu Vồng',
    'Bố Già', 'Mắt Biếc', 'Dế Mèn Phiêu Lưu Ký', 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
    'Cho Tôi Xin Một Vé Đi Tuổi Thơ', 'Totto-Chan Bên Cửa Sổ', 'Cây Cam Ngọt Của Tôi',
    'Nhật Ký Trong Tù', 'Số Đỏ', 'Lão Hạc', 'Chí Phèo', 'Vợ Nhặt',
    'Tắt Đèn', 'Hai Đứa Trẻ', 'Vang Bóng Một Thời', 'Nỗi Buồn Chiến Tranh',
    'Những Ngày Thơ Ấu', 'Đất Rừng Phương Nam', 'Rừng Xà Nu', 'Làng',
    'Gió Lạnh Đầu Mùa', 'Một Thời Đã Xa', 'Đêm Tái Sinh', 'Miền Đất Hứa',
    'Hồn Trương Ba Da Hàng Thịt', 'Vang Bóng Một Thời', 'Tôi Là Bêtô',
    'Cuộc Đời Của Pi', 'Harry Potter Và Hòn Đá Phù Thủy', 'Sherlock Holmes',
    'Thám Tử Lừng Danh Conan', 'Doraemon', 'Naruto', 'One Piece',
    'Dragon Ball', 'Thám Tử Kindaichi', 'Death Note', 'Fullmetal Alchemist'
];

const authors = [
    'Dale Carnegie', 'Paulo Coelho', 'Rosie Nguyễn', 'Tony Buổi Sáng',
    'Yuval Noah Harari', 'James Clear', 'Adam Khoo', 'Mark Manson',
    'Robin Sharma', 'Dale Carnegie', 'Daniel Kahneman', 'Andrea Hirata',
    'Mario Puzo', 'Nguyễn Nhật Ánh', 'Tô Hoài', 'Nguyễn Nhật Ánh',
    'Nguyễn Nhật Ánh', 'Tetsuko Kuroyanagi', 'José Mauro de Vasconcelos',
    'Hồ Chí Minh', 'Vũ Trọng Phụng', 'Nam Cao', 'Nam Cao', 'Kim Lân',
    'Ngô Tất Tố', 'Thạch Lam', 'Nguyễn Tuân', 'Bảo Ninh',
    'Nguyên Hồng', 'Sơn Nam', 'Nguyễn Trung Thành', 'Nguyễn Công Hoan',
    'Thạch Lam', 'Lê Lựu', 'Nguyễn Huy Thiệp', 'Nguyễn Huy Thiệp',
    'Lưu Quang Vũ', 'Nguyễn Tuân', 'Nguyễn Công Hoan',
    'Yann Martel', 'J.K. Rowling', 'Arthur Conan Doyle',
    'Aoyama Gosho', 'Fujiko F. Fujio', 'Masashi Kishimoto', 'Eiichiro Oda',
    'Akira Toriyama', 'Seimaru Amagi', 'Tsugumi Ohba', 'Hiromu Arakawa'
];

const publishers = [
    'NXB Trẻ', 'NXB Văn Học', 'NXB Hội Nhà Văn', 'NXB Tổng Hợp TPHCM',
    'NXB Kim Đồng', 'NXB Lao Động', 'NXB Phụ Nữ', 'NXB Thanh Niên',
    'NXB Đại Học Quốc Gia', 'NXB Chính Trị Quốc Gia', 'NXB Văn Hóa - Văn Nghệ',
    'NXB Thế Giới', 'First News', 'IPM', 'Alphabooks', 'Skybooks'
];

const descriptions = [
    'Cuốn sách hay nhất về phát triển bản thân và kỹ năng giao tiếp.',
    'Tác phẩm văn học kinh điển được yêu thích nhất mọi thời đại.',
    'Câu chuyện cảm động về tình yêu, tình bạn và gia đình.',
    'Hành trình khám phá bản thân và ý nghĩa cuộc sống.',
    'Kiến thức bổ ích giúp thay đổi tư duy và cuộc sống.',
    'Những bài học quý giá về thành công và hạnh phúc.',
    'Tác phẩm văn học Việt Nam đương đại xuất sắc.',
    'Cuốn sách dành cho mọi lứa tuổi, đầy cảm xúc và ý nghĩa.',
    'Kỹ năng sống thiết thực cho thế hệ trẻ.',
    'Tác phẩm kinh điển của văn học thế giới.'
];

// Helper function to create slug
const createSlug = (text, index) => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-') + `-${index}`;
};

const categories = {
    origins: [
        { name: 'Trong nước', description: 'Sách xuất bản trong nước' },
        { name: 'Nước ngoài', description: 'Sách dịch từ nước ngoài' }
    ],
    genres: [
        { name: 'Văn học', description: 'Tiểu thuyết, truyện ngắn, thơ ca' },
        { name: 'Kinh tế', description: 'Kinh doanh, tài chính, marketing' },
        { name: 'Kỹ năng sống', description: 'Phát triển bản thân, giao tiếp' },
        { name: 'Thiếu nhi', description: 'Sách dành cho trẻ em' },
        { name: 'Manga - Comic', description: 'Truyện tranh Nhật Bản' },
        { name: 'Tâm lý - Triết học', description: 'Tâm lý học, triết học' },
        { name: 'Lịch sử', description: 'Lịch sử Việt Nam và thế giới' },
        { name: 'Khoa học', description: 'Khoa học tự nhiên và xã hội' }
    ]
};

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore';
        console.log(`🔌 Connecting to MongoDB: ${mongoURI}`);
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('\n💡 Make sure MongoDB is running on your system');
        console.log('   Windows: Check Services for "MongoDB Server"');
        console.log('   Mac: brew services start mongodb-community');
        process.exit(1);
    }
};

// Copy default book cover
const setupDefaultImages = () => {
    const uploadsDir = path.join(__dirname, '../uploads/books');
    const sourceImage = path.join(__dirname, '../uploads/standard_book_cover.png');

    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Copy default image if exists
    if (fs.existsSync(sourceImage)) {
        const destImage = path.join(uploadsDir, 'default-book-cover.png');
        if (!fs.existsSync(destImage)) {
            fs.copyFileSync(sourceImage, destImage);
            console.log('✅ Default book cover copied');
        }
    }
};

// Generate random book data
const generateBook = (index, originCategories, genreCategories) => {
    const titleIndex = index % bookTitles.length;
    const authorIndex = index % authors.length;
    const publisherIndex = index % publishers.length;
    const descIndex = index % descriptions.length;

    const randomOrigin = originCategories[Math.floor(Math.random() * originCategories.length)];
    const randomGenre = genreCategories[Math.floor(Math.random() * genreCategories.length)];

    const basePrice = 50000 + (index * 1000);
    const price = Math.floor(basePrice / 1000) * 1000; // Round to thousands

    const title = `${bookTitles[titleIndex]} ${index > 49 ? `(Tập ${Math.floor(index / 50)})` : ''}`;

    return {
        title: title,
        slug: createSlug(title, index),
        author: authors[authorIndex],
        publisher: publishers[publisherIndex],
        description: descriptions[descIndex],
        price: price,
        stockQuantity: 50 + (index % 50),
        soldCount: index % 20,
        images: ['/uploads/books/default-book-cover.png'],
        categories: {
            origins: [randomOrigin._id],
            genres: [randomGenre._id]
        },
        isbn: `978-604-${String(index).padStart(6, '0')}`
    };
};

// Main seeding function
const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await Book.deleteMany({});
        await Category.deleteMany({});

        // Setup default images
        setupDefaultImages();

        // Create categories
        console.log('📁 Creating categories...');
        const originCategories = [];
        const genreCategories = [];

        for (const cat of categories.origins) {
            const created = await Category.create({
                ...cat,
                type: 'origin'
            });
            originCategories.push(created);
            console.log(`  ✓ Origin: ${cat.name}`);
        }

        for (const cat of categories.genres) {
            const created = await Category.create({
                ...cat,
                type: 'genre'
            });
            genreCategories.push(created);
            console.log(`  ✓ Genre: ${cat.name}`);
        }

        // Create 100 books
        console.log('\n📚 Creating 100 books...');
        const books = [];

        for (let i = 0; i < 100; i++) {
            const bookData = generateBook(i, originCategories, genreCategories);
            const book = await Book.create(bookData);
            books.push(book);

            if ((i + 1) % 10 === 0) {
                console.log(`  ✓ Created ${i + 1} books...`);
            }
        }

        // Create admin user if not exists
        console.log('\n👤 Checking admin user...');
        const adminExists = await User.findOne({ email: 'admin@bookstore.com' });

        if (!adminExists) {
            await User.create({
                email: 'admin@bookstore.com',
                password: 'admin123',
                name: 'Admin',
                role: 'admin'
            });
            console.log('  ✓ Admin user created (email: admin@bookstore.com, password: admin123)');
        } else {
            console.log('  ✓ Admin user already exists');
        }

        console.log('\n🎉 Seeding completed successfully!');
        console.log(`📊 Summary:`);
        console.log(`   - Categories: ${originCategories.length + genreCategories.length}`);
        console.log(`   - Books: ${books.length}`);
        console.log(`   - Default images: Ready`);
        console.log('\n💡 You can now run: npm run dev');

        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

// Run seeder
seedDatabase();
