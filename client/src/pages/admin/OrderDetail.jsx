import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const AdminOrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [statusData, setStatusData] = useState({
        orderStatus: '',
        paymentStatus: '',
        trackingNumber: ''
    });

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data.data.order);
                setStatusData({
                    orderStatus: res.data.data.order.orderStatus,
                    paymentStatus: res.data.data.order.paymentStatus,
                    trackingNumber: res.data.data.order.trackingNumber || ''
                });
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            await api.put(`/orders/${id}/status`, {
                status: statusData.orderStatus,
                paymentStatus: statusData.paymentStatus,
                trackingNumber: statusData.trackingNumber
            });

            // Refresh order data
            const res = await api.get(`/orders/${id}`);
            setOrder(res.data.data.order);
            alert('Cập nhật thành công!');
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Lỗi khi cập nhật!');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="p-10 flex justify-center">
            <div className="w-12 h-12 border-4 border-fahasa-red border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!order) return (
        <div className="p-10 text-center space-y-4">
            <h2 className="text-2xl font-black text-fahasa-dark">Không tìm thấy đơn hàng</h2>
            <Link to="/admin/orders" className="text-fahasa-red font-bold">Quay lại danh sách</Link>
        </div>
    );

    return (
        <AdminLayout>
            <div className="p-6 lg:p-10 space-y-8">
                <div className="flex items-center space-x-4">
                    <Link to="/admin/orders" className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-fahasa-red transition-all shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-fahasa-red uppercase tracking-widest">Đơn hàng #{order._id.slice(-6).toUpperCase()}</p>
                        <h1 className="text-2xl font-black text-fahasa-dark uppercase">Chi tiết đơn hàng</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Information Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Items Card */}
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-sm font-black text-fahasa-dark uppercase tracking-widest">Sản phẩm trong đơn</h3>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{order.items.length} món</span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {order.items.map((item, index) => (
                                    <div key={index} className="px-8 py-6 flex items-center space-x-6">
                                        <div className="w-20 h-28 bg-gray-50 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                                            <img
                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/150x200'}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <h4 className="font-black text-fahasa-dark line-clamp-2">{item.title}</h4>
                                            <div className="flex items-center space-x-4 text-xs">
                                                <span className="text-fahasa-red font-black">{item.price?.toLocaleString()}đ</span>
                                                <span className="text-gray-400 font-bold">Số lượng: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-fahasa-dark">{(item.price * item.quantity).toLocaleString()}đ</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-8 py-8 bg-gray-50/50 border-t border-gray-50 flex justify-end">
                                <div className="w-full max-w-xs space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-gray-400 uppercase tracking-widest">Tạm tính</span>
                                        <span className="font-black text-fahasa-dark">{order.totalAmount?.toLocaleString()}đ</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-gray-400 uppercase tracking-widest">Phí vận chuyển</span>
                                        <span className="font-black text-green-600 uppercase">Miễn phí</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-lg font-black text-fahasa-dark uppercase tracking-widest">Tổng cộng</span>
                                        <span className="text-2xl font-black text-fahasa-red">{order.totalAmount?.toLocaleString()}đ</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 space-y-6">
                                <h3 className="text-sm font-black text-fahasa-dark uppercase tracking-widest">Thông tin giao hàng</h3>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Người nhận</p>
                                        <p className="font-black text-fahasa-dark">{order.shippingAddress.fullName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số điện thoại</p>
                                        <p className="font-bold text-fahasa-dark">{order.shippingAddress.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Địa chỉ</p>
                                        <p className="font-bold text-fahasa-dark leading-relaxed">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                    </div>
                                    {order.shippingAddress.note && (
                                        <div className="space-y-1 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                                            <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Ghi chú</p>
                                            <p className="text-xs font-bold text-yellow-700 italic">"{order.shippingAddress.note}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 space-y-6">
                                <h3 className="text-sm font-black text-fahasa-dark uppercase tracking-widest">Thanh toán</h3>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phương thức</p>
                                        <p className="font-black text-fahasa-dark uppercase tracking-widest">{order.paymentMethod}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái thanh toán</p>
                                        <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã giao dịch</p>
                                        <p className="font-bold text-gray-400 truncate">{order.vnpayTransactionId || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Column */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 space-y-8 sticky top-8">
                            <h3 className="text-sm font-black text-fahasa-dark uppercase tracking-widest">Cập nhật đơn hàng</h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Trạng thái vận chuyển</label>
                                    <select
                                        value={statusData.orderStatus}
                                        onChange={(e) => setStatusData({ ...statusData, orderStatus: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-fahasa-dark focus:ring-2 focus:ring-fahasa-red/20 outline-none transition-all appearance-none"
                                    >
                                        <option value="waiting">Chờ xác nhận</option>
                                        <option value="processing">Đang xử lý</option>
                                        <option value="shipping">Đang giao</option>
                                        <option value="delivered">Đã giao</option>
                                        <option value="completed">Hoàn tất</option>
                                        <option value="cancelled">Hủy đơn</option>
                                        <option value="returned">Trả hàng</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Trạng thái thanh toán</label>
                                    <select
                                        value={statusData.paymentStatus}
                                        onChange={(e) => setStatusData({ ...statusData, paymentStatus: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-fahasa-dark focus:ring-2 focus:ring-fahasa-red/20 outline-none transition-all appearance-none"
                                    >
                                        <option value="pending">Chờ thanh toán</option>
                                        <option value="paid">Đã thanh toán</option>
                                        <option value="failed">Thất bại</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mã vận đơn</label>
                                    <input
                                        type="text"
                                        value={statusData.trackingNumber}
                                        onChange={(e) => setStatusData({ ...statusData, trackingNumber: e.target.value })}
                                        placeholder="VN-XXXXXXX"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-fahasa-dark focus:ring-2 focus:ring-fahasa-red/20 outline-none transition-all"
                                    />
                                </div>

                                <button
                                    onClick={handleUpdate}
                                    disabled={updating}
                                    className="w-full py-5 bg-fahasa-red text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-fahasa-red/20 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50"
                                >
                                    {updating ? 'Đang cập nhật...' : 'Lưu cập nhật'}
                                </button>
                            </div>

                            <div className="pt-8 border-t border-gray-100">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center">Tạo lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrderDetail;

