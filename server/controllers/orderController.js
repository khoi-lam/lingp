import Order from '../models/Order.js';
import Book from '../models/Book.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (supports guest checkout)
export const createOrder = async (req, res, next) => {
    try {
        const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không có sản phẩm trong đơn hàng'
            });
        }

        // Create order (support both authenticated and guest users)
        const order = await Order.create({
            user: req.user?._id || null, // null for guest checkout
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
        });

        // Update stock for each item
        for (const item of items) {
            await Book.findByIdAndUpdate(item.product, {
                $inc: {
                    stockQuantity: -item.quantity,
                    soldCount: item.quantity
                }
            });
        }

        res.status(201).json({
            success: true,
            message: 'Đơn hàng đã được tạo thành công',
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'images title')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { orders }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product', 'images title');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Check if user is owner or admin
        // For guest orders (no user), allow access by order ID only
        if (order.user && order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Không có quyền truy cập đơn hàng này'
            });
        }

        res.json({
            success: true,
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { orders }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        order.orderStatus = status;
        if (status === 'completed') {
            order.paymentStatus = 'paid';
        }

        await order.save();

        res.json({
            success: true,
            message: 'Cập nhật trạng thái đơn hàng thành công',
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};
