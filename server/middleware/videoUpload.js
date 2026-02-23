import multer from 'multer';
import os from 'os';
import path from 'path';

const storage = multer.diskStorage({
    destination: os.tmpdir(),
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const ext = path.extname(file.originalname);
        cb(null, `video-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file video (MP4, WebM, MOV, AVI)'), false);
    }
};

const videoUpload = multer({
    storage,
    limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
    fileFilter,
});

export default videoUpload;
