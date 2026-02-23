import prisma from '../lib/prisma.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search, role } = req.query;
        const take = parseInt(limit);
        const skip = (parseInt(page) - 1) * take;

        const where = {};
        if (role && role !== 'all') where.role = role;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: { id: true, email: true, name: true, role: true, isBlocked: true, createdAt: true, _count: { select: { orders: true } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take
            }),
            prisma.user.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                users: users.map(u => ({ _id: String(u.id), id: u.id, email: u.email, name: u.name, role: u.role, isBlocked: u.isBlocked, createdAt: u.createdAt, orderCount: u._count.orders })),
                pagination: { total, page: parseInt(page), pages: Math.ceil(total / take) }
            }
        });
    } catch (error) { next(error); }
};

export const toggleBlockUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Không thể khoá tài khoản admin' });

        const updated = await prisma.user.update({ where: { id }, data: { isBlocked: !user.isBlocked } });
        res.json({
            success: true,
            message: updated.isBlocked ? 'Đã khoá tài khoản' : 'Đã mở khoá tài khoản',
            data: { user: { ...updated, _id: String(updated.id), password: undefined } }
        });
    } catch (error) { next(error); }
};
