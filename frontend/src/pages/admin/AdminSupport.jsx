import { useState, useEffect } from 'react';
import { supportAPI } from '../../services/api';
import { Toast, useToast } from '../../components/AdminPopups';

const statusMap = {
    pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700', icon: 'schedule' },
    processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700', icon: 'sync' },
    resolved: { label: 'Đã xử lý', color: 'bg-green-100 text-green-700', icon: 'check_circle' },
};

const STATUS_FLOW = ['pending', 'processing', 'resolved'];
const getNextStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
};

const tabs = [
    { label: 'Tất cả', value: '' },
    { label: 'Chờ xử lý', value: 'pending' },
    { label: 'Đang xử lý', value: 'processing' },
    { label: 'Đã giải quyết', value: 'resolved' },
];

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminSupport() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('');
    const [viewTicket, setViewTicket] = useState(null);
    const [updating, setUpdating] = useState(null);
    const { toast, showToast, closeToast } = useToast();

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params = {};
            if (activeTab) params.status = activeTab;
            const { data } = await supportAPI.adminGetAll(params);
            if (data.success) setTickets(data.data.requests);
        } catch (err) {
            showToast('Lỗi tải danh sách yêu cầu', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTickets(); }, [activeTab]);

    const handleNextStatus = async (ticket, e) => {
        if (e) e.stopPropagation();
        const next = getNextStatus(ticket.status);
        if (!next) return;
        setUpdating(ticket._id);
        try {
            await supportAPI.adminUpdate(ticket._id, { status: next });
            const nextLabel = statusMap[next]?.label || next;
            showToast(`Đã chuyển sang "${nextLabel}"`);
            if (viewTicket?._id === ticket._id) setViewTicket({ ...ticket, status: next });
            fetchTickets();
        } catch (err) {
            showToast('Lỗi cập nhật trạng thái', 'error');
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#111811] tracking-tight">Hỗ Trợ Khách Hàng</h1>
                <p className="text-[#618961] mt-1">Xem các phiếu hỗ trợ từ khách hàng.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
                {tabs.map((tab) => (
                    <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.value ? 'bg-[#0ea00e] text-white font-bold shadow-md' : 'bg-white text-[#618961] border border-gray-200 hover:bg-gray-50'}`}
                    >{tab.label}</button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <span className="material-symbols-outlined text-4xl animate-spin text-[#0ea00e]">progress_activity</span>
                </div>
            ) : tickets.length === 0 ? (
                <div className="text-center py-20 text-[#618961]">
                    <span className="material-symbols-outlined text-5xl mb-2 block">support_agent</span>
                    <p>Không có yêu cầu hỗ trợ nào</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tickets.map((t) => {
                        const s = statusMap[t.status] || { label: t.status, color: 'bg-gray-100' };
                        return (
                            <div
                                key={t._id}
                                onClick={() => setViewTicket(t)}
                                className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-bold text-sm text-[#111811] truncate">{t.title}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.color}`}>{s.label}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${t.type === 'return' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {t.type === 'return' ? 'Đổi/Trả' : 'Hỗ trợ'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400">{t.user?.name || '—'} • {formatDate(t.createdAt)}</p>
                                        <p className="text-sm text-[#111811] mt-1.5 line-clamp-2">{t.content}</p>
                                    </div>
                                    <div className="flex flex-col gap-1 flex-shrink-0">
                                        <button className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#0ea00e] hover:bg-[#C5E0B4] transition-colors">
                                            <span className="material-symbols-outlined text-lg">visibility</span>
                                        </button>
                                        {getNextStatus(t.status) && (
                                            <button
                                                onClick={(e) => handleNextStatus(t, e)}
                                                disabled={updating === t._id}
                                                className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors disabled:opacity-50"
                                                title={`Chuyển sang: ${statusMap[getNextStatus(t.status)]?.label}`}
                                            >
                                                <span className={`material-symbols-outlined text-lg ${updating === t._id ? 'animate-spin' : ''}`}>
                                                    {updating === t._id ? 'progress_activity' : 'arrow_forward'}
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* View Ticket Modal */}
            {viewTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setViewTicket(null)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#4CAF50]">
                                    <span className="material-symbols-outlined">support_agent</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#111811]">Phiếu hỗ trợ</h2>
                                    <p className="text-xs text-gray-400">#{viewTicket._id?.slice(-6).toUpperCase()}</p>
                                </div>
                            </div>
                            <button onClick={() => setViewTicket(null)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {(() => { const s = statusMap[viewTicket.status] || { label: viewTicket.status, color: 'bg-gray-100' }; return <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.color}`}>{s.label}</span>; })()}
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${viewTicket.type === 'return' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {viewTicket.type === 'return' ? 'Đổi/Trả hàng' : 'Hỗ trợ chung'}
                                </span>
                            </div>

                            <div>
                                <h3 className="font-bold text-[#111811] text-lg mb-1">{viewTicket.title}</h3>
                                <p className="text-sm text-[#111811] leading-relaxed whitespace-pre-wrap">{viewTicket.content}</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#618961]">Khách hàng</span>
                                    <span className="font-medium text-[#111811]">{viewTicket.user?.name || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#618961]">Email</span>
                                    <span className="font-medium text-[#111811]">{viewTicket.user?.email || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#618961]">Ngày gửi</span>
                                    <span className="font-medium text-[#111811]">{formatDate(viewTicket.createdAt)}</span>
                                </div>
                                {viewTicket.orderId && (
                                    <div className="flex justify-between">
                                        <span className="text-[#618961]">Mã đơn hàng</span>
                                        <span className="font-medium text-[#111811]">#{String(viewTicket.orderId).slice(-4).toUpperCase()}</span>
                                    </div>
                                )}
                            </div>

                            {/* Next Status Button */}
                            {getNextStatus(viewTicket.status) && (
                                <button
                                    onClick={(e) => handleNextStatus(viewTicket, e)}
                                    disabled={updating === viewTicket._id}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0ea00e] text-white font-bold hover:brightness-95 transition-all disabled:opacity-50 active:scale-[0.98]"
                                >
                                    {updating === viewTicket._id ? (
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">{statusMap[getNextStatus(viewTicket.status)]?.icon || 'arrow_forward'}</span>
                                            Chuyển sang: {statusMap[getNextStatus(viewTicket.status)]?.label}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Toast {...toast} onClose={closeToast} />
        </div>
    );
}
