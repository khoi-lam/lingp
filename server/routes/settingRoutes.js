import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';

const router = express.Router();
router.use(authenticate, requireAdmin);

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
