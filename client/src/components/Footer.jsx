import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            {/* Newsletter Bar (Fahasa Style) */}
            <div className="bg-vanxuan-gray">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-vanxuan-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div>
                                <p className="text-sm font-bold text-vanxuan-dark">ĐĂNG KÝ NHẬN TIN</p>
                                <p className="text-xs text-gray-500">Nhận thông tin ưu đãi mới nhất từ Vạn Xuân</p>
                            </div>
                        </div>
                        <div className="flex w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn..."
                                className="flex-1 md:w-80 px-4 py-2.5 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:border-vanxuan-red"
                            />
                            <button className="px-6 py-2.5 bg-vanxuan-red text-white text-sm font-bold rounded-r-lg hover:bg-vanxuan-red/90 transition-colors">
                                ĐĂNG KÝ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand & Contact */}
                    <div className="space-y-5">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-vanxuan-red rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-sm">VX</span>
                            </div>
                            <span className="text-xl font-black text-vanxuan-dark tracking-tight">Vạn Xuân</span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-500">
                            <p className="flex items-start space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 text-vanxuan-red flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>60 - 62 Lê Lợi, Quận 1, TP. HCM</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-vanxuan-red flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                <span>1900 636 467</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-vanxuan-red flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <span>cskh@vanxuan.com.vn</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#1877F2] hover:text-white text-gray-400 transition-all">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white text-gray-400 transition-all">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#FF0000] hover:text-white text-gray-400 transition-all">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </a>
                            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-black hover:text-white text-gray-400 transition-all">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Dịch vụ */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-vanxuan-dark uppercase tracking-wider">Dịch vụ</h4>
                        <ul className="space-y-2.5">
                            {['Điều khoản sử dụng', 'Chính sách bảo mật', 'Chính sách thanh toán', 'Giới thiệu về Vạn Xuân'].map((item) => (
                                <li key={item}><Link to="#" className="text-sm text-gray-500 hover:text-vanxuan-red transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Hỗ trợ */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-vanxuan-dark uppercase tracking-wider">Hỗ trợ</h4>
                        <ul className="space-y-2.5">
                            {['Chính sách đổi trả', 'Chính sách bảo hành', 'Chính sách vận chuyển', 'Hệ thống nhà sách'].map((item) => (
                                <li key={item}><Link to="#" className="text-sm text-gray-500 hover:text-vanxuan-red transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Tài khoản */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-vanxuan-dark uppercase tracking-wider">Tài khoản</h4>
                        <ul className="space-y-2.5">
                            {['Đăng nhập/Tạo mới', 'Thay đổi địa chỉ', 'Chi tiết tài khoản', 'Lịch sử mua hàng'].map((item) => (
                                <li key={item}><Link to="#" className="text-sm text-gray-500 hover:text-vanxuan-red transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400">© 2026 Vạn Xuân. Bản quyền thuộc về Nhà Sách Vạn Xuân.</p>
                    <div className="flex items-center space-x-6">
                        {['Visa', 'Momo', 'VNPay', 'COD'].map((pay) => (
                            <span key={pay} className="text-xs font-bold text-gray-400 uppercase">{pay}</span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
