import express from 'express';
import { getARVideos, getARVideoById, createARVideo, updateARVideo, deleteARVideo } from '../controllers/arVideoController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';

const router = express.Router();
router.use(authenticate, requireAdmin);

router.get('/', getARVideos);
router.get('/:id', getARVideoById);
router.post('/', createARVideo);
router.put('/:id', updateARVideo);
router.delete('/:id', deleteARVideo);

export default router;
