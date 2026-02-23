import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(formData.email, formData.password);
            if (response.success) {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center space-x-3 group mb-8">
                        <div className="w-14 h-14 bg-vanxuan-red rounded-2xl flex items-center justify-center shadow-2xl shadow-vanxuan-red/30 transition-transform group-hover:scale-110">
                            <span className="text-white font-black text-lg">VX</span>
                        </div>
                        <span className="text-3xl font-black text-vanxuan-dark tracking-tight">
                            Vạn Xuân
                        </span>
                    </Link>
                    <h2 className="text-3xl font-black text-vanxuan-dark uppercase tracking-tight mb-2">
                        Đăng nhập
                    </h2>
                    <p className="text-gray-500 font-bold">
                        Chào mừng bạn quay trở lại!
                    </p>
                </div>

                {/* Login Form Card */}
                <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 p-8 md:p-10 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl font-bold text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center space-x-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full h-14 pl-12 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-vanxuan-dark placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-vanxuan-red transition-all"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full h-14 pl-12 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-vanxuan-dark placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-vanxuan-red transition-all"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-vanxuan-red text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-vanxuan-red/20 hover:bg-vanxuan-red/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Đang đăng nhập...</span>
                                </div>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-4 bg-white text-gray-400 font-black uppercase tracking-widest">
                                Hoặc
                            </span>
                        </div>
                    </div>

                    {/* Register Link */}
                    <div className="text-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center space-x-2 text-sm font-bold text-gray-600 hover:text-vanxuan-red transition-colors group"
                        >
                            <span>Chưa có tài khoản?</span>
                            <span className="text-vanxuan-red font-black group-hover:translate-x-1 transition-transform">
                                Đăng ký ngay →
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-vanxuan-dark transition-colors group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Quay về trang chủ</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
