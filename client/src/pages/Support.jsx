import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Support = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        type: 'support',
        title: '',
        content: '',
        images: [],
        orderId: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [requestsRes, ordersRes] = await Promise.all([
                api.get('/support/my'),
                api.get('/orders/my-orders')
            ]);
            setRequests(requestsRes.data.data.requests);
            setOrders(ordersRes.data.data.orders.filter(o => o.orderStatus === 'delivered' || o.orderStatus === 'completed'));
        } catch (error) {
            console.error('Error loading support data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            setUploading(true);
            const form = new FormData();
            files.forEach(file => form.append('images', file));

            const response = await api.post('/upload', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...response.data.data.urls]
            }));
        } catch (error) {
            alert('Lỗi upload ảnh: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await api.post('/support', formData);
            alert('Gửi yêu cầu thành công!');
            setShowForm(false);
            setFormData({ type: 'support', title: '', content: '', images: [], orderId: '' });
            loadData();
        } catch (error) {
            alert('Lỗi gửi yêu cầu: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700',
            processing: 'bg-blue-100 text-blue-700',
            resolved: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700'
        };
        const labels = {
            pending: 'Chờ xử lý',
            processing: 'Đang xử lý',
            resolved: 'Đã giải quyết',
            rejected: 'Từ chối'
        };
        return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>{labels[status]}</span>;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-black text-fahasa-dark uppercase tracking-tight">Hỗ trợ & Đổi trả</h1>
                    <p className="text-gray-500 font-bold mt-2">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-8 py-4 bg-fahasa-red text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-fahasa-red/20 hover:scale-105 active:scale-95 transition-all"
                >
                    {showForm ? 'Đóng Form' : '+ Gửi yêu cầu mới'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Loại yêu cầu</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 font-bold text-fahasa-dark focus:ring-2 focus:ring-fahasa-red/20 transition-all outline-none"
                                >
                                    <option value="support">Hỗ trợ kỹ thuật / Tư vấn</option>
                                    <option value="return">Yêu cầu đổi trả hàng</option>
                                </select>
                            </div>
                            {formData.type === 'return' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Chọn đơn hàng</label>
                                    <select
                                        value={formData.orderId}
                                        onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 font-bold text-fahasa-dark focus:ring-2 focus:ring-fahasa-red/20 transition-all outline-none"
                                        required
                                    >
                                        <option value="">-- Chọn đơn hàng cần đổi trả --</option>
                                        {orders.map(order => (
                                            <option key={order._id} value={order._id}>
                                                Đơn #{order._id.slice(-8).toUpperCase()} - {order.totalAmount.toLocaleString('vi-VN')}đ
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Tiêu đề</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Nhập tiêu đề yêu cầu..."
                                className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 font-bold text-fahasa-dark focus:ring-2 focus:ring-fahasa-red/20 transition-all outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Nội dung chi tiết</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                                rows="5"
                                className="w-full bg-gray-50 border-none rounded-3xl p-6 font-bold text-fahasa-dark focus:ring-2 focus:ring-fahasa-red/20 transition-all outline-none resize-none"
                                required
                            ></textarea>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Hình ảnh đính kèm (nếu có)</label>
                            <div className="flex flex-wrap gap-4">
                                {formData.images.map((url, i) => (
                                    <div key={i} className="w-24 h-24 rounded-2xl overflow-hidden relative group">
                                        <img src={url} className="w-full h-full object-cover" alt="Preview" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-fahasa-red hover:text-fahasa-red transition-all gap-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase">Upload</span>
                                </button>
                                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-5 bg-fahasa-dark text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-black transition-all disabled:opacity-50"
                        >
                            {submitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu hỗ trợ'}
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-50 rounded-3xl animate-pulse"></div>)
                ) : requests.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold">Bạn chưa gửi yêu cầu hỗ trợ nào</p>
                    </div>
                ) : (
                    requests.map(request => (
                        <div key={request._id} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${request.type === 'return' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {request.type === 'return' ? 'Đổi trả' : 'Hỗ trợ'}
                                        </span>
                                        <h3 className="text-lg font-black text-fahasa-dark">{request.title}</h3>
                                    </div>
                                    <p className="text-xs text-gray-400 font-bold">Gửi ngày: {new Date(request.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    {getStatusBadge(request.status)}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                                <p className="text-gray-600 font-medium leading-relaxed">{request.content}</p>
                                {request.images.length > 0 && (
                                    <div className="flex gap-2 mt-4">
                                        {request.images.map((img, i) => (
                                            <img key={i} src={img} className="w-16 h-16 rounded-xl object-cover border border-gray-200" alt="Support" />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {request.adminReply && (
                                <div className="bg-fahasa-red/5 rounded-2xl p-6 border border-fahasa-red/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 bg-fahasa-red/5 rounded-full"></div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-8 h-8 bg-fahasa-red rounded-full flex items-center justify-center text-white shrink-0">
                                            <span className="text-[10px] font-black">AD</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-fahasa-red uppercase tracking-widest">Phản hồi từ Admin</p>
                                            <p className="text-fahasa-dark font-bold leading-relaxed">{request.adminReply}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Support;
