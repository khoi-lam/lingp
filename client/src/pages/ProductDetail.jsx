import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../config';

const ProductDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [relatedBooks, setRelatedBooks] = useState([]);
    const [aiRecommendations, setAiRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/books/${id}`);
                setBook(res.data.data.book);

                // Fetch related books (same genre or origin)
                const genreId = res.data.data.book.categories?.genres?.[0]?._id || res.data.data.book.categories?.genres?.[0];
                if (genreId) {
                    const relatedRes = await api.get(`/books?genre=${genreId}&limit=5`);
                    setRelatedBooks(relatedRes.data.data.books.filter(b => b._id !== id));
                }
            } catch (error) {
                console.error('Error fetching product detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
        window.scrollTo(0, 0);
    }, [id]);

    // Fetch AI recommendations
    useEffect(() => {
        const fetchAIRecommendations = async () => {
            if (!book?._id) return;

            setAiLoading(true);
            setAiError(null);

            try {
                const res = await api.get(
                    `/recommendations/books/${book._id}/ai-recommendations`
                );
                setAiRecommendations(res.data.data.recommendations);
            } catch (error) {
                console.error('Error fetching AI recommendations:', error);
                setAiError('Không thể tải gợi ý AI');
            } finally {
                setAiLoading(false);
            }
        };

        fetchAIRecommendations();
    }, [book?._id]);

    const handleAddToCart = () => {
        addToCart(book, quantity);
        // We could add a more sophisticated toast notification here, but for now this is functional
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-vanxuan-red border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!book) return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl font-black text-vanxuan-dark">Không tìm thấy sản phẩm</h2>
            <Link to="/shop" className="text-vanxuan-red font-bold hover:underline">Quay lại cửa hàng</Link>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
                    <Link to="/" className="hover:text-vanxuan-red transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <Link to="/shop" className="hover:text-vanxuan-red transition-colors">Cửa hàng</Link>
                    <span>/</span>
                    <span className="text-vanxuan-dark truncate max-w-[200px]">{book.title}</span>
                </nav>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Image Gallery */}
                        <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-gray-50/50">
                            <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-xl shadow-gray-200/50">
                                <img
                                    src={getImageUrl(book.images?.[0])}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-vanxuan-red uppercase tracking-widest">{book.author}</p>
                                    <h1 className="text-3xl lg:text-4xl font-black text-vanxuan-dark leading-tight">{book.title}</h1>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <span className="text-3xl font-black text-vanxuan-red">{book.price?.toLocaleString()}đ</span>
                                    {book.stockQuantity > 0 ? (
                                        <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            Còn hàng ({book.stockQuantity})
                                        </div>
                                    ) : (
                                        <div className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            Hết hàng
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-gray-100 space-y-8">
                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-vanxuan-red transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="w-12 text-center font-black text-vanxuan-dark">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.min(book.stockQuantity, quantity + 1))}
                                                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-vanxuan-red transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                        <button
                                            disabled={book.stockQuantity === 0}
                                            onClick={handleAddToCart}
                                            className="flex-1 py-4 bg-vanxuan-red text-white rounded-lg font-black shadow-xl shadow-vanxuan-red/20 hover:bg-vanxuan-red/90 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
                                        >
                                            Thêm vào giỏ hàng
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center text-vanxuan-red shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cam kết</p>
                                                <p className="text-xs font-bold text-vanxuan-dark">100% Chính hãng</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center text-vanxuan-red shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Giao hàng</p>
                                                <p className="text-xs font-bold text-vanxuan-dark">Toàn quốc 2-4 ngày</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs & Description */}
                <div className="mt-12 bg-white rounded-lg p-8 lg:p-12 border border-gray-100 shadow-sm">
                    <div className="flex space-x-8 border-b border-gray-100 mb-8">
                        {['info', 'shipping'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-vanxuan-red' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab === 'info' ? 'Chi tiết sản phẩm' : 'Thông tin vận chuyển'}
                                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-vanxuan-red rounded-full"></div>}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[200px]">
                        {activeTab === 'info' ? (
                            <div className="space-y-6">
                                <div className="prose prose-red max-w-none text-gray-600 font-medium leading-relaxed">
                                    {book.description || 'Chưa có mô tả cho sản phẩm này.'}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 text-sm">
                                    <div className="flex justify-between py-3 border-b border-gray-50">
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Nhà xuất bản</span>
                                        <span className="font-black text-vanxuan-dark">{book.publisher || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-gray-50">
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">ISBN</span>
                                        <span className="font-black text-vanxuan-dark">{book.isbn || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="prose prose-red max-w-none text-gray-600 font-medium leading-relaxed">
                                <p>Chúng tôi cung cấp dịch vụ giao hàng toàn quốc thông qua các đối tác vận chuyển uy tín.</p>
                                <ul>
                                    <li>Khu vực TP.HCM & Hà Nội: 1-2 ngày làm việc.</li>
                                    <li>Các tỉnh thành khác: 3-5 ngày làm việc.</li>
                                    <li>Miễn phí vận chuyển cho đơn hàng từ 500.000đ.</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedBooks.length > 0 && (
                    <div className="mt-24">
                        <div className="flex justify-between items-end mb-12 px-4">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-vanxuan-red uppercase tracking-widest">Sách cùng thể loại</p>
                                <h3 className="text-3xl font-black text-vanxuan-dark">Sản phẩm liên quan</h3>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                            {relatedBooks.map(item => (
                                <Link
                                    key={item._id}
                                    to={`/product/${item._id}`}
                                    className="bg-white p-4 rounded-lg border border-transparent hover:border-gray-100 hover:shadow-2xl transition-all group"
                                >
                                    <div className="aspect-[3/4] rounded-md bg-gray-50 mb-6 overflow-hidden">
                                        <img
                                            src={getImageUrl(item.images?.[0])}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="space-y-3 px-2">
                                        <p className="text-[10px] font-black text-vanxuan-red uppercase tracking-widest truncate">{item.author}</p>
                                        <h4 className="!text-xs font-bold text-vanxuan-dark line-clamp-2 h-10">{item.title}</h4>
                                        <p className="text-lg font-black text-vanxuan-red">{item.price?.toLocaleString()}đ</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI Recommendations */}
                {(aiRecommendations.length > 0 || aiLoading) && (
                    <div className="mt-24">
                        <div className="flex justify-between items-end mb-12 px-4">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">-</span>
                                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">
                                        AI Gợi ý
                                    </p>
                                </div>
                                <h3 className="text-3xl font-black text-vanxuan-dark">
                                    Sách được đề xuất cho bạn
                                </h3>
                            </div>
                        </div>

                        {aiLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : aiError ? (
                            <div className="text-center py-10 text-gray-500 font-medium">{aiError}</div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                {aiRecommendations.map(item => (
                                    <Link
                                        key={item._id}
                                        to={`/product/${item._id}`}
                                        className="bg-white p-4 rounded-lg border border-transparent hover:border-purple-200 hover:shadow-2xl transition-all group relative"
                                    >
                                        <div className="aspect-[3/4] rounded-md bg-gray-50 mb-6 overflow-hidden">
                                            <img
                                                src={getImageUrl(item.images?.[0])}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="space-y-3 px-2">
                                            <p className="text-[10px] font-black text-vanxuan-red uppercase tracking-widest truncate">
                                                {item.author}
                                            </p>
                                            <h4 className="!text-xs font-bold text-vanxuan-dark line-clamp-2 h-10">
                                                {item.title}
                                            </h4>
                                            <p className="text-lg font-black text-vanxuan-red">
                                                {item.price?.toLocaleString()}đ
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
