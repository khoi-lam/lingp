export const adminStats = {
    revenue: { value: '₫124.500.000', change: '+12%', icon: 'payments', color: 'green' },
    orders: { value: '3.402', change: '+5%', icon: 'shopping_cart', color: 'orange' },
    users: { value: '12.200', change: '+8%', icon: 'group', color: 'blue' },
    books: { value: '1.850', change: '+20%', icon: 'library_books', color: 'emerald' },
};

export const adminOrders = [
    { id: '#2931', customer: 'Nguyễn Minh Anh', book: 'Rừng Xanh Bí Ẩn', status: 'Đã giao', statusColor: 'green', amount: '₫240.000', date: '18/02/2026', items: 2 },
    { id: '#2930', customer: 'Trần Văn Hùng', book: 'Khu Vườn Bí Mật', status: 'Đang xử lý', statusColor: 'yellow', amount: '₫185.000', date: '18/02/2026', items: 1 },
    { id: '#2929', customer: 'Lê Thu Hà', book: 'Hoàng Tử Bé', status: 'Đã giao', statusColor: 'green', amount: '₫150.000', date: '17/02/2026', items: 1 },
    { id: '#2928', customer: 'Phạm Quốc Bảo', book: 'Harry Potter', status: 'Đã hủy', statusColor: 'red', amount: '₫210.000', date: '17/02/2026', items: 3 },
    { id: '#2927', customer: 'Võ Thị Mai', book: 'Lập Trình Cho Bé', status: 'Đang giao', statusColor: 'blue', amount: '₫299.000', date: '16/02/2026', items: 1 },
    { id: '#2926', customer: 'Đỗ Hoàng Long', book: 'Hành Tinh Xanh', status: 'Đã giao', statusColor: 'green', amount: '₫125.000', date: '16/02/2026', items: 2 },
];

export const adminProducts = [
    { id: '#1024', title: 'Rừng Xanh Phiêu Lưu', author: 'Nguyễn Văn A', isbn: '978-3-16-148410-0', category: 'Thiếu Nhi', categoryColor: 'blue', price: '₫149.000', stock: 'Còn hàng', stockColor: 'green', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2LKSHxPhrtgEvtuRk-W-Spu5XGWTJKccExVxBUAhJULhKqwITz-hkHAm0uS3LPS-DM_GsHmk_9WRtpyqkjjvkW8X-0FeWR3ecITIufPLvPMXJcn30fRpf_8umgAYKjmyIdXULQ275aIAe7LFuq1jDJhEbmULpTpscKfLOi3awXg_wl-k1wk_CT2MAeNqFvnEZnPP_WNVH1FDUbDtNfIbQ772eQKy7Q1RDL8QWhiAN7JREk3EsRQvpd3entxF1Z9vls9TVT_WQXbM' },
    { id: '#1025', title: 'Lập Trình Cho Bé', author: 'Trần Minh B', isbn: '978-1-23-456789-0', category: 'Giáo Dục', categoryColor: 'purple', price: '₫299.000', stock: 'Sắp hết', stockColor: 'orange', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaevqYSwpUk_28vilwUKQRm5JC1SX70Ye34Qr9_692w1QaZQ5HN_rS8kLkFUsC62d442CLLe5A_NFxxf-T6pN6Xd6aC-uRlhFBvyeCKXy2m4998mkURrxtt2cFNiLJBuVmkqRIe7UG_rgcyOrDQYgbu2XhhbwmDycMu967Bgd2NLjzq5nIlxBwHR0I1xK3a47cgF36uylGW-S-ov77A7v86htXEx6xHR0Kj4sXoHv94Bfm5w8n2Gn2WbTmBAzxSc8urbdkMKUERsQ' },
    { id: '#1026', title: 'Hành Tinh Xanh', author: 'Lê Eco', isbn: '978-0-00-000000-0', category: 'Khoa Học', categoryColor: 'green', price: '₫125.000', stock: 'Hết hàng', stockColor: 'red', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDom_Sf49MqH1L7pF3nvfJOAgIPd53pn7fmNzg3LIyAt4A0TmONjIJXnrgg1--4LAj_lS_6A1ACe0p70IKx67HuQDAwwxt57iJiwT9dhP1q_7jykYady90LWBVeFNr0jtE-LZOIXI1OljvYqIMiIBYnDK2c0Q4gggRoWe2vnhsuN-lJaOXp-btIKrz1JQ2WQ6vadP5SNOnSNSPg1J72ZIcMGhSKBIE3UNMQv3PxG23FSd5BZvJ4XHDx1DubhMk5YPZG3-CLsR6tL0A' },
    { id: '#1027', title: 'Hoàng Tử Bé', author: 'Antoine de Saint-Exupéry', isbn: '978-0-15-601219-5', category: 'Kinh Điển', categoryColor: 'yellow', price: '₫109.000', stock: 'Còn hàng', stockColor: 'green', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQqdBnAwofLpM4KkO08rEKKDQPPo6q-jXbahDPo-yiJ0URctS6EZxw46ozs1QYRxEx4JPzSZf7EA89f54gwASCh2cAk6tyLuDldzLbADyFygnTIkNt--yWA8OEWqmPCY9u3_b0WS06cHakRzpfjHeRJULP1yEKnu5TGG6PJFh6l9yipGkFM5n1LU5aiBMKFbGLN87aKDBifw3contj9Gt5WBG2Tol_HImK4Y2r0Q7BGwkM226eaYKE3aPqFJDJdoD-cWO_ndUK2-A' },
    { id: '#1028', title: 'Harry Potter', author: 'J.K. Rowling', isbn: '978-0-7475-3269-9', category: 'Giả Tưởng', categoryColor: 'indigo', price: '₫249.000', stock: 'Còn hàng', stockColor: 'green', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8QXXfHw17VpJYURGWRXejjsf3YkTU63r8ykQbhF8sfZnnKvjKxzkVtfAom2so4spHM2DWDJfZghMBQCKHyS3EfYHf-2ehfrmQx456hrLu3xjGy9sGYXnn-yAZzzKInRDmU0Au87wA4zQ3J84Bxi3RsDRS2eKYVK_6x90sWgped5Kjeut43svUu0PuDXVu4Sn14gdcbkjBFGaKNy93XzYb82U-dygGgAVMsWJG1u9TSH3XsMD1SMyZLPnfL7WFLWCE_hZ3uROHomg' },
    { id: '#1029', title: 'Mùa Xuân Thầm Lặng', author: 'Rachel Carson', isbn: '978-0-618-24906-0', category: 'Khoa Học', categoryColor: 'teal', price: '₫180.000', stock: 'Sắp hết', stockColor: 'orange', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFzANB0-Idz_QE1Ft73PvnLGNmgRyfb_lbJ7jxLeqK90tpV0rnBApz8Arbn3NLcUITJ6x45p-gK7CATIUxcZSr82YtGc7ZHRAqD-sky8aRCcN_Qz4MevPHBOUAlgwLPX58Jeuxglp7bo27GRORzy7lmLjXM_DxB5ADH1LX539reJ78NZQ1nkZOHOva_a7IxYVxHt_avKFe5dOmvjxUuMP1PZ5mgz7mncgTxE3Kf2WC5WwE8X25w7Q9hQXOXi5OqnMbgWny7TjyEeA' },
];

export const adminUsers = [
    { id: 1, name: 'Nguyễn Minh Anh', email: 'minhanh@email.com', role: 'Khách hàng', roleColor: 'blue', orders: 12, joined: '15/01/2025', status: 'Hoạt động' },
    { id: 2, name: 'Trần Văn Hùng', email: 'vanhung@email.com', role: 'Khách hàng', roleColor: 'blue', orders: 8, joined: '22/03/2025', status: 'Hoạt động' },
    { id: 3, name: 'Lê Thu Hà', email: 'thuha@email.com', role: 'VIP', roleColor: 'yellow', orders: 45, joined: '01/06/2024', status: 'Hoạt động' },
    { id: 4, name: 'Phạm Quốc Bảo', email: 'quocbao@email.com', role: 'Khách hàng', roleColor: 'blue', orders: 3, joined: '10/12/2025', status: 'Tạm khóa' },
    { id: 5, name: 'Võ Thị Mai', email: 'thimai@email.com', role: 'VIP', roleColor: 'yellow', orders: 28, joined: '05/08/2024', status: 'Hoạt động' },
];

export const adminTickets = [
    { id: 'TK-001', customer: 'Nguyễn Minh Anh', email: 'minhanh@email.com', phone: '0901 234 567', orderCode: 'DH-2026-0041', subject: 'Đơn hàng giao chậm', category: 'Vấn Đề Đơn Hàng', content: 'Tôi đặt hàng cách đây 7 ngày nhưng chưa nhận được. Mã đơn hàng DH-2026-0041. Xin hãy kiểm tra giúp tôi.', date: '19/02/2026' },
    { id: 'TK-002', customer: 'Trần Văn Hùng', email: 'vanhung@email.com', phone: '0912 345 678', orderCode: 'DH-2026-0038', subject: 'Sách bị hỏng bìa', category: 'Yêu Cầu Đổi Trả', content: 'Sách "Rừng Xanh Phiêu Lưu" tôi nhận được bị rách bìa trước. Tôi muốn đổi sản phẩm mới.', date: '19/02/2026' },
    { id: 'TK-003', customer: 'Lê Thu Hà', email: 'thuha.le@email.com', phone: '0987 654 321', orderCode: '', subject: 'Hỏi về chương trình khuyến mãi', category: 'Hỏi Về Sản Phẩm', content: 'Cho tôi hỏi mã giảm giá FLASH02 có áp dụng cho sách thiếu nhi không? Tôi muốn mua combo 5 cuốn.', date: '18/02/2026' },
    { id: 'TK-004', customer: 'Phạm Quốc Bảo', email: 'quocbao.pham@email.com', phone: '0933 111 222', orderCode: 'DH-2026-0029', subject: 'Không áp dụng được mã giảm giá', category: 'Khác', content: 'Tôi nhập mã NEWUSER nhưng hệ thống báo lỗi "Mã không hợp lệ". Tôi là khách hàng mới đăng ký hôm qua.', date: '17/02/2026' },
    { id: 'TK-005', customer: 'Võ Thị Mai', email: 'mai.vo@email.com', phone: '0977 888 999', orderCode: '', subject: 'Câu hỏi về tính năng AR', category: 'Hỏi Về Sản Phẩm', content: 'Tính năng AR scan sách hoạt động trên iPhone 12 không ạ? Tôi tải app nhưng không thấy nút scan.', date: '16/02/2026' },
];

export const adminPromotions = [
    { id: 1, name: 'Flash Sale Tháng 2', code: 'FLASH02', discount: '30%', type: 'Phần trăm', startDate: '01/02/2026', endDate: '28/02/2026', status: 'Đang hoạt động', statusColor: 'green', used: 234 },
    { id: 2, name: 'Chào Xuân 2026', code: 'SPRING26', discount: '₫50.000', type: 'Cố định', startDate: '01/03/2026', endDate: '31/03/2026', status: 'Sắp tới', statusColor: 'blue', used: 0 },
    { id: 3, name: 'Khách Hàng Mới', code: 'NEWUSER', discount: '15%', type: 'Phần trăm', startDate: '01/01/2026', endDate: '31/12/2026', status: 'Đang hoạt động', statusColor: 'green', used: 890 },
    { id: 4, name: 'Tết Nguyên Đán', code: 'TET2026', discount: '40%', type: 'Phần trăm', startDate: '15/01/2026', endDate: '15/02/2026', status: 'Đã kết thúc', statusColor: 'gray', used: 1205 },
];

export const adminVideos = [
    { id: 1, title: 'Phiêu Lưu Trong Rừng Xanh', book: 'Rừng Xanh Phiêu Lưu', duration: '2:45', views: 1250, status: 'Đã xuất bản', statusColor: 'green', date: '10/02/2026' },
    { id: 2, title: 'Khám Phá Đại Dương', book: 'Hành Tinh Xanh', duration: '3:12', views: 890, status: 'Đã xuất bản', statusColor: 'green', date: '08/02/2026' },
    { id: 3, title: 'Thế Giới Phép Thuật', book: 'Harry Potter', duration: '4:30', views: 2100, status: 'Đã xuất bản', statusColor: 'green', date: '05/02/2026' },
    { id: 4, title: 'Hành Trình Hoàng Tử Bé', book: 'Hoàng Tử Bé', duration: '2:15', views: 0, status: 'Nháp', statusColor: 'yellow', date: '18/02/2026' },
];

export const topSellers = [
    { title: 'Rừng Xanh Phiêu Lưu', author: 'Nguyễn Văn A', sold: 450, percent: 85 },
    { title: 'Khám Phá Đại Dương', author: 'Sarah Waves', sold: 320, percent: 65 },
    { title: 'Đỉnh Núi Cao', author: 'Alex Peak', sold: 210, percent: 45 },
];

export const adminStaff = [
    { id: 101, name: 'Admin LingoLand', email: 'admin@lingoland.com', role: 'Admin', joined: '01/01/2024', status: 'Hoạt động' },
    { id: 102, name: 'Nguyễn Thị Lan', email: 'lan.nguyen@lingoland.com', role: 'Nhân viên', joined: '15/03/2024', status: 'Hoạt động' },
    { id: 103, name: 'Trần Quốc Việt', email: 'viet.tran@lingoland.com', role: 'Nhân viên', joined: '20/06/2024', status: 'Hoạt động' },
];

export const adminCategories = [
    { id: 1, name: 'Thiếu Nhi', description: 'Sách dành cho trẻ em, truyện tranh và phiêu lưu.', bookCount: 245, icon: 'child_care', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', active: true },
    { id: 2, name: 'Giáo Dục', description: 'Sách giáo khoa, tài liệu học tập và tham khảo.', bookCount: 380, icon: 'school', iconBg: 'bg-green-50', iconColor: 'text-green-600', active: true },
    { id: 3, name: 'Khoa Học', description: 'Sách khoa học tự nhiên, công nghệ và khám phá.', bookCount: 156, icon: 'science', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', active: true },
    { id: 4, name: 'Kinh Điển', description: 'Các tác phẩm văn học kinh điển thế giới.', bookCount: 98, icon: 'auto_stories', iconBg: 'bg-yellow-50', iconColor: 'text-yellow-600', active: true },
    { id: 5, name: 'Giả Tưởng', description: 'Truyện viễn tưởng, fantasy và phép thuật.', bookCount: 210, icon: 'castle', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', active: true },
    { id: 6, name: 'Kỹ Năng Sống', description: 'Sách phát triển bản thân và kỹ năng mềm.', bookCount: 175, icon: 'psychology', iconBg: 'bg-orange-50', iconColor: 'text-orange-600', active: false },
];
