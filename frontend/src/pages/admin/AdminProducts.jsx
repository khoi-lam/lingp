import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI } from '../../services/api';
import { ConfirmModal, Toast, useToast } from '../../components/AdminPopups';

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function getStockInfo(qty) {
    if (qty <= 0) return { label: 'Hết hàng', style: 'bg-red-100 text-red-800' };
    if (qty <= 10) return { label: 'Sắp hết', style: 'bg-orange-100 text-orange-800' };
    return { label: 'Còn hàng', style: 'bg-green-100 text-green-800' };
}

import { API_BASE } from '../../config.js';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 1 });
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const { toast, showToast, closeToast } = useToast();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 12 };
            if (search) params.search = search;
            const { data } = await booksAPI.getAll(params);
            if (data.success) {
                setProducts(data.data.books);
                setPagination(data.data.pagination);
            }
        } catch (err) {
            showToast('Lỗi tải danh sách sản phẩm', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await booksAPI.delete(deleteTarget._id);
            showToast(`Đã xoá sản phẩm "${deleteTarget.title}" thành công`);
            setDeleteTarget(null);
            fetchProducts();
        } catch (err) {
            showToast('Lỗi khi xoá sản phẩm', 'error');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#111811] tracking-tight">Quản Lý Sản Phẩm</h1>
                    <p className="text-[#618961] mt-1">Quản lý kho sách, giá và tồn kho.</p>
                </div>
                <Link to="/admin/products/new" className="flex items-center justify-center gap-2 rounded-full h-12 px-6 bg-[#0ea00e] hover:brightness-110 text-white shadow-lg shadow-[#0ea00e]/20 transition-all active:scale-95">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span className="text-sm font-bold">Thêm sản phẩm</span>
                </Link>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-1 min-w-[280px] max-w-md group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#618961] group-focus-within:text-[#0ea00e] transition-colors">search</span>
                    <input
                        className="w-full h-12 pl-12 pr-4 rounded-full border-0 bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] placeholder:text-gray-400 transition-shadow shadow-sm"
                        placeholder="Tìm theo tên hoặc tác giả..."
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </form>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <span className="material-symbols-outlined text-4xl animate-spin text-[#0ea00e]">progress_activity</span>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-[#618961]">
                        <span className="material-symbols-outlined text-5xl mb-2 block">inventory_2</span>
                        <p>Chưa có sản phẩm nào</p>
                    </div>
                ) : (
                    <>
                        {/* ═══ MOBILE: Card Layout ═══ */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {products.map((p) => {
                                const stock = getStockInfo(p.stockQuantity);
                                const imgSrc = p.images?.[0] ? (p.images[0].startsWith('http') ? p.images[0] : `${API_BASE}/${p.images[0]}`) : null;
                                return (
                                    <div key={p._id} className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
                                        {/* Image */}
                                        {imgSrc ? (
                                            <div className="w-16 h-20 rounded-lg bg-gray-200 bg-cover bg-center shadow-sm flex-shrink-0" style={{ backgroundImage: `url("${imgSrc}")` }} />
                                        ) : (
                                            <div className="w-16 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-gray-300">image</span>
                                            </div>
                                        )}
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-sm text-[#111811] line-clamp-2 leading-tight">{p.title}</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">{p.author}</p>
                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                <span className="text-sm font-bold text-[#0ea00e]">{formatCurrency(p.price)}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stock.style}`}>{stock.label}</span>
                                            </div>
                                            {p.isbn && <p className="text-[10px] text-gray-300 mt-1">ISBN: {p.isbn}</p>}
                                        </div>
                                        {/* Actions */}
                                        <div className="flex flex-col gap-1 flex-shrink-0">
                                            <Link to={`/admin/products/${p._id}/edit`} className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#0ea00e] hover:bg-[#C5E0B4] transition-colors">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </Link>
                                            <button onClick={() => setDeleteTarget(p)} className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors">
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ═══ DESKTOP: Table Layout ═══ */}
                        <table className="hidden md:table w-full border-collapse text-left">
                            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase tracking-wider w-24">Ảnh</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase tracking-wider">Tên sách</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase tracking-wider">Tác giả</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase tracking-wider text-right">Giá</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase tracking-wider text-center">Tồn kho</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase tracking-wider text-center">Đã bán</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase tracking-wider text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((p, i) => {
                                    const stock = getStockInfo(p.stockQuantity);
                                    const imgSrc = p.images?.[0] ? (p.images[0].startsWith('http') ? p.images[0] : `${API_BASE}/${p.images[0]}`) : null;
                                    return (
                                        <tr key={p._id} className={`hover:bg-[#0ea00e]/5 transition-colors group ${i % 2 === 1 ? 'bg-[#0ea00e]/[0.02]' : ''}`}>
                                            <td className="px-6 py-4">
                                                {imgSrc ? (
                                                    <div className="h-12 w-10 rounded-lg bg-gray-200 bg-cover bg-center shadow-sm" style={{ backgroundImage: `url("${imgSrc}")` }}></div>
                                                ) : (
                                                    <div className="h-12 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-gray-300">image</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-[#111811]">{p.title}</div>
                                                {p.isbn && <div className="text-xs text-gray-400 mt-0.5">ISBN: {p.isbn}</div>}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#111811]">{p.author}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-[#111811] text-right">{formatCurrency(p.price)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${stock.style}`}>{stock.label} ({p.stockQuantity})</span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-[#618961]">{p.soldCount || 0}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <Link to={`/admin/products/${p._id}/edit`} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#0ea00e] transition-colors" title="Sửa">
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </Link>
                                                    <button onClick={() => setDeleteTarget(p)} className="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors" title="Xóa">
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-between py-4">
                    <p className="text-sm text-gray-500">Trang <span className="font-bold text-[#111811]">{page}</span> / <span className="font-bold text-[#111811]">{pagination.pages}</span> ({pagination.total} sản phẩm)</p>
                    <div className="flex items-center gap-2">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30">
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        {(() => {
                            const maxVisible = 5;
                            let start = Math.max(1, page - Math.floor(maxVisible / 2));
                            let end = start + maxVisible - 1;
                            if (end > pagination.pages) { end = pagination.pages; start = Math.max(1, end - maxVisible + 1); }
                            return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(n => (
                                <button key={n} onClick={() => setPage(n)} className={`flex size-10 items-center justify-center rounded-full text-sm transition-colors ${n === page ? 'bg-[#0ea00e] text-white font-bold shadow-md' : 'hover:bg-gray-100'}`}>{n}</button>
                            ));
                        })()}
                        <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30">
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            <ConfirmModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Xoá sản phẩm?"
                message={`Bạn có chắc muốn xoá "${deleteTarget?.title}"? Thao tác này không thể hoàn tác.`}
                confirmText="Xoá"
                danger
                loading={deleting}
            />
            <Toast {...toast} onClose={closeToast} />
        </div>
    );
}
