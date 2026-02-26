import { Link } from 'react-router-dom';
import { booksAPI, categoriesAPI } from '../services/api';
import { useState, useEffect, useRef, useCallback } from 'react';

const stats = [
    { value: '0-6', suffix: '', label: 'Nhóm tuổi', icon: 'child_care', isText: true },
    { value: 2, suffix: '', label: 'Ngôn ngữ', icon: 'translate' },
    { value: 4.9, suffix: '★', label: 'Đánh giá phụ huynh', icon: 'star', decimal: true },
];

const testimonials = [
    {
        name: 'Nguyễn Minh Anh',
        role: 'Phụ huynh 2 bé',
        avatar: '👩',
        text: 'Con tôi 5 tuổi rất thích sách "Bé Học Chữ Cái - ABC Fun"! Bé vừa học tiếng Việt vừa tiếng Anh mà không nhàm chán. Tranh vẽ dễ thương, nội dung phù hợp. LingoLand thực sự hiểu trẻ em!',
    },
    {
        name: 'Trần Đức Huy',
        role: 'Phụ huynh',
        avatar: '👨',
        text: 'Mình tìm sách song ngữ cho con lâu lắm rồi. Sách trên thị trường hoặc quá khó hoặc nội dung không phù hợp. LingoLand có mức độ vừa phải, hình ảnh đẹp, con đọc rất vui.',
    },
    {
        name: 'Lê Thị Hương',
        role: 'Giáo viên Tiểu học',
        avatar: '👩‍🏫',
        text: 'Tôi giới thiệu sách LingoLand cho phụ huynh trong lớp. Các bé rất thích truyện "Siêu Anh Hùng Nhí" và "Thám Tử Nhí". Vừa đọc truyện vừa học từ vựng tiếng Anh — hiệu quả tuyệt vời!',
    },
];

const arSteps = [
    { step: '01', icon: 'shopping_cart', title: 'Chọn sách yêu thích', desc: 'Duyệt qua hàng trăm đầu sách với nội dung AR độc quyền từ nhiều thể loại: thiếu nhi, giáo dục, khoa học, phiêu lưu...' },
    { step: '02', icon: 'qr_code_scanner', title: 'Quét trang sách', desc: 'Mở ứng dụng LingoLand, hướng camera vào trang sách có biểu tượng AR. Chỉ cần vài giây để nội dung được nhận diện.' },
    { step: '03', icon: 'view_in_ar', title: 'Trải nghiệm sống động', desc: 'Nhân vật, hình ảnh 3D và nội dung tương tác sẽ "hiện ra" ngay trên trang sách — giúp bạn học và giải trí cùng lúc.' },
];

const features = [
    {
        icon: 'auto_awesome',
        title: 'Nội Dung AR Độc Quyền',
        desc: 'Mỗi cuốn sách tại LingoLand đều được thiết kế nội dung AR riêng biệt — từ mô hình 3D, video hoạt hình đến trò chơi tương tác. Không đâu có, chỉ có tại LingoLand.',
        color: '#4CAF50',
    },
    {
        icon: 'child_care',
        title: 'An Toàn Cho Trẻ',
        desc: 'Tất cả nội dung đều được kiểm duyệt kỹ lưỡng, phù hợp lứa tuổi. Phụ huynh hoàn toàn yên tâm khi con sử dụng. Nội dung giáo dục lồng ghép một cách tự nhiên và thú vị.',
        color: '#FF9800',
    },
    {
        icon: 'school',
        title: 'Hỗ Trợ Giáo Dục',
        desc: 'LingoLand hợp tác với các chuyên gia giáo dục hàng đầu để đảm bảo nội dung sách và AR hỗ trợ phát triển tư duy, kỹ năng ngôn ngữ và sáng tạo cho trẻ em.',
        color: '#2196F3',
    },
    {
        icon: 'eco',
        title: 'Bền Vững & Thân Thiện',
        desc: 'Sách được in trên giấy tái chế, mực in thân thiện môi trường. Đóng gói giảm nhựa. Mỗi đơn hàng, LingoLand trồng 1 cây xanh — vì tương lai của con trẻ.',
        color: '#009688',
    },
];

function CountUp({ end, suffix = '', decimal = false }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasRun = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !hasRun.current) {
                hasRun.current = true;
                const duration = 1500;
                const steps = 50;
                const stepTime = duration / steps;
                let current = 0;
                const increment = end / steps;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= end) {
                        setCount(end);
                        clearInterval(timer);
                    } else {
                        setCount(decimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
                    }
                }, stepTime);
                observer.disconnect();
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, decimal]);

    const display = decimal
        ? count.toFixed(1)
        : count >= 1000
            ? (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1).replace(/\.0$/, '') + 'K'
            : count.toLocaleString('vi-VN');

    return <span ref={ref}>{display}{suffix.replace('K+', count >= 1000 ? '+' : suffix)}</span>;
}

/* Scroll-reveal hook */
function useScrollReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); observer.disconnect(); }
        }, { threshold: 0.15 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return [ref, visible];
}

import { API_BASE } from '../config.js';
const getImg = (b) => b.images?.[0] ? (b.images[0].startsWith('http') ? b.images[0] : `${API_BASE}/${b.images[0].replace(/^\//, '')}`) : null;
const fmt = (n) => Number(n).toLocaleString('vi-VN') + '₫';


export default function Home() {
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [topBooks, setTopBooks] = useState([]);
    const [cats, setCats] = useState([]);

    useEffect(() => {
        booksAPI.getAll({ limit: 8, sort: '-createdAt' }).then(r => {
            if (r.data.success) setFeaturedBooks(r.data.data.books);
        }).catch(() => { });
        booksAPI.getAll({ limit: 5, sort: '-soldCount' }).then(r => {
            if (r.data.success) setTopBooks(r.data.data.books);
        }).catch(() => { });
        categoriesAPI.getAll().then(r => {
            if (r.data.success) setCats(r.data.data.categories.slice(0, 6));
        }).catch(() => { });
    }, []);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="overflow-hidden">

            {/* ═══════════════════════════════════════════════════
                HERO — Modern 3D Stitch-inspired
            ═══════════════════════════════════════════════════ */}
            <section className="relative min-h-[80vh] md:min-h-[92vh] flex items-center overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2E7D32] via-[#43A047] to-[#81C784]" />

                {/* Floating decorative elements */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                    {/* Floating book icons */}
                    <div className="absolute top-[8%] left-[5%] w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg animate-[float_6s_ease-in-out_infinite]">
                        <span className="material-symbols-outlined text-white text-2xl">menu_book</span>
                    </div>
                    <div className="absolute top-[15%] right-[8%] w-14 h-14 bg-[#8BC34A]/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg animate-[float_5s_ease-in-out_infinite_0.5s]">
                        <span className="material-symbols-outlined text-white text-3xl">view_in_ar</span>
                    </div>
                    <div className="absolute top-[60%] left-[3%] w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg animate-[float_7s_ease-in-out_infinite_1s]">
                        <span className="material-symbols-outlined text-white/80 text-xl">auto_stories</span>
                    </div>
                    <div className="absolute bottom-[20%] left-[12%] w-11 h-11 bg-[#66BB6A]/25 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg animate-[float_5.5s_ease-in-out_infinite_2s]">
                        <span className="material-symbols-outlined text-white/90 text-xl">qr_code_scanner</span>
                    </div>
                    <div className="absolute top-[35%] right-[3%] w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg animate-[float_6.5s_ease-in-out_infinite_1.5s]">
                        <span className="material-symbols-outlined text-white/70 text-xl">videocam</span>
                    </div>

                    {/* Scattered logos — spread evenly, more on right side */}
                    {[
                        { top: '8%', left: '22%', rotate: -20, size: 48 },
                        { top: '18%', left: '58%', rotate: 15, size: 55 },
                        { top: '6%', left: '82%', rotate: -35, size: 42 },
                        { top: '35%', left: '65%', rotate: 22, size: 60 },
                        { top: '50%', left: '80%', rotate: -12, size: 50 },
                        { top: '65%', left: '55%', rotate: 40, size: 45 },
                        { top: '45%', left: '92%', rotate: -28, size: 38 },
                        { top: '78%', left: '72%', rotate: 18, size: 52 },
                        { top: '75%', left: '20%', rotate: -25, size: 40 },
                        { top: '88%', left: '50%', rotate: 30, size: 46 },
                        { top: '55%', left: '40%', rotate: -45, size: 36 },
                        { top: '85%', left: '88%', rotate: 10, size: 44 },
                    ].map((l, i) => (
                        <img key={i} src="/logo.png" alt="" className="absolute opacity-[0.12]"
                            style={{ top: l.top, left: l.left, width: l.size, height: l.size, transform: `rotate(${l.rotate}deg)`, objectFit: 'contain' }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-6 md:px-16">
                    <div className="max-w-2xl space-y-6 text-center lg:text-left">

                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white leading-[1.08] tracking-tight">
                            Truyện Tranh<br />
                            <span className="text-[#C5E1A5]">Song Ngữ Cho Bé</span>
                        </h1>
                        <p className="text-lg text-white/80 leading-relaxed max-w-lg mx-auto lg:mx-0">
                            LingoLand phát triển và xuất bản sách truyện tranh song ngữ Anh-Việt cho trẻ em.
                            Gieo hạt ngôn ngữ từ những trang truyện đầy màu sắc — bé vừa đọc vừa học, tự nhiên và vui vẻ. 🌱
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start">
                            <Link to="/shop" className="px-8 py-3.5 bg-white hover:bg-gray-50 text-[#2E7D32] font-bold rounded-full shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                Khám Phá Bộ Sưu Tập <span className="material-symbols-outlined text-xl">arrow_forward</span>
                            </Link>
                            <Link to="/booklens" className="px-8 py-3.5 bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white font-bold rounded-full border border-white/25 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl">photo_camera</span> Thử BookLens
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
                    <span className="material-symbols-outlined text-white/40 text-3xl">expand_more</span>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                STATS — Social proof numbers
            ═══════════════════════════════════════════════════ */}
            <section className="py-10 bg-white border-b border-[#E8F5E9]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
                        {stats.map((s, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-3xl text-[#4CAF50]">{s.icon}</span>
                                <span className="text-2xl sm:text-3xl font-bold text-[#2B3A67]" style={{ fontFamily: "'Inter', 'Roboto', sans-serif" }}>
                                    {s.isText ? <>{s.value}{s.suffix}</> : <CountUp end={s.value} suffix={s.suffix} decimal={s.decimal} />}
                                </span>
                                <span className="text-sm text-gray-400">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                INTRO — Who is LingoLand?
            ═══════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#FAF5EB]">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <span className="text-sm font-bold text-[#8BC34A] uppercase tracking-widest">Về LingoLand</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2B3A67] leading-snug">
                            Mở trang sách nhỏ,<br className="hidden md:block" /> mở thế giới to
                        </h2>
                        <p className="text-gray-500 leading-relaxed text-lg">
                            LingoLand là một doanh nghiệp <strong className="text-[#2B3A67]">EdTech</strong> được thành lập với sứ mệnh phát triển nền tảng học ngôn ngữ sớm cho trẻ em,
                            tập trung vào nhóm tuổi từ 0 đến 6 tuổi - giai đoạn vàng trong quá trình hình thành và phát triển năng lực ngôn ngữ của trẻ nhỏ.
                        </p>
                        <p className="text-gray-500 leading-relaxed text-lg">
                            LingoLand hướng tới xây dựng một hệ sinh thái học tập kết hợp giữa sản phẩm vật lý và nền tảng số nhằm tạo ra các trải nghiệm học tập đa giác quan,
                            giúp trẻ tiếp thu ngôn ngữ một cách tự nhiên và từng bước hình thành nền tảng song ngữ - ngay từ những năm đầu đời. 🌱
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                CATEGORIES — Browse by genre
            ═══════════════════════════════════════════════════ */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <span className="text-xs font-bold text-[#8BC34A] uppercase tracking-widest">Khám Phá</span>
                            <h2 className="text-3xl font-display font-bold text-[#2B3A67] mt-1">Theo Độ Tuổi</h2>
                        </div>
                        <Link to="/shop" className="text-sm text-[#4CAF50] font-bold hover:underline flex items-center gap-1">
                            Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5">
                        {cats.map(cat => (
                            <Link to={`/shop?category=${cat.slug}`} key={cat._id} className="group flex flex-col items-center gap-3 py-6 rounded-2xl hover:bg-[#E8F5E9] transition-all duration-300">
                                <div className="w-16 h-16 bg-[#E8F5E9] group-hover:bg-[#4CAF50] rounded-2xl flex items-center justify-center text-[#4CAF50] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                                    <span className="material-symbols-outlined text-3xl">auto_stories</span>
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-[#2B3A67] text-center line-clamp-2">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                FEATURED BOOKS — Main product grid
            ═══════════════════════════════════════════════════ */}
            <section className="py-16 bg-[#FAF5EB]">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <span className="text-xs font-bold text-[#8BC34A] uppercase tracking-widest">Mới Nhất</span>
                            <h2 className="text-3xl font-display font-bold text-[#2B3A67] mt-1">Truyện Mới Ra Mắt</h2>
                        </div>
                        <Link to="/shop" className="px-5 py-2 border-2 border-[#2E7D32] text-[#2E7D32] rounded-full font-bold hover:bg-[#2E7D32] hover:text-white transition-all text-sm">
                            Xem Tất Cả
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {featuredBooks.map(book => (
                            <Link to={`/product/${book._id}`} key={book._id} className="bg-white rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border border-transparent hover:border-[#C5E0B4]">
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                                    {getImg(book) ? <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={getImg(book)} alt={book.title} /> : <div className="w-full h-full flex items-center justify-center text-[#8BC34A]"><span className="material-symbols-outlined text-5xl">menu_book</span></div>}
                                    {book.originalPrice && book.originalPrice > book.price && (
                                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-500">
                                            -{Math.round((1 - book.price / book.originalPrice) * 100)}%
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8BC34A]">{typeof book.genre?.[0] === 'object' ? book.genre[0].name : book.genre?.[0] || ''}</span>
                                    <h3 className="font-display font-bold text-[#2B3A67] mt-0.5 mb-1 line-clamp-1">{book.title}</h3>
                                    <p className="text-xs text-gray-400 mb-2">{book.author}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-[#2E7D32]">{fmt(book.price)}</span>
                                        <div className="flex items-center gap-1 text-[#FFB74D]">
                                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="text-xs font-bold text-gray-500">{book.rating || '—'}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                HOW AR WORKS — Step-by-step
            ═══════════════════════════════════════════════════ */}
            <section className="py-20 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C] text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-sm font-bold text-[#8BC34A] uppercase tracking-widest">Dễ Dàng & Nhanh Chóng</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
                            AR Hoạt Động Như Thế Nào?
                        </h2>
                        <p className="text-[#C5E0B4] max-w-xl mx-auto leading-relaxed">
                            Chỉ với 3 bước đơn giản, bạn có thể biến bất kỳ cuốn sách nào thành trải nghiệm tương tác sống động.
                            Không cần thiết bị đặc biệt — chỉ cần điện thoại và cuốn sách LingoLand.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {arSteps.map((s, i) => (
                            <div key={i} className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:bg-white/15 transition-all group">
                                <span className="text-6xl font-display font-bold text-white/10 absolute top-4 right-6">{s.step}</span>
                                <div className="w-16 h-16 rounded-2xl bg-[#8BC34A]/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-[#8BC34A]/30 transition-colors">
                                    <span className="material-symbols-outlined text-3xl text-[#8BC34A]">{s.icon}</span>
                                </div>
                                <h3 className="font-display font-bold text-xl mb-3">{s.title}</h3>
                                <p className="text-[#C5E0B4] text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/booklens" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#8BC34A] text-[#1B5E20] font-display font-bold rounded-full shadow-lg hover:-translate-y-0.5 transition-all">
                            <span className="material-symbols-outlined">qr_code_scanner</span> Thử Ngay Bây Giờ
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                WHY LINGOLAND — Feature deep-dive
            ═══════════════════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-xs font-bold text-[#8BC34A] uppercase tracking-widest">Tại Sao Chọn Chúng Tôi</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2B3A67] mt-2 mb-4">
                            Không Chỉ Là Nhà Sách
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            LingoLand được xây dựng với sứ mệnh mang đến trải nghiệm đọc sách tốt nhất cho thế hệ tương lai.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {features.map((f, i) => (
                            <div key={i} className="flex gap-5 p-6 rounded-2xl hover:bg-[#FAFAFA] transition-colors group">
                                <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: f.color + '18' }}>
                                    <span className="material-symbols-outlined text-3xl" style={{ color: f.color }}>{f.icon}</span>
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-[#2B3A67] text-lg mb-2">{f.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                WHY LINGOLAND — Strengths & advantages
            ═══════════════════════════════════════════════════ */}
            <section className="py-16 bg-[#FAF5EB]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-xs font-bold text-[#8BC34A] uppercase tracking-widest">Thế Mạnh</span>
                        <h2 className="text-3xl font-display font-bold text-[#2B3A67] mt-2">Tại Sao Chọn LingoLand?</h2>
                        <p className="text-gray-400 mt-3 max-w-lg mx-auto">
                            Không chỉ là một nhà sách — LingoLand mang đến trải nghiệm đọc sách hoàn toàn mới.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { icon: 'local_shipping', title: 'Giao Hàng Nhanh', desc: 'Miễn phí giao hàng toàn quốc cho đơn từ 200K. Nhận sách trong 1–3 ngày.', color: '#4CAF50' },
                            { icon: 'verified', title: 'Cam Kết Chính Hãng', desc: '100% sách bản quyền, nguồn gốc rõ ràng từ các NXB uy tín hàng đầu Việt Nam.', color: '#2196F3' },
                            { icon: 'payments', title: 'Giá Cả Minh Bạch', desc: 'Giá niêm yết chuẩn NXB, thường xuyên có chương trình ưu đãi lên đến 50%.', color: '#FF9800' },
                            { icon: 'support_agent', title: 'Hỗ Trợ Tận Tâm', desc: 'Đội ngũ tư vấn sách nhiệt tình, sẵn sàng giúp bạn tìm cuốn sách phù hợp nhất.', color: '#E91E63' },
                            { icon: 'view_in_ar', title: 'Công Nghệ AR', desc: 'Trải nghiệm sách tương tác với công nghệ thực tế tăng cường — sống động và khác biệt.', color: '#9C27B0' },
                            { icon: 'eco', title: 'Xanh & Bền Vững', desc: 'Sách in giấy tái chế, đóng gói thân thiện môi trường. Mỗi đơn hàng = 1 cây xanh.', color: '#009688' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${item.color}15` }}>
                                    <span className="material-symbols-outlined text-2xl" style={{ color: item.color }}>{item.icon}</span>
                                </div>
                                <h3 className="font-bold text-[#2B3A67] text-lg mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                WEEKLY TOP — Bestseller sidebar list
            ═══════════════════════════════════════════════════ */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="text-xs font-bold text-[#8BC34A] uppercase tracking-widest">Bảng Xếp Hạng</span>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2B3A67] leading-snug">
                                Top 5 Sách<br />Bán Chạy Nhất
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Những cuốn truyện tranh song ngữ được các bậc phụ huynh và các bé
                                yêu thích nhất. Đừng bỏ lỡ những cuốn sách đang tạo nên xu hướng!
                            </p>

                        </div>
                        <div className="space-y-4">
                            {topBooks.map((book, i) => (
                                <Link to={`/product/${book._id}`} key={book._id} className="flex items-center gap-4 bg-[#FAFAFA] rounded-xl p-3 hover:bg-[#E8F5E9] transition-colors group cursor-pointer">
                                    <span className="text-2xl font-display font-bold text-[#C5E0B4] w-8 text-center group-hover:text-[#4CAF50] transition-colors">
                                        {i + 1}
                                    </span>
                                    {getImg(book) ? <img className="w-14 h-14 rounded-lg object-cover flex-shrink-0" src={getImg(book)} alt={book.title} /> : <div className="w-14 h-14 rounded-lg bg-[#E8F5E9] flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-[#8BC34A]">menu_book</span></div>}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-[#2B3A67] truncate">{book.title}</h4>
                                        <p className="text-xs text-gray-400">{book.author}</p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-[#E8F5E9] px-2 py-1 rounded-full flex-shrink-0">
                                        <span className="material-symbols-outlined text-sm text-[#4CAF50]">local_fire_department</span>
                                        <span className="text-xs font-bold text-[#2E7D32]">{book.soldCount || 0} đã bán</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                TESTIMONIALS — Real voices
            ═══════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#FAF5EB]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-xs font-bold text-[#8BC34A] uppercase tracking-widest">Cộng Đồng</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2B3A67] mt-2 mb-4">
                            Khách Hàng Nói Gì?
                        </h2>
                        <p className="text-gray-400 max-w-lg mx-auto">
                            Hàng ngàn gia đình, giáo viên và học sinh đã tin tưởng LingoLand. Đây là những chia sẻ thực từ cộng đồng của chúng tôi.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-[#E8F5E9]">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center text-2xl">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#2B3A67]">{t.name}</h4>
                                        <p className="text-xs text-[#8BC34A] font-bold">{t.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5 mb-3">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <span key={s} className="material-symbols-outlined text-[#FFB74D] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    ))}
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed">"{t.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                SHIPPING & SUPPORT — Trust badges
            ═══════════════════════════════════════════════════ */}
            <section className="py-14 bg-white border-t border-[#E8F5E9]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: 'local_shipping', title: 'Miễn Phí Giao Hàng', desc: 'Đơn hàng từ 300.000đ trở lên được miễn phí vận chuyển trên toàn quốc.' },
                            { icon: 'shield', title: 'Bảo Hành Chất Lượng', desc: 'Sách lỗi, hỏng trong quá trình vận chuyển sẽ được đổi mới 100%.' },
                            { icon: 'support_agent', title: 'Hỗ Trợ 24/7', desc: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi lúc.' },
                            { icon: 'payments', title: 'Thanh Toán An Toàn', desc: 'Hỗ trợ nhiều hình thức: COD, chuyển khoản, ví điện tử MoMo, ZaloPay.' },
                        ].map((b, i) => (
                            <div key={i} className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#4CAF50]">
                                    <span className="material-symbols-outlined text-3xl">{b.icon}</span>
                                </div>
                                <h3 className="font-display font-bold text-[#2B3A67]">{b.title}</h3>
                                <p className="text-sm text-gray-400 max-w-[220px]">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                CTA — Minimalist with parallax
            ═══════════════════════════════════════════════════ */}
            <section className="py-24 relative overflow-hidden">
                {/* Parallax background circles */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#E8F5E9] rounded-full opacity-40" style={{ transform: `translateY(${scrollY * 0.08}px)` }} />
                    <div className="absolute top-10 right-10 w-40 h-40 bg-[#C5E0B4] rounded-full opacity-25" style={{ transform: `translateY(${scrollY * -0.05}px)` }} />
                    <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-[#A5D6A7] rounded-full opacity-20" style={{ transform: `translateY(${scrollY * 0.06}px)` }} />
                    <div className="absolute -bottom-10 right-1/4 w-32 h-32 bg-[#81C784] rounded-full opacity-15" style={{ transform: `translateY(${scrollY * -0.04}px)` }} />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-2xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
                            Hơn 120K+ độc giả tin dùng
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1B5E20] leading-tight">
                            Bắt đầu ngay hôm nay
                        </h2>
                        <p className="text-[#618961] text-lg leading-relaxed max-w-md mx-auto">
                            Khám phá thế giới sách AR — nơi mỗi trang sách mở ra một trải nghiệm sống động.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link to="/shop" className="group px-8 py-4 bg-[#2E7D32] text-white font-bold rounded-2xl shadow-lg shadow-[#2E7D32]/20 hover:shadow-xl hover:shadow-[#2E7D32]/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-xl group-hover:translate-x-0.5 transition-transform">shopping_bag</span>
                                Mua Sách Ngay
                            </Link>
                            <Link to="/booklens" className="group px-8 py-4 bg-white text-[#2E7D32] font-bold rounded-2xl border-2 border-[#C5E0B4] hover:border-[#4CAF50] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">view_in_ar</span>
                                Thử BookLens
                            </Link>
                        </div>
                        <div className="flex justify-center gap-8 pt-6 text-sm text-[#81C784]">
                            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">local_shipping</span> Freeship 300K+</span>
                            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">verified</span> AR độc quyền</span>
                            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">sync</span> Đổi trả dễ</span>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
