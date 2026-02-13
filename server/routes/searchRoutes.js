import express from 'express';
import { semanticSearch, autocompleteSuggestions } from '../controllers/searchController.js';

const router = express.Router();

// Search routes
router.get('/', semanticSearch);
router.get('/suggest', autocompleteSuggestions);

export default router;
