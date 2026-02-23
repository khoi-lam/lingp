import prisma from '../lib/prisma.js';

function fmt(v) {
    return { _id: String(v.id), ...v, book: v.book ? { _id: String(v.book.id), title: v.book.title } : null };
}

export const getARVideos = async (req, res, next) => {
    try {
        const videos = await prisma.arVideo.findMany({ include: { book: { select: { id: true, title: true } } }, orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: { videos: videos.map(fmt) } });
    } catch (error) { next(error); }
};

export const getARVideoById = async (req, res, next) => {
    try {
        const video = await prisma.arVideo.findUnique({ where: { id: parseInt(req.params.id) }, include: { book: { select: { id: true, title: true } } } });
        if (!video) return res.status(404).json({ success: false, message: 'Không tìm thấy video' });
        res.json({ success: true, data: { video: fmt(video) } });
    } catch (error) { next(error); }
};

export const createARVideo = async (req, res, next) => {
    try {
        const { title, book, videoUrl, duration, status, description } = req.body;
        const video = await prisma.arVideo.create({
            data: { title, bookId: book ? parseInt(book) : null, videoUrl, duration, status, description },
            include: { book: { select: { id: true, title: true } } }
        });
        res.status(201).json({ success: true, data: { video: fmt(video) }, message: 'Đã tạo video AR' });
    } catch (error) { next(error); }
};

export const updateARVideo = async (req, res, next) => {
    try {
        const { title, book, videoUrl, duration, status, description } = req.body;
        const data = {};
        if (title !== undefined) data.title = title;
        if (book !== undefined) data.bookId = book ? parseInt(book) : null;
        if (videoUrl !== undefined) data.videoUrl = videoUrl;
        if (duration !== undefined) data.duration = duration;
        if (status !== undefined) data.status = status;
        if (description !== undefined) data.description = description;

        const video = await prisma.arVideo.update({ where: { id: parseInt(req.params.id) }, data, include: { book: { select: { id: true, title: true } } } });
        res.json({ success: true, data: { video: fmt(video) }, message: 'Đã cập nhật video' });
    } catch (error) { next(error); }
};

export const deleteARVideo = async (req, res, next) => {
    try {
        await prisma.arVideo.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true, message: 'Đã xoá video' });
    } catch (error) { next(error); }
};
