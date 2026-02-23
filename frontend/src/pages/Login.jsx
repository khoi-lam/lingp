import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoUrl } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate(result.user.role === 'admin' ? '/admin' : '/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#FAF5EB]">
            {/* Floating decorations */}
            <div className="absolute top-10 left-10 text-[#87CEEB] opacity-60 animate-bounce" style={{ animationDuration: '3s' }}>
                <span className="material-symbols-outlined text-6xl">cloud</span>
            </div>
            <div className="absolute bottom-20 right-20 text-[#8BC34A] opacity-40 animate-bounce" style={{ animationDuration: '4s' }}>
                <span className="material-symbols-outlined text-6xl">eco</span>
            </div>
            <div className="absolute top-1/4 right-10 text-[#C5E0B4] opacity-50">
                <span className="material-symbols-outlined text-4xl">local_florist</span>
            </div>
            <div className="absolute bottom-10 left-1/4 text-[#87CEEB] opacity-40">
                <span className="material-symbols-outlined text-5xl">water_drop</span>
            </div>

            <main className="w-full max-w-md bg-white rounded-xl p-8 md:p-10 bubble-shadow relative z-10 border-2 border-[#C5E0B4]">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <img alt="LingoLand Logo" className="h-24 w-auto object-contain hover:scale-105 transition-transform duration-300" src={logoUrl} />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-[#2B3A67] mb-2">Chào Mừng Trở Lại!</h1>
                    <p className="text-[#388E3C] text-sm font-medium">Tiếp tục hành trình đọc sách của bạn 🌿</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-[#2B3A67] ml-2">Địa Chỉ Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-[#8BC34A]">mail</span>
                            </div>
                            <input
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-[#C5E0B4] focus:border-[#4CAF50] focus:ring-0 text-[#2B3A67] placeholder-[#C5E0B4] bg-[#FAF5EB] transition-colors"
                                placeholder="hello@lingoland.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center ml-2 mr-1">
                            <label className="block text-sm font-bold text-[#2B3A67]">Mật Khẩu</label>
                            <a href="#" className="text-xs font-bold text-[#4CAF50] hover:text-[#388E3C] hover:underline">Quên mật khẩu?</a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-[#8BC34A]">lock</span>
                            </div>
                            <input
                                className="w-full pl-12 pr-12 py-3 rounded-2xl border-2 border-[#C5E0B4] focus:border-[#4CAF50] focus:ring-0 text-[#2B3A67] placeholder-[#C5E0B4] bg-[#FAF5EB] transition-colors"
                                placeholder="••••••••"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8BC34A] hover:text-[#4CAF50]">
                                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#4CAF50] hover:bg-[#2E7D32] text-white font-bold py-3.5 px-4 rounded-2xl btn-shadow flex items-center justify-center gap-2 group mt-6 disabled:opacity-60"
                    >
                        {loading ? (
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        ) : (
                            <>
                                <span>Đăng nhập</span>
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <p className="text-[#2B3A67] text-sm">
                        Mới đến LingoLand?{' '}
                        <Link to="/register" className="text-[#4CAF50] font-bold hover:text-[#388E3C] hover:underline decoration-2 underline-offset-2">Tạo tài khoản</Link>
                    </p>
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-[#C5E0B4]"></div>
                        <span className="flex-shrink-0 mx-4 text-[#8BC34A] text-xs font-medium bg-white px-2">hoặc</span>
                        <div className="flex-grow border-t border-[#C5E0B4]"></div>
                    </div>
                    <Link to="/" className="inline-flex items-center text-sm font-bold text-[#388E3C] hover:text-[#2E7D32] group transition-colors">
                        <span className="material-symbols-outlined text-lg mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        Về Trang Chủ
                    </Link>
                </div>
            </main>
        </div>
    );
}
