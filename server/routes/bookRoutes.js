import express from 'express';
import {
    getBooks,
    getBookById,
    getBookBySlug,
    createBook,
    updateBook,
    deleteBook,
    suggestBooks
} from '../controllers/bookController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/suggest', suggestBooks);
router.get('/slug/:slug', getBookBySlug);
router.get('/:id', getBookById);

// Admin routes
router.post('/', authenticate, requireAdmin, upload.array('images', 5), createBook);
router.put('/:id', authenticate, requireAdmin, upload.array('images', 5), updateBook);
router.delete('/:id', authenticate, requireAdmin, deleteBook);

export default router;
