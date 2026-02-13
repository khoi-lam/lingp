import Order from '../models/Order.js';

/**
 * Get all orders (Admin only)
 * GET /api/orders/admin/all
 */
export const getAllOrders = async (req, res) => {
    try {
        const { status, paymentStatus, page = 1, limit = 20, search } = req.query;
        const query = {};

        // Filter by status
        if (status && status !== 'all') {
            query.orderStatus = status;
        }

        // Filter by payment status
        if (paymentStatus && paymentStatus !== 'all') {
            query.paymentStatus = paymentStatus;
        }

        // Search by Order ID or User ID (placeholder for more advanced search if needed)
        if (search) {
            query.$or = [
                { _id: mongoose.Types.ObjectId.isValid(search) ? search : undefined },
                { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
                { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
            ].filter(Boolean);
        }

        const skip = (page - 1) * limit;
        const total = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách đơn hàng',
            error: error.message
        });
    }
};

/**
 * Get order statistics (Admin only)
 * GET /api/orders/admin/stats
 */
export const getOrderStats = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 },
                    totalSales: { $sum: '$totalAmount' }
                }
            }
        ]);

        const totalOrders = await Order.countDocuments();
        const totalRevenue = stats.reduce((acc, curr) => acc + curr.totalSales, 0);

        res.json({
            success: true,
            data: {
                stats,
                totalOrders,
                totalRevenue
            }
        });
    } catch (error) {
        console.error('Error fetching order stats:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê đơn hàng',
            error: error.message
        });
    }
};

/**
 * Update order status (Admin only)
 * PUT /api/orders/:id/status
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentStatus, trackingNumber } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        if (status) order.orderStatus = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (trackingNumber) order.trackingNumber = trackingNumber;

        await order.save();

        res.json({
            success: true,
            message: 'Cập nhật trạng thái đơn hàng thành công',
            data: order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái đơn hàng',
            error: error.message
        });
    }
};
