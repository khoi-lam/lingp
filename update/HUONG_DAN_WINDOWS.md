# Script để copy tất cả files đã update sang Windows

## Danh sách files cần copy:

### Backend (2 files):
1. `server/server.js`
2. `server/controllers/bookController.js`

### Frontend (9 files):
1. `client/src/config.js` ⭐ QUAN TRỌNG
2. `client/src/components/Navbar.jsx`
3. `client/src/pages/Home.jsx`
4. `client/src/pages/Shop.jsx`
5. `client/src/pages/ProductDetail.jsx`
6. `client/src/pages/Cart.jsx`
7. `client/src/pages/Orders.jsx`
8. `client/src/pages/admin/Products.jsx`

## Các bước thực hiện trên Windows:

### 1. Stop cả Backend và Frontend
- Nhấn Ctrl+C trong cả 2 terminal

### 2. Copy files từ folder `update/`
Đảm bảo copy CHÍNH XÁC từ:
```
Bookstore/update/client/src/config.js
→ Bookstore/client/src/config.js
```

### 3. Xóa cache
```bash
cd Bookstore/client
rm -rf node_modules/.vite
rm -rf dist
```

### 4. Restart Backend
```bash
cd Bookstore/server
npm run dev
```

### 5. Restart Frontend (terminal mới)
```bash
cd Bookstore/client
npm run dev
```

### 6. Hard refresh browser
- Ctrl + Shift + R
- Hoặc Ctrl + F5

## Kiểm tra nhanh:

Sau khi restart, mở Console và chạy:
```javascript
fetch('http://localhost:5000/uploads/books/default-book-cover.png')
  .then(r => console.log('Image status:', r.status))
```

Nếu thấy `Image status: 200` → Backend serve ảnh OK ✅
Nếu thấy `404` → Vấn đề ở backend
Nếu thấy `ERR_CONNECTION_REFUSED` → Backend chưa chạy
