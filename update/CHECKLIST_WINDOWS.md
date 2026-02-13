# CHECKLIST - Kiểm tra files trên Windows

## ✅ Backend OK
- Ảnh hiển thị đúng khi truy cập: `http://localhost:5000/uploads/books/default-book-cover.png`

## ❌ Frontend - CẦN KIỂM TRA

### Các file PHẢI có code mới:

#### 1. `client/src/config.js`
Phải có function `getBackendUrl()` và export `getImageUrl`

#### 2. `client/src/pages/ProductDetail.jsx`
Dòng đầu phải có:
```javascript
import { getImageUrl } from '../config';
```

Và phần render ảnh:
```javascript
<img src={getImageUrl(book.images?.[0])} />
```

#### 3. `client/src/pages/Home.jsx`
Phải import và dùng `getImageUrl`

#### 4. `client/src/pages/Shop.jsx`
Phải import và dùng `getImageUrl`

---

## CÁCH KIỂM TRA NHANH:

### Trên Windows, mở file `client/src/pages/ProductDetail.jsx`

Tìm dòng import, phải thấy:
```javascript
import { getImageUrl } from '../config';
```

Nếu KHÔNG CÓ → File chưa được update!

### Nếu file chưa đúng:

1. **Copy lại TẤT CẢ files** từ folder `update/` trên Mac sang Windows
2. **Xóa cache**: `rm -rf client/node_modules/.vite`
3. **Restart frontend**: Stop (Ctrl+C) → `npm run dev`
4. **Hard refresh**: Ctrl+Shift+R

---

## DEBUG NHANH:

Trong Console của browser, chạy:
```javascript
// Kiểm tra xem getImageUrl có hoạt động không
import('/src/config.js').then(m => {
  console.log('getImageUrl test:', m.getImageUrl('/uploads/books/default-book-cover.png'));
});
```

Kết quả phải là: `http://localhost:5000/uploads/books/default-book-cover.png`

KHÔNG PHẢI: `http://localhost:5000/api/uploads/books/default-book-cover.png`
