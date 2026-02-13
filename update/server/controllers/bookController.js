import Book from '../models/Book.js';
import { processBookImages, deleteBookImages } from '../utils/imageProcessor.js';

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res, next) => {
    try {
        const { page = 1, limit = 12, search, origin, genre } = req.query;

        const filter = {};

        // Search by title or author
        if (search) {
            filter.$text = { $search: search };
        }

        // Filter by origin category
        if (origin) {
            filter['categories.origin'] = origin;
        }

        // Filter by genre category
        if (genre) {
            filter['categories.genres'] = genre;
        }

        const skip = (page - 1) * limit;

        const books = await Book.find(filter)
            .populate('categories.origin', 'name slug')
            .populate('categories.genres', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Book.countDocuments(filter);

        res.json({
            success: true,
            data: {
                books,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('categories.origin', 'name slug')
            .populate('categories.genres', 'name slug');

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách'
            });
        }

        res.json({
            success: true,
            data: { book }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get book by slug
// @route   GET /api/books/slug/:slug
// @access  Public
export const getBookBySlug = async (req, res, next) => {
    try {
        const book = await Book.findOne({ slug: req.params.slug })
            .populate('categories.origin', 'name slug')
            .populate('categories.genres', 'name slug');

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách'
            });
        }

        res.json({
            success: true,
            data: { book }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req, res, next) => {
    try {
        const { title, author, publisher, isbn, description, price, stockQuantity, origin, genres } = req.body;

        // Validate required fields
        if (!title || !author || !price) {
            return res.status(400).json({
                success: false,
                message: 'Tên sách, tác giả và giá là bắt buộc'
            });
        }

        // Process uploaded images
        let images = [];
        if (req.files && req.files.length > 0) {
            const processedImages = await processBookImages(req.files);
            images = processedImages.map(img => img.medium); // Use medium size as default
        }

        const bookData = {
            title: title.trim(),
            author: author.trim(),
            publisher: publisher?.trim(),
            isbn: isbn && isbn.trim() !== '' ? isbn.trim() : null,
            description: description?.trim(),
            price: parseFloat(price),
            stockQuantity: parseInt(stockQuantity) || 0,
            images,
            categories: {
                origin: origin || null,
                genres: genres ? JSON.parse(genres) : []
            }
        };

        const book = await Book.create(bookData);

        res.status(201).json({
            success: true,
            message: 'Tạo sách thành công',
            data: { book }
        });
    } catch (error) {
        // Handle duplicate ISBN error
        if (error.code === 11000 && error.keyPattern?.isbn) {
            return res.status(400).json({
                success: false,
                message: 'ISBN đã tồn tại trong hệ thống'
            });
        }
        next(error);
    }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req, res, next) => {
    try {
        console.log(`📝 Updating book ID: ${req.params.id}`);
        console.log('📦 Request body:', req.body);

        const book = await Book.findById(req.params.id);

        if (!book) {
            console.log('❌ Book not found');
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách'
            });
        }

        const { title, author, publisher, isbn, description, price, stockQuantity, origin, genres } = req.body;

        // Update fields
        if (title && title.trim() !== '') {
            const trimmedTitle = title.trim();
            // Update slug if title changed
            if (trimmedTitle !== book.title) {
                book.title = trimmedTitle;
                // Force slug update by clearing it (pre-save hook will regenerate or we do it here)
                book.slug = undefined;
            }
        }

        if (author) book.author = author.trim();
        if (publisher !== undefined) book.publisher = publisher?.trim();
        if (isbn !== undefined) book.isbn = isbn && isbn.trim() !== '' ? isbn.trim() : null;
        if (description !== undefined) book.description = description?.trim();

        if (price !== undefined && price !== '') {
            const numPrice = parseFloat(price);
            if (!isNaN(numPrice)) book.price = numPrice;
        }

        if (stockQuantity !== undefined && stockQuantity !== '') {
            const numStock = parseInt(stockQuantity);
            if (!isNaN(numStock)) book.stockQuantity = numStock;
        }

        // Update categories
        if (origin !== undefined) book.categories.origin = origin || null;
        if (genres) {
            try {
                book.categories.genres = typeof genres === 'string' ? JSON.parse(genres) : genres;
            } catch (e) {
                console.error('Error parsing genres:', e);
            }
        }

        // Process new images if uploaded
        if (req.files && req.files.length > 0) {
            console.log(`📸 Processing ${req.files.length} new images`);
            const processedImages = await processBookImages(req.files);
            const newImages = processedImages.map(img => img.medium);
            book.images = [...book.images, ...newImages];
        }

        const updatedBook = await book.save();
        console.log('✅ Book updated successfully:', updatedBook._id);

        res.json({
            success: true,
            message: 'Cập nhật sách thành công',
            data: { book: updatedBook }
        });
    } catch (error) {
        console.error('❌ Error updating book:', error);
        // Handle duplicate ISBN or Slug error
        if (error.code === 11000) {
            let message = 'Lỗi trùng lặp dữ liệu';
            if (error.keyPattern?.isbn) message = 'ISBN đã tồn tại trong hệ thống';
            if (error.keyPattern?.slug) message = 'Slug (đường dẫn) của sách đã tồn tại';

            return res.status(400).json({
                success: false,
                message
            });
        }
        next(error);
    }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách'
            });
        }

        // Delete associated images
        if (book.images && book.images.length > 0) {
            await deleteBookImages(book.images);
        }

        await book.deleteOne();

        res.json({
            success: true,
            message: 'Xóa sách thành công'
        });
    } catch (error) {
        next(error);
    }
};
export const suggestBooks = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.json({ success: true, data: { suggestions: [] } });
        }

        const suggestions = await Book.find({
            title: { $regex: q, $options: 'i' }
        })
            .select('title author images price')
            .limit(10);

        res.json({
            success: true,
            data: { suggestions }
        });
    } catch (error) {
        next(error);
    }
};
