import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookLensAPI } from '../services/api';

import { API_BASE } from '../config.js';

export default function WatchVideo() {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await bookLensAPI.getPublicVideo(id);
                if (res.data.success) setVideo(res.data.data.video);
            } catch (err) {
                setError(err.response?.data?.message || 'Video không tồn tại');
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-[#FAF5EB] flex items-center justify-center">
            <div className="text-center">
                <span className="material-symbols-outlined text-5xl animate-spin text-[#4CAF50]">progress_activity</span>
                <p className="text-[#618961] mt-3">Đang tải video...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#FAF5EB] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
                <span className="material-symbols-outlined text-6xl text-gray-300 block mb-4">videocam_off</span>
                <h2 className="text-xl font-bold text-[#111811] mb-2">{error}</h2>
                <p className="text-[#618961] mb-6">Video có thể chưa được xuất bản hoặc đã bị xoá.</p>
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4CAF50] text-white rounded-full font-bold hover:brightness-110 transition-all">
                    <span className="material-symbols-outlined text-base">home</span>
                    Về trang chủ
                </Link>
            </div>
        </div>
    );

    const videoSrc = video.videoPath ? `${API_BASE}/${video.videoPath.replace(/^\//, '')}` : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1B5E20] to-[#111811]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
                <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="text-sm font-medium">LingoLand</span>
                </Link>
                <div className="flex items-center gap-2 text-[#8BC34A]">
                    <span className="material-symbols-outlined text-base">photo_camera</span>
                    <span className="text-sm font-bold">BookLens</span>
                </div>
            </div>

            {/* Video Player */}
            <div className="max-w-4xl mx-auto px-4 pb-8">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video mb-6">
                    {videoSrc ? (
                        <video
                            src={videoSrc}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1B5E20]/80 to-[#2E7D32]/60">
                            <div className="text-center text-white">
                                <span className="material-symbols-outlined text-6xl mb-3 block">play_circle</span>
                                <p className="text-white/60">Video chưa được tải lên</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Video Info */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                    {video.book && (
                        <Link to={`/product/${video.book._id}`} className="inline-flex items-center gap-2 text-[#8BC34A] hover:underline mb-3">
                            <span className="material-symbols-outlined text-base">menu_book</span>
                            {video.book.title}
                        </Link>
                    )}
                    <div className="flex items-center gap-4 text-white/60 text-sm mt-3">
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">schedule</span>
                            {video.duration}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">visibility</span>
                            {video.views} lượt xem
                        </span>
                    </div>
                    {video.description && (
                        <p className="text-white/70 mt-4 leading-relaxed">{video.description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
