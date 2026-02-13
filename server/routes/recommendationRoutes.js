import express from 'express';
import { getAIRecommendations } from '../controllers/recommendationController.js';

const router = express.Router();

// GET /api/recommendations/books/:bookId/ai-recommendations
router.get('/books/:bookId/ai-recommendations', getAIRecommendations);

export default router;
