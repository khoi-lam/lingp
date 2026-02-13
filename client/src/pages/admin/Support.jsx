import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const AdminSupport = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ type: '', status: '' });
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadRequests();
    }, [filter]);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const response = await api.get('/support', { params: filter });
            setRequests(response.data.data.requests);
        } catch (error) {
            console.error('Error loading requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id, status) => {
        try {
            setUpdating(true);
            await api.patch(`/support/${id}`, { status, adminReply: replyText });
            alert('Cập nhật trạng thái thành công!');
            setSelectedRequest(null);
            setReplyText('');
            loadRequests();
        } catch (error) {
            alert('Lỗi cập nhật: ' + (error.response?.data?.message || error.message));
        } finally {
            setUpdating(false);
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
            resolved: 'Hoàn thành',
            rejected: 'Từ chối'
        };
        return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>{labels[status]}</span>;
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-fahasa-dark uppercase tracking-tight">Yêu cầu hỗ trợ</h2>
                        <p className="text-gray-500 font-bold mt-1">Quản lý và giải quyết khiếu nại của khách hàng</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20 flex flex-wrap gap-4">
                    <select
                        value={filter.type}
                        onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                        className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-gray-600 outline-none"
                    >
                        <option value="">Tất cả loại</option>
                        <option value="support">Hỗ trợ</option>
                        <option value="return">Đổi trả</option>
                    </select>
                    <select
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                        className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-gray-600 outline-none"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="resolved">Hoàn thành</option>
                        <option value="rejected">Từ chối</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Khách hàng</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Loại & Tiêu đề</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Đơn hàng</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày gửi</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [1, 2, 3].map(i => <tr key={i} className="animate-pulse">
                                    <td colSpan="6" className="p-6"><div className="h-8 bg-gray-100 rounded-xl w-full"></div></td>
                                </tr>)
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center font-bold text-gray-400">Không tìm thấy yêu cầu nào</td>
                                </tr>
                            ) : (
                                requests.map(req => (
                                    <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-fahasa-red/10 rounded-full flex items-center justify-center text-fahasa-red font-black text-xs uppercase">
                                                    {req.user?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-fahasa-dark">{req.user?.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">{req.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${req.type === 'return' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {req.type === 'return' ? 'Đổi trả' : 'Hỗ trợ'}
                                                </span>
                                                <p className="font-bold text-fahasa-dark truncate max-w-[200px]">{req.title}</p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            {req.orderId ? (
                                                <span className="text-xs font-black text-fahasa-red">#{req.orderId.orderId}</span>
                                            ) : (
                                                <span className="text-xs text-gray-300 font-bold">N/A</span>
                                            )}
                                        </td>
                                        <td className="p-6 text-xs text-gray-500 font-bold">
                                            {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="p-6">{getStatusBadge(req.status)}</td>
                                        <td className="p-6 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedRequest(req);
                                                    setReplyText(req.adminReply || '');
                                                }}
                                                className="px-4 py-2 bg-fahasa-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                                            >
                                                Xem & Phản hồi
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-fahasa-dark/60 backdrop-blur-sm" onClick={() => setSelectedRequest(null)}></div>
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-3xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${selectedRequest.type === 'return' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {selectedRequest.type === 'return' ? 'Yêu cầu đổi trả' : 'Hỗ trợ khách hàng'}
                                        </span>
                                        {getStatusBadge(selectedRequest.status)}
                                    </div>
                                    <h3 className="text-2xl font-black text-fahasa-dark">{selectedRequest.title}</h3>
                                </div>
                                <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-fahasa-red transition-colors">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-3xl p-6">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Nội dung chi tiết</p>
                                        <p className="text-gray-600 font-medium leading-relaxed">{selectedRequest.content}</p>
                                    </div>
                                    {selectedRequest.images.length > 0 && (
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-6">Ảnh đính kèm</p>
                                            <div className="flex gap-2 overflow-x-auto pb-4 px-6">
                                                {selectedRequest.images.map((img, i) => (
                                                    <a key={i} href={img} target="_blank" rel="noreferrer" className="shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-all">
                                                        <img src={img} className="w-full h-full object-cover" alt="Support Attachment" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-6">Phản hồi của Admin</label>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            rows="4"
                                            className="w-full bg-gray-50 border-none rounded-3xl p-6 font-bold text-fahasa-dark focus:ring-2 focus:ring-fahasa-red/20 outline-none resize-none"
                                            placeholder="Nhập nội dung phản hồi..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 h-14">
                                        <button
                                            onClick={() => handleUpdate(selectedRequest._id, 'rejected')}
                                            className="bg-gray-100 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                                        >
                                            Từ chối
                                        </button>
                                        <button
                                            onClick={() => handleUpdate(selectedRequest._id, selectedRequest.type === 'return' ? 'resolved' : 'resolved')}
                                            className="bg-fahasa-red text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-fahasa-red/20 hover:bg-fahasa-red/90 transition-all"
                                        >
                                            Duyệt / Hoàn thành
                                        </button>
                                    </div>
                                    {selectedRequest.type === 'return' && (
                                        <p className="text-center text-[10px] text-gray-400 font-bold italic px-6">
                                            * Lưu ý: Khi Duyệt đổi trả, trạng thái đơn hàng #{selectedRequest.orderId?.orderId} sẽ tự động cập nhật thành "Đã hoàn hàng".
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminSupport;
