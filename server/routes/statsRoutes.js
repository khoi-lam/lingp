import express from 'express';
import {
    getDashboardStats,
    getRevenueChart,
    getTopProducts
} from '../controllers/statsController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

// All stats routes require admin authentication
router.use(authenticate, requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/revenue', getRevenueChart);
router.get('/top-products', getTopProducts);

export default router;
