import express from 'express';
import {
    getContent,
    updateHeroBanner,
    updateAboutUs
} from '../controllers/contentController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

// Public routes
router.get('/:type', getContent);

// Admin routes
router.put('/hero-banner', authenticate, requireAdmin, updateHeroBanner);
router.put('/about-us', authenticate, requireAdmin, updateAboutUs);

export default router;
