import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';
import { generateSlug } from '../utils/slug.js';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
    { name: '3-5 tuổi', type: 'genre', description: 'Sách cho bé 3 đến 5 tuổi, hình ảnh nhiều, chữ ít' },
    { name: '6-8 tuổi', type: 'genre', description: 'Sách cho bé 6 đến 8 tuổi, câu chuyện đơn giản' },
    { name: '9-12 tuổi', type: 'genre', description: 'Sách cho bé 9 đến 12 tuổi, nội dung phong phú' },
    { name: 'Toàn bộ lứa tuổi', type: 'genre', description: 'Phù hợp cho mọi lứa tuổi' },
];

const books = [
    { title: 'Bé Học Chữ Cái - ABC Fun', author: 'LingoLand Studio', price: 89000, genre: '3-5 tuổi', description: 'Bé làm quen bảng chữ cái Tiếng Anh qua các nhân vật ngộ nghĩnh.', images: ['uploads/books/cover_abc.png', 'uploads/books/cover_colors.png'] },
    { title: 'Màu Sắc Kỳ Diệu - Magic Colors', author: 'LingoLand Studio', price: 79000, genre: '3-5 tuổi', description: 'Khám phá thế giới màu sắc cùng chú thỏ Bunny.', images: ['uploads/books/cover_colors.png', 'uploads/books/cover_abc.png'] },
    { title: 'Con Vật Quanh Em - My Animal Friends', author: 'LingoLand Studio', price: 85000, genre: '3-5 tuổi', description: 'Bé tìm hiểu về các con vật quen thuộc.', images: ['uploads/books/cover_animals.png', 'uploads/books/cover_counting.png'] },
    { title: 'Số Đếm Vui - Counting Fun 1-10', author: 'LingoLand Studio', price: 75000, genre: '3-5 tuổi', description: 'Học đếm từ 1 đến 10 qua truyện tranh song ngữ.', images: ['uploads/books/cover_counting.png', 'uploads/books/cover_animals.png'] },
    { title: 'Gia Đình Yêu Thương - My Lovely Family', author: 'LingoLand Studio', price: 82000, genre: '3-5 tuổi', description: 'Câu chuyện ấm áp về gia đình.', images: ['uploads/books/cover_family.png', 'uploads/books/cover_abc.png'] },
    { title: 'Phiêu Lưu Trong Rừng - Forest Adventure', author: 'LingoLand Studio', price: 105000, genre: '6-8 tuổi', description: 'Ba bạn nhỏ lạc trong khu rừng kỳ bí.', images: ['uploads/books/cover_forest.png', 'uploads/books/cover_superhero.png'] },
    { title: 'Bạn Tốt - Good Friends', author: 'LingoLand Studio', price: 95000, genre: '6-8 tuổi', description: 'Câu chuyện về tình bạn đẹp.', images: ['uploads/books/cover_superhero.png', 'uploads/books/cover_forest.png'] },
    { title: 'Siêu Anh Hùng Nhí - Little Superheroes', author: 'LingoLand Studio', price: 110000, genre: '6-8 tuổi', description: 'Các bạn nhỏ có siêu năng lực bảo vệ sân trường.', images: ['uploads/books/cover_superhero.png', 'uploads/books/cover_forest.png'] },
    { title: 'Hành Tinh Xanh - Planet Green', author: 'LingoLand Studio', price: 98000, genre: '6-8 tuổi', description: 'Bé học cách bảo vệ môi trường.', images: ['uploads/books/cover_forest.png', 'uploads/books/cover_family.png'] },
    { title: 'Khu Vườn Bí Mật - The Secret Garden', author: 'LingoLand Studio', price: 102000, genre: '6-8 tuổi', description: 'Bé Hoa phát hiện khu vườn phép thuật sau nhà.', images: ['uploads/books/cover_animals.png', 'uploads/books/cover_forest.png'] },
    { title: 'Lớp Học Vui - Happy Classroom', author: 'LingoLand Studio', price: 92000, genre: '6-8 tuổi', description: 'Một ngày ở trường với bạn bè và thầy cô.', images: ['uploads/books/cover_family.png', 'uploads/books/cover_superhero.png'] },
    { title: 'Thám Tử Nhí - Kid Detective', author: 'LingoLand Studio', price: 125000, genre: '9-12 tuổi', description: 'Chuỗi vụ án bí ẩn ở trường học đợi thám tử nhí giải mã.', images: ['uploads/books/cover_detective.png', 'uploads/books/cover_space.png'] },
    { title: 'Hành Trình Vũ Trụ - Space Journey', author: 'LingoLand Studio', price: 135000, genre: '9-12 tuổi', description: 'Du hành vũ trụ cùng phi hành đoàn nhí.', images: ['uploads/books/cover_space.png', 'uploads/books/cover_detective.png'] },
    { title: 'Truyền Thuyết Rồng Việt - Vietnamese Dragon Tales', author: 'LingoLand Studio', price: 128000, genre: '9-12 tuổi', description: 'Truyền thuyết Lạc Long Quân - Âu Cơ kể bằng truyện tranh song ngữ hiện đại.', images: ['uploads/books/cover_dragon.png', 'uploads/books/cover_vietnam.png'] },
    { title: 'Vòng Quanh Thế Giới - Around The World', author: 'LingoLand Studio', price: 145000, genre: '9-12 tuổi', description: 'Khám phá văn hóa các nước qua comic.', images: ['uploads/books/cover_vietnam.png', 'uploads/books/cover_dragon.png'] },
    { title: 'Nhà Phát Minh Nhí - Young Inventors', author: 'LingoLand Studio', price: 118000, genre: '9-12 tuổi', description: 'Các phát minh vĩ đại kể bằng truyện tranh.', images: ['uploads/books/cover_space.png', 'uploads/books/cover_dragon.png'] },
    { title: 'Bé Yêu Việt Nam - I Love Vietnam', author: 'LingoLand Studio', price: 115000, genre: 'Toàn bộ lứa tuổi', description: 'Khám phá đất nước Việt Nam qua tranh.', images: ['uploads/books/cover_vietnam.png', 'uploads/books/cover_feelings.png'] },
    { title: 'Bốn Mùa - Four Seasons', author: 'LingoLand Studio', price: 95000, genre: 'Toàn bộ lứa tuổi', description: 'Vẻ đẹp bốn mùa qua truyện tranh.', images: ['uploads/books/cover_feelings.png', 'uploads/books/cover_vietnam.png'] },
    { title: 'Nghề Nghiệp Tương Lai - Future Jobs', author: 'LingoLand Studio', price: 108000, genre: 'Toàn bộ lứa tuổi', description: 'Bé tìm hiểu các nghề nghiệp qua comic.', images: ['uploads/books/cover_family.png', 'uploads/books/cover_feelings.png'] },
    { title: 'Cảm Xúc Của Bé - My Feelings', author: 'LingoLand Studio', price: 88000, genre: 'Toàn bộ lứa tuổi', description: 'Giúp bé nhận biết và diễn đạt cảm xúc.', images: ['uploads/books/cover_feelings.png', 'uploads/books/cover_family.png'] },
];

async function seed() {
    try {
        console.log('🗑️  Clearing old data...');
        await prisma.bookGenre.deleteMany({});
        await prisma.orderItem.deleteMany({});
        await prisma.cartItem.deleteMany({});
        await prisma.book.deleteMany({});
        await prisma.category.deleteMany({});

        console.log('📂 Creating categories...');
        const catMap = {};
        for (const cat of categories) {
            const created = await prisma.category.create({
                data: { name: cat.name, type: cat.type, slug: generateSlug(cat.name), description: cat.description }
            });
            catMap[cat.name] = created.id;
            console.log(`  ✓ ${cat.name}`);
        }

        const origin = await prisma.category.create({
            data: { name: 'LingoLand', type: 'origin', slug: 'lingoland', description: 'Xuất bản bởi LingoLand Studio' }
        });

        console.log(`\n📚 Seeding ${books.length} bilingual comics...`);
        let success = 0;

        for (let i = 0; i < books.length; i++) {
            const b = books[i];
            try {
                await prisma.book.create({
                    data: {
                        title: b.title,
                        author: b.author,
                        price: b.price,
                        description: b.description,
                        publisher: 'LingoLand Studio',
                        images: b.images || [],
                        slug: generateSlug(b.title),
                        originId: origin.id,
                        genres: { create: [{ categoryId: catMap[b.genre] }] },
                        stockQuantity: 100,
                        soldCount: Math.floor(Math.random() * 50),
                    }
                });
                success++;
                console.log(`  ✓ [${i + 1}/${books.length}] ${b.title}`);
            } catch (err) {
                console.log(`  ❌ ${b.title}: ${err.message}`);
            }
        }

        console.log(`\n🎉 Done! ${success}/${books.length} books seeded.`);
        console.log(`📂 ${categories.length + 1} categories created.`);
    } catch (error) {
        console.error('❌ Seed error:', error);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

seed();
