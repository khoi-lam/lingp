import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';

const statusStyles = {
    delivered: { bg: 'bg-[#E8F5E9]', text: 'text-[#2E7D32]', icon: 'check_circle', label: 'Đã giao' },
    shipping: { bg: 'bg-[#FFF3E0]', text: 'text-[#E65100]', icon: 'local_shipping', label: 'Đang giao' },
    confirmed: { bg: 'bg-[#E3F2FD]', text: 'text-[#0D47A1]', icon: 'verified', label: 'Đã xác nhận' },
    pending: { bg: 'bg-gray-100', text: 'text-gray-600', icon: 'hourglass_empty', label: 'Chờ xử lý' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-500', icon: 'cancel', label: 'Đã huỷ' },
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const fmt = (n) => Number(n).toLocaleString('vi-VN') + '₫';

    useEffect(() => {
        ordersAPI.getMyOrders().then(r => {
            if (r.data.success) setOrders(r.data.data.orders || r.data.data);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center py-32"><span className="material-symbols-outlined text-5xl animate-spin text-[#4CAF50]">progress_activity</span></div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[#2B3A67] mb-2 flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-[#4CAF50]">receipt_long</span> Đơn Hàng Của Tôi
            </h1>
            <p className="text-[#388E3C] mb-8">Theo dõi và quản lý đơn hàng sách của bạn</p>

            <div className="space-y-4">
                {orders.map(order => {
                    const style = statusStyles[order.status] || statusStyles.pending;
                    const total = order.totalAmount || order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
                    const itemCount = order.items?.length || 0;
                    const dateStr = new Date(order.createdAt).toLocaleDateString('vi-VN');
                    return (
                        <div key={order._id} className="bg-white rounded-lg p-6 shadow-sm border border-[#E8F5E9] hover:shadow-md hover:border-[#C5E0B4] transition-all group cursor-pointer">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl ${style.bg} flex items-center justify-center ${style.text}`}>
                                        <span className="material-symbols-outlined">{style.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#2B3A67] text-lg">#{order._id.slice(-4).toUpperCase()}</h3>
                                        <p className="text-sm text-gray-500">{dateStr} • {itemCount} sản phẩm</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${style.bg} ${style.text}`}>{style.label}</span>
                                    <span className="font-display font-bold text-xl text-[#2E7D32]">{fmt(total)}</span>
                                    <span className="material-symbols-outlined text-[#8BC34A] group-hover:translate-x-1 transition-transform">chevron_right</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {orders.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-[#E8F5E9]">
                    <span className="material-symbols-outlined text-[100px] text-[#C5E0B4] mb-4 block">inventory_2</span>
                    <h3 className="text-2xl font-display font-bold text-[#2E7D32] mb-2">Chưa có đơn hàng</h3>
                    <p className="text-gray-500 mb-6">Bắt đầu mua sắm để xem đơn hàng tại đây!</p>
                    <Link to="/shop" className="px-8 py-3 bg-[#4CAF50] text-white font-bold rounded-full hover:bg-[#388E3C] transition-colors inline-block">Duyệt Sách</Link>
                </div>
            )}
        </div>
    );
}
