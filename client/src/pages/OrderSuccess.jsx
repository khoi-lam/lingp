import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const OrderSuccess = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data.data.order);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-fahasa-red border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="bg-white rounded-[40px] p-12 lg:p-20 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-10">
                    <div className="w-24 h-24 bg-green-50 rounded-[32px] flex items-center justify-center mx-auto text-green-500 shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-black text-fahasa-dark uppercase tracking-widest">Đặt hàng thành công!</h1>
                        <p className="text-gray-400 font-bold">Cảm ơn bạn đã tin tưởng và mua sắm tại Bookstore.</p>
                    </div>

                    {order && (
                        <div className="bg-gray-50 rounded-3xl p-8 space-y-6 text-left">
                            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã đơn hàng</span>
                                <span className="text-sm font-black text-fahasa-dark">#{order._id.slice(-8).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phương thức thanh toán</span>
                                <span className="text-sm font-black text-fahasa-dark uppercase">{order.paymentMethod === 'cod' ? 'COD - Tiền mặt' : 'Chuyển khoản ngân hàng'}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-sm font-black text-fahasa-dark uppercase tracking-widest">Tổng tiền</span>
                                <span className="text-2xl font-black text-fahasa-red">{order.totalAmount.toLocaleString()}đ</span>
                            </div>
                        </div>
                    )}

                    {order?.paymentMethod === 'transfer' && (
                        <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100 space-y-4 text-left">
                            <div className="flex items-center space-x-3 text-orange-600">
                                <span className="text-xl">ℹ️</span>
                                <h4 className="text-sm font-black uppercase tracking-widest">Thông tin chuyển khoản</h4>
                            </div>
                            <div className="space-y-2 text-sm font-bold text-gray-600">
                                <p>Ngân hàng: **Vietcombank**</p>
                                <p>Số tài khoản: **1234567890**</p>
                                <p>Chủ tài khoản: **FAHASA BOOKSTORE**</p>
                                <p>Nội dung: **{order._id.slice(-8).toUpperCase()}**</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            to="/shop"
                            className="py-5 bg-gray-50 text-fahasa-dark rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                        >
                            Tiếp tục mua sắm
                        </Link>
                        <Link
                            to="/"
                            className="py-5 bg-fahasa-red text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-fahasa-red/20 hover:bg-fahasa-red/90 transition-all"
                        >
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
