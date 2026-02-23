import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ordersAPI } from '../services/api';
import SearchableSelect from '../components/SearchableSelect';

const API_V2 = 'https://provinces.open-api.vn/api/v2';

export default function Checkout() {
    const { items, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderId, setOrderId] = useState(null);
    const [step, setStep] = useState('form'); // form → payment → success
    const orderCode = orderId ? orderId.slice(-8).toUpperCase() : '';

    // Address state — v2: Province → Ward (no district)
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [loadingWards, setLoadingWards] = useState(false);

    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        address: '',
        note: '',
    });

    const shipping = cartTotal > 300000 ? 0 : 30000;
    const total = cartTotal + shipping;
    const fmt = (n) => Number(n).toLocaleString('vi-VN') + '₫';
    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    // Fetch 34 provinces on mount
    useEffect(() => {
        fetch(`${API_V2}/p/`)
            .then(r => r.json())
            .then(data => setProvinces(data))
            .catch(() => { });
    }, []);

    // Fetch wards when province changes (depth=2)
    useEffect(() => {
        setWards([]);
        setSelectedWard('');
        if (!selectedProvince) return;
        setLoadingWards(true);
        fetch(`${API_V2}/p/${selectedProvince}?depth=2`)
            .then(r => r.json())
            .then(data => setWards(data.wards || []))
            .catch(() => { })
            .finally(() => setLoadingWards(false));
    }, [selectedProvince]);

    // Build full address string
    const getFullAddress = () => {
        const parts = [form.address];
        const ward = wards.find(w => String(w.code) === String(selectedWard));
        const province = provinces.find(p => String(p.code) === String(selectedProvince));
        if (ward) parts.push(ward.name);
        if (province) parts.push(province.name);
        return parts.filter(Boolean).join(', ');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.fullName || !form.phone || !form.address || !selectedProvince || !selectedWard) {
            setError('Vui lòng điền đầy đủ thông tin giao hàng');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const orderData = {
                items: items.map(i => ({ product: i._id, title: i.title, quantity: i.quantity, price: i.price })),
                totalAmount: total,
                shippingAddress: {
                    fullName: form.fullName,
                    phone: form.phone,
                    address: getFullAddress(),
                    city: provinces.find(p => String(p.code) === String(selectedProvince))?.name || '',
                    note: form.note,
                },
                paymentMethod: 'transfer',
            };
            const res = await ordersAPI.create(orderData);
            const newId = res.data?.data?._id || res.data?._id || res.data?.data?.order?._id;
            setOrderId(newId);
            setStep('payment');
            clearCart();
        } catch (err) {
            setError(err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
        } finally { setLoading(false); }
    };

    // === STEP 3: Success — after user confirms payment ===
    if (orderId && step === 'success') {
        return (
            <div className="container mx-auto px-4 py-12 max-w-md text-center">
                <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-4xl text-[#4CAF50]">verified</span>
                </div>
                <h1 className="text-2xl font-display font-bold text-[#2B3A67] mb-2">Thanh Toán Thành Công!</h1>
                <p className="text-gray-400 mb-1">Mã đơn hàng: <span className="font-mono font-bold text-[#2E7D32]">{orderCode}</span></p>
                <p className="text-sm text-gray-400 mb-8">Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ sớm liên hệ xác nhận.</p>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8F5E9] mb-6">
                    <div className="flex items-center gap-3 justify-center">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-yellow-600">schedule</span>
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-[#2B3A67]">Đang chờ xử lý</p>
                            <p className="text-xs text-gray-400">Admin sẽ xác nhận đơn hàng sớm nhất</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link to="/orders" className="flex-1 py-3 bg-[#4CAF50] text-white font-bold rounded-2xl text-center hover:bg-[#388E3C] transition-colors">
                        Xem Đơn Hàng
                    </Link>
                    <Link to="/shop" className="flex-1 py-3 bg-gray-100 text-[#2B3A67] font-bold rounded-2xl text-center hover:bg-gray-200 transition-colors">
                        Tiếp Tục Mua
                    </Link>
                </div>
            </div>
        );
    }

    // === STEP 2: Payment info — after order created ===
    if (orderId && step === 'payment') {
        return (
            <div className="container mx-auto px-4 py-8 max-w-lg">
                <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-3">
                        <span className="material-symbols-outlined text-2xl text-[#4CAF50]">account_balance</span>
                    </div>
                    <h1 className="text-2xl font-display font-bold text-[#2B3A67]">Chuyển Khoản Thanh Toán</h1>
                    <p className="text-gray-400 mt-1 text-sm">Mã đơn: <span className="font-mono font-bold text-[#2E7D32]">{orderCode}</span></p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#C5E0B4]">
                    {/* QR Code */}
                    <div className="flex justify-center mb-4">
                        <div className="w-52 h-52 rounded-xl overflow-hidden border-2 border-[#E8F5E9] bg-white p-2">
                            <img
                                src={`https://img.vietqr.io/image/VCB-1234567890-compact.png?amount=${total}&addInfo=${orderCode}`}
                                alt="QR Thanh toán"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                    <p className="text-center text-lg font-bold text-[#2E7D32] mb-4">{fmt(total)}</p>

                    {/* Bank details */}
                    <div className="space-y-2">
                        {[
                            { label: 'Ngân hàng', value: 'Vietcombank (VCB)' },
                            { label: 'Số tài khoản', value: '1234567890', copy: true },
                            { label: 'Chủ TK', value: 'NGUYEN VAN A' },
                            { label: 'Số tiền', value: fmt(total), copy: true, raw: String(total) },
                            { label: 'Nội dung CK', value: orderCode, copy: true, highlight: true },
                        ].map((item, i) => (
                            <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${item.highlight ? 'bg-[#E8F5E9] border border-[#C5E0B4]' : 'bg-gray-50'}`}>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{item.label}</p>
                                    <p className={`text-sm font-bold ${item.highlight ? 'text-[#2E7D32] font-mono' : 'text-[#2B3A67]'}`}>{item.value}</p>
                                </div>
                                {item.copy && (
                                    <button onClick={() => navigator.clipboard.writeText(item.raw || item.value)} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors" title="Sao chép">
                                        <span className="material-symbols-outlined text-sm text-gray-400">content_copy</span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-gray-400 mt-4 text-center flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#FF9800]">info</span>
                        Chuyển khoản đúng nội dung để xác nhận đơn hàng
                    </p>
                </div>

                <button
                    onClick={() => setStep('success')}
                    className="w-full mt-6 py-4 bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
                >
                    <span className="material-symbols-outlined">check</span> Đã Thanh Toán
                </button>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <span className="material-symbols-outlined text-[100px] text-[#C5E0B4] mb-4 block">remove_shopping_cart</span>
                <h2 className="text-2xl font-display font-bold text-[#2B3A67] mb-4">Giỏ hàng trống</h2>
                <Link to="/shop" className="px-8 py-3 bg-[#4CAF50] text-white font-bold rounded-full inline-block">Quay lại cửa hàng</Link>
            </div>
        );
    }

    const selectClass = "w-full rounded-2xl border border-gray-200 bg-[#FAF5EB] py-3 px-4 pr-10 focus:border-[#4CAF50] focus:ring-[#4CAF50] focus:outline-none appearance-none text-[#2B3A67]";
    const inputClass = "w-full rounded-2xl border border-gray-200 bg-[#FAF5EB] py-3 px-4 focus:border-[#4CAF50] focus:ring-[#4CAF50] focus:outline-none";

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[#2B3A67] mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-[#4CAF50]">payments</span> Thanh Toán
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                {/* Shipping Info */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8F5E9]">
                        <h2 className="text-xl font-display font-bold text-[#2E7D32] mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#8BC34A]">local_shipping</span> Thông Tin Giao Hàng
                        </h2>
                        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-bold text-[#2E7D32] mb-1.5">Họ và Tên *</label>
                                <input name="fullName" value={form.fullName} onChange={handleChange} className={inputClass} placeholder="Nguyễn Văn A" />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-bold text-[#2E7D32] mb-1.5">Số Điện Thoại *</label>
                                <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} type="tel" />
                            </div>

                            {/* Province */}
                            <div>
                                <label className="block text-sm font-bold text-[#2E7D32] mb-1.5">Tỉnh / Thành phố *</label>
                                <SearchableSelect
                                    options={provinces}
                                    value={selectedProvince}
                                    onChange={setSelectedProvince}
                                    placeholder="-- Chọn Tỉnh/Thành phố --"
                                />
                            </div>

                            {/* Ward — directly under Province in v2 */}
                            <div>
                                <label className="block text-sm font-bold text-[#2E7D32] mb-1.5">Phường / Xã *</label>
                                <SearchableSelect
                                    options={wards}
                                    value={selectedWard}
                                    onChange={setSelectedWard}
                                    placeholder={loadingWards ? 'Đang tải...' : '-- Chọn Phường/Xã --'}
                                    disabled={!selectedProvince || loadingWards}
                                />
                            </div>

                            {/* Street address */}
                            <div>
                                <label className="block text-sm font-bold text-[#2E7D32] mb-1.5">Địa chỉ cụ thể *</label>
                                <input name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="Số nhà, tên đường, tòa nhà..." />
                            </div>

                            {/* Note */}
                            <div>
                                <label className="block text-sm font-bold text-[#2E7D32] mb-1.5">Ghi Chú</label>
                                <textarea name="note" value={form.note} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Ghi chú thêm cho shipper..." />
                            </div>
                        </div>
                    </div>

                </div>
                {/* Order Summary */}
                <div className="lg:w-[380px] flex-shrink-0">
                    <div className="sticky top-24 bg-white rounded-xl p-6 shadow-lg border border-[#C5E0B4]">
                        <h3 className="text-xl font-display font-bold text-[#2B3A67] mb-4 pb-4 border-b border-[#E8F5E9]">Đơn Hàng ({items.length} sản phẩm)</h3>
                        <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                            {items.map(item => (
                                <div key={item._id} className="flex items-center gap-3">
                                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-[#E8F5E9] flex-shrink-0">
                                        {item.image ? <img className="w-full h-full object-cover" src={item.image} alt={item.title} /> : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-[#8BC34A]">menu_book</span></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[#2B3A67] truncate">{item.title}</p>
                                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                                    </div>
                                    <span className="text-sm font-bold text-[#2E7D32]">{fmt(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2 py-4 border-t border-[#E8F5E9]">
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Tạm tính</span><span className="font-semibold text-[#2E7D32]">{fmt(cartTotal)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Phí ship</span><span className={`font-semibold ${shipping === 0 ? 'text-[#4CAF50]' : 'text-[#2E7D32]'}`}>{shipping === 0 ? 'Miễn phí' : fmt(shipping)}</span></div>
                        </div>
                        <div className="flex justify-between items-end pt-4 border-t border-[#C5E0B4] mb-6">
                            <span className="font-bold text-[#2B3A67]">Tổng cộng</span>
                            <span className="text-2xl font-display font-bold text-[#388E3C]">{fmt(total)}</span>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold py-4 rounded-2xl shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                            {loading ? (
                                <><span className="material-symbols-outlined animate-spin">progress_activity</span> Đang xử lý...</>
                            ) : (
                                <><span className="material-symbols-outlined">shopping_cart_checkout</span> Đặt Hàng</>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
