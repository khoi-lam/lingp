import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { booksAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import BookCard from '../components/BookCard';

import { API_BASE } from '../config.js';
const getImg = (b) => b.images?.[0] ? (b.images[0].startsWith('http') ? b.images[0] : `${API_BASE}/${b.images[0].replace(/^\//, '')}`) : null;
const fmt = (n) => Number(n).toLocaleString('vi-VN') + '₫';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [book, setBook] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const [showDesc, setShowDesc] = useState(false);
    const [imgIdx, setImgIdx] = useState(0);

    useEffect(() => {
        setLoading(true);
        setQty(1);
        setAdded(false);
        setShowDesc(false);
        window.scrollTo(0, 0);
        booksAPI.getById(id).then(r => {
            if (r.data.success) {
                setBook(r.data.data.book);
                booksAPI.getAll({ limit: 5 }).then(r2 => {
                    if (r2.data.success) setRelated(r2.data.data.books.filter(b => b._id !== id).slice(0, 4));
                }).catch(() => { });
            }
        }).catch(() => { }).finally(() => setLoading(false));
    }, [id]);

    const flyToCart = (btnEl) => {
        const cartEl = document.getElementById('cart-icon-nav');
        if (!cartEl || !btnEl) return;

        const btnRect = btnEl.getBoundingClientRect();
        const cartRect = cartEl.getBoundingClientRect();

        const startX = btnRect.left + btnRect.width / 2;
        const startY = btnRect.top + btnRect.height / 2;
        const endX = cartRect.left + cartRect.width / 2;
        const endY = cartRect.top + cartRect.height / 2;

        // Control point for the curve — arcs up and to the side
        const cpX = (startX + endX) / 2 + (startX - endX) * 0.6;
        const cpY = Math.min(startY, endY) - 150;

        const fly = document.createElement('div');
        fly.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;color:white">shopping_cart</span>';
        Object.assign(fly.style, {
            position: 'fixed', zIndex: '9999', width: '38px', height: '38px',
            borderRadius: '50%', background: 'linear-gradient(135deg, #66BB6A, #388E3C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none', boxShadow: '0 4px 20px rgba(76,175,80,0.5)',
            left: `${startX - 19}px`, top: `${startY - 19}px`,
        });
        document.body.appendChild(fly);

        const duration = 650;
        const startTime = performance.now();
        let lastTrailTime = 0;

        const animate = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - t, 3);

            // Quadratic bezier: B(t) = (1-t)²·P0 + 2(1-t)t·CP + t²·P1
            const u = 1 - ease;
            const x = u * u * startX + 2 * u * ease * cpX + ease * ease * endX;
            const y = u * u * startY + 2 * u * ease * cpY + ease * ease * endY;

            const scale = 1 - ease * 0.6;
            const rotate = ease * 720;
            const opacity = 1 - ease * 0.3;

            fly.style.left = `${x - 19}px`;
            fly.style.top = `${y - 19}px`;
            fly.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
            fly.style.opacity = `${opacity}`;

            // Trail particles every ~80ms
            if (now - lastTrailTime > 80 && t < 0.85) {
                lastTrailTime = now;
                const trail = document.createElement('div');
                Object.assign(trail.style, {
                    position: 'fixed', zIndex: '9998', width: '8px', height: '8px',
                    borderRadius: '50%', background: '#4CAF50',
                    left: `${x - 4}px`, top: `${y - 4}px`,
                    pointerEvents: 'none', opacity: '0.6',
                    transition: 'all 0.4s ease-out',
                });
                document.body.appendChild(trail);
                requestAnimationFrame(() => {
                    trail.style.transform = `scale(0) translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px)`;
                    trail.style.opacity = '0';
                });
                setTimeout(() => trail.remove(), 400);
            }

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                fly.remove();
                // Cart icon bounce
                cartEl.style.transition = 'transform 0.3s cubic-bezier(0.3, 1.5, 0.5, 1)';
                cartEl.style.transform = 'scale(1.35)';
                setTimeout(() => {
                    cartEl.style.transition = 'transform 0.2s ease-out';
                    cartEl.style.transform = 'scale(1)';
                }, 300);
            }
        };

        requestAnimationFrame(animate);
    };

    const handleAdd = (e) => {
        if (!book) return;
        addToCart(book, qty);
        setAdded(true);
        flyToCart(e.currentTarget);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <div className="flex items-center justify-center py-32"><span className="material-symbols-outlined text-5xl animate-spin text-[#4CAF50]">progress_activity</span></div>;
    if (!book) return <div className="text-center py-32"><span className="material-symbols-outlined text-[80px] text-[#C5E0B4] mb-4 block">error</span><h2 className="text-2xl font-bold text-[#2B3A67]">Không tìm thấy sách</h2><Link to="/shop" className="text-[#4CAF50] font-bold mt-4 inline-block hover:underline">← Quay lại cửa hàng</Link></div>;

    const allImages = (book.images || []).map(img => img.startsWith('http') ? img : `${API_BASE}/${img.replace(/^\//, '')}`).filter(Boolean);
    const hasMultiple = allImages.length > 1;
    const hasDiscount = book.originalPrice && book.originalPrice > book.price;
    const discountPct = hasDiscount ? Math.round((1 - book.price / book.originalPrice) * 100) : 0;
    const genre = typeof book.genre?.[0] === 'object' ? book.genre[0].name : book.genre?.[0] || '';
    const inStock = (book.stock || book.stockQuantity || 0) > 0;

    const prevImg = () => setImgIdx(i => (i - 1 + allImages.length) % allImages.length);
    const nextImg = () => setImgIdx(i => (i + 1) % allImages.length);

    return (
        <>
            <div className="container mx-auto px-4 py-6 pb-28 md:pb-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                    <Link to="/" className="hover:text-[#4CAF50] transition-colors">Trang chủ</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <Link to="/shop" className="hover:text-[#4CAF50] transition-colors">Cửa hàng</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-[#2B3A67] font-medium truncate max-w-[200px]">{book.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 lg:gap-12">
                    {/* ═══ IMAGE COLUMN — CAROUSEL ═══ */}
                    <div className="lg:sticky lg:top-6 lg:self-start">
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-[#E8F5E9] to-[#C5E0B4] shadow-xl group">
                            {allImages.length > 0 ? (
                                <img className="w-full h-full object-cover transition-opacity duration-300" src={allImages[imgIdx]} alt={book.title} key={imgIdx} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[80px] text-[#8BC34A]/40">menu_book</span>
                                </div>
                            )}
                            {hasDiscount && (
                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white rounded-full text-sm font-bold shadow-lg">
                                    -{discountPct}%
                                </div>
                            )}
                            {book.hasAR && (
                                <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#9C27B0] text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">view_in_ar</span> AR
                                </div>
                            )}
                            {/* Prev / Next arrows */}
                            {hasMultiple && (
                                <>
                                    <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-[#2B3A67] hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-[#2B3A67] hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </>
                            )}
                        </div>
                        {/* Dot indicators + thumbnails */}
                        {hasMultiple && (
                            <div className="flex items-center justify-center gap-2 mt-3">
                                {allImages.map((img, i) => (
                                    <button key={i} onClick={() => setImgIdx(i)}
                                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-[#4CAF50] scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ═══ INFO COLUMN ═══ */}
                    <div>
                        {/* Genre tag */}
                        {genre && (
                            <Link to="/shop" className="inline-flex items-center gap-1 px-3 py-1 bg-[#E8F5E9] text-[#4CAF50] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#C5E0B4] transition-colors mb-3">
                                <span className="material-symbols-outlined text-sm">category</span>
                                {genre}
                            </Link>
                        )}

                        {/* Title & Author */}
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-[#2B3A67] leading-tight">{book.title}</h1>
                        <p className="text-lg text-[#618961] mt-2 font-medium">{book.author}</p>

                        {/* Rating */}
                        {book.rating && (
                            <div className="flex items-center gap-3 mt-4">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <span key={i} className="material-symbols-outlined text-[#FFB74D] text-lg" style={{ fontVariationSettings: `'FILL' ${i <= Math.round(book.rating) ? 1 : 0}` }}>star</span>
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-[#2B3A67]">{book.rating}</span>
                                <span className="text-sm text-gray-400">/ 5</span>
                            </div>
                        )}

                        {/* Price Section */}
                        <div className="mt-6 p-5 bg-gradient-to-r from-[#E8F5E9] to-[#F1F8E9] rounded-2xl">
                            <div className="flex items-baseline gap-3 flex-wrap">
                                <span className="text-3xl md:text-4xl font-display font-bold text-[#2E7D32]">{fmt(book.price)}</span>
                                {hasDiscount && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through">{fmt(book.originalPrice)}</span>
                                        <span className="px-2.5 py-1 bg-red-500 text-white rounded-lg text-xs font-bold">Tiết kiệm {fmt(book.originalPrice - book.price)}</span>
                                    </>
                                )}
                            </div>
                            <div className={`flex items-center gap-2 mt-2 text-sm font-medium ${inStock ? 'text-[#4CAF50]' : 'text-red-500'}`}>
                                <span className="material-symbols-outlined text-lg">{inStock ? 'check_circle' : 'cancel'}</span>
                                {inStock ? `Còn hàng (${book.stock || book.stockQuantity})` : 'Hết hàng'}
                            </div>
                        </div>

                        {/* Quantity + Add to Cart (Desktop) */}
                        <div className="hidden md:flex items-center gap-4 mt-6">
                            <div className="flex items-center bg-white rounded-full border border-gray-200 shadow-sm">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#2B3A67] font-bold transition-colors text-lg">−</button>
                                <span className="w-10 text-center font-bold text-[#2B3A67]">{qty}</span>
                                <button onClick={() => setQty(q => q + 1)} className="w-11 h-11 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#2B3A67] font-bold transition-colors text-lg">+</button>
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={!inStock}
                                className={`flex-1 py-3.5 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed ${added ? 'bg-[#2E7D32] scale-[0.98]' : 'bg-[#4CAF50] hover:bg-[#388E3C] hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]'}`}
                            >
                                <span className="material-symbols-outlined">{added ? 'check_circle' : 'add_shopping_cart'}</span>
                                {added ? 'Đã thêm vào giỏ!' : 'Thêm Vào Giỏ Hàng'}
                            </button>
                        </div>

                        {/* Divider */}
                        <hr className="my-6 border-gray-100" />

                        {/* Book Meta Info */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                book.publisher && { icon: 'business', label: 'NXB', value: book.publisher },
                                book.isbn && { icon: 'qr_code', label: 'ISBN', value: book.isbn },
                                book.pages && { icon: 'description', label: 'Số trang', value: book.pages },
                                book.language && { icon: 'translate', label: 'Ngôn ngữ', value: book.language },
                                book.publishYear && { icon: 'calendar_today', label: 'Năm XB', value: book.publishYear },
                                { icon: 'local_shipping', label: 'Vận chuyển', value: 'Miễn phí' },
                            ].filter(Boolean).map((item, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#E8F5E9] transition-colors">
                                    <span className="material-symbols-outlined text-[#8BC34A] mt-0.5">{item.icon}</span>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{item.label}</p>
                                        <p className="text-sm text-[#2B3A67] font-medium">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        {book.description && (
                            <div className="mt-6">
                                <h3 className="text-lg font-bold text-[#2B3A67] mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#8BC34A]">article</span>
                                    Mô Tả Sản Phẩm
                                </h3>
                                <div className="relative">
                                    <p className={`text-gray-500 text-sm leading-relaxed whitespace-pre-line ${!showDesc ? 'line-clamp-4' : ''}`}>
                                        {book.description}
                                    </p>
                                    {book.description.length > 200 && (
                                        <button onClick={() => setShowDesc(!showDesc)} className="text-[#4CAF50] text-sm font-bold mt-2 hover:underline flex items-center gap-1">
                                            {showDesc ? 'Thu gọn' : 'Xem thêm'}
                                            <span className="material-symbols-outlined text-sm">{showDesc ? 'expand_less' : 'expand_more'}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Books */}
                {related.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-display font-bold text-[#2B3A67]">Sách Tương Tự</h2>
                            <Link to="/shop" className="text-[#4CAF50] text-sm font-bold hover:underline flex items-center gap-1">
                                Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                            {related.map(b => <BookCard key={b._id} book={b} />)}
                        </div>
                    </div>
                )}
            </div>

            {/* ═══ MOBILE STICKY BOTTOM BAR ═══ */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center gap-3 z-40 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <div className="flex items-center bg-gray-100 rounded-full">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-full hover:bg-gray-200 flex items-center justify-center font-bold text-[#2B3A67] transition-colors">−</button>
                    <span className="w-8 text-center font-bold text-sm text-[#2B3A67]">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 rounded-full hover:bg-gray-200 flex items-center justify-center font-bold text-[#2B3A67] transition-colors">+</button>
                </div>
                <button
                    onClick={handleAdd}
                    disabled={!inStock}
                    className={`flex-1 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-white text-sm disabled:opacity-50 ${added ? 'bg-[#2E7D32]' : 'bg-[#4CAF50] hover:bg-[#388E3C] active:scale-[0.98]'}`}
                >
                    <span className="material-symbols-outlined text-lg">{added ? 'check_circle' : 'add_shopping_cart'}</span>
                    {added ? 'Đã thêm!' : `Thêm • ${fmt(book.price * qty)}`}
                </button>
            </div>
        </>
    );
}
