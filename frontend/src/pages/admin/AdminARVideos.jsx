import { useState, useEffect } from 'react';
import { bookLensAPI, booksAPI } from '../../services/api';
import { ConfirmModal, FormModal, Toast, useToast } from '../../components/AdminPopups';

import { API_BASE } from '../../config.js';
const statusStyle = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    archived: 'bg-gray-100 text-gray-500',
};
const statusLabel = { published: 'Đã xuất bản', draft: 'Nháp', archived: 'Lưu trữ' };

export default function AdminBookLens() {
    const [videos, setVideos] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [form, setForm] = useState({ title: '', book: '', duration: '', status: 'draft', description: '' });
    const [videoFile, setVideoFile] = useState(null);
    const { toast, showToast, closeToast } = useToast();

    const fetchData = async () => {
        try {
            const [vRes, bRes] = await Promise.all([bookLensAPI.getAll(), booksAPI.getAll({ limit: 200 })]);
            if (vRes.data.success) setVideos(vRes.data.data.videos);
            if (bRes.data.success) setBooks(bRes.data.data.books);
        } catch { showToast('Lỗi tải dữ liệu', 'error'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openAdd = () => { setForm({ title: '', book: '', duration: '', status: 'draft', description: '' }); setVideoFile(null); setFormOpen(true); };
    const openEdit = (v) => { setForm({ title: v.title, book: v.book?._id || '', duration: v.duration || '', status: v.status, description: v.description || '' }); setVideoFile(null); setEditTarget(v); };

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Upload video directly to Cloudinary, return secure_url
    const uploadToCloudinary = async (file) => {
        // Get signed params from backend
        const sigRes = await bookLensAPI.getUploadSignature();
        const { signature, timestamp, cloudName, apiKey, folder } = sigRes.data.data;

        const fd = new FormData();
        fd.append('file', file);
        fd.append('api_key', apiKey);
        fd.append('timestamp', timestamp);
        fd.append('signature', signature);
        fd.append('folder', folder);
        fd.append('resource_type', 'video');

        const xhr = new XMLHttpRequest();
        return new Promise((resolve, reject) => {
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
            };
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText);
                    resolve(result.secure_url);
                } else {
                    reject(new Error('Upload thất bại'));
                }
            };
            xhr.onerror = () => reject(new Error('Upload thất bại'));
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
            xhr.send(fd);
        });
    };

    const handleAdd = async () => {
        try {
            let videoUrl = '';
            if (videoFile) {
                setUploading(true);
                setUploadProgress(0);
                videoUrl = await uploadToCloudinary(videoFile);
            }
            await bookLensAPI.create({ ...form, videoUrl });
            setFormOpen(false);
            setUploading(false);
            showToast('Đã tạo video BookLens!');
            fetchData();
        } catch (err) {
            setUploading(false);
            showToast(err.response?.data?.message || err.message || 'Lỗi', 'error');
        }
    };

    const handleEdit = async () => {
        try {
            let videoUrl = '';
            if (videoFile) {
                setUploading(true);
                setUploadProgress(0);
                videoUrl = await uploadToCloudinary(videoFile);
            }
            await bookLensAPI.update(editTarget._id, { ...form, videoUrl });
            setEditTarget(null);
            setUploading(false);
            showToast('Đã cập nhật video');
            fetchData();
        } catch (err) {
            setUploading(false);
            showToast(err.response?.data?.message || err.message || 'Lỗi', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            await bookLensAPI.delete(deleteTarget._id);
            setDeleteTarget(null);
            showToast('Đã xoá video');
            fetchData();
        } catch { showToast('Lỗi', 'error'); }
    };

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const formFields = (
        <>
            <div>
                <label className="block text-sm font-medium text-[#618961] mb-1">Tiêu đề *</label>
                <input name="title" value={form.title} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811]" />
            </div>
            <div>
                <label className="block text-sm font-medium text-[#618961] mb-1">Sách liên kết</label>
                <select name="book" value={form.book} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811]">
                    <option value="">— Chọn sách —</option>
                    {books.map(b => <option key={b._id} value={b._id}>{b.title}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-[#618961] mb-1">
                    <span className="material-symbols-outlined text-base align-middle mr-1">upload_file</span>
                    File Video (MP4, WebM, MOV — tối đa 200MB)
                </label>
                <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setVideoFile(file);
                        // Auto-detect duration
                        const tempVideo = document.createElement('video');
                        tempVideo.preload = 'metadata';
                        tempVideo.onloadedmetadata = () => {
                            const secs = Math.round(tempVideo.duration);
                            const mins = Math.floor(secs / 60);
                            const remainingSecs = secs % 60;
                            setForm(f => ({ ...f, duration: `${mins}:${String(remainingSecs).padStart(2, '0')}` }));
                            URL.revokeObjectURL(tempVideo.src);
                        };
                        tempVideo.src = URL.createObjectURL(file);
                    }}
                    className="w-full h-12 px-4 py-2 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#0ea00e]/10 file:text-[#0ea00e]"
                />
                {videoFile && <p className="text-xs text-[#618961] mt-1">📹 {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)}MB)</p>}
                {uploading && (
                    <div className="mt-2">
                        <div className="flex items-center gap-2 text-xs text-[#0ea00e] font-bold mb-1">
                            <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                            Đang tải lên Cloudinary... {uploadProgress}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#0ea00e] h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                        </div>
                    </div>
                )}
                {editTarget?.videoPath && !videoFile && (
                    <p className="text-xs text-green-600 mt-1">✅ Video hiện tại — upload file mới để thay thế</p>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#618961] mb-1">Thời lượng {form.duration && '✅'}</label>
                    <input name="duration" value={form.duration} readOnly className="w-full h-12 px-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 text-[#111811] cursor-not-allowed" placeholder="Tự động từ video" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#618961] mb-1">Trạng thái</label>
                    <select name="status" value={form.status} onChange={handleChange} className="w-full h-12 px-4 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811]">
                        <option value="draft">Nháp</option>
                        <option value="published">Đã xuất bản</option>
                        <option value="archived">Lưu trữ</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-[#618961] mb-1">Mô tả</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl bg-white ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0ea00e] text-[#111811] resize-none" />
            </div>
        </>
    );

    if (loading) return <div className="flex items-center justify-center py-20"><span className="material-symbols-outlined text-4xl animate-spin text-[#0ea00e]">progress_activity</span></div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#111811] tracking-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#0ea00e]">photo_camera</span>
                        BookLens
                    </h1>
                    <p className="text-[#618961] mt-1">Quản lý video tương tác cho sách — quét QR để xem.</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2 bg-[#0ea00e] text-white rounded-full text-sm font-bold shadow-lg shadow-[#0ea00e]/20 hover:brightness-110 transition-all">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Tải video lên
                </button>
            </div>

            {videos.length === 0 ? (
                <div className="text-center py-20 text-[#618961]"><span className="material-symbols-outlined text-5xl mb-2 block">videocam</span><p>Chưa có video BookLens nào</p></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map(v => (
                        <div key={v._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                            {/* QR Code preview */}
                            {v.qrCodeUrl && (
                                <div className="bg-gradient-to-br from-[#E8F5E9] to-white p-4 flex items-center gap-4 border-b">
                                    <img
                                        src={v.qrCodeUrl.startsWith('http') ? v.qrCodeUrl : `${API_BASE}/${v.qrCodeUrl.replace(/^\//, '')}`}
                                        alt="QR Code"
                                        className="w-20 h-20 rounded-lg border-2 border-[#4CAF50]/20"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-[#618961] font-medium mb-1">Mã QR</p>
                                        <button
                                            onClick={async () => {
                                                const imgUrl = v.qrCodeUrl.startsWith('http') ? v.qrCodeUrl : `${API_BASE}/${v.qrCodeUrl.replace(/^\//, '')}`;
                                                const blob = await (await fetch(imgUrl)).blob();
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `qr-${v.title}.png`;
                                                a.click();
                                                URL.revokeObjectURL(url);
                                            }}
                                            className="inline-flex items-center gap-1 text-xs text-[#0ea00e] font-bold hover:underline"
                                        >
                                            <span className="material-symbols-outlined text-sm">download</span>
                                            Tải QR về
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <button
                                        onClick={() => v.videoPath && setPreviewVideo(v)}
                                        className={`p-3 rounded-xl transition-all ${v.videoPath ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer' : 'bg-gray-50 cursor-default'}`}
                                        title={v.videoPath ? 'Xem preview' : 'Chưa có video'}
                                    >
                                        <span className="material-symbols-outlined text-blue-600">{v.videoPath ? 'play_circle' : 'videocam'}</span>
                                    </button>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(v)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#0ea00e]"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                                        <button onClick={() => setDeleteTarget(v)} className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-[#111811] mb-1">{v.title}</h3>
                                <p className="text-sm text-[#618961] mb-3">{v.book?.title || '—'}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#618961]">{v.duration} • {v.views} lượt xem</span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${statusStyle[v.status]}`}>{statusLabel[v.status]}</span>
                                </div>
                                {v.videoPath && (
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-green-600 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">check_circle</span>
                                            {v.videoPath.split('/').pop()}
                                        </span>
                                        <button
                                            onClick={() => setPreviewVideo(v)}
                                            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">play_arrow</span>
                                            Xem
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <FormModal open={formOpen} onClose={() => setFormOpen(false)} title="Tải Video BookLens" icon="photo_camera" onSubmit={handleAdd} submitText="Tải lên">{formFields}</FormModal>
            <FormModal open={!!editTarget} onClose={() => setEditTarget(null)} title={`Sửa: ${editTarget?.title || ''}`} icon="edit" onSubmit={handleEdit} submitText="Lưu">{formFields}</FormModal>
            <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Xoá video?" message={`Xoá "${deleteTarget?.title}"?`} confirmText="Xoá" danger />
            <Toast {...toast} onClose={closeToast} />

            {/* Video Preview Modal */}
            {previewVideo && (
                <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setPreviewVideo(null)}>
                    <div className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
                            <h3 className="text-white font-bold text-lg truncate">{previewVideo.title}</h3>
                            <button onClick={() => setPreviewVideo(null)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>
                        <video
                            src={previewVideo.videoPath.startsWith('http') ? previewVideo.videoPath : `${API_BASE}/${previewVideo.videoPath.replace(/^\//, '')}`}
                            controls
                            autoPlay
                            className="w-full max-h-[70vh] object-contain"
                        />
                        <div className="p-4 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0">
                            <p className="text-white/70 text-sm">{previewVideo.book?.title || '—'} • {previewVideo.duration} • {previewVideo.views} lượt xem</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
