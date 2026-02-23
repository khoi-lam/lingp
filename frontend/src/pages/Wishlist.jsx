import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

import { API_BASE } from '../config.js';
const getImg = (b) => b.images?.[0] ? (b.images[0].startsWith('http') ? b.images[0] : `${API_BASE}/${b.images[0].replace(/^\//, '')}`) : b.image || null;
const fmt = (n) => Number(n).toLocaleString('vi-VN') + '₫';

export default function Wishlist() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const flyToCart = (btnEl) => {
        const cartEl = document.getElementById('cart-icon-nav');
        if (!cartEl || !btnEl) return;
        const btnRect = btnEl.getBoundingClientRect();
        const cartRect = cartEl.getBoundingClientRect();
        const startX = btnRect.left + btnRect.width / 2, startY = btnRect.top + btnRect.height / 2;
        const endX = cartRect.left + cartRect.width / 2, endY = cartRect.top + cartRect.height / 2;
        const cpX = (startX + endX) / 2 + (startX - endX) * 0.6;
        const cpY = Math.min(startY, endY) - 150;
        const fly = document.createElement('div');
        fly.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;color:white">shopping_cart</span>';
        Object.assign(fly.style, { position: 'fixed', zIndex: '9999', width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #66BB6A, #388E3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', boxShadow: '0 4px 20px rgba(76,175,80,0.5)', left: `${startX - 19}px`, top: `${startY - 19}px` });
        document.body.appendChild(fly);
        const duration = 650, startTime = performance.now();
        let lastTrailTime = 0;
        const animate = (now) => {
            const t = Math.min((now - startTime) / duration, 1), ease = 1 - Math.pow(1 - t, 3), u = 1 - ease;
            const x = u * u * startX + 2 * u * ease * cpX + ease * ease * endX;
            const y = u * u * startY + 2 * u * ease * cpY + ease * ease * endY;
            fly.style.left = `${x - 19}px`; fly.style.top = `${y - 19}px`;
            fly.style.transform = `scale(${1 - ease * 0.6}) rotate(${ease * 720}deg)`;
            fly.style.opacity = `${1 - ease * 0.3}`;
            if (now - lastTrailTime > 80 && t < 0.85) {
                lastTrailTime = now;
                const trail = document.createElement('div');
                Object.assign(trail.style, { position: 'fixed', zIndex: '9998', width: '8px', height: '8px', borderRadius: '50%', background: '#4CAF50', left: `${x - 4}px`, top: `${y - 4}px`, pointerEvents: 'none', opacity: '0.6', transition: 'all 0.4s ease-out' });
                document.body.appendChild(trail);
                requestAnimationFrame(() => { trail.style.transform = `scale(0) translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px)`; trail.style.opacity = '0'; });
                setTimeout(() => trail.remove(), 400);
            }
            if (t < 1) requestAnimationFrame(animate);
            else { fly.remove(); cartEl.style.transition = 'transform 0.3s cubic-bezier(0.3, 1.5, 0.5, 1)'; cartEl.style.transform = 'scale(1.35)'; setTimeout(() => { cartEl.style.transition = 'transform 0.2s ease-out'; cartEl.style.transform = 'scale(1)'; }, 300); }
        };
        requestAnimationFrame(animate);
    };

    const handleAddToCart = (book, e) => {
        addToCart(book);
        flyToCart(e.currentTarget);
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-[60vh]">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-[#2B3A67]">Sách Yêu Thích</h1>
                <p className="text-gray-400 mt-1">
                    {wishlist.length > 0 ? `${wishlist.length} cuốn sách trong danh sách yêu thích` : 'Chưa có sách yêu thích nào'}
                </p>
            </div>

            {wishlist.length === 0 ? (
                <div className="text-center py-20">
                    <span className="material-symbols-outlined text-[80px] text-[#C5E0B4] mb-4 block" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
                    <h2 className="text-xl font-bold text-[#2B3A67] mb-2">Danh sách trống</h2>
                    <p className="text-gray-400 mb-6">Hãy khám phá cửa hàng và thêm sách yêu thích!</p>
                    <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4CAF50] text-white rounded-2xl font-bold hover:bg-[#388E3C] transition-colors shadow-lg">
                        <span className="material-symbols-outlined">storefront</span>
                        Khám Phá Cửa Hàng
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {wishlist.map((book) => {
                        const imgSrc = getImg(book);
                        const hasDiscount = book.originalPrice && book.originalPrice > book.price;
                        return (
                            <div key={book._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="flex gap-4">
                                    {/* Image */}
                                    <Link to={`/product/${book._id}`} className="flex-shrink-0">
                                        <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden bg-[#E8F5E9]">
                                            {imgSrc ? (
                                                <img src={imgSrc} alt={book.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-3xl text-[#8BC34A]">menu_book</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex flex-col">
                                        <Link to={`/product/${book._id}`} className="group">
                                            <h3 className="font-bold text-[#2B3A67] group-hover:text-[#4CAF50] transition-colors line-clamp-2 leading-tight">{book.title}</h3>
                                        </Link>
                                        <p className="text-sm text-gray-400 mt-0.5">{book.author}</p>

                                        <div className="flex items-baseline gap-2 mt-2">
                                            <span className={`text-lg font-bold ${hasDiscount ? 'text-red-500' : 'text-[#2E7D32]'}`}>{fmt(book.price)}</span>
                                            {hasDiscount && <span className="text-sm text-gray-400 line-through">{fmt(book.originalPrice)}</span>}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 mt-auto pt-2">
                                            <button
                                                onClick={(e) => handleAddToCart(book, e)}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#4CAF50] text-white rounded-xl text-sm font-bold hover:bg-[#388E3C] active:scale-[0.97] transition-all"
                                            >
                                                <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                                                <span className="hidden sm:inline">Thêm vào giỏ</span>
                                            </button>
                                            <button
                                                onClick={() => removeFromWishlist(book._id)}
                                                className="w-10 h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors active:scale-90"
                                                title="Xoá khỏi yêu thích"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
