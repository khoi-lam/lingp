import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await api.put('/user/profile', {
                name: formData.name,
                email: formData.email
            });

            if (res.data.success) {
                setUser(res.data.data.user);
                setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Có lỗi xảy ra' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu mới không khớp!' });
            setLoading(false);
            return;
        }

        try {
            const res = await api.put('/user/password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            if (res.data.success) {
                setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
                setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Có lỗi xảy ra' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-2xl font-black text-fahasa-dark uppercase tracking-widest mb-10">Thông tin tài khoản</h1>

                {message.text && (
                    <div className={`mb-8 p-6 rounded-3xl border-2 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        <p className="font-bold text-sm">{message.text}</p>
                    </div>
                )}

                <div className="space-y-8">
                    {/* Profile Information */}
                    <div className="bg-white rounded-[40px] p-8 lg:p-12 border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-black text-fahasa-dark uppercase tracking-widest mb-8 pb-4 border-b border-gray-50">
                            Thông tin cá nhân
                        </h2>
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Họ và tên</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-fahasa-dark focus:ring-2 focus:ring-fahasa-red/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-fahasa-dark focus:ring-2 focus:ring-fahasa-red/20 transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-10 py-4 bg-fahasa-red text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-fahasa-red/20 hover:bg-fahasa-red/90 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white rounded-[40px] p-8 lg:p-12 border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-black text-fahasa-dark uppercase tracking-widest mb-8 pb-4 border-b border-gray-50">
                            Đổi mật khẩu
                        </h2>
                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-fahasa-dark focus:ring-2 focus:ring-fahasa-red/20 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-fahasa-dark focus:ring-2 focus:ring-fahasa-red/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Xác nhận mật khẩu mới</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-fahasa-dark focus:ring-2 focus:ring-fahasa-red/20 transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-10 py-4 bg-fahasa-dark text-white rounded-2xl font-black uppercase tracking-widest hover:bg-fahasa-dark/90 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                            </button>
                        </form>
                    </div>

                    {/* Account Stats */}
                    <div className="bg-white rounded-[40px] p-8 lg:p-12 border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-black text-fahasa-dark uppercase tracking-widest mb-8 pb-4 border-b border-gray-50">
                            Thông tin tài khoản
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-gray-50 rounded-3xl text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Vai trò</p>
                                <p className="text-lg font-black text-fahasa-red uppercase">{user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-3xl text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ngày tham gia</p>
                                <p className="text-sm font-black text-fahasa-dark">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                </p>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-3xl text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Trạng thái</p>
                                <p className="text-sm font-black text-green-600 uppercase">Hoạt động</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
