import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoUrl } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const sidebarLinks = [
    { label: 'Tổng Quan', path: '/admin', icon: 'dashboard' },
    { label: 'Sản Phẩm', path: '/admin/products', icon: 'inventory_2' },
    { label: 'Danh Mục', path: '/admin/categories', icon: 'category' },
    { label: 'Đơn Hàng', path: '/admin/orders', icon: 'shopping_bag' },
    { label: 'Hỗ Trợ', path: '/admin/support', icon: 'support_agent' },
    { label: 'BookLens', path: '/admin/booklens', icon: 'photo_camera' },
];

const bottomLinks = [
    { label: 'Cài Đặt', path: '/admin/settings', icon: 'settings' },
];

export default function AdminLayout({ children }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setDrawerOpen(false);
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/admin') return pathname === '/admin';
        return pathname.startsWith(path);
    };

    const SidebarContent = ({ onNavigate }) => (
        <>
            {/* Brand */}
            <div className="flex items-center gap-3 px-4 py-4 mb-4">
                <img src={logoUrl} alt="LingoLand" className="h-12 w-12 object-contain" />
                <div className="flex flex-col">
                    <h1 className="text-[#111811] text-lg font-bold leading-tight tracking-tight">LingoLand</h1>
                    <p className="text-[#618961] text-xs font-medium">Quản Trị Viên</p>
                </div>
            </div>

            {/* Main Nav */}
            <nav className="flex flex-col gap-1 flex-1">
                {sidebarLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        onClick={onNavigate}
                        className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-sm ${isActive(link.path)
                            ? 'bg-[#0ea00e] text-white font-bold shadow-md shadow-[#0ea00e]/20'
                            : 'text-[#618961] hover:bg-gray-50 font-medium'
                            }`}
                    >
                        <span className="material-symbols-outlined" style={isActive(link.path) ? { fontVariationSettings: "'FILL' 1" } : {}}>{link.icon}</span>
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Bottom */}
            <div className="mt-auto pt-4 border-t border-gray-100">
                {bottomLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        onClick={onNavigate}
                        className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-sm ${isActive(link.path)
                            ? 'bg-[#0ea00e] text-white font-bold shadow-md shadow-[#0ea00e]/20'
                            : 'text-[#618961] hover:bg-gray-50 font-medium'
                            }`}
                    >
                        <span className="material-symbols-outlined">{link.icon}</span>
                        <span>{link.label}</span>
                    </Link>
                ))}
                <div className="mt-4 px-4 py-4 border-t border-gray-100 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#4CAF50]">
                        <span className="material-symbols-outlined">person</span>
                    </div>
                    <div className="flex flex-col overflow-hidden flex-1">
                        <span className="text-sm font-bold text-[#111811] truncate">{user?.name || 'Admin'}</span>
                        <span className="text-xs text-[#618961] truncate">{user?.email || 'admin@lingoland.com'}</span>
                    </div>
                </div>
                <Link
                    to="/"
                    onClick={onNavigate}
                    className="flex items-center gap-3 px-4 py-2.5 mt-2 rounded-full text-sm text-[#618961] hover:bg-gray-50 font-medium transition-all"
                >
                    <span className="material-symbols-outlined text-lg">home</span>
                    <span>Về Trang Chủ</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 mt-1 rounded-full text-sm text-red-500 hover:bg-red-50 font-bold transition-all w-full text-left"
                >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span>Đăng Xuất</span>
                </button>
            </div>
        </>
    );

    return (
        <div id="admin-panel" className="flex h-screen overflow-hidden bg-[#f6f8f6]">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 h-full bg-white border-r border-gray-100 p-4">
                <SidebarContent />
            </aside>

            {/* Mobile Drawer Overlay */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 md:hidden animate-[fadeIn_0.2s_ease-out]"
                    onClick={() => setDrawerOpen(false)}
                >
                    <aside
                        className="absolute right-0 top-0 w-72 h-full bg-white p-4 flex flex-col shadow-2xl animate-[slideIn_0.25s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setDrawerOpen(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                        <SidebarContent onNavigate={() => setDrawerOpen(false)} />
                    </aside>
                </div>
            )}

            {/* Main area */}
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="flex md:hidden items-center justify-between p-4 bg-white border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <img src={logoUrl} alt="LingoLand" className="h-8 w-8 object-contain" />
                        <span className="font-bold text-[#111811]">LingoLand</span>
                    </div>
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#388E3C]"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] w-full mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
