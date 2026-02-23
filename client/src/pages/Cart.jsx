import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../config';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="text-xl font-black text-vanxuan-dark uppercase tracking-widest">Giỏ hàng trống</h2>
                <p className="text-gray-400 font-bold mt-2 mb-8 text-center">Chưa có sản phẩm nào trong giỏ hàng của bạn.</p>
                <Link to="/shop" className="px-10 py-4 bg-vanxuan-red text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-vanxuan-red/20 hover:bg-vanxuan-red/90 transition-all">
                    Mua sắm ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-2xl font-black text-vanxuan-dark uppercase tracking-widest mb-10 flex items-center space-x-4">
                    <span>Giỏ hàng</span>
                    <span className="text-sm font-bold text-gray-400 normal-case tracking-normal">({cart.length} sản phẩm)</span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="flex-1 space-y-4">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <div className="col-span-6">Sản phẩm</div>
                                <div className="col-span-2 text-center">Số lượng</div>
                                <div className="col-span-3 text-right">Thành tiền</div>
                                <div className="col-span-1"></div>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {cart.map((item) => (
                                    <div key={item._id} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group hover:bg-gray-50/30 transition-colors">
                                        <div className="col-span-1 md:col-span-6 flex items-center space-x-6">
                                            <div className="w-20 h-28 bg-gray-50 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                                <img
                                                    src={getImageUrl(item.images?.[0])}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Link to={`/product/${item._id}`} className="text-sm font-black text-vanxuan-dark hover:text-vanxuan-red transition-colors line-clamp-2">
                                                    {item.title}
                                                </Link>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.author}</p>
                                                <p className="text-sm font-black text-vanxuan-red pt-1">{item.price.toLocaleString()}đ</p>
                                            </div>
                                        </div>

                                        <div className="col-span-1 md:col-span-2 flex justify-center">
                                            <div className="flex items-center bg-gray-50 rounded-xl p-0.5 border border-gray-100">
                                                <button
                                                    onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-vanxuan-red transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <span className="w-8 text-center text-xs font-black text-vanxuan-dark">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-vanxuan-red transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-span-1 md:col-span-3 text-right">
                                            <p className="text-base font-black text-vanxuan-red">
                                                {(item.price * item.quantity).toLocaleString()}đ
                                            </p>
                                        </div>

                                        <div className="col-span-1 md:col-span-1 flex justify-end">
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Xóa sản phẩm"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link to="/shop" className="inline-flex items-center space-x-2 text-xs font-black text-vanxuan-red uppercase tracking-widest hover:underline px-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Tiếp tục mua sắm</span>
                        </Link>
                    </div>

                    {/* Order Summary Summary Sidebar */}
                    <div className="w-full lg:w-96 space-y-6">
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                            <h3 className="text-sm font-black text-vanxuan-dark uppercase tracking-widest border-b border-gray-50 pb-4">Thanh toán</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Tạm tính</span>
                                    <span className="text-vanxuan-dark">{getCartTotal().toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Giao hàng</span>
                                    <span className="text-green-500">Miễn phí</span>
                                </div>
                                <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                                    <span className="text-sm font-black text-vanxuan-dark uppercase tracking-widest">Tổng cộng</span>
                                    <span className="text-2xl font-black text-vanxuan-red">{getCartTotal().toLocaleString()}đ</span>
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold text-right">(Đã bao gồm VAT)</p>
                            </div>

                            <Link
                                to="/checkout"
                                className="block w-full py-5 bg-vanxuan-red text-white text-center rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-vanxuan-red/20 hover:bg-vanxuan-red/90 hover:-translate-y-1 transition-all active:translate-y-0"
                            >
                                Xác nhận giỏ hàng
                            </Link>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
