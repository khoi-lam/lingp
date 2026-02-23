import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

import { API_BASE } from '../config.js';

function getImageSrc(book) {
    if (book.images?.length) {
        const img = book.images[0];
        if (img.startsWith('http')) return img;
        return `${API_BASE}/${img.replace(/^\//, '')}`;
    }
    return book.image || null;
}

const fmt = (n) => Number(n).toLocaleString('vi-VN') + '₫';

export default function BookCard({ book }) {
    const { addToCart } = useCart();
    const id = book._id || book.id;
    const imgSrc = getImageSrc(book);

    const flyToCart = (btnEl) => {
        const cartEl = document.getElementById('cart-icon-nav');
        if (!cartEl || !btnEl) return;
        const btnRect = btnEl.getBoundingClientRect();
        const cartRect = cartEl.getBoundingClientRect();
        const fly = document.createElement('div');
        fly.className = 'fixed z-[9999] w-10 h-10 rounded-full bg-[#4CAF50] flex items-center justify-center shadow-lg pointer-events-none';
        fly.innerHTML = '<span class="material-symbols-outlined text-white text-lg">auto_stories</span>';
        fly.style.cssText = `left:${btnRect.left}px;top:${btnRect.top}px;transition:all 0.7s cubic-bezier(0.2,-0.3,0.5,1)`;
        document.body.appendChild(fly);
        requestAnimationFrame(() => {
            fly.style.left = `${cartRect.left + cartRect.width / 2 - 20}px`;
            fly.style.top = `${cartRect.top + cartRect.height / 2 - 20}px`;
            fly.style.transform = 'scale(0.3)';
            fly.style.opacity = '0.3';
        });
        setTimeout(() => {
            fly.remove();
            cartEl.style.transition = 'transform 0.3s cubic-bezier(0.3, 1.5, 0.5, 1)';
            cartEl.style.transform = 'scale(1.35)';
            setTimeout(() => { cartEl.style.transition = 'transform 0.2s ease-out'; cartEl.style.transform = 'scale(1)'; }, 300);
        }, 700);
    };

    const handleAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ ...book, _id: id });
        flyToCart(e.currentTarget);
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl flex flex-col h-full border-2 border-transparent hover:border-[#8BC34A] group relative overflow-hidden transition-all duration-300">
            <Link to={`/product/${id}`} className="block">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-[#E8F5E9] to-[#C5E0B4] mb-4 relative">
                    {imgSrc ? (
                        <img alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={imgSrc} />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#8BC34A] gap-2">
                            <span className="material-symbols-outlined text-5xl">auto_stories</span>
                            <span className="text-xs font-bold text-[#4CAF50]/50">LingoLand</span>
                        </div>
                    )}
                </div>
            </Link>
            <div className="flex-grow flex flex-col px-1">
                {book.category && (
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full w-fit">
                        {typeof book.category === 'object' ? book.category.name : book.category}
                    </div>
                )}
                <Link to={`/product/${id}`}>
                    <h3 className="text-base font-display font-bold text-[#2B3A67] leading-tight mb-1 group-hover:text-[#2E7D32] transition-colors line-clamp-2">
                        {book.title}
                    </h3>
                </Link>
                <p className="text-sm text-gray-400 mb-3">{book.author}</p>
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-[#E8F5E9]">
                    <span className="text-xl font-bold text-[#2B3A67]">{fmt(book.price)}</span>
                    <button onClick={handleAdd} className="w-10 h-10 rounded-full bg-[#4CAF50] text-white flex items-center justify-center shadow-md hover:bg-[#2E7D32] hover:scale-110 active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
