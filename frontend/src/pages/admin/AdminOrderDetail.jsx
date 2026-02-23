import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ordersAPI } from '../../services/api';
import { FormModal, Toast, useToast } from '../../components/AdminPopups';

const orderStatusMap = {
    waiting: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700' },
    processing: { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-700' },
    shipping: { label: 'Đang giao', color: 'bg-blue-100 text-blue-700' },
    delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700' },
    completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
    returned: { label: 'Đã trả', color: 'bg-red-100 text-red-700' },
};

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminOrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusModal, setStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const { toast, showToast, closeToast } = useToast();

    useEffect(() => {
        ordersAPI.getById(id).then(({ data }) => {
            if (data.success) {
                setOrder(data.data.order || data.data);
                setNewStatus(data.data.order?.orderStatus || data.data.orderStatus || '');
            }
        }).catch(() => showToast('Lỗi tải đơn hàng', 'error'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleUpdateStatus = async () => {
        try {
            await ordersAPI.updateStatus(id, { status: newStatus });
            setStatusModal(false);
            showToast('Đã cập nhật trạng thái đơn hàng');
            const { data } = await ordersAPI.getById(id);
            if (data.success) setOrder(data.data.order || data.data);
        } catch (err) {
            showToast('Lỗi cập nhật trạng thái', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-4xl animate-spin text-[#0ea00e]">progress_activity</span>
            </div>
        );
    }

    if (!order) {
        return <div className="text-center py-20 text-[#618961]">Không tìm thấy đơn hàng</div>;
    }

    const s = orderStatusMap[order.orderStatus] || { label: order.orderStatus, color: 'bg-gray-100' };

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Link to="/admin/orders" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-[#111811]">Đơn hàng #{order._id?.slice(-4).toUpperCase()}</h1>
                    <p className="text-sm text-[#618961]">Ngày đặt: {formatDate(order.createdAt)}</p>
                </div>
                <button onClick={() => setStatusModal(true)} className="flex items-center gap-2 px-5 py-2 bg-[#0ea00e] text-white rounded-full text-sm font-bold shadow-lg shadow-[#0ea00e]/20 hover:brightness-95 transition-all">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                    Cập nhật trạng thái
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-[#111811] mb-4">Sản phẩm ({order.items?.length || 0})</h2>
                        <div className="space-y-4">
                            {order.items?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="font-medium text-[#111811]">{item.title}</p>
                                        <p className="text-sm text-[#618961]">x{item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-[#111811]">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between pt-4 mt-4 border-t-2 border-gray-100">
                            <span className="text-lg font-bold text-[#111811]">Tổng cộng</span>
                            <span className="text-xl font-bold text-[#0ea00e]">{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Status */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-[#111811] mb-4">Trạng thái</h2>
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${s.color}`}>{s.label}</span>
                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-[#618961]">Thanh toán:</span><span className="font-medium">{order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod === 'vnpay' ? 'VNPay' : 'Chuyển khoản'}</span></div>
                            <div className="flex justify-between"><span className="text-[#618961]">TT Thanh toán:</span><span className="font-medium">{order.paymentStatus === 'paid' ? 'Đã thanh toán' : order.paymentStatus === 'pending' ? 'Chưa thanh toán' : 'Thất bại'}</span></div>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-[#111811] mb-4">Thông tin giao hàng</h2>
                        <div className="space-y-2 text-sm">
                            <p className="font-medium text-[#111811]">{order.shippingAddress?.fullName}</p>
                            <p className="text-[#618961]">{order.shippingAddress?.phone}</p>
                            <p className="text-[#618961]">{order.shippingAddress?.address}</p>
                            <p className="text-[#618961]">{order.shippingAddress?.city}</p>
                            {order.shippingAddress?.note && <p className="text-[#618961] italic">Ghi chú: {order.shippingAddress.note}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            <FormModal open={statusModal} onClose={() => setStatusModal(false)} title="Cập nhật trạng thái" icon="edit" onSubmit={handleUpdateStatus} submitText="Cập nhật">
                <div>
                    <label className="block text-sm font-medium text-[#618961] mb-1">Trạng thái mới</label>
                    <select className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811]" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                        {Object.entries(orderStatusMap).map(([val, { label }]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </select>
                </div>
            </FormModal>

            <Toast {...toast} onClose={closeToast} />
        </div>
    );
}
