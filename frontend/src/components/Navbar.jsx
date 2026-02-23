import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logoUrl } from '../data/mockData';
import { useCart } from '../contexts/CartContext';

const navLinks = [
    { label: 'Trang Chủ', path: '/', icon: 'home' },
    { label: 'Bộ Sưu Tập', path: '/shop', icon: 'auto_stories' },
    { label: 'Liên Hệ', path: '/support', icon: 'mail' },
    { label: 'BookLens', path: '/booklens', icon: 'photo_camera' },
];

export default function Navbar() {
    const { pathname } = useLocation();
    const { cartCount } = useCart();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isActive = (path) =>
        path === '/' ? pathname === '/' : pathname.startsWith(path);

    return (
        <>
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#C5E0B4] px-4 sm:px-6 py-0">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            alt="LingoLand Logo"
                            className="h-16 sm:h-20 w-auto object-contain transition-transform group-hover:rotate-3"
                            src={logoUrl}
                        />
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.path}
                                className={`font-bold transition-colors flex items-center gap-1.5 ${isActive(link.path)
                                    ? 'text-[#4CAF50]'
                                    : 'text-[#2E7D32] hover:text-[#4CAF50]'
                                    }`}
                            >
                                {link.icon === 'photo_camera' && <span className="material-symbols-outlined text-lg">photo_camera</span>}
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link
                            to="/cart"
                            id="cart-icon-nav"
                            className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] hover:bg-[#C5E0B4] transition-colors relative"
                        >
                            <span className="material-symbols-outlined">shopping_cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#4CAF50] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="md:hidden w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 z-[100] md:hidden"
                    onClick={() => setDrawerOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/40 animate-[fadeIn_0.2s_ease-out]" />

                    <aside
                        className="absolute right-0 top-0 w-72 h-full bg-white flex flex-col shadow-2xl animate-[slideIn_0.25s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-[#E8F5E9]">
                            <div className="flex items-center gap-3">
                                <img src={logoUrl} alt="LingoLand" className="h-10 w-auto object-contain" />
                            </div>
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] hover:bg-[#C5E0B4] transition-colors"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        {/* Nav links */}
                        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.path}
                                    onClick={() => setDrawerOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${isActive(link.path)
                                        ? 'bg-[#E8F5E9] text-[#4CAF50]'
                                        : 'text-[#2E7D32] hover:bg-[#E8F5E9]'
                                        }`}
                                >
                                    <span
                                        className="material-symbols-outlined text-xl"
                                        style={isActive(link.path) ? { fontVariationSettings: "'FILL' 1" } : {}}
                                    >
                                        {link.icon}
                                    </span>
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                to="/cart"
                                onClick={() => setDrawerOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-[#2E7D32] hover:bg-[#E8F5E9]"
                            >
                                <span className="material-symbols-outlined text-xl">shopping_cart</span>
                                Giỏ Hàng {cartCount > 0 && <span className="ml-auto bg-[#4CAF50] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
                            </Link>
                        </nav>
                    </aside>
                </div>
            )}
        </>
    );
}
