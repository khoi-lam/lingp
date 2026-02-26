import { useState } from 'react';
import { supportAPI } from '../services/api';

const faqItems = [
    { q: 'Thời gian giao hàng bao lâu?', a: 'Giao hàng tiêu chuẩn mất 3-5 ngày làm việc. Giao hàng nhanh trong 1-2 ngày làm việc.' },
    { q: 'Tôi có thể đổi trả sách không?', a: 'Có! Chúng tôi áp dụng chính sách đổi trả 30 ngày. Sách phải còn nguyên tình trạng ban đầu.' },
    { q: 'Có giao hàng quốc tế không?', a: 'Hiện tại chúng tôi chỉ giao hàng trong Việt Nam. Giao hàng quốc tế sẽ sớm ra mắt!' },
    { q: 'Làm thế nào để theo dõi đơn hàng?', a: 'Khi đơn hàng được giao, bạn sẽ nhận được email có mã theo dõi. Bạn cũng có thể kiểm tra trạng thái đơn hàng tại trang Đơn Hàng.' },
];

export default function Support() {
    const [openFaq, setOpenFaq] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', subject: 'Vấn Đề Đơn Hàng', message: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            setMsg('⚠️ Vui lòng điền đầy đủ thông tin');
            return;
        }
        setLoading(true);
        setMsg('');
        try {
            await supportAPI.create(form);
            setMsg('Đã gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.');
            setForm({ name: '', email: '', subject: 'Vấn Đề Đơn Hàng', message: '' });
        } catch (err) {
            setMsg('' + (err.response?.data?.message || 'Gửi thất bại. Vui lòng thử lại.'));
        } finally { setLoading(false); }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center mb-12">
                <span className="material-symbols-outlined text-6xl text-[#4CAF50] mb-4 block">support_agent</span>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-[#2B3A67] mb-2">Chúng tôi có thể giúp gì?</h1>
                <p className="text-[#388E3C] text-lg">Luôn sẵn sàng mang đến trải nghiệm đọc sách tuyệt vời cho bạn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Contact Form */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-[#E8F5E9]">
                    <h2 className="text-xl font-display font-bold text-[#2E7D32] mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#8BC34A]">mail</span> Gửi Tin Nhắn
                    </h2>
                    {msg && <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${msg.startsWith('Đã gửi') ? 'bg-[#E8F5E9] text-[#2E7D32]' : msg.startsWith('⚠') ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-600'}`}>{msg}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-[#2E7D32] mb-1.5 ml-1">Họ Tên</label>
                            <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-2xl border-gray-200 bg-[#FAF5EB] py-3 px-4 text-sm focus:border-[#4CAF50] focus:ring-[#4CAF50] transition-colors" placeholder="Nhập họ tên của bạn" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#2E7D32] mb-1.5 ml-1">Email</label>
                            <input name="email" value={form.email} onChange={handleChange} className="w-full rounded-2xl border-gray-200 bg-[#FAF5EB] py-3 px-4 text-sm focus:border-[#4CAF50] focus:ring-[#4CAF50] transition-colors" placeholder="email@example.com" type="email" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#2E7D32] mb-1.5 ml-1">Chủ Đề</label>
                            <select name="subject" value={form.subject} onChange={handleChange} className="w-full rounded-2xl border-gray-200 bg-[#FAF5EB] py-3 px-4 text-sm focus:border-[#4CAF50] focus:ring-[#4CAF50] transition-colors appearance-none">
                                <option>Vấn Đề Đơn Hàng</option>
                                <option>Hỏi Về Sản Phẩm</option>
                                <option>Yêu Cầu Đổi Trả</option>
                                <option>Khác</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#2E7D32] mb-1.5 ml-1">Nội Dung</label>
                            <textarea name="message" value={form.message} onChange={handleChange} className="w-full rounded-2xl border-gray-200 bg-[#FAF5EB] py-3 px-4 text-sm focus:border-[#4CAF50] focus:ring-[#4CAF50] transition-colors resize-none" rows="4" placeholder="Mô tả vấn đề của bạn..." />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold py-3 rounded-2xl shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60">
                            <span className="material-symbols-outlined">send</span> {loading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                        </button>
                    </form>
                </div>

                {/* FAQ */}
                <div className="space-y-4">
                    <h2 className="text-xl font-display font-bold text-[#2E7D32] mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#8BC34A]">help</span> Câu Hỏi Thường Gặp
                    </h2>
                    {faqItems.map((faq, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-[#E8F5E9] overflow-hidden transition-all">
                            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-4 text-left flex items-center justify-between hover:bg-[#E8F5E9] transition-colors">
                                <span className="font-bold text-[#2B3A67]">{faq.q}</span>
                                <span className={`material-symbols-outlined text-[#8BC34A] transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>
                            {openFaq === i && (
                                <div className="px-4 pb-4 text-[#388E3C] text-sm leading-relaxed border-t border-[#E8F5E9] pt-3">{faq.a}</div>
                            )}
                        </div>
                    ))}

                    <div className="bg-[#E8F5E9] rounded-lg p-6 mt-8">
                        <h3 className="font-display font-bold text-[#2E7D32] mb-4">Cách khác để liên hệ</h3>
                        <div className="space-y-3">
                            <a href="https://www.facebook.com/lingoland.vn/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#388E3C] hover:underline"><span className="material-symbols-outlined text-[#4CAF50]">public</span><span className="font-semibold">Facebook: LingoLand</span></a>
                            <div className="flex items-center gap-3 text-[#388E3C]"><span className="material-symbols-outlined text-[#4CAF50]">mail</span><span className="font-semibold">lingoland.vn@gmail.com</span></div>
                            <div className="flex items-center gap-3 text-[#388E3C]"><span className="material-symbols-outlined text-[#4CAF50]">schedule</span><span className="font-semibold">Thứ 2 - Thứ 7: 8:00 - 22:00</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
