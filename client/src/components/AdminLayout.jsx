import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        {
            path: '/admin',
            label: 'Dashboard',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
            )
        },
        {
            path: '/admin/categories',
            label: 'Danh Mục',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 11h.01M7 15h.01M11 7h.01M11 11h.01M11 15h.01M15 7h.01M15 11h.01M15 15h.01M19 7h.01M19 11h.01M19 15h.01M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
            )
        },
        {
            path: '/admin/products',
            label: 'Sản Phẩm',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            path: '/admin/orders',
            label: 'Đơn Hàng',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            )
        },
        {
            path: '/admin/support',
            label: 'Hỗ Trợ',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        }
    ];

    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans text-gray-900">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-white/70 backdrop-blur-xl border-r border-gray-200/50 flex flex-col z-50">
                {/* Logo Section */}
                <div className="p-8 pb-4">
                    <div className="flex items-center space-x-3 cursor-default">
                        <div className="w-10 h-10 bg-fahasa-red rounded-xl flex items-center justify-center shadow-lg shadow-fahasa-red/20">
                            <span className="text-white font-bold text-xl">B</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-fahasa-dark tracking-tight">
                                Bookstore
                            </h2>
                            <p className="text-[10px] font-bold text-fahasa-red uppercase tracking-widest leading-tight">
                                Control Center
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 px-6 py-8 space-y-1.5 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${isActive(item.path)
                                ? 'bg-fahasa-red text-white shadow-xl shadow-fahasa-red/10 scale-[1.02]'
                                : 'text-gray-500 hover:bg-fahasa-red/5 hover:text-fahasa-red'
                                }`}
                        >
                            <span className={`${isActive(item.path) ? 'text-white' : 'text-gray-400'}`}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Section */}
                <div className="p-6">
                    <div className="bg-gray-50 rounded-3xl p-4 border border-gray-200/50">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center font-bold text-gray-700 shadow-sm border border-gray-100">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full mt-4 py-2 px-4 bg-white hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-gray-100 transition-all flex items-center justify-center space-x-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 ml-72 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="sticky top-0 bg-[#f8fafc]/80 backdrop-blur-xl z-40 px-12 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                                {isActive('/admin/categories') && 'Quản Lý Danh Mục'}
                                {isActive('/admin/products') && 'Quản Lý Sản Phẩm'}
                                {isActive('/admin/orders') && 'Quản Lý Đơn Hàng'}
                                {isActive('/admin/support') && 'Hỗ Trợ & Đổi Trả'}
                                {location.pathname === '/admin' && 'Dashboard'}
                            </h1>
                            <p className="text-sm font-medium text-gray-500 mt-1">
                                Chào mừng quay trở lại, {user?.name}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 shadow-sm border border-gray-100 transition-all hover:scale-105">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                            <div className="h-10 w-px bg-gray-200"></div>
                            <div className="flex items-center space-x-3 pl-2">
                                <div className="text-right">
                                    <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">Status</p>
                                    <p className="text-[10px] font-bold text-green-500 flex items-center justify-end">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                        Live
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 px-12 pb-12 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                {/* Footer hint */}
                <footer className="px-12 py-6 text-center border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Bookstore Admin Dashboard © 2026 • Made with ❤️
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;

