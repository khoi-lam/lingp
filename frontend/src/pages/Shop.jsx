import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { booksAPI, categoriesAPI } from '../services/api';
import BookCard from '../components/BookCard';

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        categoriesAPI.getAll().then(r => {
            if (r.data.success) setCategories(r.data.data.categories);
        }).catch(() => { });
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = { page, limit: 12 };
        if (search) params.search = search;
        if (selectedCat) params.genre = selectedCat;

        booksAPI.getAll(params).then(r => {
            if (r.data.success) {
                setBooks(r.data.data.books);
                setTotalPages(r.data.data.pagination?.pages || 1);
            }
        }).catch(() => { }).finally(() => setLoading(false));
    }, [page, search, selectedCat]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        const val = e.target.elements.search.value;
        setSearch(val);
    };

    const handleCatClick = (slug) => {
        setSelectedCat(slug === selectedCat ? '' : slug);
        setPage(1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-display font-bold text-[#2B3A67]">Cửa Hàng Sách</h1>
                <p className="text-[#388E3C] mt-2">Khám phá hàng trăm đầu sách AR sống động</p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
                <div className="relative">
                    <input name="search" defaultValue={search} placeholder="Tìm sách theo tên, tác giả..." className="w-full py-3 pl-12 pr-4 rounded-full border-2 border-[#C5E0B4] focus:border-[#4CAF50] focus:ring-0 bg-white text-[#2B3A67]" />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8BC34A]">search</span>
                </div>
            </form>

            {/* Category Filters */}
            <div className="flex gap-2 justify-start sm:justify-center mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                <button onClick={() => handleCatClick('')} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${!selectedCat ? 'bg-[#4CAF50] text-white' : 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C5E0B4]'}`}>
                    Tất Cả
                </button>
                {categories.map(cat => (
                    <button key={cat._id} onClick={() => handleCatClick(cat.slug)} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${selectedCat === cat.slug ? 'bg-[#4CAF50] text-white' : 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C5E0B4]'}`}>
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Books Grid */}
            {loading ? (
                <div className="text-center py-20"><span className="material-symbols-outlined text-5xl animate-spin text-[#4CAF50]">progress_activity</span></div>
            ) : books.length === 0 ? (
                <div className="text-center py-20">
                    <span className="material-symbols-outlined text-[80px] text-[#C5E0B4] mb-4 block">search_off</span>
                    <h3 className="text-xl font-bold text-[#2B3A67] mb-2">Không tìm thấy sách</h3>
                    <p className="text-gray-400">Thử tìm kiếm với từ khoá khác hoặc chọn thể loại khác.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {books.map(book => <BookCard key={book._id} book={book} />)}
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-10">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-full font-bold transition-colors ${p === page ? 'bg-[#4CAF50] text-white' : 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C5E0B4]'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
