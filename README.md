# Bookstore - Website Bán Sách

Dự án website bán sách với MERN stack (MongoDB, Express, React, Node.js)

## 🚀 Công Nghệ Sử Dụng

### Backend
- **Node.js** + **Express** - Web framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication (Access + Refresh Token)
- **bcryptjs** - Password hashing
- **Helmet** + **CORS** - Security

### Frontend
- **Vite** + **React** - Frontend framework
- **TailwindCSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client

## 📁 Cấu Trúc Project

```
bookstore/
├── server/              # Backend
│   ├── config/          # Database & environment config
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Request handlers
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & error handling
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
├── client/              # Frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React Context (Auth)
│   │   ├── services/    # API calls
│   │   └── App.jsx      # Main app
│   └── package.json
│
└── README.md
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (LTS version)
- MongoDB (local hoặc MongoDB Atlas)

### 1. Clone Repository
```bash
git clone <repository-url>
cd bookstore
```

### 2. Backend Setup
```bash
cd server
npm install

# Tạo file .env từ template
cp .env.example .env

# Chỉnh sửa .env với thông tin của bạn
# Đặc biệt là MONGODB_URI và JWT secrets
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Tạo file .env từ template
cp .env.example .env
```

### 4. Start MongoDB
```bash
# Nếu dùng MongoDB local
mongod

# Hoặc sử dụng MongoDB Atlas (cloud)
```

### 5. Run Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server chạy tại: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend chạy tại: `http://localhost:5173`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký user mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Đăng xuất

### User
- `GET /api/user/profile` - Lấy thông tin profile (Protected)
- `PUT /api/user/profile` - Cập nhật profile (Protected)
- `PUT /api/user/password` - Đổi mật khẩu (Protected)

## 🔐 Authentication Flow

1. User đăng ký/đăng nhập
2. Server trả về:
   - **Access Token** (15 phút) → Lưu trong localStorage
   - **Refresh Token** (7 ngày) → HTTP-only cookie
3. Mỗi request gửi Access Token trong header
4. Khi Access Token hết hạn → Tự động refresh bằng Refresh Token
5. Logout → Xóa cả 2 tokens

## 🎨 Features (Phase 1 - Foundation)

- ✅ User Registration & Login
- ✅ JWT Authentication với Refresh Token
- ✅ Protected Routes
- ✅ Role-based Access Control (User/Admin)
- ✅ Password Hashing
- ✅ Responsive UI với TailwindCSS

## 🔜 Next Phases

- **Phase 2**: Admin Core (Category CRUD, Product CRUD, Content Management)
- **Phase 3**: User Features (Product Listing, Search, Cart, Checkout)
- **Phase 4**: Advanced Features (Order Management, Support, AI Recommendations, Dashboard)

## 📄 License

ISC
