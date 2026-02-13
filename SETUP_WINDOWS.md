# HƯỚNG DẪN SETUP DỰ ÁN TRÊN WINDOWS

## Yêu cầu hệ thống

- **Node.js**: v18 trở lên ([Download](https://nodejs.org/))
- **MongoDB**: v6.0 trở lên ([Download](https://www.mongodb.com/try/download/community))
- **Git**: ([Download](https://git-scm.com/download/win))

## Bước 1: Cài đặt MongoDB trên Windows

1. Download MongoDB Community Server từ trang chủ
2. Chạy file cài đặt `.msi`
3. Chọn "Complete" installation
4. Tick vào "Install MongoDB as a Service"
5. Sau khi cài xong, MongoDB sẽ tự động chạy

**Kiểm tra MongoDB đã chạy:**
```cmd
mongosh
```

Nếu thấy `test>` là thành công!

## Bước 2: Giải nén và cài đặt project

1. Giải nén file `Bookstore.zip`
2. Mở **Command Prompt** hoặc **PowerShell** tại thư mục project

### Cài đặt Backend

```cmd
cd server
npm install
```

### Cài đặt Frontend

```cmd
cd ../client
npm install
```

## Bước 3: Cấu hình môi trường

File `.env` đã có sẵn trong `server/` folder với cấu hình mặc định:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=development
```

**Lưu ý:** Nếu MongoDB của bạn chạy ở port khác, hãy sửa `MONGO_URI`

## Bước 4: Seed dữ liệu mẫu (100 sản phẩm)

```cmd
cd server
npm run seed:full
```

Script sẽ tạo:
- ✅ 10 danh mục (2 xuất xứ + 8 thể loại)
- ✅ 100 sản phẩm với hình ảnh mặc định
- ✅ 1 tài khoản admin

**Thông tin đăng nhập Admin:**
- Email: `admin@bookstore.com`
- Password: `admin123`

## Bước 5: Chạy ứng dụng

### Chạy Backend (Terminal 1)

```cmd
cd server
npm run dev
```

Server sẽ chạy tại: `http://localhost:5000`

### Chạy Frontend (Terminal 2)

```cmd
cd client
npm run dev
```

Client sẽ chạy tại: `http://localhost:5173`

## Bước 6: Truy cập ứng dụng

Mở trình duyệt và vào: **http://localhost:5173**

### Đăng nhập Admin

1. Click vào icon **Tài khoản** (góc phải)
2. Chọn **Đăng nhập**
3. Nhập:
   - Email: `admin@bookstore.com`
   - Password: `admin123`
4. Sau khi đăng nhập, click **Tài khoản** → **Admin Panel**

## Các lệnh hữu ích

```cmd
# Xóa và seed lại database
cd server
npm run seed:full

# Chạy backend ở chế độ production
npm start

# Chạy tests
npm test

# Build frontend cho production
cd client
npm run build
```

## Xử lý lỗi thường gặp

### Lỗi: "MongoDB connection error"

**Nguyên nhân:** MongoDB chưa chạy

**Giải pháp:**
```cmd
# Mở Services (Win + R, gõ services.msc)
# Tìm "MongoDB Server" và Start
```

Hoặc chạy MongoDB thủ công:
```cmd
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

### Lỗi: "Port 5000 already in use"

**Giải pháp:** Đổi port trong `server/.env`:
```env
PORT=5001
```

### Lỗi: "npm: command not found"

**Giải pháp:** Cài đặt lại Node.js và restart terminal

## Cấu trúc thư mục

```
Bookstore/
├── client/              # Frontend React + Vite
│   ├── src/
│   ├── public/
│   └── package.json
├── server/              # Backend Node.js + Express
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/         # Hình ảnh sản phẩm
│   ├── scripts/         # Seed scripts
│   └── package.json
└── README.md
```

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Node.js version: `node --version` (cần >= v18)
2. MongoDB đang chạy: `mongosh`
3. Port 5000 và 5173 không bị chiếm

---

**Chúc bạn setup thành công! 🎉**
