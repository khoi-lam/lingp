import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI } from '../../services/api';

const colorMap = {
    green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'bg-green-50 text-green-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'bg-orange-50 text-orange-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'bg-blue-50 text-blue-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'bg-emerald-50 text-emerald-600' },
};

const statusStyle = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
};

const orderStatusMap = {
    waiting: { label: 'Chờ xử lý', color: 'yellow' },
    processing: { label: 'Đang xử lý', color: 'yellow' },
    shipping: { label: 'Đang giao', color: 'blue' },
    delivered: { label: 'Đã giao', color: 'green' },
    completed: { label: 'Hoàn thành', color: 'green' },
    cancelled: { label: 'Đã hủy', color: 'red' },
    returned: { label: 'Đã trả', color: 'red' },
};

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [dashRes, topRes] = await Promise.all([
                    statsAPI.getDashboard(),
                    statsAPI.getTopProducts(),
                ]);
                if (dashRes.data.success) {
                    setStats(dashRes.data.data.stats);
                    setRecentOrders(dashRes.data.data.recentOrders || []);
                }
                if (topRes.data.success) {
                    setTopProducts(topRes.data.data.topProducts || []);
                }
            } catch (err) {
                console.error('Failed to load dashboard:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-4xl animate-spin text-[#0ea00e]">progress_activity</span>
            </div>
        );
    }

    const kpiCards = [
        { key: 'revenue', label: 'Tổng Doanh Thu', value: formatCurrency(stats?.totalRevenue || 0), icon: 'payments', color: 'green' },
        { key: 'orders', label: 'Tổng Đơn Hàng', value: (stats?.totalOrders || 0).toLocaleString('vi-VN'), icon: 'shopping_cart', color: 'orange' },
        { key: 'users', label: 'Tổng Người Dùng', value: (stats?.totalUsers || 0).toLocaleString('vi-VN'), icon: 'group', color: 'blue' },
        { key: 'books', label: 'Tổng Sách', value: (stats?.totalProducts || 0).toLocaleString('vi-VN'), icon: 'library_books', color: 'emerald' },
    ];

    const maxSold = topProducts.length > 0 ? topProducts[0].soldCount : 1;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#111811] tracking-tight">Tổng Quan</h1>
                    <p className="text-[#618961] mt-1">Chào mừng trở lại! Đây là tình hình cửa hàng hôm nay.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                    30 ngày qua
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpiCards.map((stat) => {
                    const c = colorMap[stat.color];
                    return (
                        <div key={stat.key} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-full ${c.icon}`}>
                                    <span className="material-symbols-outlined">{stat.icon}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[#618961] text-sm font-medium mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-[#111811]">{stat.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sales Chart */}
            <div className="mb-8">
                <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-[#111811]">Xu Hướng Doanh Thu</h2>
                            <p className="text-sm text-[#618961]">Doanh thu 30 ngày qua</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#0ea00e]"></span>
                                <span className="text-sm font-medium text-[#618961]">Kỳ hiện tại</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[300px] relative">
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#0ea00e" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#0ea00e" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0,250 C100,240 150,180 250,200 C350,220 400,100 500,120 C600,140 650,50 750,80 C850,110 900,40 1000,60 L1000,300 L0,300 Z" fill="url(#chartGradient)" />
                            <path d="M0,250 C100,240 150,180 250,200 C350,220 400,100 500,120 C600,140 650,50 750,80 C850,110 900,40 1000,60" fill="none" stroke="#0ea00e" strokeLinecap="round" strokeWidth="4" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Bottom: Orders + Top Sellers */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="xl:col-span-2 bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#111811]">Đơn Hàng Gần Đây</h2>
                        <Link to="/admin/orders" className="text-sm font-bold text-[#618961] hover:text-[#0ea00e] transition-colors">Xem tất cả</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[#618961] text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="pb-3 pl-2 font-semibold">Mã ĐH</th>
                                    <th className="pb-3 font-semibold">Khách hàng</th>
                                    <th className="pb-3 font-semibold">Sản phẩm</th>
                                    <th className="pb-3 font-semibold">Trạng thái</th>
                                    <th className="pb-3 font-semibold text-right pr-2">Giá trị</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-[#111811]">
                                {recentOrders.length === 0 ? (
                                    <tr><td colSpan="5" className="py-8 text-center text-[#618961]">Chưa có đơn hàng nào</td></tr>
                                ) : recentOrders.map((order) => {
                                    const s = orderStatusMap[order.orderStatus] || { label: order.orderStatus, color: 'yellow' };
                                    return (
                                        <tr key={order._id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-4 pl-2 font-medium border-b border-gray-50">#{order._id?.slice(-4).toUpperCase()}</td>
                                            <td className="py-4 border-b border-gray-50">{order.user?.name || order.shippingAddress?.fullName || '—'}</td>
                                            <td className="py-4 text-[#618961] border-b border-gray-50">{order.items?.length || 0} sản phẩm</td>
                                            <td className="py-4 border-b border-gray-50">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusStyle[s.color]}`}>{s.label}</span>
                                            </td>
                                            <td className="py-4 text-right pr-2 font-bold border-b border-gray-50">{formatCurrency(order.totalAmount)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Sellers */}
                <div className="xl:col-span-1 bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#111811]">Bán Chạy Nhất</h2>
                    </div>
                    <div className="flex flex-col gap-5 flex-1">
                        {topProducts.length === 0 ? (
                            <p className="text-center text-[#618961] py-8">Chưa có dữ liệu</p>
                        ) : topProducts.slice(0, 5).map((book, i) => (
                            <div key={book._id || i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#4CAF50] font-bold text-sm">#{i + 1}</div>
                                <div className="flex flex-col flex-1">
                                    <h3 className="font-bold text-[#111811] text-sm line-clamp-1">{book.title}</h3>
                                    <p className="text-xs text-[#618961] mb-2">{book.author}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#0ea00e] rounded-full" style={{ width: `${Math.round((book.soldCount / maxSold) * 100)}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-[#111811]">{book.soldCount}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to="/admin/products" className="w-full mt-6 py-3 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors text-center block">Xem tất cả sản phẩm</Link>
                </div>
            </div>
        </div>
    );
}
