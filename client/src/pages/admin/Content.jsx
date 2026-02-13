import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const Content = () => {
    const [loading, setLoading] = useState(true);
    const [heroBanners, setHeroBanners] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            setLoading(true);
            const heroRes = await api.get('/content/hero-banner');
            setHeroBanners(heroRes.data.data?.content?.content?.images || []);
        } catch (error) {
            console.error('Error loading hero banner:', error);
            setHeroBanners([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveHero = async () => {
        try {
            setLoading(true);
            await api.put('/content/hero-banner', { images: heroBanners });
            alert('Cập nhật Hero Banner thành công!');
        } catch (error) {
            console.error('Error saving hero:', error);
            alert('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('images', file);

            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const uploadedUrl = response.data.data.urls[0];
            setHeroBanners([...heroBanners, uploadedUrl]);
            alert('Upload ảnh thành công!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Lỗi upload ảnh: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const addBannerUrl = () => {
        const url = prompt('Nhập URL hình ảnh:');
        if (url) {
            setHeroBanners([...heroBanners, url]);
        }
    };

    const removeBanner = (index) => {
        setHeroBanners(heroBanners.filter((_, i) => i !== index));
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 space-y-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Banner trang chủ</h3>
                            <p className="text-sm text-gray-500 mt-1">Quản lý các hình ảnh chạy slide ở đầu trang chủ</p>
                        </div>
                        <div className="flex space-x-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {uploading ? '⏳ Đang upload...' : '📤 Upload ảnh'}
                            </button>
                            <button
                                onClick={addBannerUrl}
                                className="px-6 py-2.5 bg-fahasa-red text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-fahasa-red/90 transition-all shadow-lg shadow-fahasa-red/10 active:scale-95"
                            >
                                + Thêm URL
                            </button>
                            <button
                                onClick={handleSaveHero}
                                disabled={loading}
                                className="px-6 py-2.5 bg-fahasa-dark text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Đang lưu...' : 'Lưu banner'}
                            </button>
                        </div>
                    </div>

                    {loading && heroBanners.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : heroBanners.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
                            <p className="text-gray-400 font-medium">Chưa có banner nào được thêm</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {heroBanners.map((url, index) => (
                                <div key={index} className="group relative rounded-2xl overflow-hidden shadow-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                                    <img
                                        src={url}
                                        alt={`Banner ${index + 1}`}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/800x400?text=Hình+ảnh+không+hợp+lệ';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <div className="w-full flex justify-between items-center">
                                            <p className="text-white text-xs truncate max-w-[150px]">{url}</p>
                                            <button
                                                onClick={() => removeBanner(index)}
                                                className="bg-white/20 backdrop-blur-md hover:bg-red-500 text-white rounded-lg p-2 transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Content;
