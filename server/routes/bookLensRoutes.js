import express from 'express';
import {
    getBookLensVideos,
    getBookLensById,
    createBookLens,
    updateBookLens,
    deleteBookLens,
    getPublicVideo,
    getUploadSignature
} from '../controllers/bookLensController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

// Public route — QR scan opens this
router.get('/watch/:id', getPublicVideo);

// Admin routes
router.use(authenticate, requireAdmin);
router.get('/upload-signature', getUploadSignature);
router.get('/', getBookLensVideos);
router.get('/:id', getBookLensById);
router.post('/', createBookLens);
router.put('/:id', updateBookLens);
router.delete('/:id', deleteBookLens);

export default router;
