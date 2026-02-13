import express from 'express';
import {
    createRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus
} from '../controllers/supportController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

// User routes
router.post('/', authenticate, createRequest);
router.get('/my', authenticate, getMyRequests);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllRequests);
router.patch('/:id', authenticate, requireAdmin, updateRequestStatus);

export default router;
