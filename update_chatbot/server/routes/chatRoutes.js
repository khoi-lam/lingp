import express from 'express';
import { chatWithAI, getChatSuggestions } from '../controllers/chatController.js';

const router = express.Router();

// POST /api/chat - Chat with AI about books
router.post('/', chatWithAI);

// GET /api/chat/suggestions - Get suggested questions
router.get('/suggestions', getChatSuggestions);

export default router;
