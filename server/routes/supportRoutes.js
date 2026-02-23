import express from 'express';
import {
    createRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus
} from '../controllers/supportController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';
import { verifyAccessToken } from '../utils/generateToken.js';

const router = express.Router();

// Optional auth — sets req.user if token present, continues regardless
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            const decoded = verifyAccessToken(authHeader.split(' ')[1]);
            req.user = { _id: decoded.userId, email: decoded.email, role: decoded.role };
        }
    } catch { /* guest user — continue without auth */ }
    next();
};

// User routes (POST is public for guests)
router.post('/', optionalAuth, createRequest);
router.get('/my', authenticate, getMyRequests);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllRequests);
router.patch('/:id', authenticate, requireAdmin, updateRequestStatus);

export default router;
