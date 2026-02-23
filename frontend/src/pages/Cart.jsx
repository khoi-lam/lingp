import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
    const { items, updateQty, removeFromCart, cartTotal } = useCart();
    const shipping = cartTotal > 300000 ? 0 : 30000;
    const total = cartTotal + shipping;
    const fmt = (n) => Number(n).toLocaleString('vi-VN') + '₫';

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <span className="material-symbols-outlined text-[120px] text-[#C5E0B4] mb-6 block">shopping_cart</span>
                <h2 className="text-3xl font-display font-bold text-[#2E7D32] mb-4">Giỏ hàng trống</h2>
                <p className="text-gray-500 mb-8">Có vẻ bạn chưa thêm sản phẩm nào!</p>
                <Link to="/shop" className="px-8 py-3 bg-[#4CAF50] text-white font-bold rounded-full hover:bg-[#388E3C] transition-colors inline-flex items-center gap-2">
                    <span className="material-symbols-outlined">storefront</span> Tiếp Tục Mua Sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[#2B3A67] mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-[#4CAF50]">shopping_cart</span> Giỏ Hàng
                <span className="text-sm font-normal text-[#388E3C] bg-[#E8F5E9] px-3 py-1 rounded-full">{items.length} sản phẩm</span>
            </h1>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                    {items.map(item => (
                        <div key={item._id} className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-[#E8F5E9] flex gap-4 group hover:shadow-md transition-all">
                            <div className="w-20 h-28 md:w-24 md:h-32 bg-[#E8F5E9] rounded-xl overflow-hidden flex-shrink-0 border border-[#C5E0B4]">
                                {item.image ? <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={item.image} /> : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-3xl text-[#8BC34A]">menu_book</span></div>}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-display font-bold text-lg text-[#2B3A67] truncate">{item.title}</h3>
                                    <p className="text-sm text-[#388E3C]">{item.author}</p>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center bg-[#E8F5E9] rounded-full">
                                        <button onClick={() => updateQty(item._id, item.quantity - 1)} className="w-8 h-8 rounded-full hover:bg-[#C5E0B4] flex items-center justify-center text-[#2E7D32] font-bold transition-colors">−</button>
                                        <span className="w-8 text-center font-bold text-[#2E7D32]">{item.quantity}</span>
                                        <button onClick={() => updateQty(item._id, item.quantity + 1)} className="w-8 h-8 rounded-full hover:bg-[#C5E0B4] flex items-center justify-center text-[#2E7D32] font-bold transition-colors">+</button>
                                    </div>
                                    <span className="font-bold text-[#2E7D32] text-lg">{fmt(item.price * item.quantity)}</span>
                                    <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="lg:w-[380px] flex-shrink-0">
                    <div className="sticky top-24 bg-white rounded-xl p-6 shadow-lg border border-[#C5E0B4]">
                        <h3 className="text-xl font-display font-bold text-[#2B3A67] mb-6 pb-4 border-b border-[#E8F5E9]">Tóm Tắt Đơn Hàng</h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm text-[#2E7D32]">
                                <span>Tạm tính</span><span className="font-semibold">{fmt(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-[#2E7D32]">
                                <span>Phí vận chuyển</span><span className={`font-semibold ${shipping === 0 ? 'text-[#4CAF50]' : ''}`}>{shipping === 0 ? 'Miễn phí' : fmt(shipping)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end mb-8 pt-4 border-t border-[#C5E0B4]">
                            <span className="text-[#2B3A67] font-bold text-lg">Tổng cộng</span>
                            <span className="text-2xl font-display font-bold text-[#388E3C]">{fmt(total)}</span>
                        </div>
                        <Link to="/checkout" className="block w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold py-4 rounded-2xl shadow-lg transition-all text-center hover:-translate-y-1">
                            Tiến Hành Thanh Toán
                        </Link>
                        <Link to="/shop" className="block text-center text-sm text-[#388E3C] font-bold mt-4 hover:underline">Tiếp tục mua sắm</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
