import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Book from '../models/Book.js';
import Category from '../models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Mock book data (100 Vietnamese books)
const mockBooks = [
    // Văn học Việt Nam
    { title: 'Số Đỏ', author: 'Vũ Trọng Phụng', price: 85000, genre: 'Văn học', description: 'Tác phẩm kinh điển của văn học Việt Nam hiện đại' },
    { title: 'Chí Phèo', author: 'Nam Cao', price: 65000, genre: 'Văn học', description: 'Truyện ngắn nổi tiếng về số phận con người' },
    { title: 'Vợ Nhặt', author: 'Kim Lân', price: 55000, genre: 'Văn học', description: 'Câu chuyện cảm động về tình người' },
    { title: 'Tắt Đèn', author: 'Ngô Tất Tố', price: 95000, genre: 'Văn học', description: 'Bức tranh xã hội nông thôn đầu thế kỷ 20' },
    { title: 'Lão Hạc', author: 'Nam Cao', price: 60000, genre: 'Văn học', description: 'Truyện ngắn bi kịch về người nông dân nghèo' },

    // Tiểu thuyết hiện đại
    { title: 'Mắt Biếc', author: 'Nguyễn Nhật Ánh', price: 120000, genre: 'Tiểu thuyết', description: 'Chuyện tình tuổi học trò đầy cảm xúc' },
    { title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', author: 'Nguyễn Nhật Ánh', price: 115000, genre: 'Tiểu thuyết', description: 'Hồi ức tuổi thơ đẹp đẽ và day dứt' },
    { title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', author: 'Nguyễn Nhật Ánh', price: 110000, genre: 'Tiểu thuyết', description: 'Những kỷ niệm không thể quên' },
    { title: 'Cô Gái Đến Từ Hôm Qua', author: 'Nguyễn Nhật Ánh', price: 125000, genre: 'Tiểu thuyết', description: 'Câu chuyện tình yêu kỳ ảo' },
    { title: 'Tôi Là Bêtô', author: 'Nguyễn Nhật Ánh', price: 105000, genre: 'Tiểu thuyết', description: 'Cuộc phiêu lưu của cậu bé Bêtô' },

    // Kỹ năng sống
    { title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', price: 86000, genre: 'Kỹ năng sống', description: 'Nghệ thuật giao tiếp và ứng xử' },
    { title: 'Nghĩ Giàu Và Làm Giàu', author: 'Napoleon Hill', price: 95000, genre: 'Kỹ năng sống', description: 'Bí quyết thành công trong cuộc sống' },
    { title: 'Quẳng Gánh Lo Đi Và Vui Sống', author: 'Dale Carnegie', price: 82000, genre: 'Kỹ năng sống', description: 'Cách vượt qua lo lắng và căng thẳng' },
    { title: '7 Thói Quen Của Người Thành Đạt', author: 'Stephen Covey', price: 125000, genre: 'Kỹ năng sống', description: 'Những thói quen dẫn đến thành công' },
    { title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', author: 'Rosie Nguyễn', price: 78000, genre: 'Kỹ năng sống', description: 'Hành trình tự khám phá bản thân' },

    // Kinh tế - Khởi nghiệp
    { title: 'Khởi Nghiệp Tinh Gọn', author: 'Eric Ries', price: 135000, genre: 'Kinh tế', description: 'Phương pháp khởi nghiệp hiệu quả' },
    { title: 'Từ Tốt Đến Vĩ Đại', author: 'Jim Collins', price: 145000, genre: 'Kinh tế', description: 'Bí quyết xây dựng doanh nghiệp bền vững' },
    { title: 'Nghệ Thuật Bán Hàng', author: 'Brian Tracy', price: 98000, genre: 'Kinh tế', description: 'Kỹ năng bán hàng chuyên nghiệp' },
    { title: 'Marketing 4.0', author: 'Philip Kotler', price: 155000, genre: 'Kinh tế', description: 'Marketing trong kỷ nguyên số' },
    { title: 'Chiến Lược Đại Dương Xanh', author: 'W. Chan Kim', price: 165000, genre: 'Kinh tế', description: 'Tạo không gian thị trường mới' },

    // Tâm lý học
    { title: 'Tâm Lý Học Về Tiền', author: 'Morgan Housel', price: 128000, genre: 'Tâm lý học', description: 'Hiểu về hành vi tài chính' },
    { title: 'Nghệ Thuật Tư Duy', author: 'Rolf Dobelli', price: 115000, genre: 'Tâm lý học', description: 'Những sai lầm tư duy phổ biến' },
    { title: 'Tâm Lý Học Đám Đông', author: 'Gustave Le Bon', price: 92000, genre: 'Tâm lý học', description: 'Hành vi của con người trong tập thể' },
    { title: 'Hiểu Về Trái Tim', author: 'Minh Niệm', price: 108000, genre: 'Tâm lý học', description: 'Hành trình tìm hiểu bản thân' },
    { title: 'Dám Bị Ghét', author: 'Kishimi Ichiro', price: 118000, genre: 'Tâm lý học', description: 'Tự do sống theo cách của mình' },

    // Lịch sử
    { title: 'Sapiens: Lược Sử Loài Người', author: 'Yuval Noah Harari', price: 198000, genre: 'Lịch sử', description: 'Hành trình tiến hóa của loài người' },
    { title: 'Homo Deus', author: 'Yuval Noah Harari', price: 205000, genre: 'Lịch sử', description: 'Tương lai của nhân loại' },
    { title: '21 Bài Học Cho Thế Kỷ 21', author: 'Yuval Noah Harari', price: 185000, genre: 'Lịch sử', description: 'Những thách thức của thời đại mới' },
    { title: 'Lịch Sử Việt Nam Bằng Tranh', author: 'Trần Bạch Đằng', price: 245000, genre: 'Lịch sử', description: 'Lịch sử dân tộc qua tranh ảnh' },
    { title: 'Việt Nam Sử Lược', author: 'Trần Trọng Kim', price: 165000, genre: 'Lịch sử', description: 'Tổng quan lịch sử Việt Nam' },

    // Thiếu nhi
    { title: 'Dế Mèn Phiêu Lưu Ký', author: 'Tô Hoài', price: 75000, genre: 'Thiếu nhi', description: 'Cuộc phiêu lưu của chú dế mèn' },
    { title: 'Tôm Tôm Phiêu Lưu Ký', author: 'Tô Hoài', price: 68000, genre: 'Thiếu nhi', description: 'Hành trình của chú tôm nhỏ' },
    { title: 'Hoàng Tử Bé', author: 'Antoine de Saint-Exupéry', price: 88000, genre: 'Thiếu nhi', description: 'Câu chuyện cảm động về tình bạn' },
    { title: 'Nhật Ký Chú Bé Nhút Nhát', author: 'Jeff Kinney', price: 95000, genre: 'Thiếu nhi', description: 'Cuộc sống học đường hài hước' },
    { title: 'Thỏ Bảy Màu', author: 'Nguyễn Nhật Ánh', price: 72000, genre: 'Thiếu nhi', description: 'Những câu chuyện tuổi thơ' },

    // Triết học
    { title: 'Đạo Đức Kinh', author: 'Lão Tử', price: 65000, genre: 'Triết học', description: 'Triết lý sống của Đạo gia' },
    { title: 'Nghệ Thuật Sống', author: 'Thích Nhất Hạnh', price: 98000, genre: 'Triết học', description: 'Sống an lạc trong hiện tại' },
    { title: 'Tuệ Giác Của Trái Tim', author: 'Kahlil Gibran', price: 85000, genre: 'Triết học', description: 'Những suy ngẫm về cuộc sống' },
    { title: 'Đời Ngắn Đừng Ngủ Dài', author: 'Robin Sharma', price: 92000, genre: 'Triết học', description: 'Sống trọn vẹn từng khoảnh khắc' },
    { title: 'Hạnh Phúc Từ Suy Nghĩ', author: 'Dalai Lama', price: 105000, genre: 'Triết học', description: 'Con đường đến hạnh phúc' },

    // Khoa học
    { title: 'Vũ Trụ Trong Vỏ Hạt Dẻ', author: 'Stephen Hawking', price: 145000, genre: 'Khoa học', description: 'Khám phá bí ẩn vũ trụ' },
    { title: 'Lược Sử Thời Gian', author: 'Stephen Hawking', price: 155000, genre: 'Khoa học', description: 'Hành trình từ Big Bang đến hố đen' },
    { title: 'Vật Lý Đại Cương', author: 'Halliday & Resnick', price: 285000, genre: 'Khoa học', description: 'Giáo trình vật lý cơ bản' },
    { title: 'Sinh Học Phân Tử', author: 'Bruce Alberts', price: 325000, genre: 'Khoa học', description: 'Cơ sở sinh học phân tử' },
    { title: 'Hóa Học Hữu Cơ', author: 'John McMurry', price: 295000, genre: 'Khoa học', description: 'Giáo trình hóa hữu cơ' },

    // Ngoại ngữ
    { title: 'English Grammar In Use', author: 'Raymond Murphy', price: 165000, genre: 'Ngoại ngữ', description: 'Ngữ pháp tiếng Anh cơ bản' },
    { title: '999 Câu Tiếng Anh Giao Tiếp', author: 'Lê Văn Sự', price: 88000, genre: 'Ngoại ngữ', description: 'Tiếng Anh giao tiếp hàng ngày' },
    { title: 'TOEIC 990', author: 'Hackers', price: 195000, genre: 'Ngoại ngữ', description: 'Luyện thi TOEIC hiệu quả' },
    { title: 'IELTS Cambridge 18', author: 'Cambridge', price: 215000, genre: 'Ngoại ngữ', description: 'Đề thi IELTS chính thức' },
    { title: 'Tiếng Nhật Cho Mọi Người', author: 'Minna No Nihongo', price: 145000, genre: 'Ngoại ngữ', description: 'Giáo trình tiếng Nhật cơ bản' },

    // Thêm 50 sách nữa để đủ 100
    { title: 'Nhà Giả Kim', author: 'Paulo Coelho', price: 79000, genre: 'Tiểu thuyết', description: 'Hành trình tìm kiếm kho báu' },
    { title: 'Alchemist', author: 'Paulo Coelho', price: 85000, genre: 'Tiểu thuyết', description: 'The Alchemist - English version' },
    { title: 'Cà Phê Cùng Tony', author: 'Tony Buổi Sáng', price: 68000, genre: 'Kỹ năng sống', description: 'Những suy ngẫm về cuộc sống' },
    { title: 'Trên Đường Băng', author: 'Tony Buổi Sáng', price: 72000, genre: 'Kỹ năng sống', description: 'Hành trình khởi nghiệp' },
    { title: 'Muôn Kiếp Nhân Sinh', author: 'Nguyên Phong', price: 158000, genre: 'Tâm linh', description: 'Hành trình của linh hồn' },
    { title: 'Sống Chậm Lại', author: 'Hae Min Sunim', price: 95000, genre: 'Tâm linh', description: 'Nghệ thuật sống chậm' },
    { title: 'Không Diệt Không Sinh', author: 'Thích Nhất Hạnh', price: 108000, genre: 'Tâm linh', description: 'Triết lý Phật giáo' },
    { title: 'Bước Chậm Lại Giữa Thế Gian Vội Vã', author: 'Hae Min Sunim', price: 98000, genre: 'Tâm linh', description: 'Sống an nhiên trong hiện tại' },
    { title: 'Thiền Định Mỗi Ngày', author: 'Thích Nhất Hạnh', price: 85000, genre: 'Tâm linh', description: 'Thực hành thiền trong cuộc sống' },
    { title: 'Nghệ Thuật Yêu', author: 'Erich Fromm', price: 92000, genre: 'Tâm lý học', description: 'Bản chất của tình yêu' },
    { title: 'Tâm Lý Học Tính Cách', author: 'Carl Jung', price: 135000, genre: 'Tâm lý học', description: 'Phân tích tính cách con người' },
    { title: 'Trí Tuệ Cảm Xúc', author: 'Daniel Goleman', price: 125000, genre: 'Tâm lý học', description: 'EQ quan trọng hơn IQ' },
    { title: 'Tư Duy Nhanh Và Chậm', author: 'Daniel Kahneman', price: 168000, genre: 'Tâm lý học', description: 'Hai hệ thống tư duy' },
    { title: 'Atomic Habits', author: 'James Clear', price: 145000, genre: 'Kỹ năng sống', description: 'Thay đổi tí hon hiệu quả bất ngờ' },
    { title: 'Deep Work', author: 'Cal Newport', price: 138000, genre: 'Kỹ năng sống', description: 'Làm việc chuyên sâu hiệu quả' },
    { title: 'Essentialism', author: 'Greg McKeown', price: 128000, genre: 'Kỹ năng sống', description: 'Nghệ thuật sống tối giản' },
    { title: 'The Lean Startup', author: 'Eric Ries', price: 142000, genre: 'Kinh tế', description: 'Khởi nghiệp tinh gọn' },
    { title: 'Zero To One', author: 'Peter Thiel', price: 155000, genre: 'Kinh tế', description: 'Từ 0 đến 1 trong khởi nghiệp' },
    { title: 'The Hard Thing About Hard Things', author: 'Ben Horowitz', price: 165000, genre: 'Kinh tế', description: 'Những điều khó trong kinh doanh' },
    { title: 'Hooked', author: 'Nir Eyal', price: 135000, genre: 'Kinh tế', description: 'Tạo sản phẩm gây nghiện' },
    { title: 'Traction', author: 'Gabriel Weinberg', price: 148000, genre: 'Kinh tế', description: 'Tăng trưởng cho startup' },
    { title: 'The Mom Test', author: 'Rob Fitzpatrick', price: 125000, genre: 'Kinh tế', description: 'Cách nói chuyện với khách hàng' },
    { title: 'Sprint', author: 'Jake Knapp', price: 138000, genre: 'Kinh tế', description: 'Giải quyết vấn đề trong 5 ngày' },
    { title: 'Measure What Matters', author: 'John Doerr', price: 155000, genre: 'Kinh tế', description: 'OKRs - Mục tiêu và kết quả then chốt' },
    { title: 'The Innovators Dilemma', author: 'Clayton Christensen', price: 168000, genre: 'Kinh tế', description: 'Thách thức của đổi mới' },
    { title: 'Crossing The Chasm', author: 'Geoffrey Moore', price: 145000, genre: 'Kinh tế', description: 'Vượt qua khoảng trống thị trường' },
    { title: 'The Art of War', author: 'Sun Tzu', price: 75000, genre: 'Triết học', description: 'Binh pháp Tôn Tử' },
    { title: '36 Kế', author: 'Tác giả không rõ', price: 68000, genre: 'Triết học', description: '36 kế binh pháp Trung Hoa' },
    { title: 'Tam Quốc Diễn Nghĩa', author: 'La Quán Trung', price: 185000, genre: 'Văn học', description: 'Tiểu thuyết lịch sử Trung Quốc' },
    { title: 'Thủy Hử', author: 'Thi Nại Am', price: 175000, genre: 'Văn học', description: '108 anh hùng Lương Sơn Bạc' },
    { title: 'Tây Du Ký', author: 'Ngô Thừa Ân', price: 165000, genre: 'Văn học', description: 'Hành trình Tây Thiên thỉnh kinh' },
    { title: 'Hồng Lâu Mộng', author: 'Tào Tuyết Cần', price: 195000, genre: 'Văn học', description: 'Tứ đại danh tác Trung Hoa' },
    { title: 'Chiến Tranh Và Hòa Bình', author: 'Leo Tolstoy', price: 245000, genre: 'Văn học', description: 'Kiệt tác văn học thế giới' },
    { title: 'Anna Karenina', author: 'Leo Tolstoy', price: 215000, genre: 'Văn học', description: 'Bi kịch tình yêu' },
    { title: 'Tội Ác Và Hình Phạt', author: 'Fyodor Dostoevsky', price: 198000, genre: 'Văn học', description: 'Tâm lý tội phạm sâu sắc' },
    { title: 'Anh Em Nhà Karamazov', author: 'Fyodor Dostoevsky', price: 225000, genre: 'Văn học', description: 'Tác phẩm triết học vĩ đại' },
    { title: '1984', author: 'George Orwell', price: 125000, genre: 'Văn học', description: 'Tiểu thuyết phản địa đàng' },
    { title: 'Trại Súc Vật', author: 'George Orwell', price: 95000, genre: 'Văn học', description: 'Ngụ ngôn chính trị' },
    { title: 'Ông Già Và Biển Cả', author: 'Ernest Hemingway', price: 88000, genre: 'Văn học', description: 'Ý chí kiên cường của con người' },
    { title: 'Vĩ Tuyến Không Độ', author: 'Hemingway', price: 105000, genre: 'Văn học', description: 'Chiến tranh và tình yêu' },
    { title: 'Những Người Khốn Khổ', author: 'Victor Hugo', price: 235000, genre: 'Văn học', description: 'Bi kịch xã hội Pháp' },
    { title: 'Nhà Thờ Đức Bà Paris', author: 'Victor Hugo', price: 185000, genre: 'Văn học', description: 'Tình yêu và số phận' },
    { title: 'Bà Bovary', author: 'Gustave Flaubert', price: 145000, genre: 'Văn học', description: 'Chân dung người phụ nữ' },
    { title: 'Đồi Gió Hú', author: 'Emily Brontë', price: 135000, genre: 'Văn học', description: 'Tình yêu và thù hận' },
    { title: 'Kiêu Hãnh Và Định Kiến', author: 'Jane Austen', price: 145000, genre: 'Văn học', description: 'Tình yêu vượt qua định kiến' },
    { title: 'Jane Eyre', author: 'Charlotte Brontë', price: 155000, genre: 'Văn học', description: 'Hành trình tìm kiếm tình yêu' },
    { title: 'Những Tấm Lòng Cao Cả', author: 'Edmondo De Amicis', price: 98000, genre: 'Thiếu nhi', description: 'Nhật ký của cậu bé' },
    { title: 'Cuộc Phiêu Lưu Của Tom Sawyer', author: 'Mark Twain', price: 108000, genre: 'Thiếu nhi', description: 'Tuổi thơ phiêu lưu' },
    { title: 'Những Cuộc Phiêu Lưu Của Huckleberry Finn', author: 'Mark Twain', price: 115000, genre: 'Thiếu nhi', description: 'Hành trình trên sông Mississippi' },
    { title: 'Alice Ở Xứ Sở Thần Tiên', author: 'Lewis Carroll', price: 95000, genre: 'Thiếu nhi', description: 'Thế giới kỳ ảo' },
    { title: 'Harry Potter Và Hòn Đá Phù Thủy', author: 'J.K. Rowling', price: 185000, genre: 'Thiếu nhi', description: 'Phép thuật và phiêu lưu' }
];

const seedMockBooks = async () => {
    try {
        await connectDB();

        console.log(`📚 Preparing to seed ${mockBooks.length} books...`);

        // Get or create categories
        const categories = {};
        const genres = [...new Set(mockBooks.map(b => b.genre))];

        for (const genreName of genres) {
            let genre = await Category.findOne({ name: genreName });
            if (!genre) {
                genre = await Category.create({
                    name: genreName,
                    type: 'genre',
                    description: `Thể loại ${genreName}`
                });
            }
            categories[genreName] = genre._id;
        }

        // Create origin category
        let vnOrigin = await Category.findOne({ name: 'Trong nước' });
        if (!vnOrigin) {
            vnOrigin = await Category.create({
                name: 'Trong nước',
                type: 'origin',
                description: 'Sách trong nước'
            });
        }

        // Seed books
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < mockBooks.length; i++) {
            const bookData = mockBooks[i];

            try {
                await Book.create({
                    title: bookData.title,
                    author: bookData.author,
                    price: bookData.price,
                    description: bookData.description,
                    publisher: 'Nhà Xuất Bản Văn Học',
                    images: [],
                    categories: {
                        origins: [vnOrigin._id],
                        genres: [categories[bookData.genre]]
                    },
                    stock: 50,
                    soldCount: Math.floor(Math.random() * 100)
                });

                successCount++;
                if ((i + 1) % 10 === 0) {
                    console.log(`✓ Seeded ${i + 1}/${mockBooks.length} books...`);
                }
            } catch (error) {
                console.log(`❌ Failed to create book ${i + 1}: ${error.message}`);
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

seedMockBooks();
