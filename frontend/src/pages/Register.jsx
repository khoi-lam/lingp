import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const logoUrl = '/logo.png';

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }
        if (form.password.length < 6) {
            setError('Mật khẩu tối thiểu 6 ký tự');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await register(form.email, form.password, form.name);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#FAF5EB]">
            <div className="absolute top-16 right-16 text-[#8BC34A] opacity-50 animate-bounce" style={{ animationDuration: '3.5s' }}>
                <span className="material-symbols-outlined text-7xl">park</span>
            </div>
            <div className="absolute bottom-16 left-16 text-[#87CEEB] opacity-40 animate-bounce" style={{ animationDuration: '4.5s' }}>
                <span className="material-symbols-outlined text-5xl">auto_stories</span>
            </div>
            <div className="absolute top-1/3 left-8 text-[#C5E0B4] opacity-60">
                <span className="material-symbols-outlined text-4xl">star</span>
            </div>

            <main className="w-full max-w-md bg-white rounded-xl p-8 md:p-10 bubble-shadow relative z-10 border-2 border-[#C5E0B4]">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <img alt="LingoLand Logo" className="h-20 w-auto object-contain hover:scale-105 transition-transform duration-300" src={logoUrl} />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-[#2B3A67] mb-2">Tham Gia LingoLand!</h1>
                    <p className="text-[#388E3C] text-sm font-medium">Bắt đầu hành trình đọc sách ngay hôm nay 🌱</p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-[#2B3A67] ml-2">Họ và Tên</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><span className="material-symbols-outlined text-[#8BC34A]">person</span></div>
                            <input name="name" value={form.name} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-[#C5E0B4] focus:border-[#4CAF50] focus:ring-0 text-[#2B3A67] placeholder-[#C5E0B4] bg-[#FAF5EB] transition-colors" placeholder="Nhập họ và tên" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-[#2B3A67] ml-2">Địa Chỉ Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><span className="material-symbols-outlined text-[#8BC34A]">mail</span></div>
                            <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-[#C5E0B4] focus:border-[#4CAF50] focus:ring-0 text-[#2B3A67] placeholder-[#C5E0B4] bg-[#FAF5EB] transition-colors" placeholder="hello@lingoland.com" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-[#2B3A67] ml-2">Số Điện Thoại</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><span className="material-symbols-outlined text-[#8BC34A]">phone</span></div>
                            <input name="phone" value={form.phone} onChange={handleChange} type="tel" className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-[#C5E0B4] focus:border-[#4CAF50] focus:ring-0 text-[#2B3A67] placeholder-[#C5E0B4] bg-[#FAF5EB] transition-colors" placeholder="0912 345 678" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-[#2B3A67] ml-2">Mật Khẩu</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><span className="material-symbols-outlined text-[#8BC34A]">lock</span></div>
                            <input name="password" value={form.password} onChange={handleChange} className="w-full pl-12 pr-12 py-3 rounded-2xl border-2 border-[#C5E0B4] focus:border-[#4CAF50] focus:ring-0 text-[#2B3A67] placeholder-[#C5E0B4] bg-[#FAF5EB] transition-colors" placeholder="Tối thiểu 6 ký tự" type={showPassword ? 'text' : 'password'} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8BC34A] hover:text-[#4CAF50]">
                                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-[#4CAF50] hover:bg-[#2E7D32] text-white font-bold py-3.5 px-4 rounded-2xl btn-shadow flex items-center justify-center gap-2 group mt-2 disabled:opacity-60">
                        <span>{loading ? 'Đang tạo...' : 'Tạo Tài Khoản'}</span>
                        {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-4">
                    <p className="text-[#2B3A67] text-sm">Đã có tài khoản? <Link to="/login" className="text-[#4CAF50] font-bold hover:text-[#388E3C] hover:underline decoration-2 underline-offset-2">Đăng nhập</Link></p>
                    <Link to="/" className="inline-flex items-center text-sm font-bold text-[#388E3C] hover:text-[#2E7D32] group transition-colors">
                        <span className="material-symbols-outlined text-lg mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span> Về Trang Chủ
                    </Link>
                </div>
            </main>
        </div>
    );
}
