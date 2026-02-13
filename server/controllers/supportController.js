import Support from '../models/Support.js';
import Order from '../models/Order.js';

// @desc    Create new support/return request
// @route   POST /api/support
// @access  Private
export const createRequest = async (req, res, next) => {
    try {
        const { type, title, content, images, orderId } = req.body;

        const request = await Support.create({
            user: req.user._id,
            type,
            title,
            content,
            images,
            orderId
        });

        res.status(201).json({
            success: true,
            message: 'Gửi yêu cầu thành công',
            data: { request }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's support requests
// @route   GET /api/support/my
// @access  Private
export const getMyRequests = async (req, res, next) => {
    try {
        const requests = await Support.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('orderId', 'orderId totalAmount orderStatus');

        res.json({
            success: true,
            data: { requests }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all support requests (Admin)
// @route   GET /api/support
// @access  Private/Admin
export const getAllRequests = async (req, res, next) => {
    try {
        const { type, status } = req.query;
        const query = {};
        if (type) query.type = type;
        if (status) query.status = status;

        const requests = await Support.find(query)
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .populate('orderId', 'orderId totalAmount orderStatus');

        res.json({
            success: true,
            data: { requests }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update support request status/reply (Admin)
// @route   PATCH /api/support/:id
// @access  Private/Admin
export const updateRequestStatus = async (req, res, next) => {
    try {
        const { status, adminReply } = req.body;
        const request = await Support.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy yêu cầu'
            });
        }

        request.status = status || request.status;
        request.adminReply = adminReply || request.adminReply;

        await request.save();

        // If it's a return request and it's approved (resolved), update original order
        if (request.type === 'return' && status === 'resolved' && request.orderId) {
            await Order.findByIdAndUpdate(request.orderId, {
                orderStatus: 'returned'
            });
        }

        res.json({
            success: true,
            message: 'Cập nhật yêu cầu thành công',
            data: { request }
        });
    } catch (error) {
        next(error);
    }
};
