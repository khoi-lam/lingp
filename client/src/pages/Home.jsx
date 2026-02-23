import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../config';
import {
    FaBolt, FaTags, FaTicketAlt, FaStar, FaChartLine,
    FaChild, FaBook, FaGlobe, FaPen, FaBookOpen,
    FaSpa, FaMoneyBillWave, FaHome, FaFeatherAlt,
    FaGifts, FaCrown, FaSearch, FaGhost,
    FaRobot, FaUserSecret, FaSkull, FaDragon,
    FaFish, FaHippo, FaMask, FaHatWizard
} from 'react-icons/fa';
import {
    HiOutlineTrendingUp, HiOutlineBookOpen, HiOutlineChevronRight,
    HiOutlineArrowRight, HiOutlineViewGrid
} from 'react-icons/hi';

const Home = () => {
    const { user } = useAuth();
    const banners = [
        '/hero-images/hero1.png',
        '/hero-images/hero2.png',
        '/hero-images/hero3.png',
        '/hero-images/hero4.png',
        '/hero-images/hero5.png'
    ];
    const [flashSaleBooks, setFlashSaleBooks] = useState([]);
    const [trendBooks, setTrendBooks] = useState([]);
    const [rankBooks, setRankBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeBanner, setActiveBanner] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [activeRankTab, setActiveRankTab] = useState(0);
    const [loading, setLoading] = useState(true);

    // Countdown timer
    const [countdown, setCountdown] = useState({ h: 0, m: 29, s: 59 });
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                const totalSec = prev.h * 3600 + prev.m * 60 + prev.s - 1;
                if (totalSec <= 0) return { h: 23, m: 59, s: 59 };
                return {
                    h: Math.floor(totalSec / 3600),
                    m: Math.floor((totalSec % 3600) / 60),
                    s: totalSec % 60
                };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [flashRes, trendRes, rankRes, catRes] = await Promise.all([
                    api.get('/books?limit=5'),
                    api.get('/books?limit=10&page=2'),
                    api.get('/books?limit=5&page=3'),
                    api.get('/categories')
                ]);
                setFlashSaleBooks(flashRes.data.data.books || []);
                setTrendBooks(trendRes.data.data.books || []);
                setRankBooks(rankRes.data.data.books || []);
                setCategories(catRes.data.data.categories || catRes.data.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
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
        { name: 'Flash Sale', icon: <FaBolt className="w-5 h-5" />, iconColor: 'text-vanxuan-red' },
        { name: 'Ưu Đãi', icon: <FaTags className="w-5 h-5" />, iconColor: 'text-vanxuan-red' },
        { name: 'Mã Giảm Giá', icon: <FaTicketAlt className="w-5 h-5" />, iconColor: 'text-vanxuan-red' },
        { name: 'Sản Phẩm Mới', icon: <FaStar className="w-5 h-5" />, iconColor: 'text-vanxuan-red' },
        { name: 'Bán Chạy', icon: <FaChartLine className="w-5 h-5" />, iconColor: 'text-vanxuan-red' },
        { name: 'Thiếu Nhi', icon: <FaChild className="w-5 h-5" />, iconColor: 'text-vanxuan-red' },
        { name: 'Văn Học', icon: <FaBook className="w-5 h-5" />, iconColor: 'text-vanxuan-red' },
        { name: 'Ngoại Văn', icon: <FaGlobe className="w-5 h-5" />, iconColor: 'text-vanxuan-red' },
        { name: 'Văn Phòng Phẩm', icon: <FaPen className="w-5 h-5" />, iconColor: 'text-vanxuan-red' },
        { name: 'Manga', icon: <FaBookOpen className="w-5 h-5" />, iconColor: 'text-vanxuan-red' },
    ];

    const promoBanners = [
        { title: 'GIẢM ĐẾN 45%', subtitle: 'Sách Văn Học Hay', bgColor: 'bg-red-500', icon: <FaBook className="w-10 h-10" /> },
        { title: 'BOOK FOR VALENTINE', subtitle: 'Sách Tình Yêu', bgColor: 'bg-rose-500', icon: <FaFeatherAlt className="w-10 h-10" /> },
        { title: 'VĂN HỌC 360°', subtitle: 'Mọi Trang Một Cảm Xúc', bgColor: 'bg-blue-600', icon: <FaBookOpen className="w-10 h-10" /> },
        { title: 'KHAI BÚT ĐÓN XUÂN', subtitle: 'Văn Phòng Phẩm Mới', bgColor: 'bg-teal-600', icon: <FaPen className="w-10 h-10" /> },
    ];

    const trendTabs = ['Xu Hướng Theo Ngày', 'Sách HOT - Giảm Sốc', 'Bestseller Ngoại Văn'];
    const rankTabs = ['Văn học', 'Kinh Tế', 'Tâm lý - Kỹ năng sống', 'Thiếu nhi', 'Ngoại ngữ'];

    const featuredShelves = [
        { name: 'Bình Yên Để Bắt Đầu', icon: <FaSpa className="w-8 h-8 text-emerald-500" /> },
        { name: 'Làm Chủ Đồng Tiền', icon: <FaMoneyBillWave className="w-8 h-8 text-green-600" /> },
        { name: 'Về Nhà Ăn Tết', icon: <FaHome className="w-8 h-8 text-amber-600" /> },
        { name: 'Tác Giả Trẻ Việt Nam', icon: <FaFeatherAlt className="w-8 h-8 text-blue-500" /> },
        { name: 'Thiếu Nhi Vui Đón Tết', icon: <FaGifts className="w-8 h-8 text-red-500" /> },
        { name: 'Sách Độc Quyền', icon: <FaCrown className="w-8 h-8 text-yellow-500" /> },
        { name: 'Tủ Sách Trinh Thám', icon: <FaSearch className="w-8 h-8 text-indigo-500" /> },
        { name: 'Tủ Sách Kinh Dị', icon: <FaGhost className="w-8 h-8 text-purple-600" /> },
    ];

    const collections = [
        { name: 'Doraemon', icon: <FaRobot className="w-8 h-8 text-blue-500" /> },
        { name: 'Conan', icon: <FaUserSecret className="w-8 h-8 text-gray-700" /> },
        { name: 'One Piece', icon: <FaSkull className="w-8 h-8 text-red-600" /> },
        { name: 'Dragon Ball', icon: <FaDragon className="w-8 h-8 text-orange-500" /> },
        { name: 'Naruto', icon: <FaFish className="w-8 h-8 text-blue-600" /> },
        { name: 'Capybara', icon: <FaHippo className="w-8 h-8 text-amber-700" /> },
        { name: 'Marvel', icon: <FaMask className="w-8 h-8 text-red-500" /> },
        { name: 'Harry Potter', icon: <FaHatWizard className="w-8 h-8 text-indigo-600" /> },
    ];

    const pad = (n) => n.toString().padStart(2, '0');

    const ProductCard = ({ book, showSold = false }) => (
        <Link to={`/product/${book._id}`} className="space-y-3 group">
            <div className="aspect-[3/4] bg-gray-50 rounded-md relative overflow-hidden">
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-vanxuan-red text-white text-[10px] font-black rounded z-10">
                    -{Math.round((1 - book.price / (book.price * 1.3)) * 100)}%
                </div>
                <img
                    src={getImageUrl(book.images?.[0])}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    alt={book.title}
                />
            </div>
            <div className="space-y-1.5">
                <h4 className="text-xs font-medium text-vanxuan-dark h-[32px] line-clamp-2 leading-tight group-hover:text-vanxuan-red transition-colors">
                    {book.title}
                </h4>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-vanxuan-red">
                        {book.price?.toLocaleString('vi-VN')} đ
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-50 text-vanxuan-red font-bold rounded">
                        -{Math.round((1 - book.price / (book.price * 1.3)) * 100)}%
                    </span>
                </div>
                <div className="text-[10px] text-gray-400 line-through">
                    {(book.price * 1.3).toLocaleString('vi-VN')} đ
                </div>
                {showSold && (
                    <div className="h-3.5 bg-red-50 rounded-full relative overflow-hidden">
                        <div
                            className="absolute inset-0 bg-vanxuan-red rounded-full"
                            style={{ width: `${Math.min(((book.soldCount || Math.floor(Math.random() * 200 + 10)) / 300) * 100, 100)}%` }}
                        ></div>
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
                            Đã bán {book.soldCount || Math.floor(Math.random() * 200 + 10)}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-vanxuan-red border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="bg-vanxuan-gray min-h-screen pb-20">
            {/* ─── 1. Hero Section ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
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
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeBanner ? 'bg-vanxuan-red w-8' : 'bg-white/50'}`}
                                        ></button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full bg-vanxuan-red flex items-center justify-center">
                                <h1 className="text-white text-3xl font-black italic tracking-widest">HỆ THỐNG NHÀ SÁCH VẠN XUÂN</h1>
                            </div>
                        )}
                    </div>
                    <div className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-4 h-auto lg:h-[400px]">
                        <div className="flex-1 rounded-lg overflow-hidden shadow-lg shadow-gray-200/50 relative group">
                            <img src="/hero-images/promo-jan.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Khuyến mãi" />
                        </div>
                        <div className="flex-1 rounded-lg overflow-hidden shadow-lg shadow-gray-200/50 relative group">
                            <img src="/hero-images/new-arrival.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Sách mới" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── 2. Promo Banner Row (4 banners) ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {promoBanners.map((promo, i) => (
                        <Link
                            key={i}
                            to="/shop"
                            className={`${promo.bgColor} rounded-lg p-4 md:p-5 text-white relative overflow-hidden group hover:shadow-lg transition-shadow h-[130px] flex flex-col justify-between`}
                        >
                            <div className="absolute top-3 right-3 opacity-30">{promo.icon}</div>
                            <div>
                                <h3 className="text-sm md:text-base font-black tracking-wide line-clamp-1">{promo.title}</h3>
                                <p className="text-[10px] md:text-xs opacity-80 mt-1 line-clamp-1">{promo.subtitle}</p>
                            </div>
                            <div className="inline-flex items-center text-[10px] md:text-xs font-bold bg-white/20 px-3 py-1 rounded-full group-hover:bg-white/30 transition-colors w-fit">
                                MUA NGAY →
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ─── 3. Icon Menu ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 grid grid-cols-5 md:grid-cols-10 gap-4">
                    {iconMenu.map((item, i) => (
                        <Link
                            key={i}
                            to="/shop"
                            className="flex flex-col items-center space-y-2 group transition-transform hover:-translate-y-1"
                        >
                            <div className={`w-14 h-14 bg-gray-50 border border-gray-200 ${item.iconColor} flex items-center justify-center rounded-lg transition-all group-hover:border-vanxuan-red group-hover:bg-red-50`}>
                                {item.icon}
                            </div>
                            <span className="text-[10px] font-bold text-gray-600 text-center leading-tight group-hover:text-vanxuan-red transition-colors">
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ─── 4. Flash Sale ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                    <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                            <span className="text-vanxuan-red font-black text-xl tracking-wider flex items-center space-x-2"><span>FLASH</span> <FaBolt className="w-5 h-5 text-yellow-500" /> <span>SALE</span></span>
                            <div className="hidden md:flex items-center space-x-1 text-sm font-bold text-gray-500">
                                <span>Kết thúc trong</span>
                                <span className="bg-vanxuan-dark text-white px-2 py-1 rounded-md font-black text-xs min-w-[28px] text-center">{pad(countdown.h)}</span>
                                <span className="font-black">:</span>
                                <span className="bg-vanxuan-dark text-white px-2 py-1 rounded-md font-black text-xs min-w-[28px] text-center">{pad(countdown.m)}</span>
                                <span className="font-black">:</span>
                                <span className="bg-vanxuan-dark text-white px-2 py-1 rounded-md font-black text-xs min-w-[28px] text-center">{pad(countdown.s)}</span>
                            </div>
                        </div>
                        <Link to="/shop" className="text-vanxuan-red text-sm font-bold hover:underline flex items-center space-x-1">
                            <span>Xem tất cả</span>
                            <HiOutlineChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-5 gap-6">
                        {flashSaleBooks.map((book) => (
                            <ProductCard key={book._id} book={book} showSold={true} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── 5. Xu Hướng Mua Sắm (Shopping Trends) ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                    {/* Pink Header */}
                    <div className="bg-red-50 px-6 py-4 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-vanxuan-red rounded-lg flex items-center justify-center">
                            <HiOutlineTrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg md:text-xl font-black text-vanxuan-dark">Xu Hướng Mua Sắm</h2>
                    </div>
                    {/* Tabs */}
                    <div className="border-b border-gray-100 px-6">
                        <div className="flex space-x-6 overflow-x-auto">
                            {trendTabs.map((tab, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTab(i)}
                                    className={`py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === i
                                        ? 'border-vanxuan-red text-vanxuan-red'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Product Grid */}
                    <div className="p-6 grid grid-cols-2 md:grid-cols-5 gap-6">
                        {trendBooks.slice(0, 5).map((book) => (
                            <ProductCard key={book._id} book={book} showSold={true} />
                        ))}
                    </div>
                    {/* Row 2 */}
                    {trendBooks.length > 5 && (
                        <div className="px-6 pb-6 grid grid-cols-2 md:grid-cols-5 gap-6">
                            {trendBooks.slice(5, 10).map((book) => (
                                <ProductCard key={book._id} book={book} showSold={true} />
                            ))}
                        </div>
                    )}
                    {/* Xem Thêm Button */}
                    <div className="px-6 pb-6 flex justify-center">
                        <Link
                            to="/shop"
                            className="border-2 border-vanxuan-red text-vanxuan-red px-16 py-3 rounded-lg font-bold text-sm hover:bg-vanxuan-red hover:text-white transition-colors"
                        >
                            Xem Thêm
                        </Link>
                    </div>
                </div>
            </div>

            {/* ─── 6. Tủ Sách Nổi Bật (Featured Bookshelves) ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                    <div className="bg-red-50 px-6 py-4 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-vanxuan-red rounded-lg flex items-center justify-center">
                            <HiOutlineBookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg md:text-xl font-black text-vanxuan-dark uppercase">Tủ Sách Nổi Bật</h2>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <div className="flex space-x-6 min-w-[640px]">
                            {featuredShelves.map((shelf, i) => (
                                <Link key={i} to="/shop" className="flex flex-col items-center space-y-3 group min-w-[120px]">
                                    <div className="w-24 h-24 bg-red-50 border-2 border-gray-100 rounded-lg flex items-center justify-center group-hover:border-vanxuan-red group-hover:shadow-md transition-all">
                                        {shelf.icon}
                                    </div>
                                    <span className="text-xs font-bold text-gray-600 text-center leading-tight group-hover:text-vanxuan-red transition-colors max-w-[100px]">
                                        {shelf.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── 7. Bảng Xếp Hạng Bán Chạy Tuần (Weekly Rankings) ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                    {/* Dark Header */}
                    <div className="bg-vanxuan-dark px-6 py-4">
                        <h2 className="text-lg md:text-xl font-black text-white">Bảng xếp hạng bán chạy tuần</h2>
                    </div>
                    {/* Category Tabs */}
                    <div className="border-b border-gray-100 px-6 bg-white">
                        <div className="flex space-x-4 overflow-x-auto">
                            {rankTabs.map((tab, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveRankTab(i)}
                                    className={`py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeRankTab === i
                                        ? 'border-vanxuan-red text-vanxuan-red'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* 2-Column Layout */}
                    <div className="flex flex-col lg:flex-row">
                        {/* Left: Ranked List */}
                        <div className="w-full lg:w-1/2 p-6 space-y-4 border-r border-gray-100">
                            {rankBooks.slice(0, 5).map((book, i) => (
                                <Link key={book._id} to={`/product/${book._id}`} className="flex items-center space-x-4 group p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col items-center min-w-[30px]">
                                        <span className={`text-xl font-black ${i === 0 ? 'text-vanxuan-red' : i < 3 ? 'text-orange-500' : 'text-gray-400'}`}>
                                            {pad(i + 1)}
                                        </span>
                                        <HiOutlineTrendingUp className="h-3 w-3 text-green-500" />
                                    </div>
                                    <img
                                        src={getImageUrl(book.images?.[0])}
                                        className="w-14 h-20 object-cover rounded shadow-sm"
                                        alt={book.title}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-vanxuan-dark line-clamp-2 group-hover:text-vanxuan-red transition-colors">{book.title}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{book.author || 'Nhiều tác giả'}</p>
                                        <p className="text-xs font-bold text-vanxuan-red mt-1">{(Math.floor(Math.random() * 2000 + 500))} điểm</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {/* Right: Featured product */}
                        {rankBooks[0] && (
                            <div className="w-full lg:w-1/2 p-6 flex flex-col items-center justify-center">
                                <img
                                    src={getImageUrl(rankBooks[0].images?.[0])}
                                    className="w-48 h-72 object-cover rounded-lg shadow-xl"
                                    alt={rankBooks[0].title}
                                />
                                <div className="mt-6 text-center max-w-sm space-y-2">
                                    <div className="flex items-center justify-center space-x-2">
                                        <span className="text-lg font-black text-vanxuan-red">{rankBooks[0].price?.toLocaleString('vi-VN')} đ</span>
                                        <span className="text-sm bg-vanxuan-red text-white px-2 py-0.5 rounded font-bold">-28%</span>
                                    </div>
                                    <div className="text-sm text-gray-400 line-through">{(rankBooks[0].price * 1.4)?.toLocaleString('vi-VN')} đ</div>
                                    <h3 className="text-base font-black text-vanxuan-dark uppercase leading-tight">
                                        {rankBooks[0].title}
                                    </h3>
                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                                        {rankBooks[0].description || 'Một cuốn sách cuốn hút ngay từ những trang đầu tiên. Được bạn đọc yêu thích và đánh giá cao trên toàn quốc.'}
                                    </p>
                                    <div className="pt-2">
                                        <p className="text-sm font-bold text-vanxuan-dark">VỀ TÁC GIẢ: {(rankBooks[0].author || 'Tác giả').toUpperCase()}</p>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                            Một tác giả được yêu thích trong dòng văn học Việt Nam, nổi tiếng với những tác phẩm có nội dung sâu sắc, kịch tính, giàu cảm xúc.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Xem thêm */}
                    <div className="px-6 pb-6 flex justify-center">
                        <Link
                            to="/shop"
                            className="border-2 border-vanxuan-red text-vanxuan-red px-16 py-3 rounded-lg font-bold text-sm hover:bg-vanxuan-red hover:text-white transition-colors"
                        >
                            Xem thêm
                        </Link>
                    </div>
                </div>
            </div>

            {/* ─── 8. Bộ Sưu Tập Nổi Bật (Featured Collections) ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                    <div className="bg-red-50 px-6 py-4 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-vanxuan-red rounded-lg flex items-center justify-center">
                            <HiOutlineViewGrid className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg md:text-xl font-black text-vanxuan-dark uppercase">Bộ Sưu Tập Nổi Bật</h2>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <div className="flex space-x-6 min-w-[640px]">
                            {collections.map((col, i) => (
                                <Link key={i} to="/shop" className="flex flex-col items-center space-y-3 group min-w-[120px]">
                                    <div className="w-24 h-24 bg-amber-50 border-2 border-gray-100 rounded-lg flex items-center justify-center group-hover:border-vanxuan-red group-hover:shadow-md transition-all">
                                        {col.icon}
                                    </div>
                                    <span className="text-xs font-bold text-gray-600 text-center leading-tight group-hover:text-vanxuan-red transition-colors">
                                        {col.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── 9. Sách chỉ bán tại Vạn Xuân (Exclusives) ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                    <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-vanxuan-red rounded-lg flex items-center justify-center">
                                <FaStar className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg md:text-xl font-black text-vanxuan-dark">Sách chỉ bán tại Vạn Xuân</h2>
                        </div>
                        <Link to="/shop" className="text-vanxuan-red text-sm font-bold hover:underline flex items-center space-x-1">
                            <span>Xem tất cả</span>
                            <HiOutlineChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-5 gap-6">
                        {[...flashSaleBooks].reverse().map((book) => (
                            <Link key={`exc-${book._id}`} to={`/product/${book._id}`} className="space-y-3 group relative">
                                <div className="aspect-[3/4] bg-gray-50 rounded-md relative overflow-hidden">
                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-vanxuan-gold text-vanxuan-dark text-[10px] font-black rounded z-10">Độc quyền</div>
                                    <img
                                        src={getImageUrl(book.images?.[0])}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        alt={book.title}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-medium text-vanxuan-dark h-[32px] line-clamp-2 leading-tight group-hover:text-vanxuan-red transition-colors">
                                        {book.title}
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-black text-vanxuan-red">
                                            {book.price?.toLocaleString('vi-VN')} đ
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-[10px] text-yellow-500">
                                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                        <span className="text-gray-400 ml-1">| Đã bán {Math.floor(Math.random() * 100 + 5)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="px-6 pb-6 flex justify-center">
                        <Link
                            to="/shop"
                            className="border-2 border-vanxuan-red text-vanxuan-red px-16 py-3 rounded-lg font-bold text-sm hover:bg-vanxuan-red hover:text-white transition-colors flex items-center space-x-2"
                        >
                            <span>Xem tất cả</span>
                            <HiOutlineChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ─── 10. AI Suggestion CTA ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-vanxuan-dark rounded-lg p-12 md:p-16 relative overflow-hidden">
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
                        <p className="text-vanxuan-gold font-black uppercase tracking-[0.2em] text-sm">Cá nhân hóa trải nghiệm</p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight underline decoration-vanxuan-gold decoration-8 underline-offset-8">
                            AI gợi ý cuốn sách <br /> dành riêng cho bạn
                        </h2>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed">
                            Khám phá tri thức mới dựa trên sở thích và hành vi của bạn. Hệ thống AI của chúng tôi sẽ giúp bạn tìm thấy "chân ái" tiếp theo.
                        </p>
                        <Link to="/shop" className="group flex items-center space-x-6">
                            <div className="px-10 py-5 bg-vanxuan-red text-white rounded-lg font-black text-lg shadow-2xl shadow-vanxuan-red/20 group-hover:bg-vanxuan-red/90 transition-all group-hover:translate-x-2">
                                Trải nghiệm ngay
                            </div>
                            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                                <HiOutlineArrowRight className="w-8 h-8" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
