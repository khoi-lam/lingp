import prisma from '../lib/prisma.js';

function fmt(r) {
    return { _id: String(r.id), ...r, user: r.user ? { _id: String(r.user.id), name: r.user.name, email: r.user.email } : undefined };
}

export const createRequest = async (req, res, next) => {
    try {
        const { type, title, content, images, orderId, name, email, subject, message } = req.body;
        const request = await prisma.supportTicket.create({
            data: {
                userId: req.user?.id || null,
                guestName: name || null,
                guestEmail: email || null,
                type: type || 'support',
                title: title || subject || 'Yêu cầu hỗ trợ',
                content: content || message,
                images: images || [],
                orderId: orderId ? parseInt(orderId) : null
            }
        });
        res.status(201).json({ success: true, message: 'Gửi yêu cầu thành công', data: { request: { ...request, _id: String(request.id) } } });
    } catch (error) { next(error); }
};

export const getMyRequests = async (req, res, next) => {
    try {
        const requests = await prisma.supportTicket.findMany({
            where: { userId: req.user.id },
            include: { order: { select: { id: true, totalAmount: true, orderStatus: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: { requests: requests.map(r => ({ ...r, _id: String(r.id) })) } });
    } catch (error) { next(error); }
};

export const getAllRequests = async (req, res, next) => {
    try {
        const { type, status } = req.query;
        const where = {};
        if (type) where.type = type;
        if (status) where.status = status;

        const requests = await prisma.supportTicket.findMany({
            where,
            include: { user: { select: { id: true, name: true, email: true } }, order: { select: { id: true, totalAmount: true, orderStatus: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: { requests: requests.map(fmt) } });
    } catch (error) { next(error); }
};

export const updateRequestStatus = async (req, res, next) => {
    try {
        const { status, adminReply } = req.body;
        const id = parseInt(req.params.id);
        const existing = await prisma.supportTicket.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu' });

        const data = {};
        if (status) data.status = status;
        if (adminReply) data.adminReply = adminReply;

        const request = await prisma.supportTicket.update({ where: { id }, data });

        if (existing.type === 'return_request' && status === 'resolved' && existing.orderId) {
            await prisma.order.update({ where: { id: existing.orderId }, data: { orderStatus: 'cancelled' } });
        }

        res.json({ success: true, message: 'Cập nhật yêu cầu thành công', data: { request: { ...request, _id: String(request.id) } } });
    } catch (error) { next(error); }
};
