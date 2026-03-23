import express from 'express';
import {
    getProfile,
    updateProfile,
    changePassword
} from '../controllers/userController.js';
import {
    getAllUsers,
    toggleBlockUser
} from '../controllers/adminUserController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

// Admin routes
router.get('/admin/all', requireAdmin, getAllUsers);
router.put('/admin/:id/block', requireAdmin, toggleBlockUser);

export default router;
