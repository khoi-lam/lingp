import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderById
} from '../controllers/orderController.js';
import {
    getAllOrders,
    getOrderStats,
    updateOrderStatus
} from '../controllers/adminOrderController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

// Public route for order creation (supports both authenticated and guest checkout)
router.post('/', optionalAuth, createOrder);

// Private routes for authenticated users
router.get('/my-orders', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, getAllOrders);
router.get('/admin/stats', authenticate, requireAdmin, getOrderStats);
router.put('/:id/status', authenticate, requireAdmin, updateOrderStatus);

export default router;
