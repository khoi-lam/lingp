import { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import { ConfirmModal, FormModal, Toast, useToast } from '../../components/AdminPopups';

const iconOptions = [
    { icon: 'child_care', label: 'Thiếu nhi', bg: 'bg-blue-50', color: 'text-blue-600' },
    { icon: 'school', label: 'Giáo dục', bg: 'bg-green-50', color: 'text-green-600' },
    { icon: 'science', label: 'Khoa học', bg: 'bg-purple-50', color: 'text-purple-600' },
    { icon: 'auto_stories', label: 'Văn học', bg: 'bg-yellow-50', color: 'text-yellow-600' },
    { icon: 'castle', label: 'Giả tưởng', bg: 'bg-indigo-50', color: 'text-indigo-600' },
    { icon: 'psychology', label: 'Kỹ năng', bg: 'bg-orange-50', color: 'text-orange-600' },
    { icon: 'category', label: 'Mặc định', bg: 'bg-gray-50', color: 'text-gray-600' },
];

function getIconStyle(iconName) {
    const found = iconOptions.find(o => o.icon === iconName);
    return found || { icon: iconName || 'category', bg: 'bg-gray-50', color: 'text-gray-600' };
}

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editCat, setEditCat] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', type: 'genre', icon: 'category' });
    const { toast, showToast, closeToast } = useToast();

    const fetchCategories = async () => {
        try {
            const { data } = await categoriesAPI.getAll();
            if (data.success) setCategories(data.data.categories);
        } catch (err) {
            showToast('Lỗi tải danh mục', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const openAdd = () => {
        setFormData({ name: '', description: '', type: 'genre', icon: 'category' });
        setFormOpen(true);
    };

    const openEdit = (cat) => {
        setFormData({ name: cat.name, description: cat.description || '', type: cat.type, icon: cat.icon || 'category' });
        setEditCat(cat);
    };

    const handleAdd = async () => {
        try {
            await categoriesAPI.create(formData);
            setFormOpen(false);
            showToast('Đã thêm danh mục mới thành công!');
            fetchCategories();
        } catch (err) {
            showToast(err.response?.data?.message || 'Lỗi thêm danh mục', 'error');
        }
    };

    const handleEdit = async () => {
        try {
            await categoriesAPI.update(editCat._id, formData);
            setEditCat(null);
            showToast(`Đã cập nhật danh mục "${formData.name}"`);
            fetchCategories();
        } catch (err) {
            showToast(err.response?.data?.message || 'Lỗi cập nhật', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            await categoriesAPI.delete(deleteTarget._id);
            setDeleteTarget(null);
            showToast(`Đã xoá danh mục "${deleteTarget.name}"`);
            fetchCategories();
        } catch (err) {
            showToast('Lỗi xoá danh mục', 'error');
        }
    };

    const formFields = (
        <>
            <div>
                <label className="block text-sm font-medium text-[#618961] mb-1">Tên danh mục *</label>
                <input className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811]" placeholder="VD: Truyện Thiếu Nhi" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
                <label className="block text-sm font-medium text-[#618961] mb-1">Loại</label>
                <select className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811]" value={formData.type} onChange={e => setFormData(f => ({ ...f, type: e.target.value }))}>
                    <option value="genre">Thể loại</option>
                    <option value="origin">Xuất xứ</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-[#618961] mb-1">Mô tả</label>
                <textarea className="w-full h-24 px-4 py-3 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] resize-none text-sm" placeholder="Mô tả ngắn về danh mục..." value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} />
            </div>
        </>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-4xl animate-spin text-[#0ea00e]">progress_activity</span>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#111811] tracking-tight">Quản Lý Danh Mục</h1>
                    <p className="text-[#618961] mt-1">Quản lý các danh mục sách trong cửa hàng.</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2 bg-[#0ea00e] text-white rounded-full text-sm font-bold shadow-lg shadow-[#0ea00e]/20 hover:brightness-110 transition-all">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Thêm danh mục
                </button>
            </div>

            {categories.length === 0 ? (
                <div className="text-center py-20 text-[#618961]">
                    <span className="material-symbols-outlined text-5xl mb-2 block">category</span>
                    <p>Chưa có danh mục nào</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => {
                        const iconStyle = getIconStyle(cat.icon);
                        return (
                            <div key={cat._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${iconStyle.bg}`}>
                                        <span className={`material-symbols-outlined ${iconStyle.color}`}>{iconStyle.icon}</span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(cat)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#0ea00e] transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button onClick={() => setDeleteTarget(cat)} className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-[#111811] mb-1">{cat.name}</h3>
                                <p className="text-sm text-[#618961] mb-4">{cat.description || '—'}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-sm text-[#618961]">{cat.type === 'origin' ? 'Xuất xứ' : 'Thể loại'}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Category Modal */}
            <FormModal open={formOpen} onClose={() => setFormOpen(false)} title="Thêm danh mục mới" icon="category" onSubmit={handleAdd} submitText="Thêm">
                {formFields}
            </FormModal>

            {/* Edit Category Modal */}
            <FormModal open={!!editCat} onClose={() => setEditCat(null)} title={`Sửa: ${editCat?.name || ''}`} icon="edit" onSubmit={handleEdit} submitText="Lưu">
                {formFields}
            </FormModal>

            {/* Delete Confirm */}
            <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xoá danh mục?" message={`Bạn có chắc muốn xoá danh mục "${deleteTarget?.name}"? Các sách thuộc danh mục này sẽ trở thành chưa phân loại.`} confirmText="Xoá" danger />

            <Toast {...toast} onClose={closeToast} />
        </div>
    );
}
