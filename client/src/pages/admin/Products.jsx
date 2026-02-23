import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { bookService } from '../../services/bookService';
import { categoryService } from '../../services/categoryService';
import Notification from '../../components/Notification';
import ConfirmModal from '../../components/ConfirmModal';
import { getImageUrl } from '../../config';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState({ origins: [], genres: [] });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [notification, setNotification] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, productId: null });

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, [page]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await bookService.getBooks({ page, limit: 10 });
            setProducts(response.data.books);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const [originsRes, genresRes] = await Promise.all([
                categoryService.getCategories('origin'),
                categoryService.getCategories('genre')
            ]);
            setCategories({
                origins: originsRes.data.categories,
                genres: genresRes.data.categories
            });
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const handleDeleteClick = (id) => {
        setConfirmDelete({ isOpen: true, productId: id });
    };

    const handleConfirmDelete = async () => {
        const id = confirmDelete.productId;
        setConfirmDelete({ isOpen: false, productId: null });

        try {
            await bookService.deleteBook(id);
            setNotification({ message: 'Xóa sản phẩm thành công!', type: 'success' });
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            setNotification({
                message: error.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm',
                type: 'error'
            });
        }
    };

    const getCategoryName = (id, type) => {
        const list = type === 'origin' ? categories.origins : categories.genres;
        const cat = list.find((c) => c._id === id);
        return cat?.name || '-';
    };

    return (
        <AdminLayout>
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Inventory Management</p>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Thư viện sách</h2>
                    </div>
                    <Link
                        to="/admin/products/new"
                        className="px-8 py-4 bg-vanxuan-red text-white rounded-2xl font-black text-sm hover:bg-vanxuan-red/90 transition-all shadow-xl shadow-vanxuan-red/20 hover:scale-105 active:scale-95 flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Thêm Sản Phẩm</span>
                    </Link>
                </div>

                {/* Products Table Area */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Sản phẩm
                                </th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Tác giả
                                </th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Giá bán
                                </th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Kho hàng
                                </th>
                                <th className="px-10 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                                            <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Đang truy xuất dữ liệu...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center text-gray-400">
                                        <div className="flex flex-col items-center opacity-30">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            <p className="font-black uppercase tracking-[0.2em] text-sm">Chưa có sản phẩm nào</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center space-x-6">
                                                <div className="relative w-14 h-20 rounded-xl overflow-hidden shadow-md border border-gray-100 flex-shrink-0 bg-white group-hover:scale-105 transition-transform duration-500">
                                                    {product.images?.[0] ? (
                                                        <img
                                                            src={getImageUrl(product.images?.[0])}
                                                            alt={product.title}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate max-w-xs">
                                                        {product.title}
                                                    </div>
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                        ISBN: {product.isbn || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="text-sm font-bold text-gray-600">
                                                {product.author}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="text-base font-black text-gray-900 bg-gray-50 inline-block px-4 py-1.5 rounded-xl border border-gray-100">
                                                {product.price.toLocaleString('vi-VN')} đ
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-2 h-2 rounded-full ${product.stockQuantity > 10 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                                                <span className="text-sm font-black text-gray-700">{product.stockQuantity} cuốn</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 whitespace-nowrap text-right">
                                            <div className="flex justify-end space-x-3">
                                                <Link
                                                    to={`/admin/products/edit/${product._id}`}
                                                    className="w-12 h-12 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(product._id)}
                                                    className="w-12 h-12 bg-white border border-gray-100 text-vanxuan-red hover:text-white hover:bg-vanxuan-red rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-90"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:hover:bg-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="bg-white px-8 py-3 rounded-2xl border border-gray-100 shadow-sm font-black text-xs uppercase tracking-[0.2em] text-gray-400">
                            Page <span className="text-primary-600">{page}</span> of <span className="text-gray-900">{totalPages}</span>
                        </div>

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:hover:bg-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
                confirmText="Xác nhận xóa"
                cancelText="Quay lại"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, productId: null })}
                type="danger"
            />
        </AdminLayout>
    );
};

export default Products;
