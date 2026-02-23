import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
    });
    const [revenueData, setRevenueData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsRes, revenueRes, topProductsRes] = await Promise.all([
                api.get('/stats/dashboard'),
                api.get('/stats/revenue?period=7days'),
                api.get('/stats/top-products')
            ]);

            setStats(statsRes.data.data.stats);

            // Format revenue data from backend
            const rawRevenueData = revenueRes.data.data.revenueData || [];
            const formattedData = rawRevenueData.map(item => ({
                date: new Date(item._id).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
                revenue: item.revenue
            }));
            setRevenueData(formattedData);

            setTopProducts(topProductsRes.data.data.topProducts || []);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 flex items-center space-x-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-vanxuan-red/5 text-vanxuan-red rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng Sản Phẩm</p>
                            <h3 className="text-4xl font-black text-vanxuan-dark mt-1">{stats.totalProducts}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 flex items-center space-x-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Doanh Thu</p>
                            <h3 className="text-4xl font-black text-vanxuan-dark mt-1">{stats.totalRevenue.toLocaleString('vi-VN')} đ</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 flex items-center space-x-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đơn Hàng</p>
                            <h3 className="text-4xl font-black text-vanxuan-dark mt-1">{stats.totalOrders}</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-100 border border-gray-100 p-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Doanh Thu 7 Ngày</h3>
                            <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold text-gray-500 border border-gray-100 uppercase tracking-wider">
                                Weekly Report
                            </div>
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#C81E2B" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#C81E2B" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '20px',
                                            border: 'none',
                                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                            padding: '15px'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#C81E2B"
                                        strokeWidth={4}
                                        dot={{ fill: '#C81E2B', strokeWidth: 2, r: 6, stroke: '#fff' }}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-100 border border-gray-100 p-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Sản Phẩm Bán Chạy</h3>
                            <button className="text-primary-600 font-bold text-sm hover:underline">Xem tất cả</button>
                        </div>
                        <div className="overflow-hidden">
                            {topProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <p className="font-bold uppercase tracking-widest text-xs">Chưa có dữ liệu giao dịch</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {topProducts.map((product, index) => (
                                        <div key={product._id} className="flex items-center p-4 rounded-3xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-gray-900 shadow-sm border border-gray-100 mr-4">
                                                #{index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 truncate">{product.title}</h4>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{product.author}</p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="text-sm font-black text-gray-900">{product.soldCount} Đã bán</p>
                                                <p className="text-xs font-bold text-gray-400">{product.price.toLocaleString('vi-VN')} đ</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
