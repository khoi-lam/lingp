import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../config';

const Home = () => {
    const { user } = useAuth();
    // Hardcoded hero banners
    const banners = [
        '/hero-images/hero1.png',
        '/hero-images/hero2.png',
        '/hero-images/hero3.png',
        '/hero-images/hero4.png',
        '/hero-images/hero5.png'
    ];
    const [flashSaleBooks, setFlashSaleBooks] = useState([]);
    const [activeBanner, setActiveBanner] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Only fetch books
                const response = await api.get('/books?limit=5');
                setFlashSaleBooks(response.data.data.books || []);
            } catch (error) {
                console.error('Error fetching flash sale books:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (banners.length > 0) {
            const timer = setInterval(() => {
                setActiveBanner((prev) => (prev + 1) % banners.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [banners]);

    const iconMenu = [
        {
            name: 'Flash Sale',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" /></svg>,
            color: 'bg-orange-500'
        },
        {
            name: 'Mã Giảm Giá',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" /></svg>,
            color: 'bg-red-500'
        },
        {
            name: 'Sản Phẩm Mới',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
            color: 'bg-blue-500'
        },
        {
            name: 'Bán Chạy',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" /></svg>,
            color: 'bg-pink-500'
        },
        {
            name: 'Thiếu Nhi',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>,
            color: 'bg-yellow-500'
        },
        {
            name: 'Văn Học',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" /></svg>,
            color: 'bg-green-500'
        },
        {
            name: 'Kinh Tế',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" /></svg>,
            color: 'bg-indigo-500'
        },
        {
            name: 'Ngoại Văn',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" /></svg>,
            color: 'bg-purple-500'
        },
        {
            name: 'Văn Phòng Phẩm',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>,
            color: 'bg-teal-500'
        },
        {
            name: 'Đồ Chơi',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.48.41-2.86 1.12-4.06l10.94 10.94C14.86 19.59 13.48 20 12 20zm6.88-3.94L8.94 6.12C10.14 5.41 11.52 5 13 5c4.41 0 8 3.59 8 8 0 1.48-.41 2.86-1.12 4.06z" /></svg>,
            color: 'bg-cyan-500'
        },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-fahasa-red border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Section (Fahasa Style: 1 Main + 2 Side) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Main Slider (66%) */}
                    <div className="w-full lg:w-2/3 aspect-[21/9] lg:aspect-auto lg:h-[400px] relative rounded-lg overflow-hidden shadow-xl shadow-gray-200/50 group">
                        {banners.length > 0 ? (
                            <>
                                {banners.map((banner, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-opacity duration-1000 ${index === activeBanner ? 'opacity-100' : 'opacity-0'}`}
                                    >
                                        <img src={typeof banner === 'string' ? banner : banner.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                                    {banners.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveBanner(i)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeBanner ? 'bg-fahasa-red w-8' : 'bg-white/50'}`}
                                        ></button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-fahasa-red to-red-600 flex items-center justify-center">
                                <h1 className="text-white text-3xl font-black italic tracking-widest">HỆ THỐNG NHÀ SÁCH BOOKSTORE</h1>
                            </div>
                        )}
                    </div>

                    {/* Side Banners (33%) */}
                    <div className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-4 h-auto lg:h-[400px]">
                        <div className="flex-1 rounded-lg overflow-hidden shadow-lg shadow-gray-200/50 relative group">
                            <img src="/hero-images/promo-jan.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Khuyến mãi tháng 1" />
                        </div>
                        <div className="flex-1 rounded-lg overflow-hidden shadow-lg shadow-gray-200/50 relative group">
                            <img src="/hero-images/new-arrival.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Sách mới về" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Icon Menu (Quick Access) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 grid grid-cols-5 md:grid-cols-10 gap-8">
                    {iconMenu.map((item, i) => (
                        <Link
                            key={i}
                            to="/shop"
                            className="flex flex-col items-center space-y-3 group transition-transform hover:-translate-y-2"
                        >
                            <div className={`w-14 h-14 ${item.color} text-white flex items-center justify-center rounded-lg shadow-lg transition-transform group-hover:rotate-12`}>
                                {item.icon}
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center leading-tight group-hover:text-fahasa-red transition-colors">
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Flash Sale Block */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="bg-white rounded-[40px] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="bg-fahasa-red p-6 flex justify-between items-center text-white">
                        <div className="flex items-center space-x-4">
                            <div className="text-3xl">📚</div>
                            <h3 className="text-2xl font-black uppercase tracking-widest italic">Sách mới nhất</h3>
                        </div>
                        <Link to="/shop" className="text-sm font-black uppercase tracking-widest hover:underline">Xem tất cả</Link>
                    </div>
                    <div className="p-8 grid grid-cols-2 md:grid-cols-5 gap-8">
                        {flashSaleBooks.map((book) => (
                            <Link key={book._id} to={`/product/${book._id}`} className="space-y-3 group">
                                <div className="aspect-[3/4] bg-gray-50 rounded-md relative overflow-hidden">
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-fahasa-red text-white text-[10px] font-black rounded-lg z-10">-30%</div>
                                    <img
                                        src={getImageUrl(book.images?.[0])}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                        alt={book.title}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-fahasa-dark h-[32px] line-clamp-2 leading-tight group-hover:text-fahasa-red transition-colors">
                                        {book.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 h-[24px]">
                                        <span className="text-base font-black text-fahasa-red">
                                            {book.price.toLocaleString('vi-VN')}đ
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-bold line-through">
                                            {(book.price * 1.3).toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                    <div className="h-4 bg-gray-100 rounded-full relative overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-orange-400 rounded-full"
                                            style={{ width: `${Math.min(((book.soldCount || 10) / 100) * 100, 100)}%` }}
                                        ></div>
                                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white uppercase tracking-tighter">
                                            Đã bán {book.soldCount || 10}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Suggestion Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="bg-gradient-to-br from-fahasa-dark to-black rounded-[40px] p-12 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,0 L100,0 L100,100 Z" fill="url(#grad)" />
                            <defs>
                                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#C81E2B', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#333', stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className="relative z-10 max-w-2xl space-y-8">
                        <p className="text-fahasa-red font-black uppercase tracking-[0.2em] text-sm">Cá nhân hóa trải nghiệm</p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight underline decoration-fahasa-red decoration-8 underline-offset-8">
                            AI gợi ý cuốn sách <br /> dành riêng cho bạn
                        </h2>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed">
                            Khám phá tri thức mới dựa trên sở thích và hành vi của bạn. Hệ thống AI của chúng tôi sẽ giúp bạn tìm thấy "chân ái" tiếp theo.
                        </p>
                        <Link to="/shop" className="group flex items-center space-x-6">
                            <div className="px-10 py-5 bg-fahasa-red text-white rounded-lg font-black text-lg shadow-2xl shadow-fahasa-red/20 group-hover:bg-fahasa-red/90 transition-all group-hover:translate-x-2">
                                Trải nghiệm ngay
                            </div>
                            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
