import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        // Validate
        const newErrors = [];
        if (formData.password !== formData.confirmPassword) {
            newErrors.push('Mật khẩu xác nhận không khớp');
        }
        if (formData.password.length < 6) {
            newErrors.push('Mật khẩu phải có ít nhất 6 ký tự');
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            const response = await register(
                formData.email,
                formData.password,
                formData.name
            );
            if (response.success) {
                navigate('/');
            }
        } catch (err) {
            const errorMessages = err.response?.data?.errors || [
                err.response?.data?.message || 'Đăng ký thất bại'
            ];
            setErrors(errorMessages);
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
                        <div className="w-14 h-14 bg-fahasa-red rounded-2xl flex items-center justify-center shadow-2xl shadow-fahasa-red/30 transition-transform group-hover:scale-110">
                            <span className="text-white font-black text-2xl">B</span>
                        </div>
                        <span className="text-3xl font-black text-fahasa-dark tracking-tight">
                            Bookstore
                        </span>
                    </Link>
                    <h2 className="text-3xl font-black text-fahasa-dark uppercase tracking-tight mb-2">
                        Đăng ký tài khoản
                    </h2>
                    <p className="text-gray-500 font-bold">
                        Tạo tài khoản để bắt đầu mua sắm
                    </p>
                </div>

                {/* Register Form Card */}
                <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 p-8 md:p-10 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.length > 0 && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                                <ul className="space-y-1">
                                    {errors.map((error, index) => (
                                        <li key={index} className="flex items-start space-x-2 text-sm font-bold">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{error}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                                    Họ và tên
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className="w-full h-14 pl-12 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-fahasa-dark placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-fahasa-red transition-all"
                                        placeholder="Nguyễn Văn A"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

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
                                        className="w-full h-14 pl-12 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-fahasa-dark placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-fahasa-red transition-all"
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
                                        className="w-full h-14 pl-12 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-fahasa-dark placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-fahasa-red transition-all"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="w-full h-14 pl-12 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-fahasa-dark placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-fahasa-red transition-all"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-fahasa-red text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-fahasa-red/20 hover:bg-fahasa-red/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Đang đăng ký...</span>
                                </div>
                            ) : (
                                'Đăng ký'
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

                    {/* Login Link */}
                    <div className="text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center space-x-2 text-sm font-bold text-gray-600 hover:text-fahasa-red transition-colors group"
                        >
                            <span>Đã có tài khoản?</span>
                            <span className="text-fahasa-red font-black group-hover:translate-x-1 transition-transform">
                                Đăng nhập →
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-fahasa-dark transition-colors group"
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

export default Register;
