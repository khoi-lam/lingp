import { useState, useEffect, useRef } from 'react';
import { settingsAPI } from '../../services/api';
import { Toast, useToast } from '../../components/AdminPopups';

import { API_BASE } from '../../config.js';

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        bankName: '', bankAccount: '', bankHolder: '', bankContent: '', bankQR: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [qrFile, setQrFile] = useState(null);
    const [qrPreview, setQrPreview] = useState('');
    const fileRef = useRef(null);
    const { toast, showToast, closeToast } = useToast();

    useEffect(() => {
        settingsAPI.get().then(({ data }) => {
            if (data.success) setSettings(s => ({ ...s, ...data.data.settings }));
        }).catch(() => showToast('Lỗi tải cài đặt', 'error'))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(s => ({ ...s, [name]: value }));
    };

    const handleQRFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setQrFile(file);
        setQrPreview(URL.createObjectURL(file));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // If QR image selected, upload it first
            if (qrFile) {
                const fd = new FormData();
                fd.append('images', qrFile);
                const uploadRes = await fetch(`${API_BASE}/api/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                    body: fd,
                });
                const uploadData = await uploadRes.json();
                if (uploadData.success && uploadData.data?.urls?.length) {
                    settings.bankQR = uploadData.data.urls[0];
                }
            }
            await settingsAPI.update(settings);
            showToast('Đã lưu cài đặt thành công!');
            setQrFile(null);
        } catch { showToast('Lỗi lưu cài đặt', 'error'); }
        finally { setSaving(false); }
    };

    const inputClass = 'w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] transition-all';

    if (loading) return <div className="flex items-center justify-center py-20"><span className="material-symbols-outlined text-4xl animate-spin text-[#0ea00e]">progress_activity</span></div>;

    const currentQR = qrPreview || (settings.bankQR ? `${API_BASE}/${settings.bankQR.replace(/^\//, '')}` : '');

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#111811] tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0ea00e]">settings</span>
                    Cài Đặt
                </h1>
                <p className="text-[#618961] mt-1">Quản lý thông tin thanh toán.</p>
            </div>

            <form onSubmit={handleSave} className="max-w-2xl space-y-6">
                {/* Payment Account */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-[#111811] mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#0ea00e]">account_balance</span>
                        Tài khoản nhận tiền
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#618961] mb-1">Tên ngân hàng</label>
                            <input name="bankName" value={settings.bankName} onChange={handleChange} placeholder="VD: Vietcombank, MB Bank, Techcombank..." className={inputClass} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#618961] mb-1">Số tài khoản</label>
                                <input name="bankAccount" value={settings.bankAccount} onChange={handleChange} placeholder="VD: 0123456789" className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#618961] mb-1">Tên chủ tài khoản</label>
                                <input name="bankHolder" value={settings.bankHolder} onChange={handleChange} placeholder="VD: NGUYEN VAN A" className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#618961] mb-1">Nội dung chuyển khoản</label>
                            <input name="bankContent" value={settings.bankContent} onChange={handleChange} placeholder="VD: LINGOLAND {mã đơn hàng}" className={inputClass} />
                        </div>

                        {/* QR Upload */}
                        <div>
                            <label className="block text-sm font-medium text-[#618961] mb-2">Mã QR chuyển khoản</label>
                            <div className="flex items-start gap-4">
                                {/* Preview */}
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="w-40 h-40 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0ea00e] flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-[#E8F5E9]/30 transition-all overflow-hidden group"
                                >
                                    {currentQR ? (
                                        <img src={currentQR} alt="QR" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-center text-gray-400 group-hover:text-[#0ea00e] transition-colors">
                                            <span className="material-symbols-outlined text-3xl block mb-1">qr_code</span>
                                            <span className="text-xs font-medium">Tải QR lên</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleQRFile}
                                    className="hidden"
                                />
                                <div className="flex-1 pt-2">
                                    <p className="text-xs text-[#618961] leading-relaxed">
                                        Tải lên mã QR ngân hàng để khách hàng quét thanh toán.
                                        <br />Hỗ trợ PNG, JPG, WebP.
                                    </p>
                                    {currentQR && (
                                        <button
                                            type="button"
                                            onClick={() => fileRef.current?.click()}
                                            className="mt-2 text-xs text-[#0ea00e] font-bold hover:underline flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">upload</span>
                                            Thay đổi QR
                                        </button>
                                    )}
                                    {qrFile && (
                                        <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">check_circle</span>
                                            {qrFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={saving} className="w-full py-3 bg-[#0ea00e] text-white font-bold rounded-full shadow-lg shadow-[#0ea00e]/20 hover:brightness-95 transition-all disabled:opacity-60">
                    {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
                </button>
            </form>

            <Toast {...toast} onClose={closeToast} />
        </div>
    );
}
