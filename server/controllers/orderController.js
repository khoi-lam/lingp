import prisma from '../lib/prisma.js';
import crypto from 'crypto';

function generateOrderCode() {
    return 'LL-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function formatOrder(order) {
    if (!order) return null;
    return {
        _id: order.orderCode,
        id: order.id,
        orderCode: order.orderCode,
        user: order.userId,
        items: (order.items || []).map(item => ({
            _id: String(item.id),
            product: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            productData: item.product ? { _id: String(item.product.id), images: item.product.images, title: item.product.title } : null
        })),
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        vnpayTransactionId: order.vnpayTransactionId,
        cancelledReason: order.cancelledReason,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        userData: order.user ? { _id: String(order.user.id), name: order.user.name, email: order.user.email } : null
    };
}

export const createOrder = async (req, res, next) => {
    try {
        const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Không có sản phẩm trong đơn hàng' });
        }

        const orderCode = generateOrderCode();
        const order = await prisma.order.create({
            data: {
                orderCode,
                userId: req.user?.id || null,
                totalAmount: parseFloat(totalAmount),
                shippingAddress: shippingAddress,
                paymentMethod: paymentMethod || 'cod',
                items: {
                    create: items.map(item => ({
                        productId: parseInt(item.product),
                        title: item.title,
                        price: parseFloat(item.price),
                        quantity: parseInt(item.quantity)
                    }))
                }
            },
            include: { items: { include: { product: true } } }
        });

        // Update stock
        for (const item of items) {
            await prisma.book.update({
                where: { id: parseInt(item.product) },
                data: {
                    stockQuantity: { decrement: parseInt(item.quantity) },
                    soldCount: { increment: parseInt(item.quantity) }
                }
            });
        }

        res.status(201).json({ success: true, message: 'Đơn hàng đã được tạo thành công', data: { order: formatOrder(order) } });
    } catch (error) { next(error); }
};

export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            include: { items: { include: { product: { select: { id: true, images: true, title: true } } } } },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: { orders: orders.map(formatOrder) } });
    } catch (error) { next(error); }
};

export const getOrderById = async (req, res, next) => {
    try {
        const param = req.params.id;
        const isCode = param.startsWith('LL-');
        const order = await prisma.order.findUnique({
            where: isCode ? { orderCode: param } : { id: parseInt(param) },
            include: { items: { include: { product: { select: { id: true, images: true, title: true } } } } }
        });

        if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });

        if (order.userId && order.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Không có quyền truy cập đơn hàng này' });
        }

        res.json({ success: true, data: { order: formatOrder(order) } });
    } catch (error) { next(error); }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await prisma.order.findMany({
            include: { user: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: { orders: orders.map(formatOrder) } });
    } catch (error) { next(error); }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const id = parseInt(req.params.id);
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });

        const data = { orderStatus: status };
        if (status === 'completed') data.paymentStatus = 'paid';

        const updated = await prisma.order.update({ where: { id }, data });
        res.json({ success: true, message: 'Cập nhật trạng thái đơn hàng thành công', data: { order: formatOrder(updated) } });
    } catch (error) { next(error); }
};
