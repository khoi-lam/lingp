import express from 'express';
import {
    getBookLensVideos,
    getBookLensById,
    createBookLens,
    updateBookLens,
    deleteBookLens,
    getPublicVideo
} from '../controllers/bookLensController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';
import videoUpload from '../middleware/videoUpload.js';

const router = express.Router();

// Public route — QR scan opens this
router.get('/watch/:id', getPublicVideo);

// Admin routes
router.use(authenticate, requireAdmin);
router.get('/', getBookLensVideos);
router.get('/:id', getBookLensById);
router.post('/', videoUpload.single('video'), createBookLens);
router.put('/:id', videoUpload.single('video'), updateBookLens);
router.delete('/:id', deleteBookLens);

export default router;
