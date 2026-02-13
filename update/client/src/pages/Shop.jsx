import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../config';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState({ origin: [], genres: [] });
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    // Filter states
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        origin: searchParams.get('origin') || '',
        genre: searchParams.get('genre') || '',
        sort: searchParams.get('sort') || '-createdAt',
        page: parseInt(searchParams.get('page')) || 1
    });

    // Sync URL params with filters when navigating from Navbar
    useEffect(() => {
        const newSearch = searchParams.get('search') || '';
        if (newSearch !== filters.search) {
            setFilters(prev => ({
                ...prev,
                search: newSearch,
                page: 1 // Reset to page 1 when search changes
            }));
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                const cats = res.data.data.categories;
                setCategories({
                    origin: cats.filter(c => c.type === 'origin'),
                    genres: cats.filter(c => c.type === 'genre')
                });
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();

                // Use semantic search API if there's a search query
                if (filters.search) {
                    params.append('q', filters.search);
                    params.append('limit', 20);

                    const res = await api.get(`/search?${params.toString()}`);
                    setBooks(res.data.data.results || []);
                    setTotal(res.data.data.count || 0);
                } else {
                    // Use regular books API for browsing/filtering
                    if (filters.origin) params.append('origin', filters.origin);
                    if (filters.genre) params.append('genre', filters.genre);
                    params.append('sort', filters.sort);
                    params.append('page', filters.page);
                    params.append('limit', 20);

                    const res = await api.get(`/books?${params.toString()}`);
                    setBooks(res.data.data.books);
                    setTotal(res.data.data.pagination.total);
                }
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
        setSearchParams(filters);
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-64 space-y-8">
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-black text-fahasa-dark uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Bộ lọc</h3>

                            {/* Origin Filter */}
                            <div className="space-y-4 mb-8">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Xuất xứ</p>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleFilterChange('origin', '')}
                                        className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${!filters.origin ? 'bg-fahasa-red text-white shadow-lg shadow-fahasa-red/20' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Tất cả
                                    </button>
                                    {categories.origin.map(cat => (
                                        <button
                                            key={cat._id}
                                            onClick={() => handleFilterChange('origin', cat._id)}
                                            className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${filters.origin === cat._id ? 'bg-fahasa-red text-white shadow-lg shadow-fahasa-red/20' : 'text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Genre Filter */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thể loại</p>
                                <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                    <button
                                        onClick={() => handleFilterChange('genre', '')}
                                        className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${!filters.genre ? 'bg-fahasa-red text-white shadow-lg shadow-fahasa-red/20' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Tất cả thể loại
                                    </button>
                                    {categories.genres.map(cat => (
                                        <button
                                            key={cat._id}
                                            onClick={() => handleFilterChange('genre', cat._id)}
                                            className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${filters.genre === cat._id ? 'bg-fahasa-red text-white shadow-lg shadow-fahasa-red/20' : 'text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        {/* Toolbar */}
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 px-6">
                            <p className="text-sm font-bold text-gray-500">
                                Hiển thị <span className="text-fahasa-dark font-black">{books.length}</span> trên <span className="text-fahasa-dark font-black">{total}</span> sản phẩm
                            </p>
                            <div className="flex items-center space-x-4">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sắp xếp theo</span>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-fahasa-red text-fahasa-dark cursor-pointer"
                                >
                                    <option value="-createdAt">Mới nhất</option>
                                    <option value="-soldCount">Bán chạy nhất</option>
                                    <option value="price">Giá thấp - cao</option>
                                    <option value="-price">Giá cao - thấp</option>
                                </select>
                            </div>
                        </div>

                        {/* Grid */}
                        {loading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 animate-pulse">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-lg p-4 space-y-4">
                                        <div className="aspect-[3/4] bg-gray-100 rounded-md"></div>
                                        <div className="h-4 bg-gray-100 rounded-full w-2/3"></div>
                                        <div className="h-4 bg-gray-100 rounded-full"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {books.length > 0 ? (
                                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                                        {books.map(book => (
                                            <Link
                                                key={book._id}
                                                to={`/product/${book._id}`}
                                                className="bg-white p-4 rounded-lg border border-transparent hover:border-gray-100 hover:shadow-2xl transition-all group"
                                            >
                                                <div className="aspect-[3/4] rounded-md bg-gray-50 mb-6 overflow-hidden relative">
                                                    <img
                                                        src={getImageUrl(book.images?.[0])}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="space-y-3 px-2">
                                                    <p className="text-[10px] font-black text-fahasa-red uppercase tracking-widest truncate">{book.author}</p>
                                                    <h4 className="!text-xs font-bold text-fahasa-dark line-clamp-2 h-10 group-hover:text-fahasa-red transition-colors">{book.title}</h4>
                                                    <p className="text-lg font-black text-fahasa-red">{book.price?.toLocaleString()}đ</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100">
                                        <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-xl font-black text-fahasa-dark">Không tìm thấy kết quả</h4>
                                        <p className="text-gray-400 font-bold mt-2">Thử điều chỉnh bộ lọc để tìm kiếm thêm nhé!</p>
                                    </div>
                                )}

                                {/* Pagination */}
                                {total > 20 && (
                                    <div className="flex justify-center space-x-2 pt-8">
                                        {[...Array(Math.ceil(total / 20))].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleFilterChange('page', i + 1)}
                                                className={`w-10 h-10 rounded-xl font-black transition-all ${filters.page === i + 1 ? 'bg-fahasa-red text-white shadow-lg shadow-fahasa-red/20' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
