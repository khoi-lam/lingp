import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CategoryMenu from './CategoryMenu';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';
import { getImageUrl } from '../config';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { getCartCount } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const debouncedSearch = useDebounce(searchQuery, 300);
    const searchRef = useRef(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedSearch.length >= 2) {
                setIsSearching(true);
                try {
                    const response = await api.get(`/search/suggest?q=${encodeURIComponent(debouncedSearch)}`);
                    setSuggestions(response.data.data.suggestions);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        fetchSuggestions();
    }, [debouncedSearch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <>
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-[100]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20 gap-4 md:gap-8">
                        {/* Menu Icon & Logo */}
                        <div className="flex items-center space-x-4 min-w-fit">
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-fahasa-red transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <Link to="/" className="flex items-center space-x-3 group">
                                <div className="w-10 h-10 bg-fahasa-red rounded-xl flex items-center justify-center shadow-lg shadow-fahasa-red/20 transition-transform group-hover:scale-110">
                                    <span className="text-white font-bold text-xl">B</span>
                                </div>
                                <span className="text-2xl font-black text-fahasa-dark tracking-tight hidden lg:block">
                                    Bookstore
                                </span>
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-2xl hidden md:block" ref={searchRef}>
                            <form onSubmit={handleSearch} className="relative">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm sách, tác giả..."
                                        value={searchQuery}
                                        onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-6 py-2.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-fahasa-red font-bold transition-all text-sm placeholder:text-gray-400"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                                        {isSearching && (
                                            <div className="w-4 h-4 border-2 border-fahasa-red border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                        <button
                                            type="submit"
                                            className="w-8 h-8 bg-fahasa-red text-white rounded-xl flex items-center justify-center hover:bg-fahasa-red/90 transition-colors shadow-lg shadow-fahasa-red/10"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Search Suggestions Dropdown */}
                                {showSuggestions && (suggestions.length > 0 || isSearching) && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gợi ý tìm kiếm</span>
                                            {suggestions.length > 0 && (
                                                <span className="text-[10px] font-black text-fahasa-red uppercase tracking-widest">{suggestions.length} kết quả</span>
                                            )}
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {suggestions.map((book) => (
                                                <Link
                                                    key={book._id}
                                                    to={`/product/${book.slug}`}
                                                    onClick={() => {
                                                        setShowSuggestions(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="flex items-center p-2 px-4 hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0"
                                                >
                                                    <div className="w-10 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
                                                        <img
                                                            src={getImageUrl(book.images?.[0])}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="ml-3 flex-1 min-w-0">
                                                        <h4 className="text-xs font-black text-fahasa-dark truncate group-hover:text-fahasa-red transition-colors capitalize">
                                                            {book.title.toLowerCase()}
                                                        </h4>
                                                        <p className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-tight">{book.author}</p>
                                                        <p className="text-[10px] font-black text-fahasa-red mt-0.5">{book.price?.toLocaleString()}đ</p>
                                                    </div>
                                                    <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-fahasa-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        {suggestions.length === 0 && !isSearching && searchQuery.length >= 2 && (
                                            <div className="p-10 text-center">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-bold text-gray-400">Không tìm thấy sách phù hợp</p>
                                            </div>
                                        )}
                                        <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
                                            <button
                                                onClick={handleSearch}
                                                className="text-[10px] font-black text-fahasa-red uppercase tracking-widest hover:underline"
                                            >
                                                Xem tất cả kết quả
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
                            {/* Notifications */}
                            <button className="hidden sm:flex flex-col items-center text-gray-500 hover:text-fahasa-red transition-colors group">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="text-[10px] font-black uppercase tracking-widest mt-1 group-hover:block hidden lg:block">Thông báo</span>
                            </button>

                            {/* Cart */}
                            <Link to="/cart" className="flex flex-col items-center text-gray-500 hover:text-fahasa-red transition-colors group relative">
                                <div className="relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-fahasa-red text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg shadow-fahasa-red/20 animate-bounce">
                                        {getCartCount()}
                                    </span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest mt-1 group-hover:block hidden lg:block">Giỏ hàng</span>
                            </Link>

                            {/* Account */}
                            {user ? (
                                <div className="flex items-center space-x-3 border-l border-gray-100 pl-4 sm:pl-6">
                                    <div className="group relative">
                                        <button className="flex flex-col items-center text-gray-500 hover:text-fahasa-red transition-colors group">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-[10px] font-black uppercase tracking-widest mt-1 group-hover:block hidden lg:block">Tài khoản</span>
                                        </button>
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-50 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                            <div className="p-3 border-b border-gray-50">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Xin chào</p>
                                                <p className="text-sm font-bold text-fahasa-dark truncate">{user.name}</p>
                                            </div>
                                            <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-600 transition-colors">
                                                <span>Trang cá nhân</span>
                                            </Link>
                                            <Link to="/orders" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-600 transition-colors">
                                                <span>Đơn hàng của tôi</span>
                                            </Link>
                                            <Link to="/support" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-600 transition-colors">
                                                <span>Hỗ trợ & Đổi trả</span>
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link to="/admin" className="flex items-center space-x-3 p-3 rounded-xl bg-fahasa-red/5 text-fahasa-red text-sm font-bold transition-colors">
                                                    <span>Quản trị hệ thống</span>
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 text-sm font-bold text-red-500 transition-colors border-t border-gray-50 mt-2"
                                            >
                                                <span>Đăng xuất</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex flex-col items-center text-gray-500 hover:text-fahasa-red transition-colors group"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest mt-1 group-hover:block hidden lg:block">Đăng nhập</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <CategoryMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
};

export default Navbar;
