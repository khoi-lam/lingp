# FIX CACHE - Xóa hoàn toàn cache trên Windows

## Vấn đề:
Code đã đúng nhưng ảnh vẫn bị thêm `/api/` vào URL do cache.

## Giải pháp:

### Bước 1: Stop Frontend
Nhấn **Ctrl + C** trong terminal đang chạy frontend

### Bước 2: Xóa TẤT CẢ cache
```bash
cd Bookstore/client

# Xóa Vite cache
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist

# Xóa build artifacts
rm -rf node_modules/.cache
```

### Bước 3: Restart Frontend
```bash
npm run dev
```

### Bước 4: Xóa Browser Cache
**QUAN TRỌNG**: Mở **Incognito/Private window** mới (Ctrl+Shift+N)

Hoặc trong tab hiện tại:
1. Mở DevTools (F12)
2. Click chuột phải vào nút Refresh
3. Chọn **"Empty Cache and Hard Reload"**

### Bước 5: Test
Truy cập `http://localhost:5173` trong Incognito window

---

## Nếu vẫn không được:

### Kiểm tra trong Console:
```javascript
// Test xem getImageUrl có hoạt động đúng không
import('/src/config.js').then(m => {
  const testUrl = m.getImageUrl('/uploads/books/default-book-cover.png');
  console.log('Test URL:', testUrl);
  // Phải là: http://localhost:5000/uploads/books/default-book-cover.png
  // KHÔNG PHẢI: http://localhost:5000/api/uploads/books/default-book-cover.png
});
```

### Nếu vẫn thấy `/api/`:
Có thể do **Service Worker** cache. Xóa bằng cách:
1. DevTools → Application tab
2. Service Workers → Unregister
3. Clear Storage → Clear site data
4. Refresh

---

## Debug cuối cùng:

Nếu sau TẤT CẢ các bước trên vẫn không được, hãy:

1. **Kiểm tra file build**: Mở `client/node_modules/.vite/deps/` và xem có file cũ không
2. **Kill tất cả process Node**: `taskkill /F /IM node.exe` (Windows)
3. **Restart máy** (cuối cùng)

Sau khi restart, chạy lại frontend và test trong Incognito window.
