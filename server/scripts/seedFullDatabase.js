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
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// ── 10 Genre Categories ──
const genreList = [
    { name: 'Văn học Việt Nam', description: 'Tiểu thuyết, truyện ngắn, thơ Việt Nam' },
    { name: 'Văn học nước ngoài', description: 'Tiểu thuyết, truyện ngắn quốc tế dịch sang tiếng Việt' },
    { name: 'Kinh tế - Quản trị', description: 'Kinh doanh, tài chính, marketing, leadership' },
    { name: 'Tâm lý - Kỹ năng sống', description: 'Phát triển bản thân, giao tiếp, tư duy' },
    { name: 'Thiếu nhi', description: 'Truyện thiếu nhi, sách giáo dục cho trẻ em' },
    { name: 'Manga - Comic', description: 'Truyện tranh Nhật Bản, webtoon, comic phương Tây' },
    { name: 'Khoa học - Công nghệ', description: 'Khoa học tự nhiên, CNTT, kỹ thuật' },
    { name: 'Lịch sử - Địa lý', description: 'Lịch sử Việt Nam và thế giới, du lịch, khám phá' },
    { name: 'Sách giáo khoa - Tham khảo', description: 'Giáo trình, sách tham khảo, luyện thi' },
    { name: 'Ngoại ngữ', description: 'Sách học tiếng Anh, Nhật, Hàn, Trung' },
];

const originList = [
    { name: 'Trong nước', description: 'Sách xuất bản trong nước' },
    { name: 'Nước ngoài', description: 'Sách dịch từ nước ngoài' },
];

// ── 150 Books Data ──
const booksData = [
    // === Văn học Việt Nam (0) ===
    { title: 'Mắt Biếc', author: 'Nguyễn Nhật Ánh', g: 0, o: 0 },
    { title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', author: 'Nguyễn Nhật Ánh', g: 0, o: 0 },
    { title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', author: 'Nguyễn Nhật Ánh', g: 0, o: 0 },
    { title: 'Tôi Là Bêtô', author: 'Nguyễn Nhật Ánh', g: 0, o: 0 },
    { title: 'Cà Phê Cùng Tony', author: 'Tony Buổi Sáng', g: 0, o: 0 },
    { title: 'Dế Mèn Phiêu Lưu Ký', author: 'Tô Hoài', g: 0, o: 0 },
    { title: 'Số Đỏ', author: 'Vũ Trọng Phụng', g: 0, o: 0 },
    { title: 'Chí Phèo', author: 'Nam Cao', g: 0, o: 0 },
    { title: 'Lão Hạc', author: 'Nam Cao', g: 0, o: 0 },
    { title: 'Vợ Nhặt', author: 'Kim Lân', g: 0, o: 0 },
    { title: 'Tắt Đèn', author: 'Ngô Tất Tố', g: 0, o: 0 },
    { title: 'Nỗi Buồn Chiến Tranh', author: 'Bảo Ninh', g: 0, o: 0 },
    { title: 'Đất Rừng Phương Nam', author: 'Đoàn Giỏi', g: 0, o: 0 },
    { title: 'Những Ngày Thơ Ấu', author: 'Nguyên Hồng', g: 0, o: 0 },
    { title: 'Hồn Trương Ba Da Hàng Thịt', author: 'Lưu Quang Vũ', g: 0, o: 0 },
    // === Văn học nước ngoài (1) ===
    { title: 'Nhà Giả Kim', author: 'Paulo Coelho', g: 1, o: 1 },
    { title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', g: 1, o: 1 },
    { title: 'Hoàng Tử Bé', author: 'Antoine de Saint-Exupéry', g: 1, o: 1 },
    { title: 'Cuộc Đời Của Pi', author: 'Yann Martel', g: 1, o: 1 },
    { title: '1984', author: 'George Orwell', g: 1, o: 1 },
    { title: 'Rừng Na Uy', author: 'Murakami Haruki', g: 1, o: 1 },
    { title: 'Kafka Bên Bờ Biển', author: 'Murakami Haruki', g: 1, o: 1 },
    { title: 'Totto-Chan Bên Cửa Sổ', author: 'Tetsuko Kuroyanagi', g: 1, o: 1 },
    { title: 'Cây Cam Ngọt Của Tôi', author: 'José Mauro de Vasconcelos', g: 1, o: 1 },
    { title: 'Bố Già', author: 'Mario Puzo', g: 1, o: 1 },
    { title: 'Chiến Binh Cầu Vồng', author: 'Andrea Hirata', g: 1, o: 1 },
    { title: 'Đại Gia Gatsby', author: 'F. Scott Fitzgerald', g: 1, o: 1 },
    { title: 'Giết Con Chim Nhại', author: 'Harper Lee', g: 1, o: 1 },
    { title: 'Trăm Năm Cô Đơn', author: 'Gabriel García Márquez', g: 1, o: 1 },
    { title: 'Biên Niên Ký Chim Vặn Dây Cót', author: 'Murakami Haruki', g: 1, o: 1 },
    // === Kinh tế - Quản trị (2) ===
    { title: 'Nghĩ Giàu Làm Giàu', author: 'Napoleon Hill', g: 2, o: 1 },
    { title: 'Cha Giàu Cha Nghèo', author: 'Robert Kiyosaki', g: 2, o: 1 },
    { title: 'Từ Tốt Đến Vĩ Đại', author: 'Jim Collins', g: 2, o: 1 },
    { title: 'Khởi Nghiệp Tinh Gọn', author: 'Eric Ries', g: 2, o: 1 },
    { title: 'Quốc Gia Khởi Nghiệp', author: 'Dan Senor & Saul Singer', g: 2, o: 1 },
    { title: 'Tuần Làm Việc 4 Giờ', author: 'Tim Ferriss', g: 2, o: 1 },
    { title: '7 Thói Quen Hiệu Quả', author: 'Stephen Covey', g: 2, o: 1 },
    { title: 'Người Bán Hàng Vĩ Đại Nhất Thế Giới', author: 'Og Mandino', g: 2, o: 1 },
    { title: 'Marketing Căn Bản', author: 'Philip Kotler', g: 2, o: 1 },
    { title: 'Chiến Lược Đại Dương Xanh', author: 'W. Chan Kim', g: 2, o: 1 },
    { title: 'Đầu Tư Thông Minh', author: 'Benjamin Graham', g: 2, o: 1 },
    { title: 'Zero To One', author: 'Peter Thiel', g: 2, o: 1 },
    { title: 'Dẫn Dắt Sự Thay Đổi', author: 'John Kotter', g: 2, o: 1 },
    { title: 'Tài Chính Cá Nhân Cho Người Việt', author: 'Lâm Minh Chánh', g: 2, o: 0 },
    { title: 'Bí Quyết Gây Dựng Cơ Nghiệp', author: 'David Green', g: 2, o: 1 },
    // === Tâm lý - Kỹ năng sống (3) ===
    { title: 'Atomic Habits', author: 'James Clear', g: 3, o: 1 },
    { title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', author: 'Rosie Nguyễn', g: 3, o: 0 },
    { title: 'Nghệ Thuật Tinh Tế Của Việc Đếch Quan Tâm', author: 'Mark Manson', g: 3, o: 1 },
    { title: 'Đời Ngắn Đừng Ngủ Dài', author: 'Robin Sharma', g: 3, o: 1 },
    { title: 'Quẳng Gánh Lo Đi Và Vui Sống', author: 'Dale Carnegie', g: 3, o: 1 },
    { title: 'Tư Duy Nhanh Và Chậm', author: 'Daniel Kahneman', g: 3, o: 1 },
    { title: 'Sức Mạnh Của Thói Quen', author: 'Charles Duhigg', g: 3, o: 1 },
    { title: 'Đọc Vị Bất Kỳ Ai', author: 'David J. Lieberman', g: 3, o: 1 },
    { title: 'Tôi Tài Giỏi Bạn Cũng Thế', author: 'Adam Khoo', g: 3, o: 1 },
    { title: 'Làm Ít Được Nhiều', author: 'Leo Babauta', g: 3, o: 1 },
    { title: 'Người Giỏi Không Phải Người Làm Tất Cả', author: 'Bùi Thế Anh', g: 3, o: 0 },
    { title: 'Sống Thực Tế Giữa Đời Thực Dụng', author: 'Mễ Mông', g: 3, o: 1 },
    { title: 'Dám Nghĩ Lớn', author: 'David J. Schwartz', g: 3, o: 1 },
    { title: 'Con Đường Ít Người Đi', author: 'M. Scott Peck', g: 3, o: 1 },
    { title: 'Cảm Ơn Vì Đã Đến Muộn', author: 'Hà Thanh Phúc', g: 3, o: 0 },
    // === Thiếu nhi (4) ===
    { title: 'Harry Potter Và Hòn Đá Phù Thủy', author: 'J.K. Rowling', g: 4, o: 1 },
    { title: 'Harry Potter Và Phòng Chứa Bí Mật', author: 'J.K. Rowling', g: 4, o: 1 },
    { title: 'Harry Potter Và Tên Tù Nhân Azkaban', author: 'J.K. Rowling', g: 4, o: 1 },
    { title: 'Harry Potter Và Chiếc Cốc Lửa', author: 'J.K. Rowling', g: 4, o: 1 },
    { title: 'Charlie Và Nhà Máy Sô-Cô-La', author: 'Roald Dahl', g: 4, o: 1 },
    { title: 'Cậu Bé Rừng Xanh', author: 'Rudyard Kipling', g: 4, o: 1 },
    { title: 'Chuyện Con Mèo Dạy Hải Âu Bay', author: 'Luis Sepúlveda', g: 4, o: 1 },
    { title: 'Nhóc Nicolas', author: 'René Goscinny', g: 4, o: 1 },
    { title: 'Pippi Tất Dài', author: 'Astrid Lindgren', g: 4, o: 1 },
    { title: 'Đô Rê Mon Tập 1', author: 'Fujiko F. Fujio', g: 4, o: 1 },
    { title: 'Đô Rê Mon Tập 2', author: 'Fujiko F. Fujio', g: 4, o: 1 },
    { title: 'Đô Rê Mon Tập 3', author: 'Fujiko F. Fujio', g: 4, o: 1 },
    { title: 'Shin - Cậu Bé Bút Chì Tập 1', author: 'Yoshito Usui', g: 4, o: 1 },
    { title: 'Doremon Truyện Dài Tập 1', author: 'Fujiko F. Fujio', g: 4, o: 1 },
    { title: 'Matilda', author: 'Roald Dahl', g: 4, o: 1 },
    // === Manga - Comic (5) ===
    { title: 'Thám Tử Lừng Danh Conan Tập 1', author: 'Aoyama Gosho', g: 5, o: 1 },
    { title: 'Thám Tử Lừng Danh Conan Tập 2', author: 'Aoyama Gosho', g: 5, o: 1 },
    { title: 'Thám Tử Lừng Danh Conan Tập 3', author: 'Aoyama Gosho', g: 5, o: 1 },
    { title: 'One Piece Tập 1', author: 'Eiichiro Oda', g: 5, o: 1 },
    { title: 'One Piece Tập 2', author: 'Eiichiro Oda', g: 5, o: 1 },
    { title: 'One Piece Tập 3', author: 'Eiichiro Oda', g: 5, o: 1 },
    { title: 'Naruto Tập 1', author: 'Masashi Kishimoto', g: 5, o: 1 },
    { title: 'Naruto Tập 2', author: 'Masashi Kishimoto', g: 5, o: 1 },
    { title: 'Dragon Ball Tập 1', author: 'Akira Toriyama', g: 5, o: 1 },
    { title: 'Dragon Ball Tập 2', author: 'Akira Toriyama', g: 5, o: 1 },
    { title: 'Death Note Tập 1', author: 'Tsugumi Ohba', g: 5, o: 1 },
    { title: 'Fullmetal Alchemist Tập 1', author: 'Hiromu Arakawa', g: 5, o: 1 },
    { title: 'Attack on Titan Tập 1', author: 'Hajime Isayama', g: 5, o: 1 },
    { title: 'Demon Slayer Tập 1', author: 'Koyoharu Gotouge', g: 5, o: 1 },
    { title: 'My Hero Academia Tập 1', author: 'Kohei Horikoshi', g: 5, o: 1 },
    // === Khoa học - Công nghệ (6) ===
    { title: 'Sapiens: Lược Sử Loài Người', author: 'Yuval Noah Harari', g: 6, o: 1 },
    { title: 'Homo Deus', author: 'Yuval Noah Harari', g: 6, o: 1 },
    { title: 'Lược Sử Thời Gian', author: 'Stephen Hawking', g: 6, o: 1 },
    { title: 'Cosmos', author: 'Carl Sagan', g: 6, o: 1 },
    { title: 'Vũ Trụ Trong Vỏ Hạt Dẻ', author: 'Stephen Hawking', g: 6, o: 1 },
    { title: 'Gen Ích Kỷ', author: 'Richard Dawkins', g: 6, o: 1 },
    { title: 'Elon Musk', author: 'Ashlee Vance', g: 6, o: 1 },
    { title: 'Steve Jobs', author: 'Walter Isaacson', g: 6, o: 1 },
    { title: 'Clean Code', author: 'Robert C. Martin', g: 6, o: 1 },
    { title: 'Design Patterns', author: 'Gang of Four', g: 6, o: 1 },
    { title: 'The Pragmatic Programmer', author: 'David Thomas', g: 6, o: 1 },
    { title: 'Khoa Học Vui Cho Trẻ Em', author: 'Nhiều tác giả', g: 6, o: 0 },
    { title: 'AI Superpowers', author: 'Kai-Fu Lee', g: 6, o: 1 },
    { title: 'Những Phát Minh Thay Đổi Thế Giới', author: 'Nhiều tác giả', g: 6, o: 0 },
    { title: 'Bí Mật Của Nước', author: 'Masaru Emoto', g: 6, o: 1 },
    // === Lịch sử - Địa lý (7) ===
    { title: 'Đại Việt Sử Ký Toàn Thư', author: 'Ngô Sĩ Liên', g: 7, o: 0 },
    { title: 'Lịch Sử Việt Nam Bằng Tranh', author: 'Trần Bạch Đằng', g: 7, o: 0 },
    { title: 'Nhật Ký Trong Tù', author: 'Hồ Chí Minh', g: 7, o: 0 },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', g: 7, o: 1 },
    { title: '21 Bài Học Cho Thế Kỷ 21', author: 'Yuval Noah Harari', g: 7, o: 1 },
    { title: 'Nghệ Thuật Chiến Tranh', author: 'Tôn Tử', g: 7, o: 1 },
    { title: 'Việt Nam Sử Lược', author: 'Trần Trọng Kim', g: 7, o: 0 },
    { title: 'Sài Gòn Một Thuở', author: 'Phạm Công Luận', g: 7, o: 0 },
    { title: 'Dọc Đường Gió Bụi', author: 'Xuân Diệu', g: 7, o: 0 },
    { title: 'Bản Đồ Du Lịch Việt Nam', author: 'Nhiều tác giả', g: 7, o: 0 },
    { title: 'Lịch Sử Thế Giới Cận Đại', author: 'Nhiều tác giả', g: 7, o: 0 },
    { title: 'Thế Giới Phẳng', author: 'Thomas L. Friedman', g: 7, o: 1 },
    { title: 'Sài Gòn Chợ Lớn Qua Ống Kính', author: 'Tim Doling', g: 7, o: 1 },
    { title: 'Hà Nội Băm Sáu Phố Phường', author: 'Thạch Lam', g: 7, o: 0 },
    { title: 'Đường Xưa Mây Trắng', author: 'Thích Nhất Hạnh', g: 7, o: 0 },
    // === Sách giáo khoa - Tham khảo (8) ===
    { title: 'Ngữ Văn 12 Nâng Cao', author: 'Bộ GD&ĐT', g: 8, o: 0 },
    { title: 'Toán 12 Cơ Bản', author: 'Bộ GD&ĐT', g: 8, o: 0 },
    { title: 'Vật Lý 12', author: 'Bộ GD&ĐT', g: 8, o: 0 },
    { title: 'Hóa Học 12', author: 'Bộ GD&ĐT', g: 8, o: 0 },
    { title: 'Sinh Học 12', author: 'Bộ GD&ĐT', g: 8, o: 0 },
    { title: 'Bài Tập Toán Cao Cấp', author: 'Nguyễn Đình Trí', g: 8, o: 0 },
    { title: 'Giải Tích 1', author: 'Nguyễn Đình Trí', g: 8, o: 0 },
    { title: 'Xác Suất Thống Kê', author: 'Đào Hữu Hồ', g: 8, o: 0 },
    { title: 'Cơ Sở Dữ Liệu', author: 'Trần Thiên Thành', g: 8, o: 0 },
    { title: 'Lập Trình C++', author: 'Phạm Văn Ất', g: 8, o: 0 },
    { title: 'Kinh Tế Vi Mô', author: 'Nguyễn Văn Công', g: 8, o: 0 },
    { title: 'Kinh Tế Vĩ Mô', author: 'N. Gregory Mankiw', g: 8, o: 1 },
    { title: 'Nguyên Lý Kế Toán', author: 'Phan Đức Dũng', g: 8, o: 0 },
    { title: 'Tài Chính Doanh Nghiệp', author: 'Nguyễn Minh Kiều', g: 8, o: 0 },
    { title: 'Quản Trị Học', author: 'Nguyễn Hải Sản', g: 8, o: 0 },
    // === Ngoại ngữ (9) ===
    { title: 'English Grammar In Use', author: 'Raymond Murphy', g: 9, o: 1 },
    { title: 'IELTS Academic 18', author: 'Cambridge', g: 9, o: 1 },
    { title: 'TOEIC Listening & Reading', author: 'ETS', g: 9, o: 1 },
    { title: 'Minna No Nihongo Tập 1', author: 'Nhiều tác giả', g: 9, o: 1 },
    { title: 'Minna No Nihongo Tập 2', author: 'Nhiều tác giả', g: 9, o: 1 },
    { title: 'Tiếng Hàn Tổng Hợp Sơ Cấp 1', author: 'Cho Hang-rok', g: 9, o: 1 },
    { title: 'HSK Standard Course 1', author: 'Jiang Liping', g: 9, o: 1 },
    { title: 'HSK Standard Course 2', author: 'Jiang Liping', g: 9, o: 1 },
    { title: 'Word Power Made Easy', author: 'Norman Lewis', g: 9, o: 1 },
    { title: '4000 Essential English Words', author: 'Paul Nation', g: 9, o: 1 },
    { title: 'Basic Kanji Book Vol.1', author: 'Chieko Kano', g: 9, o: 1 },
    { title: 'Genki 1', author: 'Eri Banno', g: 9, o: 1 },
    { title: 'Talk To Me In Korean Level 1', author: 'TTMIK', g: 9, o: 1 },
    { title: 'Oxford Advanced Learner Dictionary', author: 'Oxford', g: 9, o: 1 },
    { title: 'Practical English Usage', author: 'Michael Swan', g: 9, o: 1 },
];

const publishers = [
    'NXB Trẻ', 'NXB Văn Học', 'NXB Hội Nhà Văn', 'NXB Tổng Hợp TPHCM',
    'NXB Kim Đồng', 'NXB Lao Động', 'NXB Phụ Nữ', 'NXB Thanh Niên',
    'NXB Đại Học Quốc Gia', 'NXB Giáo Dục', 'NXB Thế Giới', 'NXB Chính Trị',
    'First News', 'IPM', 'Alphabooks', 'Skybooks'
];

const descriptions = [
    'Cuốn sách hay nhất về phát triển bản thân và kỹ năng giao tiếp. Một tác phẩm kinh điển đã thay đổi cuộc sống của hàng triệu người trên thế giới.',
    'Tác phẩm văn học kinh điển được yêu thích nhất mọi thời đại. Câu chuyện đầy cảm xúc, sâu sắc và giàu ý nghĩa nhân văn.',
    'Câu chuyện cảm động về tình yêu, tình bạn và gia đình. Mỗi trang sách mở ra một thế giới mới đầy yêu thương và hy vọng.',
    'Hành trình khám phá bản thân và ý nghĩa cuộc sống. Cuốn sách sẽ thay đổi cách bạn nhìn nhận mọi thứ xung quanh.',
    'Kiến thức bổ ích giúp thay đổi tư duy và cuộc sống. Được hàng triệu bạn đọc trên thế giới đánh giá cao và khuyên đọc.',
    'Những bài học quý giá về thành công và hạnh phúc. Tác giả chia sẻ bí quyết để sống một cuộc đời ý nghĩa hơn.',
    'Tác phẩm văn học Việt Nam đương đại xuất sắc. Phản ánh chân thực cuộc sống và tâm hồn con người Việt Nam.',
    'Cuốn sách dành cho mọi lứa tuổi, đầy cảm xúc và ý nghĩa. Một hành trình đọc đáng nhớ mà bạn không nên bỏ lỡ.',
    'Kỹ năng sống thiết thực cho thế hệ trẻ. Giúp bạn tự tin hơn trong giao tiếp, công việc và cuộc sống hàng ngày.',
    'Tác phẩm kinh điển của văn học thế giới. Được dịch ra hơn 50 ngôn ngữ và bán hàng triệu bản trên toàn cầu.',
];

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

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore';
        console.log(`🔌 Connecting to MongoDB: ${mongoURI}`);
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

const setupDefaultImages = () => {
    const uploadsDir = path.join(__dirname, '../uploads/books');
    const sourceImage = path.join(__dirname, '../uploads/standard_book_cover.png');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    if (fs.existsSync(sourceImage)) {
        const destImage = path.join(uploadsDir, 'default-book-cover.png');
        if (!fs.existsSync(destImage)) {
            fs.copyFileSync(sourceImage, destImage);
            console.log('✅ Default book cover copied');
        }
    }
};

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await Book.deleteMany({});
        await Category.deleteMany({});

        setupDefaultImages();

        // Create origin categories
        console.log('📁 Creating categories...');
        const originCats = [];
        for (const cat of originList) {
            const created = await Category.create({ ...cat, type: 'origin' });
            originCats.push(created);
            console.log(`  ✓ Origin: ${cat.name}`);
        }

        // Create genre categories
        const genreCats = [];
        for (const cat of genreList) {
            const created = await Category.create({ ...cat, type: 'genre' });
            genreCats.push(created);
            console.log(`  ✓ Genre: ${cat.name}`);
        }

        // Create 150 books
        console.log(`\n📚 Creating ${booksData.length} books...`);
        const books = [];

        for (let i = 0; i < booksData.length; i++) {
            const b = booksData[i];
            const price = Math.floor((30000 + Math.random() * 270000) / 1000) * 1000;
            const book = await Book.create({
                title: b.title,
                slug: createSlug(b.title, i),
                author: b.author,
                publisher: publishers[i % publishers.length],
                description: descriptions[i % descriptions.length],
                price,
                stockQuantity: 20 + Math.floor(Math.random() * 80),
                soldCount: Math.floor(Math.random() * 500),
                images: ['/uploads/books/default-book-cover.png'],
                categories: {
                    origin: originCats[b.o]._id,
                    genres: [genreCats[b.g]._id]
                },
                isbn: `978-604-${String(i).padStart(6, '0')}`
            });
            books.push(book);
            if ((i + 1) % 25 === 0) console.log(`  ✓ Created ${i + 1} books...`);
        }

        // Admin user
        console.log('\n👤 Checking admin user...');
        const adminExists = await User.findOne({ email: 'admin@bookstore.com' });
        if (!adminExists) {
            await User.create({
                email: 'admin@bookstore.com',
                password: 'admin123',
                name: 'Admin',
                role: 'admin'
            });
            console.log('  ✓ Admin user created (admin@bookstore.com / admin123)');
        } else {
            console.log('  ✓ Admin user already exists');
        }

        console.log('\n🎉 Seeding completed!');
        console.log(`📊 Summary:`);
        console.log(`   - Origins: ${originCats.length}`);
        console.log(`   - Genres: ${genreCats.length}`);
        console.log(`   - Books: ${books.length}`);
        console.log('\n💡 Run: npm run dev');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
