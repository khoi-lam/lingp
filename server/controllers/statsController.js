import Book from '../models/Book.js';
import Order from '../models/Order.js';

// @desc    Get dashboard stats
// @route   GET /api/stats/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
    try {
        // Count total products
        const totalProducts = await Book.countDocuments();

        // Count total orders
        const totalOrders = await Order.countDocuments();

        // Calculate total revenue
        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: { $in: ['delivered', 'completed'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // Get recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('_id totalAmount status createdAt');

        res.json({
            success: true,
            data: {
                stats: {
                    totalProducts,
                    totalOrders,
                    totalRevenue
                },
                recentOrders
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get revenue chart data
// @route   GET /api/stats/revenue
// @access  Private/Admin
export const getRevenueChart = async (req, res, next) => {
    try {
        const { period = '7days' } = req.query;

        let startDate;
        const now = new Date();

        if (period === '7days') {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (period === '30days') {
            startDate = new Date(now.setDate(now.getDate() - 30));
        } else {
            startDate = new Date(now.setDate(now.getDate() - 7));
        }

        const revenueData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    orderStatus: { $in: ['delivered', 'completed'] }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: { revenueData }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get top products
// @route   GET /api/stats/top-products
// @access  Private/Admin
export const getTopProducts = async (req, res, next) => {
    try {
        const topProducts = await Book.find()
            .sort({ soldCount: -1 })
            .limit(10)
            .select('title author soldCount price');

        res.json({
            success: true,
            data: { topProducts }
        });
    } catch (error) {
        next(error);
    }
};
