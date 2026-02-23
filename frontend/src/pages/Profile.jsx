import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('info');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        usersAPI.getProfile().then(r => {
            if (r.data.success) {
                const p = r.data.data.user || r.data.data;
                setProfile(p);
                setForm({ name: p.name || '', email: p.email || '', phone: p.phone || '' });
            }
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMsg('');
        try {
            const { data } = await usersAPI.updateProfile({ name: form.name, phone: form.phone });
            if (data.success) {
                setProfile(p => ({ ...p, name: form.name, phone: form.phone }));
                setEditing(false);
                setMsg('Đã cập nhật thành công!');
                setTimeout(() => setMsg(''), 3000);
            }
        } catch (err) {
            setMsg(err.response?.data?.message || 'Lỗi cập nhật');
        } finally { setSaving(false); }
    };

    if (loading) return <div className="flex items-center justify-center py-32"><span className="material-symbols-outlined text-5xl animate-spin text-[#4CAF50]">progress_activity</span></div>;
    if (!profile) return <div className="text-center py-32"><p className="text-gray-500">Vui lòng đăng nhập để xem trang cá nhân.</p><Link to="/login" className="text-[#4CAF50] font-bold mt-4 inline-block">Đăng nhập</Link></div>;

    const initial = profile.name?.charAt(0)?.toUpperCase() || 'U';
    const joinDate = new Date(profile.createdAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {msg && <div className={`mb-4 p-3 rounded-xl text-sm font-medium text-center ${msg.includes('Lỗi') ? 'bg-red-50 text-red-600' : 'bg-[#E8F5E9] text-[#2E7D32]'}`}>{msg}</div>}

            <div className="bg-white rounded-xl p-8 shadow-sm border border-[#E8F5E9] mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8BC34A] to-[#4CAF50] flex items-center justify-center text-white text-3xl font-display font-bold shadow-lg">
                            {initial}
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-display font-bold text-[#2B3A67]">{profile.name}</h1>
                        <p className="text-[#388E3C]">{profile.email}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-[#8BC34A] flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> Tham gia {joinDate}</span>
                        </div>
                    </div>
                    <div className="md:ml-auto flex gap-3">
                        <Link to="/orders" className="px-4 py-2 bg-[#E8F5E9] text-[#2E7D32] rounded-full font-bold text-sm hover:bg-[#C5E0B4] transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">receipt_long</span> Đơn Hàng
                        </Link>
                        <button onClick={logout} className="px-4 py-2 bg-red-50 text-red-500 rounded-full font-bold text-sm hover:bg-red-100 transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">logout</span> Đăng Xuất
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#E8F5E9] overflow-hidden">
                <div className="flex border-b border-[#E8F5E9]">
                    {['info', 'security'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === tab ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' : 'text-gray-400 hover:text-[#2B3A67]'}`}>
                            {tab === 'info' ? 'Thông Tin Cá Nhân' : 'Bảo Mật'}
                        </button>
                    ))}
                </div>
                <div className="p-6">
                    {activeTab === 'info' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[#2E7D32] mb-1.5">Họ và Tên</label>
                                <input disabled={!editing} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-2xl border-gray-200 bg-[#FAF5EB] py-3 px-4 focus:border-[#4CAF50] focus:ring-[#4CAF50] disabled:opacity-60" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#2E7D32] mb-1.5">Email (không thể thay đổi)</label>
                                <input disabled value={form.email} className="w-full rounded-2xl border-gray-200 bg-gray-100 py-3 px-4 opacity-60" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#2E7D32] mb-1.5">Số Điện Thoại</label>
                                <input disabled={!editing} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full rounded-2xl border-gray-200 bg-[#FAF5EB] py-3 px-4 focus:border-[#4CAF50] focus:ring-[#4CAF50] disabled:opacity-60" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                {editing ? (
                                    <>
                                        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-[#4CAF50] text-white rounded-full font-bold hover:bg-[#388E3C] transition-colors disabled:opacity-60">{saving ? 'Đang lưu...' : 'Lưu'}</button>
                                        <button onClick={() => { setEditing(false); setForm({ name: profile.name, email: profile.email, phone: profile.phone || '' }); }} className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-full font-bold hover:bg-gray-200">Huỷ</button>
                                    </>
                                ) : (
                                    <button onClick={() => setEditing(true)} className="px-6 py-2.5 bg-[#E8F5E9] text-[#2E7D32] rounded-full font-bold hover:bg-[#C5E0B4] transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">edit</span> Chỉnh Sửa
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'security' && (
                        <div className="text-center py-8 text-gray-400">
                            <span className="material-symbols-outlined text-5xl mb-3 block">lock</span>
                            <p>Tính năng đổi mật khẩu sẽ được cập nhật sớm.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
