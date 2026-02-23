import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import prisma from '../lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const QR_DIR = path.join(__dirname, '../uploads/qr');

const generateQR = async (videoId) => {
    const watchUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/watch/${videoId}`;
    const qrFilename = `qr-${videoId}.png`;
    const qrPath = path.join(QR_DIR, qrFilename);
    await QRCode.toFile(qrPath, watchUrl, { width: 400, margin: 2, color: { dark: '#1B5E20', light: '#FFFFFF' } });
    return `/uploads/qr/${qrFilename}`;
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
        const videoPath = req.file ? `/uploads/videos/${req.file.filename}` : '';

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
            if (existing.videoPath) {
                const oldPath = path.join(__dirname, '..', existing.videoPath.replace(/^\//, ''));
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            data.videoPath = `/uploads/videos/${req.file.filename}`;
            data.qrCodeUrl = await generateQR(id);
        } else if ((existing.videoPath && !existing.qrCodeUrl) || (existing.videoPath && existing.qrCodeUrl)) {
            // Preserve or regenerate QR if video exists
            if (!existing.qrCodeUrl) {
                data.qrCodeUrl = await generateQR(id);
            }
            // Otherwise qrCodeUrl stays untouched (not in data = not overwritten)
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

        if (video.videoPath) { const f = path.join(__dirname, '..', video.videoPath.replace(/^\//, '')); if (fs.existsSync(f)) fs.unlinkSync(f); }
        if (video.qrCodeUrl) { const f = path.join(__dirname, '..', video.qrCodeUrl.replace(/^\//, '')); if (fs.existsSync(f)) fs.unlinkSync(f); }

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
