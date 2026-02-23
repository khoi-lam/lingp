import prisma from '../lib/prisma.js';

function formatOrder(order) {
    return {
        _id: order.orderCode,
        id: order.id,
        orderCode: order.orderCode,
        user: order.user ? { _id: String(order.user.id), name: order.user.name, email: order.user.email } : null,
        items: (order.items || []).map(item => ({
            _id: String(item.id),
            product: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity
        })),
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber,
        cancelledReason: order.cancelledReason,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
    };
}

export const getAllOrders = async (req, res) => {
    try {
        const { status, paymentStatus, page = 1, limit = 20, search } = req.query;
        const take = parseInt(limit);
        const skip = (parseInt(page) - 1) * take;

        const where = {};
        if (status && status !== 'all') where.orderStatus = status;
        if (paymentStatus && paymentStatus !== 'all') where.paymentStatus = paymentStatus;

        if (search) {
            where.shippingAddress = { path: ['fullName'], string_contains: search };
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    items: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take
            }),
            prisma.order.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                orders: orders.map(formatOrder),
                pagination: { total, page: parseInt(page), pages: Math.ceil(total / take) }
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách đơn hàng', error: error.message });
    }
};

export const getOrderStats = async (req, res) => {
    try {
        const stats = await prisma.order.groupBy({
            by: ['orderStatus'],
            _count: true,
            _sum: { totalAmount: true }
        });

        const totalOrders = await prisma.order.count();
        const totalRevenue = stats.reduce((acc, s) => acc + (s._sum.totalAmount || 0), 0);

        res.json({
            success: true,
            data: {
                stats: stats.map(s => ({ _id: s.orderStatus, count: s._count, totalSales: s._sum.totalAmount || 0 })),
                totalOrders,
                totalRevenue
            }
        });
    } catch (error) {
        console.error('Error fetching order stats:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy thống kê đơn hàng', error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const param = req.params.id;
        const isCode = param.startsWith('LL-');
        const { status, paymentStatus, trackingNumber } = req.body;
        const order = await prisma.order.findUnique({ where: isCode ? { orderCode: param } : { id: parseInt(param) } });
        if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });

        const data = {};
        if (status) data.orderStatus = status;
        if (paymentStatus) data.paymentStatus = paymentStatus;
        if (trackingNumber) data.trackingNumber = trackingNumber;

        const updated = await prisma.order.update({
            where: { id: order.id },
            data,
            include: { user: { select: { id: true, name: true, email: true } }, items: true }
        });

        res.json({ success: true, message: 'Cập nhật trạng thái đơn hàng thành công', data: formatOrder(updated) });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái đơn hàng', error: error.message });
    }
};
