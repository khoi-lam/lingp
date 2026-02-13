import express from 'express';
import { uploadImages } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Upload images - Admin only
router.post('/', authenticate, requireAdmin, upload.array('images', 10), uploadImages);

export default router;
