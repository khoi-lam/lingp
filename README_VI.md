# 📚 Lingoland Book Store - Hệ Thống Bán Sách Trực Tuyến

Dự án website bán sách trực tuyến hiện đại với đầy đủ tính năng quản lý, thanh toán và gợi ý sách thông minh sử dụng AI.

## 🌟 Tính Năng Chính

### Người Dùng
- 🔐 **Xác thực & Phân quyền**: Đăng ký, đăng nhập với JWT (Access + Refresh Token)
- 📖 **Duyệt & Tìm kiếm sách**: Tìm kiếm nâng cao, lọc theo danh mục, giá, tác giả
- 🛒 **Giỏ hàng**: Thêm, xóa, cập nhật số lượng sản phẩm
- 💳 **Thanh toán**: Tích hợp VNPay cho thanh toán trực tuyến
- 📦 **Quản lý đơn hàng**: Theo dõi trạng thái đơn hàng, lịch sử mua hàng
- 🤖 **Gợi ý AI**: Đề xuất sách thông minh dựa trên Hugging Face AI
- 👤 **Quản lý tài khoản**: Cập nhật thông tin cá nhân, đổi mật khẩu
- ⭐ **Đánh giá & Nhận xét**: Đánh giá sách đã mua

### Quản Trị Viên
- 📊 **Dashboard**: Thống kê doanh thu, đơn hàng, sản phẩm bán chạy
- 📚 **Quản lý sách**: CRUD sách, upload ảnh, quản lý tồn kho
- 🏷️ **Quản lý danh mục**: Tạo, sửa, xóa danh mục sách
- 📦 **Quản lý đơn hàng**: Xem, cập nhật trạng thái đơn hàng
- 👥 **Quản lý người dùng**: Xem danh sách, phân quyền
- 📈 **Báo cáo**: Thống kê doanh thu, sản phẩm bán chạy
- 🎨 **Quản lý nội dung**: Banner, slider, trang giới thiệu

## 🚀 Công Nghệ Sử Dụng

### Backend
- **Node.js** v20+ - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database chính
- **Prisma ORM** - Database ORM
- **JWT** - Authentication (Access + Refresh Token)
- **bcryptjs** - Mã hóa mật khẩu
- **Helmet** + **CORS** - Bảo mật
- **Cloudinary** - Lưu trữ hình ảnh
- **Multer** - Upload file
- **VNPay** - Cổng thanh toán
- **Hugging Face API** - AI recommendations
- **Natural** - Xử lý ngôn ngữ tự nhiên
- **QRCode** - Tạo mã QR cho đơn hàng

### Frontend
- **Vite** + **React 19** - Frontend framework
- **TailwindCSS 4** - Styling framework
- **React Router v7** - Routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Quill** - Rich text editor
- **React Dropzone** - File upload
- **Recharts** - Biểu đồ thống kê

## 📁 Cấu Trúc Dự Án

```
Lingoland-Book-Store/
├── server/                    # Backend API
│   ├── config/               # Cấu hình database, env
│   ├── controllers/          # Xử lý logic nghiệp vụ
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── orderController.js
│   │   ├── categoryController.js
│   │   ├── recommendationController.js
│   │   └── ...
│   ├── middleware/           # Auth, error handling, validation
│   ├── models/               # Prisma models
│   ├── routes/               # API endpoints
│   ├── scripts/              # Scripts tiện ích
│   │   ├── scraper/         # Scrape sách từ Fahasa
│   │   ├── seedAdmin.js     # Tạo admin mặc định
│   │   └── seedFullDatabase.js
│   ├── utils/                # Helper functions
│   ├── prisma/               # Prisma schema & migrations
│   ├── uploads/              # Thư mục upload tạm
│   └── server.js             # Entry point
│
├── client/                   # Frontend (User)
│   ├── src/
│   │   ├── components/      # Components tái sử dụng
│   │   ├── pages/           # Trang người dùng
│   │   ├── context/         # React Context (Auth, Cart)
│   │   ├── services/        # API calls
│   │   ├── utils/           # Helper functions
│   │   └── App.jsx          # Main app
│   └── package.json
│
├── frontend/                 # Frontend (Admin)
│   ├── src/
│   │   ├── components/      # Admin components
│   │   ├── pages/           # Trang quản trị
│   │   ├── context/         # Admin context
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

## ⚙️ Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống
- **Node.js** >= 20.x
- **PostgreSQL** >= 14.x
- **npm** hoặc **yarn**
- **Cloudinary Account** (cho upload ảnh)
- **Hugging Face API Key** (cho AI recommendations)
- **VNPay Account** (cho thanh toán - tùy chọn)

### 1. Clone Repository
```bash
git clone <repository-url>
cd Lingoland-Book-Store
```

### 2. Cài Đặt Backend

```bash
cd server
npm install

# Tạo file .env từ template
cp .env.example .env
```

**Cấu hình file `.env`:**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bookstore"

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Hugging Face
HF_API_KEY=hf_your_api_key_here

# VNPay (tùy chọn)
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

**Khởi tạo database:**
```bash
# Generate Prisma Client
npx prisma generate

# Chạy migrations
npx prisma migrate deploy

# Seed database (tùy chọn)
npm run seed:full
```

### 3. Cài Đặt Frontend (User)

```bash
cd ../client
npm install

# Tạo file .env
cp .env.example .env
```

**Cấu hình `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Cài Đặt Frontend (Admin)

```bash
cd ../frontend
npm install

# Tạo file .env
cp .env.example .env
```

**Cấu hình `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Chạy Ứng Dụng

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server chạy tại: `http://localhost:5000`

**Terminal 2 - Frontend User:**
```bash
cd client
npm run dev
```
Frontend User chạy tại: `http://localhost:5173`

**Terminal 3 - Frontend Admin:**
```bash
cd frontend
npm run dev
```
Frontend Admin chạy tại: `http://localhost:5174`

## 📝 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Đăng ký tài khoản mới
- `POST /login` - Đăng nhập
- `POST /refresh` - Làm mới access token
- `POST /logout` - Đăng xuất
- `GET /me` - Lấy thông tin user hiện tại

### Books (`/api/books`)
- `GET /` - Lấy danh sách sách (có phân trang, lọc, tìm kiếm)
- `GET /:id` - Lấy chi tiết sách
- `POST /` - Tạo sách mới (Admin)
- `PUT /:id` - Cập nhật sách (Admin)
- `DELETE /:id` - Xóa sách (Admin)

### Categories (`/api/categories`)
- `GET /` - Lấy danh sách danh mục
- `GET /:id` - Lấy chi tiết danh mục
- `POST /` - Tạo danh mục (Admin)
- `PUT /:id` - Cập nhật danh mục (Admin)
- `DELETE /:id` - Xóa danh mục (Admin)

### Orders (`/api/orders`)
- `GET /` - Lấy danh sách đơn hàng
- `GET /:id` - Lấy chi tiết đơn hàng
- `POST /` - Tạo đơn hàng mới
- `PUT /:id/status` - Cập nhật trạng thái (Admin)
- `POST /vnpay/create-payment` - Tạo link thanh toán VNPay
- `GET /vnpay/return` - Xử lý callback VNPay

### Cart (`/api/cart`)
- `GET /` - Lấy giỏ hàng
- `POST /items` - Thêm sản phẩm vào giỏ
- `PUT /items/:id` - Cập nhật số lượng
- `DELETE /items/:id` - Xóa sản phẩm khỏi giỏ

### Recommendations (`/api/recommendations`)
- `GET /books/:id/ai-recommendations` - Gợi ý AI cho sách
- `GET /books/:id/similar` - Sách tương tự
- `GET /trending` - Sách xu hướng

### Reviews (`/api/reviews`)
- `GET /books/:bookId` - Lấy đánh giá của sách
- `POST /` - Tạo đánh giá mới
- `PUT /:id` - Cập nhật đánh giá
- `DELETE /:id` - Xóa đánh giá

### Users (`/api/users`)
- `GET /profile` - Lấy thông tin profile
- `PUT /profile` - Cập nhật profile
- `PUT /password` - Đổi mật khẩu
- `GET /` - Lấy danh sách users (Admin)

### Dashboard (`/api/dashboard`)
- `GET /stats` - Thống kê tổng quan (Admin)
- `GET /revenue` - Thống kê doanh thu (Admin)
- `GET /top-products` - Sản phẩm bán chạy (Admin)

## 🔐 Luồng Xác Thực (Authentication Flow)

1. User đăng ký/đăng nhập
2. Server trả về:
   - **Access Token** (15 phút) → Lưu trong localStorage
   - **Refresh Token** (7 ngày) → HTTP-only cookie
3. Mỗi request gửi Access Token trong header: `Authorization: Bearer <token>`
4. Khi Access Token hết hạn → Tự động refresh bằng Refresh Token
5. Logout → Xóa cả 2 tokens

## 🤖 Hệ Thống Gợi Ý AI

Dự án sử dụng **Hugging Face Inference API** với model `sentence-transformers/all-MiniLM-L6-v2` để:

1. **Tạo embeddings** (384 chiều) cho mỗi sách dựa trên:
   - Tiêu đề
   - Tác giả
   - Mô tả
   - Thể loại

2. **Tính toán độ tương đồng** bằng cosine similarity

3. **Hybrid scoring** kết hợp:
   - AI similarity (60%)
   - Genre matching (20%)
   - Price similarity (10%)
   - Popularity (10%)

4. **Caching**: Embeddings được cache trong database 7 ngày

## 🛠️ Scripts Hữu Ích

### Scrape Sách Từ Fahasa
```bash
cd server/scripts/scraper
pip install -r requirements.txt
python fahasa_scraper.py
```

### Seed Database
```bash
cd server
npm run seed:full
```

### Tạo Admin Mặc Định
```bash
cd server
node scripts/seedAdmin.js
```

### Generate Prisma Client
```bash
cd server
npx prisma generate
```

### Chạy Migrations
```bash
cd server
npx prisma migrate dev
```

## 🎨 Tính Năng Nổi Bật

### 1. Giao Diện Hiện Đại
- Responsive design với TailwindCSS
- Dark mode support
- Smooth animations
- Mobile-first approach

### 2. Thanh Toán VNPay
- Tích hợp cổng thanh toán VNPay
- Hỗ trợ QR Code
- Xử lý callback tự động

### 3. Quản Lý Hình Ảnh
- Upload lên Cloudinary
- Tự động resize & optimize
- Multiple images per book

### 4. Tìm Kiếm Nâng Cao
- Full-text search
- Lọc theo nhiều tiêu chí
- Sort theo giá, tên, ngày

### 5. Dashboard Admin
- Biểu đồ thống kê với Recharts
- Real-time updates
- Export reports

## 📊 Database Schema

Dự án sử dụng **Prisma ORM** với **PostgreSQL**. Các bảng chính:

- `User` - Người dùng
- `Book` - Sách
- `Category` - Danh mục
- `Order` - Đơn hàng
- `OrderItem` - Chi tiết đơn hàng
- `Cart` - Giỏ hàng
- `CartItem` - Sản phẩm trong giỏ
- `Review` - Đánh giá
- `BookEmbedding` - AI embeddings
- `Banner` - Banner quảng cáo

## 🔒 Bảo Mật

- ✅ Password hashing với bcryptjs
- ✅ JWT authentication
- ✅ HTTP-only cookies cho refresh token
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection

## 🚀 Deployment

### Backend (Node.js)
Có thể deploy lên:
- **Railway**
- **Render**
- **Heroku**
- **DigitalOcean**
- **AWS EC2**

### Frontend (React)
Có thể deploy lên:
- **Vercel**
- **Netlify**
- **Cloudflare Pages**
- **GitHub Pages**

### Database
- **Neon** (PostgreSQL serverless)
- **Supabase**
- **Railway**
- **AWS RDS**

## 📚 Tài Liệu Tham Khảo

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Hugging Face API](https://huggingface.co/docs/api-inference)
- [VNPay Documentation](https://sandbox.vnpayment.vn/apis/)

## 🐛 Troubleshooting

### Lỗi kết nối Database
```bash
# Kiểm tra PostgreSQL đang chạy
pg_isready

# Kiểm tra DATABASE_URL trong .env
echo $DATABASE_URL
```

### Lỗi Prisma
```bash
# Reset database
npx prisma migrate reset

# Generate lại client
npx prisma generate
```

### Lỗi CORS
Kiểm tra `CLIENT_URL` và `ADMIN_URL` trong `.env` của server

### Lỗi Upload Ảnh
Kiểm tra Cloudinary credentials trong `.env`

## 👥 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

ISC License

## 📞 Liên Hệ

Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ qua:
- Email: your-email@example.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

---

**Phát triển bởi**: Lingoland Team  
**Phiên bản**: 1.0.0  
**Cập nhật lần cuối**: 2026
