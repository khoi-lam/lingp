import React from 'react';

const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy bỏ',
    onConfirm,
    onCancel,
    type = 'danger'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onCancel}
            ></div>

            {/* Modal */}
            <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-gray-100 p-10 animate-in zoom-in-95 duration-300">
                <div className="space-y-6 text-center">
                    {/* Icon */}
                    <div className={`mx-auto w-16 h-16 rounded-3xl flex items-center justify-center ${type === 'danger' ? 'bg-red-50 text-fahasa-red' : 'bg-blue-50 text-blue-600'}`}>
                        {type === 'danger' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">{title}</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <div className="flex flex-col space-y-3 pt-2">
                        <button
                            onClick={onConfirm}
                            className={`w-full py-4 rounded-2xl font-black text-sm text-white transition-all shadow-xl shadow-opacity-20 active:scale-95 ${type === 'danger'
                                    ? 'bg-fahasa-red hover:bg-fahasa-red/90 shadow-fahasa-red/20'
                                    : 'bg-blue-600 hover:bg-blue-600/90 shadow-blue-600/20'
                                }`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onCancel}
                            className="w-full py-4 rounded-2xl font-black text-sm text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
