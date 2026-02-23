import { useState, useEffect } from 'react';
import { promotionsAPI } from '../../services/api';
import { ConfirmModal, FormModal, Toast, useToast } from '../../components/AdminPopups';

const statusMap = {
    active: { label: 'Đang hoạt động', color: 'bg-green-100 text-green-700' },
    upcoming: { label: 'Sắp tới', color: 'bg-blue-100 text-blue-700' },
    expired: { label: 'Đã kết thúc', color: 'bg-gray-100 text-gray-500' },
    paused: { label: 'Tạm dừng', color: 'bg-yellow-100 text-yellow-700' },
};

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const emptyForm = { name: '', code: '', discountType: 'percentage', discountValue: '', startDate: '', endDate: '', description: '' };

export default function AdminPromotions() {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const { toast, showToast, closeToast } = useToast();

    const fetchPromos = async () => {
        try {
            const { data } = await promotionsAPI.getAll();
            if (data.success) setPromos(data.data.promotions);
        } catch { showToast('Lỗi tải khuyến mãi', 'error'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPromos(); }, []);

    const openAdd = () => { setForm(emptyForm); setFormOpen(true); };
    const openEdit = (p) => {
        setForm({ name: p.name, code: p.code, discountType: p.discountType, discountValue: p.discountValue, startDate: p.startDate?.slice(0, 10) || '', endDate: p.endDate?.slice(0, 10) || '', description: p.description || '' });
        setEditTarget(p);
    };

    const handleAdd = async () => {
        try {
            await promotionsAPI.create(form);
            setFormOpen(false);
            showToast('Đã tạo khuyến mãi mới!');
            fetchPromos();
        } catch (err) { showToast(err.response?.data?.message || 'Lỗi', 'error'); }
    };

    const handleEdit = async () => {
        try {
            await promotionsAPI.update(editTarget._id, form);
            setEditTarget(null);
            showToast('Đã cập nhật khuyến mãi');
            fetchPromos();
        } catch (err) { showToast(err.response?.data?.message || 'Lỗi', 'error'); }
    };

    const handleDelete = async () => {
        try {
            await promotionsAPI.delete(deleteTarget._id);
            setDeleteTarget(null);
            showToast('Đã xoá khuyến mãi');
            fetchPromos();
        } catch { showToast('Lỗi xoá', 'error'); }
    };

    const handleTogglePause = async (p) => {
        try {
            await promotionsAPI.togglePause(p._id);
            showToast(p.status === 'paused' ? 'Đã kích hoạt lại' : 'Đã tạm dừng');
            fetchPromos();
        } catch { showToast('Lỗi', 'error'); }
    };

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const formFields = (
        <>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#618961] mb-1">Tên KM *</label>
                    <input name="name" value={form.name} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811]" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#618961] mb-1">Mã KM *</label>
                    <input name="code" value={form.code} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] uppercase" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#618961] mb-1">Loại giảm</label>
                    <select name="discountType" value={form.discountType} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811]">
                        <option value="percentage">Phần trăm (%)</option>
                        <option value="fixed">Cố định (₫)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#618961] mb-1">Giá trị *</label>
                    <input name="discountValue" type="number" value={form.discountValue} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811]" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#618961] mb-1">Ngày bắt đầu</label>
                    <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811]" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#618961] mb-1">Ngày kết thúc</label>
                    <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811]" />
                </div>
            </div>
        </>
    );

    if (loading) return <div className="flex items-center justify-center py-20"><span className="material-symbols-outlined text-4xl animate-spin text-[#0ea00e]">progress_activity</span></div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#111811] tracking-tight">Quản Lý Khuyến Mãi</h1>
                    <p className="text-[#618961] mt-1">Tạo và quản lý các chương trình giảm giá.</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2 bg-[#0ea00e] text-white rounded-full text-sm font-bold shadow-lg shadow-[#0ea00e]/20 hover:brightness-110 transition-all">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Tạo khuyến mãi
                </button>
            </div>

            {promos.length === 0 ? (
                <div className="text-center py-20 text-[#618961]"><span className="material-symbols-outlined text-5xl mb-2 block">local_offer</span><p>Chưa có khuyến mãi nào</p></div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
                    <table className="w-full border-collapse text-left min-w-[800px]">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase">Tên KM</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase">Mã</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase">Giảm giá</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase">Thời gian</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase text-center">Đã dùng</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {promos.map((p) => {
                                const s = statusMap[p.status] || { label: p.status, color: 'bg-gray-100' };
                                return (
                                    <tr key={p._id} className="hover:bg-[#0ea00e]/5 transition-colors group">
                                        <td className="px-6 py-4 font-medium">{p.name}</td>
                                        <td className="px-6 py-4"><code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{p.code}</code></td>
                                        <td className="px-6 py-4 text-sm">{p.discountType === 'percentage' ? `${p.discountValue}%` : `₫${p.discountValue?.toLocaleString('vi-VN')}`}</td>
                                        <td className="px-6 py-4 text-sm text-[#618961]">{formatDate(p.startDate)} — {formatDate(p.endDate)}</td>
                                        <td className="px-6 py-4 text-center text-sm">{p.usedCount}</td>
                                        <td className="px-6 py-4 text-center"><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${s.color}`}>{s.label}</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100">
                                                <button onClick={() => handleTogglePause(p)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-yellow-600 transition-colors" title={p.status === 'paused' ? 'Kích hoạt' : 'Tạm dừng'}>
                                                    <span className="material-symbols-outlined text-[20px]">{p.status === 'paused' ? 'play_arrow' : 'pause'}</span>
                                                </button>
                                                <button onClick={() => openEdit(p)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#0ea00e] transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                                                <button onClick={() => setDeleteTarget(p)} className="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <FormModal open={formOpen} onClose={() => setFormOpen(false)} title="Tạo khuyến mãi mới" icon="local_offer" onSubmit={handleAdd} submitText="Tạo">{formFields}</FormModal>
            <FormModal open={!!editTarget} onClose={() => setEditTarget(null)} title={`Sửa: ${editTarget?.name || ''}`} icon="edit" onSubmit={handleEdit} submitText="Lưu">{formFields}</FormModal>
            <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xoá khuyến mãi?" message={`Xoá "${deleteTarget?.name}"?`} confirmText="Xoá" danger />
            <Toast {...toast} onClose={closeToast} />
        </div>
    );
}
