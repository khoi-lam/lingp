import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [filter, setFilter] = useState({
        status: 'all',
        page: 1,
        limit: 20
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pages: 1
    });

    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, [filter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/orders/admin/all', {
                params: filter
            });
            setOrders(res.data.data.orders);
            setPagination(res.data.data.pagination);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/orders/admin/stats');
            setStats(res.data.data);
        } catch (error) {
            console.error('Error fetching order stats:', error);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            waiting: 'bg-yellow-100 text-yellow-700',
            processing: 'bg-blue-100 text-blue-700',
            shipping: 'bg-purple-100 text-purple-700',
            delivered: 'bg-green-100 text-green-700',
            completed: 'bg-emerald-100 text-emerald-700',
            cancelled: 'bg-red-100 text-red-700',
            returned: 'bg-gray-100 text-gray-700'
        };
        const labels = {
            waiting: 'Chờ xác nhận',
            processing: 'Đang xử lý',
            shipping: 'Đang giao',
            delivered: 'Đã giao',
            completed: 'Hoàn tất',
            cancelled: 'Đã hủy',
            returned: 'Trả hàng'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <AdminLayout>
            <div className="p-6 lg:p-10 space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <Link to="/admin" className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-gray-100 text-gray-400 hover:text-vanxuan-red transition-all shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-vanxuan-red uppercase tracking-widest">Hệ thống quản lý</p>
                            <h1 className="text-3xl font-black text-vanxuan-dark uppercase">Quản lý đơn hàng</h1>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <select
                            value={filter.status}
                            onChange={(e) => setFilter({ ...filter, status: e.target.value, page: 1 })}
                            className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-vanxuan-dark focus:outline-none focus:ring-2 focus:ring-vanxuan-red/20"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="waiting">Chờ xác nhận</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="shipping">Đang giao</option>
                            <option value="delivered">Đã giao</option>
                            <option value="completed">Hoàn tất</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-2">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng đơn hàng</p>
                            <p className="text-3xl font-black text-vanxuan-dark">{stats.totalOrders}</p>
                        </div>
                        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-2">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng doanh thu</p>
                            <p className="text-3xl font-black text-vanxuan-red">{stats.totalRevenue?.toLocaleString()}đ</p>
                        </div>
                        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-2">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Đang xử lý</p>
                            <p className="text-3xl font-black text-blue-600">
                                {stats.stats.find(s => s._id === 'processing')?.count || 0}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-2">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Chờ xác nhận</p>
                            <p className="text-3xl font-black text-yellow-500">
                                {stats.stats.find(s => s._id === 'waiting')?.count || 0}
                            </p>
                        </div>
                    </div>
                )}

                {/* Orders Table */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50 uppercase text-[10px] font-black text-gray-400 tracking-widest">
                                    <th className="px-8 py-6">Mã đơn</th>
                                    <th className="px-8 py-6">Khách hàng</th>
                                    <th className="px-8 py-6">Tổng tiền</th>
                                    <th className="px-8 py-6">Thanh toán</th>
                                    <th className="px-8 py-6">Trạng thái</th>
                                    <th className="px-8 py-6 text-right">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 px-4">
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="6" className="px-8 py-6 h-16 bg-gray-50/50"></td>
                                        </tr>
                                    ))
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <p className="text-gray-400 font-bold">Không tìm thấy đơn hàng nào</p>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6 font-black text-vanxuan-dark">#{order._id.slice(-6).toUpperCase()}</td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-vanxuan-dark">{order.shippingAddress.fullName}</span>
                                                    <span className="text-xs text-gray-400">{order.shippingAddress.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 font-black text-vanxuan-red">{order.totalAmount?.toLocaleString()}đ</td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {order.paymentMethod.toUpperCase()} - {order.paymentStatus === 'paid' ? 'Đã thu' : 'Chưa thu'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">{getStatusBadge(order.orderStatus)}</td>
                                            <td className="px-8 py-6 text-right">
                                                <Link
                                                    to={`/admin/orders/${order._id}`}
                                                    className="w-10 h-10 inline-flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-vanxuan-red hover:text-white transition-all shadow-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
                            <p className="text-xs font-bold text-gray-400">Trang {pagination.page} / {pagination.pages}</p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
                                    disabled={filter.page === 1}
                                    className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-black uppercase tracking-widest text-vanxuan-dark disabled:opacity-50"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
                                    disabled={filter.page === pagination.pages}
                                    className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-vanxuan-dark disabled:opacity-50"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
