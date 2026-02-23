import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import jsQR from 'jsqr';
import { bookLensAPI } from '../services/api';
import { API_BASE } from '../config.js';

const logoUrl = '/logo.png';

export default function ARScanner() {
    const [searchParams] = useSearchParams();
    const autoVideoId = searchParams.get('id');

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const overlayVideoRef = useRef(null);

    const [cameraActive, setCameraActive] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const [facingMode, setFacingMode] = useState('environment');
    const [scanning, setScanning] = useState(false);

    // Video overlay state
    const [activeVideo, setActiveVideo] = useState(null); // { id, videoSrc, title }
    const [qrVisible, setQrVisible] = useState(false);

    // Toast state
    const [toast, setToast] = useState(null); // { message, type: 'error' | 'success' | 'info' }

    const streamRef = useRef(null);
    const animFrameRef = useRef(null);
    const lostTimerRef = useRef(null);
    const lastVideoIdRef = useRef(null);
    const fetchingRef = useRef(false);
    const toastTimerRef = useRef(null);

    // ─── Toast helper ───
    const showToast = useCallback((message, type = 'error', duration = 3000) => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        setToast({ message, type });
        toastTimerRef.current = setTimeout(() => setToast(null), duration);
    }, []);

    // ─── Camera controls ───
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCameraActive(true);
            setActiveVideo(null);
            setQrVisible(false);
            lastVideoIdRef.current = null;
            startLiveScanning();
        } catch (err) {
            showToast('Không thể truy cập camera', 'error');
        }
    };

    const stopCamera = () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (lostTimerRef.current) clearTimeout(lostTimerRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraActive(false);
    };

    const flipCamera = () => {
        stopCamera();
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    const toggleFlash = async () => {
        if (streamRef.current) {
            const track = streamRef.current.getVideoTracks()[0];
            const capabilities = track.getCapabilities?.();
            if (capabilities?.torch) {
                await track.applyConstraints({ advanced: [{ torch: !flashOn }] });
                setFlashOn(!flashOn);
            } else {
                showToast('Đèn flash không khả dụng', 'info');
            }
        }
    };

    // ─── Extract BookLens ID from QR data ───
    const extractBookLensId = (data) => {
        try {
            // Try as URL first: .../watch/abc123
            const url = new URL(data);
            const match = url.pathname.match(/\/watch\/([a-f0-9]+)/i);
            if (match) return match[1];
        } catch {
            // Try as raw path: /watch/abc123
            const match = data.match(/\/watch\/([a-f0-9]+)/i);
            if (match) return match[1];
        }
        return null;
    };

    // ─── Fetch video data ───
    const fetchVideo = async (id) => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;
        try {
            const res = await bookLensAPI.getPublicVideo(id);
            if (res.data.success) {
                const video = res.data.data.video;
                const videoSrc = video.videoPath
                    ? (video.videoPath.startsWith('http') ? video.videoPath : `${API_BASE}/${video.videoPath.replace(/^\//, '')}`)
                    : null;
                if (videoSrc) {
                    setActiveVideo({ id, videoSrc, title: video.title });
                    lastVideoIdRef.current = id;
                } else {
                    showToast('Video chưa được tải lên', 'info');
                }
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Không tìm thấy video';
            showToast(msg, 'error');
            setActiveVideo(null);
            lastVideoIdRef.current = null;
        } finally {
            fetchingRef.current = false;
        }
    };

    // ─── Live camera QR scanning (never stops) ───
    const startLiveScanning = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        const tick = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'dontInvert',
                });

                if (code?.data) {
                    // QR detected in frame
                    if (lostTimerRef.current) {
                        clearTimeout(lostTimerRef.current);
                        lostTimerRef.current = null;
                    }
                    setQrVisible(true);

                    const bookLensId = extractBookLensId(code.data);
                    if (bookLensId) {
                        // Only fetch if it's a new video
                        if (lastVideoIdRef.current !== bookLensId) {
                            fetchVideo(bookLensId);
                        }
                    } else {
                        // Not a BookLens QR
                        if (!lastVideoIdRef.current) {
                            showToast('Mã QR không phải BookLens', 'error');
                        }
                    }
                } else {
                    // QR not visible — debounce 1s before hiding video
                    if (!lostTimerRef.current) {
                        lostTimerRef.current = setTimeout(() => {
                            setQrVisible(false);
                            lostTimerRef.current = null;
                        }, 1000);
                    }
                }
            }
            animFrameRef.current = requestAnimationFrame(tick);
        };
        animFrameRef.current = requestAnimationFrame(tick);
    };

    // ─── File upload QR scanning ───
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setScanning(true);

        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'attemptBoth',
            });

            if (code?.data) {
                const bookLensId = extractBookLensId(code.data);
                if (bookLensId) {
                    setQrVisible(true);
                    fetchVideo(bookLensId);
                    showToast('QR BookLens phát hiện từ ảnh!', 'success');
                } else {
                    showToast('Mã QR không phải BookLens', 'error');
                }
            } else {
                showToast('Không tìm thấy mã QR trong ảnh', 'error');
            }
            setScanning(false);
        };
        img.onerror = () => {
            showToast('Không thể đọc file ảnh', 'error');
            setScanning(false);
        };
        img.src = URL.createObjectURL(file);
        e.target.value = '';
    };

    // ─── Auto-play/pause overlay video based on QR visibility ───
    useEffect(() => {
        const vid = overlayVideoRef.current;
        if (!vid) return;
        if (qrVisible && activeVideo) {
            vid.play().catch(() => { });
        } else {
            vid.pause();
        }
    }, [qrVisible, activeVideo]);

    // Clear video when QR lost for a while
    useEffect(() => {
        if (!qrVisible) {
            const timer = setTimeout(() => {
                setActiveVideo(null);
                lastVideoIdRef.current = null;
            }, 3000); // Clear fully after 3s of no QR
            return () => clearTimeout(timer);
        }
    }, [qrVisible]);

    // Auto-load video from URL param (from /watch/:id redirect)
    useEffect(() => {
        if (autoVideoId && !activeVideo) {
            setQrVisible(true);
            fetchVideo(autoVideoId);
        }
    }, [autoVideoId]);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [facingMode]);

    const showVideoOverlay = activeVideo && (qrVisible || autoVideoId);

    return (
        <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
            {/* Hidden canvas for QR decoding */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                    <img src={logoUrl} alt="LingoLand" className="h-10 w-auto drop-shadow-2xl" />
                    <div className="flex items-center gap-[2px] h-6">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="w-[3px] bg-[#8BC34A] rounded-full"
                                style={{
                                    animation: `soundwave 1.2s ease-in-out ${i * 0.15}s infinite`,
                                    height: `${12 + Math.random() * 12}px`,
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-white/70 text-sm font-bold ml-1">BookLens</span>
                </div>
                <Link
                    to="/"
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors border border-white/10"
                >
                    <span className="material-symbols-outlined">close</span>
                </Link>
            </div>

            {/* ═══ Video Overlay ═══ */}
            {showVideoOverlay && (
                <div
                    className="absolute inset-0 z-30 flex items-center justify-center"
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                >
                    {/* Dark backdrop */}
                    <div className="absolute inset-0 bg-black/70" />

                    {/* Video container */}
                    <div className="relative w-[92%] max-w-lg" style={{ animation: 'scaleIn 0.3s ease-out' }}>
                        {/* Title badge */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                            <div className="flex items-center gap-2 bg-[#4CAF50] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                <span className="material-symbols-outlined text-sm">play_circle</span>
                                {activeVideo.title}
                            </div>
                        </div>

                        <video
                            ref={overlayVideoRef}
                            src={activeVideo.videoSrc}
                            autoPlay
                            playsInline
                            loop
                            className="w-full rounded-2xl shadow-2xl border-2 border-white/20"
                            style={{ maxHeight: '60vh' }}
                        />

                        {/* Hint */}
                        <p className="text-center text-white/60 text-xs mt-3">
                            <span className="material-symbols-outlined text-sm align-middle mr-1">qr_code_scanner</span>
                            Rời mã QR để dừng video
                        </p>
                    </div>
                </div>
            )}

            {/* ═══ Toast ═══ */}
            {toast && (
                <div
                    className="absolute top-20 left-1/2 -translate-x-1/2 z-50 max-w-[85%]"
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-md ${toast.type === 'error'
                        ? 'bg-red-500/90 text-white'
                        : toast.type === 'success'
                            ? 'bg-[#4CAF50]/90 text-white'
                            : 'bg-white/20 text-white border border-white/20'
                        }`}>
                        <span className="material-symbols-outlined text-base">
                            {toast.type === 'error' ? 'error' : toast.type === 'success' ? 'check_circle' : 'info'}
                        </span>
                        {toast.message}
                    </div>
                </div>
            )}

            {/* Scanning hint */}
            {!showVideoOverlay && !toast && (
                <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                    <span className="text-white/80 text-sm font-medium bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#8BC34A] text-base">qr_code_scanner</span>
                        {scanning ? 'Đang quét ảnh QR...' : 'Đưa mã QR vào khung hoặc tải ảnh QR lên'}
                    </span>
                </div>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 z-40 p-8">
                <div className="flex items-center justify-center gap-6">
                    <button
                        onClick={toggleFlash}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border border-white/10 ${flashOn ? 'bg-[#FFB74D] text-[#1B5E20]' : 'bg-white/15 backdrop-blur-md text-white hover:bg-white/25'
                            }`}
                    >
                        <span className="material-symbols-outlined text-2xl">{flashOn ? 'flash_on' : 'flash_off'}</span>
                    </button>

                    {/* Upload QR from device */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-16 h-16 rounded-full bg-[#4CAF50] flex items-center justify-center text-white shadow-lg shadow-[#4CAF50]/30 hover:brightness-110 transition-all border-2 border-white/20"
                        title="Tải ảnh QR từ thiết bị"
                    >
                        <span className="material-symbols-outlined text-3xl">image</span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    <button
                        onClick={flipCamera}
                        className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors border border-white/10"
                    >
                        <span className="material-symbols-outlined text-2xl">flip_camera_ios</span>
                    </button>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes soundwave {
                    0%, 100% { transform: scaleY(0.4); }
                    50% { transform: scaleY(1); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
