import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { categoryService } from '../../services/categoryService';
import Notification from '../../components/Notification';
import ConfirmModal from '../../components/ConfirmModal';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'origin',
        description: ''
    });
    const [notification, setNotification] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, categoryId: null });

    useEffect(() => {
        loadCategories();
    }, [filter]);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const filterType = filter === 'all' ? null : filter;
            const response = await categoryService.getCategories(filterType);
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory._id, formData);
            } else {
                await categoryService.createCategory(formData);
            }
            setShowModal(false);
            setEditingCategory(null);
            setFormData({ name: '', type: 'origin', description: '' });
            loadCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            setNotification({
                message: error.response?.data?.message || 'Có lỗi xảy ra khi lưu danh mục',
                type: 'error'
            });
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            type: category.type,
            description: category.description || ''
        });
        setShowModal(true);
    };

    const handleDeleteClick = (id) => {
        setConfirmDelete({ isOpen: true, categoryId: id });
    };

    const handleConfirmDelete = async () => {
        const id = confirmDelete.categoryId;
        setConfirmDelete({ isOpen: false, categoryId: null });

        try {
            await categoryService.deleteCategory(id);
            setNotification({ message: 'Xóa danh mục thành công!', type: 'success' });
            loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            setNotification({
                message: error.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục',
                type: 'error'
            });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', type: 'origin', description: '' });
    };

    return (
        <AdminLayout>
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="bg-white/80 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-gray-100 flex space-x-1">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filter === 'all'
                                ? 'bg-fahasa-red text-white shadow-lg shadow-fahasa-red/20'
                                : 'text-gray-400 hover:bg-gray-50'
                                }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setFilter('origin')}
                            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filter === 'origin'
                                ? 'bg-fahasa-red text-white shadow-lg shadow-fahasa-red/20'
                                : 'text-gray-400 hover:bg-gray-50'
                                }`}
                        >
                            Xuất xứ
                        </button>
                        <button
                            onClick={() => setFilter('genre')}
                            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filter === 'genre'
                                ? 'bg-fahasa-red text-white shadow-lg shadow-fahasa-red/20'
                                : 'text-gray-400 hover:bg-gray-50'
                                }`}
                        >
                            Thể loại
                        </button>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-8 py-3.5 bg-fahasa-red text-white rounded-2xl font-black text-sm hover:bg-fahasa-red/90 transition-all shadow-xl shadow-fahasa-red/20 hover:scale-105 active:scale-95"
                    >
                        + Thêm Danh Mục
                    </button>
                </div>

                {/* Categories Table Area */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Danh mục
                                </th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Phân loại
                                </th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Mô tả
                                </th>
                                <th className="px-10 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                                            <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Đang kết nối...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-10 py-32 text-center text-gray-400">
                                        <div className="flex flex-col items-center opacity-30">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            <p className="font-black uppercase tracking-[0.2em] text-sm">Trống rỗng</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-10 py-6 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 rounded-full bg-fahasa-red opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <span className="text-base font-bold text-gray-900 group-hover:text-fahasa-red transition-colors">
                                                    {category.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 whitespace-nowrap">
                                            <span
                                                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl ${category.type === 'origin'
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'bg-green-50 text-green-600'
                                                    }`}
                                            >
                                                {category.type === 'origin' ? 'Xuất xứ' : 'Thể loại'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="text-sm font-medium text-gray-500 line-clamp-1 max-w-xs">
                                                {category.description || '—'}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 whitespace-nowrap text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="w-10 h-10 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl flex items-center justify-center transition-all shadow-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(category._id)}
                                                    className="w-10 h-10 bg-white border border-gray-100 text-fahasa-red hover:text-white hover:bg-fahasa-red rounded-xl flex items-center justify-center transition-all shadow-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
                        <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500">
                            <div className="bg-gray-900 px-10 py-8 flex justify-between items-center">
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                    {editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}
                                </h2>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-primary-600 transition-colors">
                                            Tên danh mục
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Tiếng Anh, Sách Giáo Khoa..."
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-fahasa-red font-bold transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'origin' })}
                                            className={`py-4 rounded-2xl font-bold border-2 transition-all ${formData.type === 'origin'
                                                ? 'bg-blue-50 border-blue-600 text-blue-600'
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                                        >
                                            Xuất xứ
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'genre' })}
                                            className={`py-4 rounded-2xl font-bold border-2 transition-all ${formData.type === 'genre'
                                                ? 'bg-green-50 border-green-600 text-green-600'
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                                        >
                                            Thể loại
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                            Mô tả chi tiết
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData({ ...formData, description: e.target.value })
                                            }
                                            rows="4"
                                            placeholder="Những thông tin bổ sung về danh mục này..."
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-600 font-bold transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-100"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-4 bg-fahasa-red text-white rounded-2xl font-black shadow-xl shadow-fahasa-red/20 hover:bg-fahasa-red/90 hover:-translate-y-1 active:translate-y-0 transition-all"
                                    >
                                        {editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}
                                    </button>
                                </div>
                            </form>
                        </div>
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
                message="Bạn có chắc chắn muốn xóa danh mục này? Hành động này có thể ảnh hưởng đến các sản phẩm trong danh mục."
                confirmText="Xác nhận xóa"
                cancelText="Quay lại"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, categoryId: null })}
                type="danger"
            />
        </AdminLayout>
    );
};

export default Categories;
