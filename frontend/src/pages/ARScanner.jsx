import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';

const logoUrl = '/logo.png';

export default function ARScanner() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const [cameraActive, setCameraActive] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const [facingMode, setFacingMode] = useState('environment');
    const [scanResult, setScanResult] = useState(null); // { url, source: 'camera' | 'file' }
    const [scanError, setScanError] = useState('');
    const [scanning, setScanning] = useState(false);
    const streamRef = useRef(null);
    const animFrameRef = useRef(null);

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
            setScanResult(null);
            setScanError('');
            startLiveScanning();
        } catch (err) {
            console.error('Không thể truy cập camera:', err);
        }
    };

    const stopCamera = () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
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
            }
        }
    };

    // ─── Live camera QR scanning ───
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
                    handleQRResult(code.data, 'camera');
                    return; // stop scanning on success
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
        setScanError('');
        setScanResult(null);

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
                handleQRResult(code.data, 'file');
            } else {
                setScanError('Không tìm thấy mã QR trong ảnh. Hãy thử ảnh khác.');
            }
            setScanning(false);
        };
        img.onerror = () => {
            setScanError('Không thể đọc file ảnh.');
            setScanning(false);
        };
        img.src = URL.createObjectURL(file);

        // Reset file input
        e.target.value = '';
    };

    // ─── Handle decoded QR ───
    const handleQRResult = (data, source) => {
        setScanResult({ url: data, source });

        // Auto-navigate if it's a /watch/ URL on our domain
        try {
            const url = new URL(data);
            const watchMatch = url.pathname.match(/\/watch\/([a-f0-9]+)/i);
            if (watchMatch) {
                stopCamera();
                navigate(`/watch/${watchMatch[1]}`);
                return;
            }
        } catch {
            // Not a valid URL, just show it
        }
    };

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [facingMode]);

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
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-5">
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

            {/* Scan Result Overlay */}
            {scanResult && (
                <div className="absolute inset-0 flex items-center justify-center z-20 p-6"
                    style={{ animation: 'fadeIn 0.4s ease-out' }}
                >
                    <div className="absolute top-20 left-1/2 -translate-x-1/2"
                        style={{ animation: 'fadeIn 0.3s ease-out' }}
                    >
                        <div className="flex items-center gap-2 bg-[#4CAF50] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            <span className="material-symbols-outlined text-base">qr_code_2</span>
                            QR Đã Phát Hiện — {scanResult.source === 'file' ? 'Từ ảnh' : 'Camera'}
                        </div>
                    </div>

                    <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 p-6"
                        style={{ animation: 'scaleIn 0.4s ease-out' }}
                    >
                        <div className="text-center text-white">
                            <span className="material-symbols-outlined text-5xl text-[#8BC34A] mb-3 block">link</span>
                            <p className="text-sm text-white/70 mb-2">Liên kết được phát hiện:</p>
                            <p className="text-lg font-bold break-all mb-4">{scanResult.url}</p>
                            <div className="flex gap-3 justify-center">
                                <a
                                    href={scanResult.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2.5 bg-[#4CAF50] text-white rounded-full text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-base">open_in_new</span>
                                    Mở liên kết
                                </a>
                                <button
                                    onClick={() => { setScanResult(null); if (!cameraActive) startCamera(); else startLiveScanning(); }}
                                    className="px-6 py-2.5 bg-white/20 text-white rounded-full text-sm font-bold hover:bg-white/30 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-base">qr_code_scanner</span>
                                    Quét tiếp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Scan Error */}
            {scanError && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30"
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                >
                    <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        <span className="material-symbols-outlined text-base">error</span>
                        {scanError}
                    </div>
                </div>
            )}

            {/* Scanning hint */}
            {!scanResult && !scanError && (
                <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                    <span className="text-white/80 text-sm font-medium bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#8BC34A] text-base">qr_code_scanner</span>
                        {scanning ? 'Đang quét ảnh QR...' : 'Đưa mã QR vào khung hoặc tải ảnh QR lên'}
                    </span>
                </div>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
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
