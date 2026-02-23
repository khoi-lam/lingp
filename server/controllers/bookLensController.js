import QRCode from 'qrcode';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';
import prisma from '../lib/prisma.js';

/**
 * Upload buffer to Cloudinary
 */
const uploadToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
        stream.end(buffer);
    });
};

/**
 * Generate QR code and upload to Cloudinary
 */
const generateQR = async (videoId) => {
    const watchUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/watch/${videoId}`;
    const qrBuffer = await QRCode.toBuffer(watchUrl, { width: 400, margin: 2, color: { dark: '#1B5E20', light: '#FFFFFF' } });
    const result = await uploadToCloudinary(qrBuffer, {
        folder: 'lingoland/qr',
        public_id: `qr-${videoId}`,
        resource_type: 'image',
        format: 'png',
        overwrite: true,
    });
    return result.secure_url;
};

function fmt(v) {
    return { _id: String(v.id), ...v, book: v.book ? { _id: String(v.book.id), title: v.book.title, author: v.book.author } : null };
}

export const getBookLensVideos = async (req, res, next) => {
    try {
        const videos = await prisma.bookLens.findMany({ include: { book: { select: { id: true, title: true, author: true } } }, orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: { videos: videos.map(fmt) } });
    } catch (error) { next(error); }
};

export const getBookLensById = async (req, res, next) => {
    try {
        const video = await prisma.bookLens.findUnique({ where: { id: parseInt(req.params.id) }, include: { book: { select: { id: true, title: true, author: true } } } });
        if (!video) return res.status(404).json({ success: false, message: 'Video không tồn tại' });
        res.json({ success: true, data: { video: fmt(video) } });
    } catch (error) { next(error); }
};

export const createBookLens = async (req, res, next) => {
    try {
        const { title, book, duration, status, description } = req.body;
        let videoPath = '';

        // Upload video to Cloudinary from temp disk file
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'lingoland/videos',
                resource_type: 'video',
            });
            videoPath = result.secure_url;
            // Cleanup temp file
            fs.unlink(req.file.path, () => { });
        }

        let video = await prisma.bookLens.create({
            data: { title, bookId: book ? parseInt(book) : null, videoPath, duration: duration || '0:00', status: status || 'draft', description: description || '' }
        });

        if (videoPath) {
            const qrCodeUrl = await generateQR(video.id);
            video = await prisma.bookLens.update({ where: { id: video.id }, data: { qrCodeUrl }, include: { book: { select: { id: true, title: true, author: true } } } });
        } else {
            video = await prisma.bookLens.findUnique({ where: { id: video.id }, include: { book: { select: { id: true, title: true, author: true } } } });
        }

        res.status(201).json({ success: true, message: 'Đã tạo video BookLens!', data: { video: fmt(video) } });
    } catch (error) { next(error); }
};

export const updateBookLens = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await prisma.bookLens.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: 'Video không tồn tại' });

        const { title, book, duration, status, description } = req.body;
        const data = {};
        if (title) data.title = title;
        if (book !== undefined) data.bookId = book ? parseInt(book) : null;
        if (duration) data.duration = duration;
        if (status) data.status = status;
        if (description !== undefined) data.description = description;

        if (req.file) {
            // Delete old video from Cloudinary if exists
            if (existing.videoPath && existing.videoPath.includes('cloudinary')) {
                const match = existing.videoPath.match(/\/lingoland\/videos\/([^.]+)/);
                if (match) await cloudinary.uploader.destroy(`lingoland/videos/${match[1]}`, { resource_type: 'video' }).catch(() => { });
            }
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'lingoland/videos',
                resource_type: 'video',
            });
            data.videoPath = result.secure_url;
            data.qrCodeUrl = await generateQR(id);
            // Cleanup temp file
            fs.unlink(req.file.path, () => { });
        } else if (existing.videoPath && !existing.qrCodeUrl) {
            // Regenerate QR if video exists but QR is missing
            data.qrCodeUrl = await generateQR(id);
        }

        const video = await prisma.bookLens.update({ where: { id }, data, include: { book: { select: { id: true, title: true, author: true } } } });
        res.json({ success: true, message: 'Đã cập nhật video', data: { video: fmt(video) } });
    } catch (error) { next(error); }
};

export const deleteBookLens = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const video = await prisma.bookLens.findUnique({ where: { id } });
        if (!video) return res.status(404).json({ success: false, message: 'Video không tồn tại' });

        // Delete from Cloudinary
        if (video.videoPath && video.videoPath.includes('cloudinary')) {
            const match = video.videoPath.match(/\/lingoland\/videos\/([^.]+)/);
            if (match) await cloudinary.uploader.destroy(`lingoland/videos/${match[1]}`, { resource_type: 'video' }).catch(() => { });
        }
        if (video.qrCodeUrl && video.qrCodeUrl.includes('cloudinary')) {
            const match = video.qrCodeUrl.match(/\/lingoland\/qr\/([^.]+)/);
            if (match) await cloudinary.uploader.destroy(`lingoland/qr/${match[1]}`).catch(() => { });
        }

        await prisma.bookLens.delete({ where: { id } });
        res.json({ success: true, message: 'Đã xoá video' });
    } catch (error) { next(error); }
};

export const getPublicVideo = async (req, res, next) => {
    try {
        const video = await prisma.bookLens.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { book: { select: { id: true, title: true, author: true, images: true } } }
        });
        if (!video || video.status !== 'published') return res.status(404).json({ success: false, message: 'Video không tồn tại hoặc chưa xuất bản' });

        await prisma.bookLens.update({ where: { id: video.id }, data: { views: { increment: 1 } } });
        res.json({ success: true, data: { video: fmt({ ...video, views: video.views + 1 }) } });
    } catch (error) { next(error); }
};
