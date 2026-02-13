# Chi Tiết Bản Cập Nhật Hệ Thống Chatbot AI (Bookstore)

Bản cập nhật này nâng cấp toàn diện hệ thống Chatbot từ tìm kiếm từ khóa cơ bản sang Trợ lý ảo thông minh sử dụng Trí tuệ nhân tạo (AI).

---

## 📂 Danh sách file trong gói cập nhật

### Frontend (Client)
| File | Mô tả |
|------|------|
| `client/src/components/ChatBubble.jsx` | Component React chính cho chatbot |
| `client/src/components/ChatBubble.css` | Giao diện cao cấp |

### Backend (Server)
| File | Mô tả |
|------|------|
| `server/controllers/chatController.js` | Logic AI chính |
| `server/routes/chatRoutes.js` | Định nghĩa API routes |
| `server/models/BookEmbedding.js` | Model lưu vector embeddings |
| `server/sync_embeddings.js` | Script đồng bộ hóa dữ liệu |

---

## 🔧 Hướng dẫn tích hợp từng bước

### ⚠️ BƯỚC QUAN TRỌNG NHẤT: Hiển thị Chatbot trên giao diện

Mở file `client/src/App.jsx` và thực hiện 2 thay đổi:

**1. Thêm dòng import ở đầu file (khoảng dòng 27):**
```javascript
import ChatBubble from './components/ChatBubble';
```

**2. Thêm component vào trong PublicLayout (sau `<Footer />`):**
```javascript
const PublicLayout = () => (
  <div className="min-h-screen flex flex-col pt-20">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
    <ChatBubble />   {/* <-- THÊM DÒNG NÀY */}
  </div>
);
```

---

### Bước 2: Đăng ký Route trong server.js
Mở file `server/server.js` và thêm:

```javascript
// Ở đầu file, thêm import:
import chatRoutes from './routes/chatRoutes.js';

// Trong phần Routes, thêm:
app.use('/api/chat', chatRoutes);
```

### Bước 3: Cấu hình biến môi trường
Thêm vào file `.env` của backend:
```
HF_API_KEY=hf_your_huggingface_api_key_here
```
> Lấy API Key miễn phí tại: https://huggingface.co/settings/tokens

### Bước 4: Đồng bộ hóa dữ liệu AI
```bash
cd server
node sync_embeddings.js
```

### Bước 5: Restart cả Backend và Frontend
```bash
# Backend
npm run dev

# Frontend (terminal khác)
cd client
npm run dev
```

---

## 🚀 Các tính năng cốt lõi

### 1. Hệ thống Fallback Đa Tầng
- Llama-3-8B → Mistral-7B → Phi-3-mini
- Tự động Retry khi API quá tải

### 2. Tìm kiếm Semantic
Chatbot hiểu **ý nghĩa** câu hỏi, không chỉ từ khóa

### 3. Phản hồi 3 Phần
1. Mô tả thể loại
2. Top 5 sách thế giới
3. Sách có tại cửa hàng

---

## ⚠️ Checklist kiểm tra lỗi

- [ ] Đã thêm import ChatBubble vào App.jsx?
- [ ] Đã thêm `<ChatBubble />` vào PublicLayout?
- [ ] Đã thêm chatRoutes vào server.js?
- [ ] Đã cấu hình HF_API_KEY trong .env?
- [ ] Đã chạy sync_embeddings.js?
- [ ] Đã restart cả backend và frontend?

---
*Bản quyền phát triển bởi Antigravity AI Team.*
