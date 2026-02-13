import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-12 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Oops! Đã có lỗi xảy ra</h2>
                    <p className="text-gray-500 font-medium text-center max-w-md mb-8">
                        Ứng dụng gặp sự cố khi hiển thị nội dung này. Vui lòng thử tải lại trang hoặc liên hệ quản trị viên.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95"
                    >
                        Tải lại trang
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-8 p-4 bg-red-50 rounded-xl text-left w-full max-w-2xl border border-red-100">
                            <summary className="text-xs font-bold text-red-800 cursor-pointer uppercase tracking-widest">Chi tiết lỗi (Dev Mode)</summary>
                            <pre className="mt-4 text-xs text-red-700 overflow-auto whitespace-pre-wrap font-mono">
                                {this.state.error?.toString()}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
