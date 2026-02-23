import prisma from '../lib/prisma.js';

export const getDashboardStats = async (req, res, next) => {
    try {
        const [totalProducts, totalOrders, totalUsers] = await Promise.all([
            prisma.book.count(),
            prisma.order.count(),
            prisma.user.count({ where: { role: 'user' } })
        ]);

        const revenueResult = await prisma.order.aggregate({
            where: { orderStatus: { in: ['completed'] } },
            _sum: { totalAmount: true }
        });
        const totalRevenue = revenueResult._sum.totalAmount || 0;

        const recentOrders = await prisma.order.findMany({
            include: { user: { select: { id: true, name: true, email: true } }, items: true },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        res.json({
            success: true,
            data: {
                stats: { totalProducts, totalOrders, totalRevenue, totalUsers },
                recentOrders: recentOrders.map(o => ({
                    _id: String(o.id), totalAmount: o.totalAmount, orderStatus: o.orderStatus,
                    createdAt: o.createdAt, shippingAddress: o.shippingAddress, items: o.items,
                    user: o.user ? { _id: String(o.user.id), name: o.user.name, email: o.user.email } : null
                }))
            }
        });
    } catch (error) { next(error); }
};

export const getRevenueChart = async (req, res, next) => {
    try {
        const { period = '7days' } = req.query;
        const days = period === '30days' ? 30 : 7;
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const orders = await prisma.order.findMany({
            where: { createdAt: { gte: startDate }, orderStatus: 'completed' },
            select: { createdAt: true, totalAmount: true }
        });

        const grouped = {};
        orders.forEach(o => {
            const day = o.createdAt.toISOString().slice(0, 10);
            grouped[day] = (grouped[day] || 0) + o.totalAmount;
        });

        const revenueData = Object.entries(grouped)
            .map(([_id, revenue]) => ({ _id, revenue }))
            .sort((a, b) => a._id.localeCompare(b._id));

        res.json({ success: true, data: { revenueData } });
    } catch (error) { next(error); }
};

export const getTopProducts = async (req, res, next) => {
    try {
        const topProducts = await prisma.book.findMany({
            orderBy: { soldCount: 'desc' },
            take: 10,
            select: { id: true, title: true, author: true, soldCount: true, price: true }
        });

        res.json({
            success: true,
            data: { topProducts: topProducts.map(p => ({ ...p, _id: String(p.id) })) }
        });
    } catch (error) { next(error); }
};
