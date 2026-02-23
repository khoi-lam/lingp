# LingoLand — Screen & UI Element Analysis Report

![LingoLand Logo](/Users/mymac/.gemini/antigravity/brain/8de75dc5-79d4-4399-b3be-1a0f5d38f99b/lingoland_logo_1771388331079.png)

> **LingoLand** — Nền tảng thương mại sách trực tuyến với phong cách thiết kế tươi vui, đầy sắc màu, hướng tới trải nghiệm người dùng thân thiện và sinh động.

---

## Nhận diện thương hiệu & Bảng màu

### Logo

Logo LingoLand sử dụng kiểu chữ **bubble letter** tròn trịa, mỗi ký tự mang một sắc màu riêng — tạo cảm giác vui tươi, đa dạng và thân thiện. Chiếc lá nhỏ mọc trên chữ "i" tượng trưng cho sự **tăng trưởng và học hỏi**. Các yếu tố trang trí (cầu vồng, mây, confetti) gợi lên không gian **sáng tạo, đầy cảm hứng** — phản ánh tinh thần của một nền tảng sách hướng tới mọi lứa tuổi.

- **Nền logo**: Kem ấm `#FAF5EB` — cốt lõi của bảng màu giao diện
- **Viền chữ**: Navy xanh đậm `#2B3A67` — tạo sự nổi bật và chuyên nghiệp
- **Chữ "Land"**: Xanh dương nhạt `#87CEEB` — mềm mại, nhẹ nhàng

### Bảng màu (Color Palette)

![LingoLand Color Palette](/Users/mymac/.gemini/antigravity/brain/8de75dc5-79d4-4399-b3be-1a0f5d38f99b/lingoland_palette_1771388355485.png)

Bảng màu xanh lá gradient — lấy cảm hứng từ chiếc lá trên logo — tượng trưng cho **sự phát triển, tri thức và tự nhiên**.

| Swatch | Mã màu (ước lượng) | Tên gợi ý | Ứng dụng                                    |
| ------ | ------------------------ | ------------ | --------------------------------------------- |
| 🟩 1   | `#E8F5E9`              | Mint Frost   | Nền phụ nhẹ, hover state, card background  |
| 🟩 2   | `#C5E0B4`              | Sage Mist    | Divider, secondary badge, tag nhãn nhẹ      |
| 🟩 3   | `#8BC34A`              | Leaf Green   | Trạng thái thành công nhẹ, icon xanh lá |
| 🟩 4   | `#4CAF50`              | Vivid Green  | Badge "Hoàn tất", stock status, CTA phụ    |
| 🟩 5   | `#388E3C`              | Forest Green | Text nhấn trên nền sáng, accent border    |
| 🟩 6   | `#2E7D32`              | Deep Emerald | Heading quan trọng, strong success state     |

---

## Tổng quan hệ thống

| Phân hệ        | Số lượng màn hình | Shared Components                                             |
| ---------------- | ---------------------- | ------------------------------------------------------------- |
| **Client** | 11                     | `Navbar`, `Footer`, `ChatBubble` (qua `PublicLayout`) |
| **Admin**  | 8                      | `AdminLayout` (sidebar + header)                            |
| **Tổng**  | **19**           | —                                                            |

---

## Phần 1 — Client Screens (11)

### 1. Home (`Home.jsx` — 582 dòng)

| Khu vực                     | Thành phần UI                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Hero Banner**        | Carousel tự động xoay (3 slide), dot indicators, gradient overlays, nút CTA                                     |
| **Promo Banner Row**   | 3 card cố định chiều cao với icon + text + CTA links                                                           |
| **Icon Menu**          | 6 icon danh mục xếp ngang (dynamic từ API)                                                                       |
| **Flash Sale**         | Đồng hồ đếm ngược, danh sách `ProductCard` cuộn ngang (ảnh, tiêu đề, tác giả, giá, số đã bán) |
| **Shopping Trends**    | 4 tab chuyển đổi (Sách mới, Bán chạy, Giảm giá, Đề xuất), lưới sản phẩm                             |
| **Featured Bookshelf** | Khu vực quảng bá lớn với ảnh nền + text overlay                                                              |
| **Weekly Rankings**    | Danh sách đánh số (top 5), ảnh bìa thu nhỏ, huy hiệu thứ hạng                                             |
| **Collections**        | Card danh mục liên kết đến `/shop?genre=...`                                                                 |
| **AI Suggestion CTA**  | Banner gradient động, link đến gợi ý cá nhân hóa                                                           |

---

### 2. Shop (`Shop.jsx` — 239 dòng)

| Khu vực                   | Thành phần UI                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------- |
| **Sidebar Filters**  | Radio list Xuất xứ, Radio list Thể loại, nút "Xóa tất cả"                  |
| **Search Bar**       | Input tìm kiếm với icon                                                         |
| **Sorting Toolbar**  | Dropdown sắp xếp (Mới nhất, Giá tăng, Giá giảm, Theo tên)                 |
| **Product Grid**     | Lưới card responsive (ảnh, tiêu đề, tác giả, giá, nút "Thêm vào giỏ") |
| **Pagination**       | Nút số trang + mũi tên trước/sau                                             |
| **Loading Skeleton** | Card placeholder với animation                                                    |

---

### 3. Product Detail (`ProductDetail.jsx` — 330 dòng)

| Khu vực                     | Thành phần UI                                                |
| ---------------------------- | -------------------------------------------------------------- |
| **Breadcrumbs**        | Trang chủ → Danh mục → Tên sản phẩm                     |
| **Image Gallery**      | Ảnh chính + dải thumbnail, click phóng to                  |
| **Product Info**       | Tiêu đề, tác giả, giá (VND), badge trạng thái tồn kho |
| **Quantity Selector**  | Nút − / + với hiển thị số                                |
| **Add to Cart**        | Nút CTA đỏ chính                                           |
| **Tabs**               | "Thông tin sản phẩm" / "Vận chuyển"                       |
| **Description Panel**  | Rich text HTML                                                 |
| **Related Products**   | Hàng card ngang (cùng thể loại)                            |
| **AI Recommendations** | Hàng card từ API gợi ý AI                                  |

---

### 4. Cart (`Cart.jsx` — 154 dòng)

| Khu vực                  | Thành phần UI                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Empty State**     | Minh họa + link "Tiếp tục mua sắm"                                                                  |
| **Cart Items List** | Mỗi item: thumbnail, tiêu đề, tác giả, đơn giá, số lượng (−/+), tổng phụ, nút xóa (×) |
| **Order Summary**   | Tạm tính, phí ship ("Miễn phí"), tổng cộng                                                       |
| **Checkout Button** | Nút CTA đỏ full-width →`/checkout`                                                                |

---

### 5. Checkout (`Checkout.jsx` — 275 dòng)

| Khu vực                        | Thành phần UI                                                               |
| ------------------------------- | ----------------------------------------------------------------------------- |
| **Shipping Form**         | Input: Họ tên, SĐT, Địa chỉ, Thành phố, Ghi chú (textarea)           |
| **Payment Method**        | Radio: COD / Chuyển khoản                                                   |
| **Order Summary Sidebar** | Danh sách item (thumbnail, tên, số lượng, giá), tạm tính, ship, tổng |
| **Place Order Button**    | Nút CTA đỏ, disabled khi đang gửi                                        |

---

### 6. Order Success (`OrderSuccess.jsx` — 98 dòng)

| Khu vực                     | Thành phần UI                                     |
| ---------------------------- | --------------------------------------------------- |
| **Success Icon**       | Biểu tượng check xanh lá                        |
| **Order Details**      | Mã đơn, phương thức thanh toán, tổng tiền  |
| **Bank Transfer Info** | Hiển thị có điều kiện: thông tin tài khoản |
| **Action Buttons**     | "Tiếp tục mua sắm" + "Xem đơn hàng"           |

---

### 7. Orders (`Orders.jsx` — 155 dòng)

| Khu vực                | Thành phần UI                                                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Empty State**   | Minh họa + link "Mua sắm ngay"                                                                                                                                      |
| **Order Cards**   | Mỗi đơn: ID (6 ký tự cuối), ngày, badge trạng thái, thumbnail sản phẩm, tổng tiền                                                                        |
| **Status Badges** | `waiting` (vàng), `processing` (xanh dương), `shipping` (tím), `delivered` (xanh lá), `completed` (emerald), `cancelled` (đỏ), `returned` (xám) |

---

### 8. Profile (`Profile.jsx` — 215 dòng)

| Khu vực                       | Thành phần UI                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------ |
| **Profile Info Form**    | Input: Tên, Email (read-only) — nút "Cập nhật"                                  |
| **Password Change Form** | Input: Mật khẩu hiện tại, Mật khẩu mới, Xác nhận — nút "Đổi mật khẩu" |
| **Account Stats**        | Badge vai trò, ngày tham gia, trạng thái tài khoản                             |

---

### 9. Support (`Support.jsx` — 274 dòng)

| Khu vực                   | Thành phần UI                                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **New Request Form** | Dropdown loại (Hỗ trợ/Đổi trả), input tiêu đề, textarea nội dung, upload ảnh (multi-file), chọn đơn hàng |
| **Request History**  | Danh sách card: tiêu đề, badge loại, ngày, badge trạng thái, preview nội dung                                  |
| **Admin Reply**      | Khối phản hồi nổi bật cho mỗi yêu cầu                                                                           |

---

### 10. Login (`Login.jsx` — 186 dòng)

| Khu vực                | Thành phần UI                                        |
| ----------------------- | ------------------------------------------------------ |
| **Brand Header**  | Logo + tên ứng dụng                                 |
| **Login Form**    | Input email, input password (toggle hiện/ẩn)         |
| **Submit Button** | Nút CTA đỏ full-width                               |
| **Links**         | "Đăng ký" →`/register`, "← Trang chủ" → `/` |

---

### 11. Register (`Register.jsx` — 262 dòng)

| Khu vực                | Thành phần UI                                       |
| ----------------------- | ----------------------------------------------------- |
| **Brand Header**  | Logo + tên ứng dụng                                |
| **Register Form** | Input: Tên, Email, Mật khẩu, Xác nhận mật khẩu |
| **Validation**    | Kiểm tra độ dài ≥ 6, So khớp mật khẩu         |
| **Submit Button** | Nút CTA đỏ full-width                              |
| **Links**         | "Đăng nhập" →`/login`, "← Trang chủ" → `/` |

---

## Phần 2 — Admin Screens (8)

> Tất cả admin screens được bọc trong `AdminLayout` (sidebar navigation + top header).

### 1. Dashboard (`admin/Dashboard.jsx` — 179 dòng)

| Khu vực                  | Thành phần UI                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Stats Cards (3)** | Tổng sản phẩm (icon sách), Doanh thu (icon tiền), Tổng đơn hàng (icon giỏ) — hover animation |
| **Revenue Chart**   | `recharts` LineChart — doanh thu 7 ngày, gradient fill, custom tooltip                              |
| **Top Products**    | Danh sách xếp hạng: #badge, tiêu đề, tác giả, số đã bán, giá                               |

**APIs:** `/stats/dashboard`, `/stats/revenue?period=7days`, `/stats/top-products`

---

### 2. Categories (`admin/Categories.jsx` — 345 dòng)

| Khu vực                   | Thành phần UI                                                                                           |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Filter Tabs**      | Segmented control: Tất cả / Xuất xứ / Thể loại                                                      |
| **Add Button**       | "+ Thêm Danh Mục" CTA đỏ                                                                              |
| **Categories Table** | Cột: Tên, Badge loại (xanh dương=origin, xanh lá=genre), Mô tả, Thao tác (Sửa ✏️ / Xóa 🗑️) |
| **Add/Edit Modal**   | Backdrop blur → Form: Name input, Type toggle (2 nút), Description textarea, Cancel/Submit              |
| **ConfirmModal**     | Dialog xác nhận xóa kiểu danger                                                                       |
| **Notification**     | Toast thông báo success/error                                                                           |

---

### 3. Products (`admin/Products.jsx` — 267 dòng)

| Khu vực                  | Thành phần UI                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Header**          | Tiêu đề "Thư viện sách" + link "+ Thêm Sản Phẩm"                                                           |
| **Products Table**  | Cột: Sản phẩm (thumbnail + tên + ISBN), Tác giả, Giá (badge formatted), Kho (dot chỉ thị + số), Thao tác |
| **Stock Indicator** | Dot xanh (>10) / Dot đỏ (≤10), pulse animation                                                                   |
| **Pagination**      | ← Page X of Y →                                                                                                   |
| **ConfirmModal**    | Dialog xác nhận xóa                                                                                              |

---

### 4. Product Form (`admin/ProductForm.jsx` — 316 dòng)

| Khu vực                  | Thành phần UI                                                                 |
| ------------------------- | ------------------------------------------------------------------------------- |
| **Form (2 cột)**   | Input: Tên sách*, Tác giả*, NXB, ISBN, Giá* (number), Số lượng (number) |
| **Description**     | Textarea (4 dòng)                                                              |
| **Origin Selector** | Dropdown từ API                                                                |
| **Genre Selector**  | Checkbox group (multi-select) từ API                                           |
| **Image Upload**    | File input (multi), preview grid 4 cột, nút xóa từng ảnh                   |
| **Action Buttons**  | "Hủy" + "Tạo mới" / "Cập nhật"                                             |

---

### 5. Content (`admin/Content.jsx` — 165 dòng)

| Khu vực                 | Thành phần UI                                         |
| ------------------------ | ------------------------------------------------------- |
| **Header**         | "Banner trang chủ" + mô tả                           |
| **Action Buttons** | "📤 Upload ảnh", "+ Thêm URL", "Lưu banner"          |
| **Banner Grid**    | Grid 3 cột responsive, hover overlay (URL + nút xóa) |
| **Empty State**    | Viền nét đứt + "Chưa có banner nào"              |

**APIs:** `/content/hero-banner` (GET/PUT), `/upload` (POST multipart)

---

### 6. Orders (`admin/Orders.jsx` — 225 dòng)

| Khu vực                  | Thành phần UI                                                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Header**          | Nút quay lại + "Quản lý đơn hàng"                                                                                      |
| **Status Filter**   | Dropdown: Tất cả / 6 trạng thái                                                                                           |
| **Stats Cards (4)** | Tổng đơn, Doanh thu, Đang xử lý, Chờ xác nhận                                                                        |
| **Orders Table**    | Cột: Mã đơn, Khách hàng (tên + SĐT), Tổng tiền, Thanh toán (method + status), Trạng thái (badge), Link chi tiết |
| **Pagination**      | "Trước" / "Sau" + chỉ thị trang                                                                                           |

**APIs:** `/orders/admin/all`, `/orders/admin/stats`

---

### 7. Order Detail (`admin/OrderDetail.jsx` — 252 dòng)

| Khu vực                        | Thành phần UI                                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Items Card**            | List sản phẩm: thumbnail, tên, đơn giá, số lượng, tổng dòng — Summary: tạm tính, ship (miễn phí), tổng cộng |
| **Shipping Info Card**    | Người nhận, SĐT, Địa chỉ + TP, Ghi chú (highlight vàng)                                                              |
| **Payment Info Card**     | Phương thức, Badge thanh toán (xanh=đã thu, đỏ=chưa thu), Mã giao dịch                                             |
| **Update Panel (sticky)** | Dropdown trạng thái đơn (7 options), Dropdown thanh toán (3 options), Input mã vận đơn, Nút "Lưu cập nhật"       |

**APIs:** `/orders/:id` (GET), `/orders/:id/status` (PUT)

---

### 8. Support (`admin/Support.jsx` — 252 dòng)

| Khu vực                | Thành phần UI                                                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Filters**       | Dropdown loại (Hỗ trợ/Đổi trả), Dropdown trạng thái (4 options)                                                                                     |
| **Request Table** | Cột: Khách hàng (avatar + tên + email), Badge loại + Tiêu đề, Mã đơn, Ngày, Badge trạng thái, Nút "Xem & Phản hồi"                         |
| **Detail Modal**  | Backdrop blur → Badge loại + trạng thái, tiêu đề, nội dung, ảnh đính kèm, textarea phản hồi admin, nút "Từ chối" / "Duyệt / Hoàn thành" |

**APIs:** `/support` (GET), `/support/:id` (PATCH)

---

## Shared Components

| Component          | Sử dụng tại         | Mục đích                             |
| ------------------ | ---------------------- | --------------------------------------- |
| `Navbar`         | Toàn bộ client pages | Thanh điều hướng trên cùng        |
| `Footer`         | Toàn bộ client pages | Chân trang                             |
| `ChatBubble`     | Toàn bộ client pages | Widget chat AI nổi                     |
| `AdminLayout`    | Toàn bộ admin pages  | Sidebar nav + header admin              |
| `ProtectedRoute` | Admin routes           | Guard xác thực (kiểm tra role admin) |
| `ErrorBoundary`  | Admin routes           | Bắt lỗi + fallback UI                 |
| `Notification`   | Categories, Products   | Toast thông báo                       |
| `ConfirmModal`   | Categories, Products   | Dialog xác nhận xóa                  |

---

## Phong cách thiết kế & Design System

### 🌿 Triết lý thiết kế

Lấy cảm hứng trực tiếp từ logo LingoLand — với kiểu chữ **bubble letter** tròn trịa, chiếc lá xanh mọc lên, cầu vồng và mây — giao diện web hướng tới phong cách:

| Từ khóa                            | Ý nghĩa                                                                            | Cách thể hiện                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| **Nhẹ nhàng**                | Không gây áp lực thị giác, tạo cảm giác thư giãn khi duyệt sách         | Nền kem ấm `#FAF5EB`, bo tròn lớn, khoảng trắng rộng rãi                                        |
| **Dễ thương**               | Giao diện gợi lên sự vui tươi, tươi mới — giống như logo đầy màu sắc | Góc bo siêu tròn (`rounded-[32px]`, `rounded-[40px]`), icon minh họa, micro-animations mượt mà |
| **Thân thiện người dùng** | Dễ hiểu, dễ thao tác, không cần hướng dẫn                                   | Hierarchy rõ ràng, label uppercase nhỏ dẫn dắt mắt, empty state có minh họa + CTA                 |
| **Thân thiện môi trường** | Gợi lên thiên nhiên — lá, cây, tăng trưởng — qua bảng màu xanh lá      | Toàn bộ palette xanh gradient, nền kem tự nhiên thay vì trắng lạnh                                |

### 🎨 Hệ màu chủ đạo (từ Palette xanh lá + nền Logo)

Giao diện chỉ sử dụng **7 màu** — 6 từ palette xanh lá gradient + 1 nền kem từ logo — đảm bảo tính nhất quán và gần gũi với thiên nhiên:

| Token           | Mã màu    | Vai trò trong giao diện                                                                                                                         |
| --------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--bg-base`   | `#FAF5EB` | **Nền toàn trang** — kem ấm lấy từ nền logo. Thay thế trắng thuần, mang lại cảm giác mềm mại, tự nhiên, dễ chịu cho mắt |
| `--green-50`  | `#E8F5E9` | **Nền card, hover state** — xanh mint cực nhạt tạo sự phân tách nhẹ nhàng giữa các khu vực mà không gây "cứng"             |
| `--green-100` | `#C5E0B4` | **Divider, tag, badge phụ** — xanh sage mờ dùng cho đường phân cách, nhãn danh mục, viền nhẹ                                   |
| `--green-300` | `#8BC34A` | **Icon, trạng thái tích cực nhẹ** — xanh lá tươi dùng cho icon "còn hàng", checkmark, hover accent                              |
| `--green-500` | `#4CAF50` | **CTA chính, nút hành động** — xanh lá sống động cho nút "Thêm vào giỏ", "Đặt hàng", "Lưu"                                |
| `--green-700` | `#388E3C` | **Text nhấn mạnh, heading phụ** — xanh rừng đậm dùng khi cần nhấn trên nền sáng mà vẫn giữ tông tự nhiên                 |
| `--green-900` | `#2E7D32` | **Text quan trọng nhất, status "Hoàn tất"** — xanh đậm nhất, thay thế đen thuần cho heading chính, badge hoàn thành           |

### 🧩 Quy tắc áp dụng màu

```
Nền trang        → #FAF5EB  (kem ấm — mềm mại, không chói)
Nền card/section  → #E8F5E9  (mint nhạt — phân tách nhẹ nhàng)
Viền & divider    → #C5E0B4  (sage — tinh tế, không cứng)
Icon & accent     → #8BC34A  (lá tươi — sinh động nhưng không chói)
Nút CTA chính     → #4CAF50  (xanh sống — thu hút hành động)
Text nhấn         → #388E3C  (rừng — nghiêm túc nhưng tự nhiên)
Heading / badge   → #2E7D32  (emerald đậm — trọng lượng cao nhất)
```

### 💫 Chuyển động & Tương tác

- **Fade-in nhẹ nhàng**: `animate-in fade-in slide-in-from-bottom` — nội dung xuất hiện từ dưới lên, không giật
- **Hover scale**: `hover:scale-105`, `hover:-translate-y-1` — card "nhấc lên" khi rê chuột, tạo cảm giác sống động
- **Pulse indicator**: Dot trạng thái kho hàng nhấp nháy nhẹ — thu hút chú ý mà không gây phiền

### 🛠️ Công nghệ

- **Styling**: Tailwind CSS — utility-first, dễ maintain
- **State Management**: React Context (`AuthContext`, `CartContext`)
- **Charts**: Recharts (admin dashboard — biểu đồ doanh thu)
