import express from 'express';
import { getPromotions, getPromotionById, createPromotion, updatePromotion, deletePromotion, togglePause } from '../controllers/promotionController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';

const router = express.Router();
router.use(authenticate, requireAdmin);

router.get('/', getPromotions);
router.get('/:id', getPromotionById);
router.post('/', createPromotion);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);
router.put('/:id/toggle-pause', togglePause);

export default router;
