import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Notification from '../components/Notification';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        phone: '',
        address: '',
        city: '',
        note: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [notification, setNotification] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Prevent multiple submissions if already loading
        if (loading) return;

        // Validate required fields with trimming
        const errors = [];
        if (!formData.fullName?.trim()) errors.push('Họ và tên');
        if (!formData.phone?.trim()) errors.push('Số điện thoại');
        if (!formData.address?.trim()) errors.push('Địa chỉ chi tiết');
        if (!formData.city?.trim()) errors.push('Thành phố/Tỉnh');

        if (errors.length > 0) {
            setNotification({
                message: `Vui lòng điền đầy đủ: ${errors.join(', ')}`,
                type: 'error'
            });
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                items: cart.map(item => ({
                    product: item._id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalAmount: getCartTotal(),
                shippingAddress: formData,
                paymentMethod
            };

            console.log('Sending order data:', orderData); // Debug log

            const res = await api.post('/orders', orderData);

            if (res.data.success) {
                clearCart();
                navigate(`/order-success/${res.data.data.order._id}`);
            }
        } catch (error) {
            console.error('Error creating order:', error);
            setNotification({
                message: error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-xl font-black text-vanxuan-dark uppercase tracking-widest">Không có gì để thanh toán</h2>
                <Link to="/shop" className="text-vanxuan-red font-bold mt-4 hover:underline">Tiếp tục mua sắm</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Checkout Form Content */}
                        <div className="flex-1 space-y-8">
                            {/* Shipping Info */}
                            <div className="bg-white rounded-[40px] p-8 lg:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-vanxuan-red"></div>
                                <h2 className="text-xl font-black text-vanxuan-dark uppercase tracking-widest mb-10 flex items-center space-x-3">
                                    <span className="w-8 h-8 bg-vanxuan-red text-white rounded-lg flex items-center justify-center text-sm">1</span>
                                    <span>Thông tin giao hàng</span>
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 col-span-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Họ và tên</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-vanxuan-dark focus:ring-2 focus:ring-vanxuan-red/20 transition-all"
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-vanxuan-dark focus:ring-2 focus:ring-vanxuan-red/20 transition-all"
                                            placeholder="0987xxxxxx"
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Thành phố/Tỉnh</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-vanxuan-dark focus:ring-2 focus:ring-vanxuan-red/20 transition-all"
                                            placeholder="TP. Hồ Chí Minh"
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Địa chỉ chi tiết</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            rows="3"
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-vanxuan-dark focus:ring-2 focus:ring-vanxuan-red/20 transition-all resize-none"
                                            placeholder="Số nhà, tên đường, phường/xã..."
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Ghi chú (Tùy chọn)</label>
                                        <input
                                            type="text"
                                            name="note"
                                            value={formData.note}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-vanxuan-dark focus:ring-2 focus:ring-vanxuan-red/20 transition-all"
                                            placeholder="Ví dụ: Giao giờ hành chính"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-[40px] p-8 lg:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-vanxuan-red"></div>
                                <h2 className="text-xl font-black text-vanxuan-dark uppercase tracking-widest mb-10 flex items-center space-x-3">
                                    <span className="w-8 h-8 bg-vanxuan-red text-white rounded-lg flex items-center justify-center text-sm">2</span>
                                    <span>Phương thức thanh toán</span>
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'cod' ? 'border-vanxuan-red bg-red-50/50' : 'border-gray-50 bg-gray-50/30 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-vanxuan-red' : 'border-gray-300'}`}>
                                                {paymentMethod === 'cod' && <div className="w-3 h-3 bg-vanxuan-red rounded-full"></div>}
                                            </div>
                                            <div className="text-left text-sm font-black text-vanxuan-dark uppercase tracking-widest">COD</div>
                                        </div>
                                        <span className="text-2xl">💵</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('transfer')}
                                        className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'transfer' ? 'border-vanxuan-red bg-red-50/50' : 'border-gray-50 bg-gray-50/30 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-vanxuan-red' : 'border-gray-300'}`}>
                                                {paymentMethod === 'transfer' && <div className="w-3 h-3 bg-vanxuan-red rounded-full"></div>}
                                            </div>
                                            <div className="text-left text-sm font-black text-vanxuan-dark uppercase tracking-widest">Chuyển khoản</div>
                                        </div>
                                        <span className="text-2xl">💳</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Summary Sidebar */}
                        <div className="w-full lg:w-96 space-y-6">
                            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm sticky top-24">
                                <h3 className="text-sm font-black text-vanxuan-dark uppercase tracking-widest mb-8 pb-4 border-b border-gray-50">Đơn hàng của bạn</h3>

                                <div className="space-y-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar mb-8">
                                    {cart.map(item => (
                                        <div key={item._id} className="flex space-x-4">
                                            <div className="w-16 h-20 bg-gray-50 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                                <img src={item.images?.[0] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"%3E%3Crect fill="%23f3f4f6" width="300" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E'} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-xs font-black text-vanxuan-dark line-clamp-2 leading-tight">{item.title}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-gray-400">Số lượng: {item.quantity}</span>
                                                    <span className="text-xs font-black text-vanxuan-red">{item.price.toLocaleString()}đ</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-6 border-t border-gray-100">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                                        <span>Tạm tính</span>
                                        <span className="text-vanxuan-dark">{getCartTotal().toLocaleString()}đ</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                                        <span>Vận chuyển</span>
                                        <span className="text-green-500">Miễn phí</span>
                                    </div>
                                    <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                                        <span className="text-sm font-black text-vanxuan-dark uppercase tracking-widest">Tổng tiền</span>
                                        <span className="text-2xl font-black text-vanxuan-red">{getCartTotal().toLocaleString()}đ</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold text-right">(Đã bao gồm VAT)</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-10 py-5 bg-vanxuan-red text-white text-center rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-vanxuan-red/20 hover:bg-vanxuan-red/90 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center space-x-3"
                                >
                                    {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                    <span>{paymentMethod === 'cod' ? 'Đặt hàng ngay' : 'Thanh toán ngay'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default Checkout;
