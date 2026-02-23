import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../config';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/my-orders');
                setOrders(res.data.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            waiting: 'bg-yellow-50 text-yellow-600 border-yellow-100',
            processing: 'bg-blue-50 text-blue-600 border-blue-100',
            shipping: 'bg-purple-50 text-purple-600 border-purple-100',
            delivered: 'bg-green-50 text-green-600 border-green-100',
            completed: 'bg-green-50 text-green-600 border-green-100',
            cancelled: 'bg-red-50 text-red-600 border-red-100',
            returned: 'bg-orange-50 text-orange-600 border-orange-100'
        };
        return colors[status] || 'bg-gray-50 text-gray-600 border-gray-100';
    };

    const getStatusText = (status) => {
        const texts = {
            waiting: 'Chờ xác nhận',
            processing: 'Đang xử lý',
            shipping: 'Đang giao',
            delivered: 'Đã giao',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy',
            returned: 'Đã trả'
        };
        return texts[status] || status;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-vanxuan-red border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-2xl font-black text-vanxuan-dark uppercase tracking-widest">Đơn hàng của tôi</h1>
                    <Link to="/shop" className="text-xs font-black text-vanxuan-red uppercase tracking-widest hover:underline">
                        Tiếp tục mua sắm
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-20 text-center border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">📦</span>
                        </div>
                        <h4 className="text-xl font-black text-vanxuan-dark uppercase">Chưa có đơn hàng</h4>
                        <p className="text-gray-400 font-bold mt-2">Bạn chưa có đơn hàng nào.</p>
                        <Link to="/shop" className="inline-block mt-8 px-10 py-4 bg-vanxuan-red text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-vanxuan-red/20 hover:bg-vanxuan-red/90 transition-all">
                            Mua sắm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-shadow">
                                {/* Order Header */}
                                <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-center space-x-6">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mã đơn hàng</p>
                                            <p className="text-sm font-black text-vanxuan-dark">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <div className="h-8 w-px bg-gray-200"></div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ngày đặt</p>
                                            <p className="text-sm font-bold text-vanxuan-dark">
                                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl border-2 text-xs font-black uppercase tracking-widest ${getStatusColor(order.orderStatus)}`}>
                                        {getStatusText(order.orderStatus)}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-8 space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center space-x-6 pb-4 border-b border-gray-50 last:border-0">
                                            <div className="w-16 h-20 bg-gray-50 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                                <img
                                                    src={getImageUrl(item.product?.images?.[0])}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-black text-vanxuan-dark line-clamp-1">{item.title}</h4>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <span className="text-xs font-bold text-gray-400">Số lượng: {item.quantity}</span>
                                                    <span className="text-xs font-black text-vanxuan-red">{item.price.toLocaleString()}đ</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer */}
                                <div className="bg-gray-50/30 px-8 py-6 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-center space-x-6 text-sm">
                                        <div>
                                            <span className="text-gray-400 font-bold">Thanh toán: </span>
                                            <span className="font-black text-vanxuan-dark uppercase">
                                                {order.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản'}
                                            </span>
                                        </div>
                                        <div className="h-4 w-px bg-gray-200"></div>
                                        <div>
                                            <span className="text-gray-400 font-bold">Tổng tiền: </span>
                                            <span className="text-lg font-black text-vanxuan-red">{order.totalAmount.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/order-success/${order._id}`}
                                        className="px-6 py-3 bg-vanxuan-dark text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-vanxuan-dark/90 transition-all text-center"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
