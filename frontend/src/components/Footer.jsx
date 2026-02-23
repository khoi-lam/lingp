import { Link } from 'react-router-dom';
import { logoUrl } from '../data/mockData';

export default function Footer() {
    return (
        <footer className="bg-[#2E7D32] text-white pt-16 pb-8 rounded-t-3xl mt-auto">
            <div className="container mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    <div className="space-y-4">
                        <img alt="LingoLand Logo" className="h-16 w-auto object-contain drop-shadow-md" src={logoUrl} />
                        <p className="text-[#C5E0B4] text-sm leading-relaxed">
                            LingoLand — Phát triển và xuất bản sách truyện tranh song ngữ cho trẻ em. Gieo hạt song ngữ, nuôi dưỡng tương lai. 🌱
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-[#8BC34A]">Bộ Sưu Tập</h4>
                        <ul className="space-y-3 text-[#C5E0B4]">
                            <li><Link to="/shop" className="hover:text-white transition-colors">📚 3-5 Tuổi</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">📖 6-8 Tuổi</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">📕 9-12 Tuổi</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">🌏 Song Ngữ Anh-Việt</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-[#8BC34A]">Liên Hệ</h4>
                        <ul className="space-y-3 text-[#C5E0B4]">
                            <li><Link to="/support" className="hover:text-white transition-colors">💬 Hỗ Trợ Khách Hàng</Link></li>
                            <li><Link to="/support" className="hover:text-white transition-colors">📦 Thông Tin Giao Hàng</Link></li>
                            <li><Link to="/support" className="hover:text-white transition-colors">❓ Câu Hỏi Thường Gặp</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-[#4CAF50] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[#C5E0B4]/60 text-sm">© 2026 LingoLand Studio — Sách Song Ngữ Cho Bé</p>
                </div>
            </div>
        </footer>
    );
}
