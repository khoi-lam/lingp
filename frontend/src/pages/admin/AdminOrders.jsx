import { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import { Toast, useToast } from '../../components/AdminPopups';

const STATUS = {
    processing: { label: 'Đang xử lý', bg: 'bg-yellow-100 text-yellow-700', icon: 'sync' },
    shipping: { label: 'Đang giao', bg: 'bg-blue-100 text-blue-700', icon: 'local_shipping' },
    completed: { label: 'Hoàn thành', bg: 'bg-green-100 text-green-700', icon: 'check_circle' },
    cancelled: { label: 'Đã hủy', bg: 'bg-red-100 text-red-700', icon: 'cancel' },
};

// Forward flow only: processing → shipping → completed
const NEXT = { processing: 'shipping', shipping: 'completed' };
const NEXT_LABEL = { processing: 'Giao hàng', shipping: 'Hoàn thành' };

const TABS = ['all', 'processing', 'shipping', 'completed', 'cancelled'];
const TAB_LABEL = { all: 'Tất cả', processing: 'Xử lý', shipping: 'Giao', completed: 'Xong', cancelled: 'Hủy' };

const fmt = (n) => Number(n).toLocaleString('vi-VN') + '₫';
const fmtDate = (d) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

import { API_BASE } from '../../config.js';
const getImg = (b) => b.images?.[0] ? (b.images[0].startsWith('http') ? b.images[0] : `${API_BASE}/${b.images[0].replace(/^\//, '')}`) : b.image || null;

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 1 });
    const [detail, setDetail] = useState(null); // popup order
    const [updating, setUpdating] = useState(''); // updating order id
    const { toast, showToast, closeToast } = useToast();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 20 };
            if (tab !== 'all') params.status = tab;
            if (search) params.search = search;
            const { data } = await ordersAPI.adminGetAll(params);
            if (data.success) { setOrders(data.data.orders); setPagination(data.data.pagination); }
        } catch { showToast('Lỗi tải đơn hàng', 'error'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, [tab, page]);

    const handleStatus = async (order, newStatus, e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (newStatus === 'cancelled' && !confirm('Hủy đơn hàng này? Không thể khôi phục!')) return;
        setUpdating(order._id);
        try {
            await ordersAPI.updateStatus(order._id, { orderStatus: newStatus });
            showToast(`Đơn #${order._id.slice(-4).toUpperCase()} → ${STATUS[newStatus].label}`, 'success');
            // Update local state
            setOrders(prev => prev.map(o => o._id === order._id ? { ...o, orderStatus: newStatus } : o));
            if (detail?._id === order._id) setDetail(d => ({ ...d, orderStatus: newStatus }));
        } catch { showToast('Cập nhật thất bại', 'error'); }
        finally { setUpdating(''); }
    };

    const StatusActions = ({ order, compact }) => {
        const status = order.orderStatus;
        const next = NEXT[status];
        const isFinal = status === 'completed' || status === 'cancelled';
        const canCancel = status === 'processing'; // chỉ hủy được khi đang xử lý
        const isUpdating = updating === order._id;

        if (isFinal) return <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${STATUS[status].bg}`}>{STATUS[status].label}</span>;

        return (
            <div className={`flex items-center ${compact ? 'gap-1' : 'gap-2'}`} onClick={e => e.stopPropagation()}>
                {next && (
                    <button
                        disabled={isUpdating}
                        onClick={(e) => handleStatus(order, next, e)}
                        className={`${compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'} font-bold rounded-lg bg-[#0ea00e] text-white hover:bg-[#0c8c0c] transition-all disabled:opacity-50 flex items-center gap-1`}
                    >
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        {NEXT_LABEL[status]}
                    </button>
                )}
                {canCancel && (
                    <button
                        disabled={isUpdating}
                        onClick={(e) => handleStatus(order, 'cancelled', e)}
                        className={`${compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'} font-bold rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all disabled:opacity-50`}
                        title="Hủy đơn"
                    >
                        <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                )}
            </div>
        );
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-[#111811] mb-4">Đơn Hàng</h1>

            {/* Search */}
            <form onSubmit={e => { e.preventDefault(); setPage(1); fetchOrders(); }} className="relative mb-4">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
                <input className="w-full h-10 pl-10 pr-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-sm placeholder:text-gray-400" placeholder="Tìm khách hàng, SĐT..." value={search} onChange={e => setSearch(e.target.value)} />
            </form>

            {/* Tabs */}
            <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
                {TABS.map(t => (
                    <button key={t} onClick={() => { setTab(t); setPage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${tab === t ? 'bg-[#0ea00e] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >{TAB_LABEL[t]}</button>
                ))}
            </div>

            {/* Order list */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-16"><span className="material-symbols-outlined text-3xl animate-spin text-[#0ea00e]">progress_activity</span></div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <span className="material-symbols-outlined text-4xl mb-1 block">receipt_long</span>
                        <p className="text-sm">Không có đơn hàng</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {orders.map(order => {
                            const s = STATUS[order.orderStatus] || STATUS.processing;
                            return (
                                <div key={order._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                                    {/* Status icon */}
                                    <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                                        <span className="material-symbols-outlined text-base">{s.icon}</span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-bold text-[#111811] truncate">{order.user?.name || order.shippingAddress?.fullName || '—'}</span>
                                            <span className="text-[10px] text-gray-400 font-mono">#{order._id?.slice(-4).toUpperCase()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                            <span>{order.items?.length || 0} sp</span>
                                            <span>•</span>
                                            <span>{fmtDate(order.createdAt)}</span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <span className="text-sm font-bold text-[#0ea00e] flex-shrink-0 hidden sm:block">{fmt(order.totalAmount)}</span>

                                    {/* Status actions */}
                                    <div className="flex-shrink-0 hidden sm:flex">
                                        <StatusActions order={order} compact={false} />
                                    </div>
                                    <div className="flex-shrink-0 sm:hidden">
                                        <StatusActions order={order} compact={true} />
                                    </div>

                                    {/* Eye button */}
                                    <button onClick={() => setDetail(order)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0ea00e] hover:bg-[#E8F5E9] transition-colors flex-shrink-0" title="Chi tiết">
                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-gray-400">{page}/{pagination.pages} · {pagination.total} đơn</p>
                    <div className="flex gap-1">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"><span className="material-symbols-outlined text-sm text-gray-500">chevron_left</span></button>
                        <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"><span className="material-symbols-outlined text-sm text-gray-500">chevron_right</span></button>
                    </div>
                </div>
            )}

            {/* ═══ Detail Popup ═══ */}
            {detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setDetail(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl z-10">
                            <div>
                                <h2 className="font-bold text-lg text-[#111811]">Đơn #{detail._id?.slice(-4).toUpperCase()}</h2>
                                <p className="text-xs text-gray-400">{fmtDate(detail.createdAt)}</p>
                            </div>
                            <button onClick={() => setDetail(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"><span className="material-symbols-outlined text-lg">close</span></button>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Status + Actions */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-lg ${(STATUS[detail.orderStatus] || STATUS.processing).bg} flex items-center justify-center`}>
                                        <span className="material-symbols-outlined text-base">{(STATUS[detail.orderStatus] || STATUS.processing).icon}</span>
                                    </div>
                                    <span className="text-sm font-bold">{(STATUS[detail.orderStatus] || STATUS.processing).label}</span>
                                </div>
                                <StatusActions order={detail} compact={false} />
                            </div>

                            {/* Customer */}
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Khách hàng</p>
                                <p className="text-sm font-bold text-[#111811]">{detail.user?.name || detail.shippingAddress?.fullName || '—'}</p>
                                {detail.shippingAddress?.phone && <p className="text-xs text-gray-500">{detail.shippingAddress.phone}</p>}
                                {detail.shippingAddress?.address && <p className="text-xs text-gray-400 mt-0.5">{detail.shippingAddress.address}</p>}
                            </div>

                            {/* Items */}
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-2">Sản phẩm ({detail.items?.length || 0})</p>
                                <div className="space-y-2">
                                    {detail.items?.map((item, i) => {
                                        const img = item.product?.images ? getImg(item.product) : null;
                                        return (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                    {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-gray-300 text-sm">menu_book</span></div>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-[#111811] truncate">{item.title || item.product?.title || '—'}</p>
                                                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                                                </div>
                                                <span className="text-sm font-bold text-[#0ea00e]">{fmt(item.price * item.quantity)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-[#E8F5E9]">
                                <span className="text-sm font-bold text-[#111811]">Tổng cộng</span>
                                <span className="text-lg font-bold text-[#0ea00e]">{fmt(detail.totalAmount)}</span>
                            </div>

                            {/* Note */}
                            {detail.shippingAddress?.note && (
                                <div className="p-3 rounded-xl bg-yellow-50 text-sm text-yellow-700">
                                    <span className="material-symbols-outlined text-sm align-middle mr-1">sticky_note_2</span>
                                    {detail.shippingAddress.note}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Toast {...toast} onClose={closeToast} />
        </div>
    );
}
