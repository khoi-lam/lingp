import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { booksAPI, categoriesAPI } from '../../services/api';
import { API_BASE } from '../../config.js';
import { Toast, useToast } from '../../components/AdminPopups';

export default function AdminProductEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const { toast, showToast, closeToast } = useToast();

    const [form, setForm] = useState({ title: '', author: '', isbn: '', publisher: '', description: '', price: '', stockQuantity: '', origin: '', genres: [] });
    const [categories, setCategories] = useState({ origins: [], genres: [] });
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
        categoriesAPI.getAll().then(({ data }) => {
            if (data.success) {
                const cats = data.data.categories;
                setCategories({
                    origins: cats.filter(c => c.type === 'origin'),
                    genres: cats.filter(c => c.type === 'genre'),
                });
            }
        });

        if (isEdit) {
            booksAPI.getById(id).then(({ data }) => {
                if (data.success) {
                    const b = data.data.book;
                    setForm({
                        title: b.title || '', author: b.author || '', isbn: b.isbn || '', publisher: b.publisher || '',
                        description: b.description || '', price: b.price || '', stockQuantity: b.stockQuantity || '',
                        origin: b.categories?.origin?._id || b.categories?.origin || '',
                        genres: (b.categories?.genres || []).map(g => g._id || g),
                    });
                    setExistingImages(b.images || []);
                }
            }).finally(() => setLoading(false));
        }
    }, [id]);

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleGenreToggle = (gid) => {
        setForm(f => ({
            ...f,
            genres: f.genres.includes(gid) ? f.genres.filter(g => g !== gid) : [...f.genres, gid]
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files) setImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.author || !form.price) {
            showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('author', form.author);
            fd.append('publisher', form.publisher);
            fd.append('isbn', form.isbn);
            fd.append('description', form.description);
            fd.append('price', form.price);
            fd.append('stockQuantity', form.stockQuantity);
            if (form.origin) fd.append('origin', form.origin);
            fd.append('genres', JSON.stringify(form.genres));
            images.forEach(img => fd.append('images', img));

            if (isEdit) {
                await booksAPI.update(id, fd);
                showToast('Đã cập nhật sản phẩm thành công!');
            } else {
                await booksAPI.create(fd);
                showToast('Đã thêm sản phẩm mới thành công!');
                setTimeout(() => navigate('/admin/products'), 1200);
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Lỗi khi lưu sản phẩm', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-4xl animate-spin text-[#0ea00e]">progress_activity</span>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Link to="/admin/products" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[#111811] tracking-tight">{isEdit ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h1>
                    <p className="text-[#618961] text-sm">{isEdit ? 'Cập nhật thông tin sách' : 'Nhập thông tin sách để thêm vào kho hàng'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-[#111811] mb-4">Thông tin cơ bản</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#618961] mb-1">Tên sách *</label>
                                    <input name="title" value={form.title} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] transition-shadow" placeholder="VD: Rừng Xanh Phiêu Lưu" required />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#618961] mb-1">Tác giả *</label>
                                        <input name="author" value={form.author} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] transition-shadow" placeholder="Tên tác giả" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#618961] mb-1">ISBN</label>
                                        <input name="isbn" value={form.isbn} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] transition-shadow" placeholder="978-X-XX-XXXXXX-X" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#618961] mb-1">Nhà xuất bản</label>
                                    <input name="publisher" value={form.publisher} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] transition-shadow" placeholder="Nhà xuất bản" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#618961] mb-1">Mô tả</label>
                                    <textarea name="description" value={form.description} onChange={handleChange} className="w-full h-32 px-4 py-3 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] transition-shadow resize-none" placeholder="Mô tả chi tiết về cuốn sách..." />
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-[#111811] mb-4">Giá & Tồn kho</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#618961] mb-1">Giá bán (₫) *</label>
                                    <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] transition-shadow" placeholder="149000" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#618961] mb-1">Số lượng tồn *</label>
                                    <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] transition-shadow" placeholder="100" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-6">
                        {/* Category */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-[#111811] mb-4">Phân loại</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#618961] mb-1">Xuất xứ</label>
                                    <select name="origin" value={form.origin} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] appearance-none cursor-pointer">
                                        <option value="">Chọn xuất xứ</option>
                                        {categories.origins.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#618961] mb-2">Thể loại</label>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.genres.map(g => (
                                            <button key={g._id} type="button" onClick={() => handleGenreToggle(g._id)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.genres.includes(g._id) ? 'bg-[#0ea00e] text-white border-[#0ea00e]' : 'bg-white text-[#618961] border-gray-200 hover:border-[#0ea00e]'}`}
                                            >{g.name}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-[#111811] mb-4">Ảnh sản phẩm <span className="text-sm font-normal text-[#618961]">(tối đa 5 ảnh)</span></h2>
                            {existingImages.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {existingImages.map((img, i) => (
                                        <div key={i} className="relative">
                                            <div className="h-20 w-16 rounded-lg bg-gray-200 bg-cover bg-center shadow-sm border" style={{ backgroundImage: `url("${img.startsWith('http') ? img : `${API_BASE}/${img}`}")` }}></div>
                                            <button type="button" onClick={() => setExistingImages(imgs => imgs.filter((_, idx) => idx !== i))}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow">✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#0ea00e] transition-colors cursor-pointer block">
                                <input type="file" multiple accept="image/*" onChange={(e) => {
                                    const files = Array.from(e.target.files || []).slice(0, 5 - existingImages.length);
                                    setImages(files);
                                }} className="hidden" />
                                <span className="material-symbols-outlined text-3xl text-[#618961] mb-1">cloud_upload</span>
                                <p className="text-sm text-[#618961]">{images.length > 0 ? `${images.length} ảnh đã chọn (tổng: ${existingImages.length + images.length}/5)` : `Nhấn để tải lên (còn ${5 - existingImages.length} slot)`}</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG (Tối đa 5MB mỗi ảnh)</p>
                            </label>
                            {images.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {images.map((img, i) => (
                                        <div key={i} className="relative">
                                            <img src={URL.createObjectURL(img)} alt="" className="h-20 w-16 rounded-lg object-cover border shadow-sm" />
                                            <button type="button" onClick={() => setImages(imgs => imgs.filter((_, idx) => idx !== i))}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow">✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button type="submit" disabled={saving} className="w-full py-3 bg-[#0ea00e] text-white font-bold rounded-full shadow-lg shadow-[#0ea00e]/20 hover:brightness-95 transition-all disabled:opacity-60">
                                {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm')}
                            </button>
                            <Link to="/admin/products" className="w-full py-3 border border-gray-200 text-[#618961] font-medium rounded-full hover:bg-gray-50 transition-colors text-center block">Hủy</Link>
                        </div>
                    </div>
                </div>
            </form>

            <Toast {...toast} onClose={closeToast} />
        </div>
    );
}
