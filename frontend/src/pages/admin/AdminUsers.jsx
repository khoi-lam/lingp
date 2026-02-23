import { useState, useEffect, useMemo } from 'react';
import { usersAPI } from '../../services/api';
import { ConfirmModal, Toast, useToast } from '../../components/AdminPopups';

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const TABS = [
    { label: 'Tất cả', value: 'all', icon: 'group' },
    { label: 'Admin', value: 'admin', icon: 'admin_panel_settings' },
    { label: 'Khách hàng', value: 'user', icon: 'person' },
];

const PER_PAGE = 10;

export default function AdminUsers() {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);
    const [blockTarget, setBlockTarget] = useState(null);
    const [detailUser, setDetailUser] = useState(null);
    const { toast, showToast, closeToast } = useToast();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await usersAPI.adminGetAll({ limit: 999 });
            if (data.success) setAllUsers(data.data.users);
        } catch (err) {
            showToast('Lỗi tải danh sách người dùng', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const filtered = useMemo(() => {
        let list = allUsers;
        if (activeTab === 'admin') list = list.filter(u => u.role === 'admin');
        if (activeTab === 'user') list = list.filter(u => u.role !== 'admin');
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
        }
        return list;
    }, [allUsers, activeTab, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const adminCount = allUsers.filter(u => u.role === 'admin').length;
    const userCount = allUsers.filter(u => u.role !== 'admin').length;

    const handleTabChange = (val) => { setActiveTab(val); setPage(1); };
    const handleSearch = (e) => { e.preventDefault(); setPage(1); };

    const handleToggleBlock = async () => {
        if (!blockTarget) return;
        try {
            await usersAPI.adminToggleBlock(blockTarget._id);
            showToast(blockTarget.isBlocked ? `Đã mở khoá "${blockTarget.name}"` : `Đã khoá "${blockTarget.name}"`);
            setBlockTarget(null);
            fetchUsers();
        } catch (err) {
            showToast('Lỗi thao tác', 'error');
        }
    };

    const paginationPages = (() => {
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = start + maxVisible - 1;
        if (end > totalPages) { end = totalPages; start = Math.max(1, end - maxVisible + 1); }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    })();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#111811] tracking-tight">Quản Lý Người Dùng</h1>
                <p className="text-[#618961] mt-1">Quản lý tài khoản khách hàng và quyền truy cập.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.value ? 'bg-[#0ea00e] text-white font-bold shadow-md shadow-[#0ea00e]/20' : 'bg-white text-[#618961] border border-gray-200 hover:bg-gray-50'}`}
                    >
                        <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                        {tab.label}
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab.value ? 'bg-white/20' : 'bg-gray-100'}`}>
                            {tab.value === 'all' ? allUsers.length : tab.value === 'admin' ? adminCount : userCount}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative max-w-md mb-6 group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#618961] group-focus-within:text-[#0ea00e] transition-colors">search</span>
                <input className="w-full h-12 pl-12 pr-4 rounded-full border-0 bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] placeholder:text-gray-400 shadow-sm" placeholder="Tìm theo tên hoặc email..." type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </form>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <span className="material-symbols-outlined text-4xl animate-spin text-[#0ea00e]">progress_activity</span>
                    </div>
                ) : paginated.length === 0 ? (
                    <div className="text-center py-20 text-[#618961]">
                        <span className="material-symbols-outlined text-5xl mb-2 block">group</span>
                        <p>{search ? 'Không tìm thấy kết quả' : 'Chưa có người dùng nào'}</p>
                    </div>
                ) : (
                    <>
                        {/* ═══ MOBILE: Card Layout ═══ */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {paginated.map((u) => (
                                <div key={u._id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${u.role === 'admin' ? 'bg-orange-50 text-orange-500' : 'bg-[#E8F5E9] text-[#4CAF50]'}`}>
                                            <span className="material-symbols-outlined">{u.role === 'admin' ? 'admin_panel_settings' : 'person'}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-sm text-[#111811] truncate">{u.name}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {u.role === 'admin' ? 'Admin' : 'User'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 truncate">{u.email}</p>
                                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                                                <span>{u.orderCount || 0} đơn</span>
                                                <span>•</span>
                                                <span>{formatDate(u.createdAt)}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {u.isBlocked ? 'Khóa' : 'OK'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 flex-shrink-0">
                                            <button onClick={() => setDetailUser(u)} className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#0ea00e] hover:bg-[#C5E0B4] transition-colors">
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </button>
                                            {u.role !== 'admin' && (
                                                <button onClick={() => setBlockTarget(u)} className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${u.isBlocked ? 'bg-green-50 text-green-500 hover:bg-green-100' : 'bg-red-50 text-red-400 hover:bg-red-100'}`}>
                                                    <span className="material-symbols-outlined text-lg">{u.isBlocked ? 'lock_open' : 'block'}</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ═══ DESKTOP: Table Layout ═══ */}
                        <table className="hidden md:table w-full border-collapse text-left">
                            <thead className="border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase tracking-wider">Tên</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase tracking-wider text-center">Vai trò</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase tracking-wider text-center">Đơn hàng</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase tracking-wider">Ngày tham gia</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase tracking-wider text-center">Trạng thái</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#618961] uppercase tracking-wider text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginated.map((u, i) => (
                                    <tr key={u._id} className={`hover:bg-[#0ea00e]/5 transition-colors group ${i % 2 === 1 ? 'bg-[#0ea00e]/[0.02]' : ''}`}>
                                        <td className="px-6 py-4 font-medium text-[#111811]">{u.name}</td>
                                        <td className="px-6 py-4 text-sm text-[#618961]">{u.email}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {u.role === 'admin' ? 'Admin' : 'Khách hàng'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm">{u.orderCount || 0}</td>
                                        <td className="px-6 py-4 text-sm text-[#618961]">{formatDate(u.createdAt)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {u.isBlocked ? 'Tạm khóa' : 'Hoạt động'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setDetailUser(u)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#0ea00e] transition-colors" title="Xem chi tiết">
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                                {u.role !== 'admin' && (
                                                    <button onClick={() => setBlockTarget(u)} className={`p-2 rounded-full transition-colors ${u.isBlocked ? 'hover:bg-green-50 text-gray-500 hover:text-green-600' : 'hover:bg-red-50 text-gray-500 hover:text-red-500'}`} title={u.isBlocked ? 'Mở khóa' : 'Khóa'}>
                                                        <span className="material-symbols-outlined text-[20px]">{u.isBlocked ? 'lock_open' : 'block'}</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between py-4">
                    <p className="text-sm text-gray-500">Trang <span className="font-bold text-[#111811]">{page}</span> / <span className="font-bold text-[#111811]">{totalPages}</span> ({filtered.length} người dùng)</p>
                    <div className="flex items-center gap-2">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30">
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        {paginationPages.map(n => (
                            <button key={n} onClick={() => setPage(n)} className={`flex size-10 items-center justify-center rounded-full text-sm transition-colors ${n === page ? 'bg-[#0ea00e] text-white font-bold shadow-md' : 'hover:bg-gray-100'}`}>{n}</button>
                        ))}
                        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30">
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}

            {/* User Detail Modal */}
            {detailUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setDetailUser(null)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-[#111811]">Thông tin người dùng</h2>
                            <button onClick={() => setDetailUser(null)} className="p-2 rounded-full hover:bg-gray-100"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${detailUser.role === 'admin' ? 'bg-orange-50 text-orange-500' : 'bg-[#E8F5E9] text-[#4CAF50]'}`}>
                                <span className="material-symbols-outlined text-2xl">{detailUser.role === 'admin' ? 'admin_panel_settings' : 'person'}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#111811]">{detailUser.name}</h3>
                                <p className="text-sm text-gray-400">{detailUser.email}</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-[#618961]">Vai trò</span><span className={`font-bold ${detailUser.role === 'admin' ? 'text-orange-600' : 'text-blue-600'}`}>{detailUser.role === 'admin' ? 'Admin' : 'Khách hàng'}</span></div>
                            <div className="flex justify-between"><span className="text-[#618961]">Đơn hàng</span><span className="font-medium">{detailUser.orderCount || 0}</span></div>
                            <div className="flex justify-between"><span className="text-[#618961]">Ngày tham gia</span><span className="font-medium">{formatDate(detailUser.createdAt)}</span></div>
                            <div className="flex justify-between"><span className="text-[#618961]">Trạng thái</span><span className={`font-bold ${detailUser.isBlocked ? 'text-red-600' : 'text-green-600'}`}>{detailUser.isBlocked ? 'Tạm khóa' : 'Hoạt động'}</span></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Block Confirm */}
            <ConfirmModal
                open={!!blockTarget}
                onClose={() => setBlockTarget(null)}
                onConfirm={handleToggleBlock}
                title={blockTarget?.isBlocked ? 'Mở khoá tài khoản?' : 'Khoá tài khoản?'}
                message={blockTarget?.isBlocked
                    ? `Bạn có chắc muốn mở khoá tài khoản "${blockTarget?.name}"?`
                    : `Bạn có chắc muốn khoá tài khoản "${blockTarget?.name}"? Người dùng sẽ không thể đăng nhập.`
                }
                confirmText={blockTarget?.isBlocked ? 'Mở khoá' : 'Khoá'}
                danger={!blockTarget?.isBlocked}
            />

            <Toast {...toast} onClose={closeToast} />
        </div>
    );
}
