import { useState, useEffect, useCallback } from 'react';

/* ─── Confirm Modal ────────────────────────────── */
export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = 'Xác nhận', cancelText = 'Huỷ', danger = false }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-[popIn_.2s_ease]" onClick={e => e.stopPropagation()}>
                <div className="p-6 text-center">
                    <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${danger ? 'bg-red-50' : 'bg-[#0ea00e]/10'}`}>
                        <span className={`material-symbols-outlined text-3xl ${danger ? 'text-red-500' : 'text-[#0ea00e]'}`}>
                            {danger ? 'warning' : 'help'}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111811] mb-2">{title}</h3>
                    <p className="text-sm text-[#618961] leading-relaxed">{message}</p>
                </div>
                <div className="flex gap-3 p-5 pt-0">
                    <button onClick={onClose} className="flex-1 py-3 rounded-full border border-gray-200 text-[#618961] font-medium hover:bg-gray-50 transition-colors text-sm">
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} className={`flex-1 py-3 rounded-full font-bold text-white text-sm transition-all ${danger ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20' : 'bg-[#0ea00e] hover:brightness-110 shadow-lg shadow-[#0ea00e]/20'}`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Toast Notification ───────────────────────── */
export function Toast({ message, type = 'success', open, onClose }) {
    useEffect(() => {
        if (open) {
            const t = setTimeout(onClose, 3000);
            return () => clearTimeout(t);
        }
    }, [open, onClose]);

    if (!open) return null;

    const styles = {
        success: { bg: 'bg-[#0ea00e]', icon: 'check_circle' },
        error: { bg: 'bg-red-500', icon: 'error' },
        info: { bg: 'bg-blue-500', icon: 'info' },
    };
    const s = styles[type] || styles.success;

    return (
        <div className="fixed top-6 right-6 z-[60] animate-[slideIn_.3s_ease]">
            <div className={`${s.bg} text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 min-w-[280px]`}>
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                <span className="text-sm font-medium flex-1">{message}</span>
                <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors shrink-0">
                    <span className="material-symbols-outlined text-base">close</span>
                </button>
            </div>
        </div>
    );
}

/* ─── Form Modal (generic wrapper) ─────────────── */
export function FormModal({ open, onClose, title, icon, children, onSubmit, submitText = 'Lưu', submitDanger = false }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-[popIn_.2s_ease]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-[#0ea00e]/10">
                            <span className="material-symbols-outlined text-[#0ea00e]">{icon || 'edit'}</span>
                        </div>
                        <h3 className="font-bold text-[#111811] text-lg">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="material-symbols-outlined text-gray-400">close</span>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {children}
                </div>
                <div className="flex gap-3 p-6 pt-0">
                    <button onClick={onClose} className="flex-1 py-3 rounded-full border border-gray-200 text-[#618961] font-medium hover:bg-gray-50 transition-colors text-sm">
                        Huỷ
                    </button>
                    <button onClick={onSubmit} className={`flex-1 py-3 rounded-full font-bold text-white text-sm transition-all ${submitDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-[#0ea00e] hover:brightness-110 shadow-lg shadow-[#0ea00e]/20'}`}>
                        {submitText}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Custom hook for toast ────────────────────── */
export function useToast() {
    const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
    const showToast = useCallback((message, type = 'success') => {
        setToast({ open: true, message, type });
    }, []);
    const closeToast = useCallback(() => {
        setToast(prev => ({ ...prev, open: false }));
    }, []);
    return { toast, showToast, closeToast };
}
