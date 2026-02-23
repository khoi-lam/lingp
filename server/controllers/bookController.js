import prisma from '../lib/prisma.js';
import { generateSlug } from '../utils/slug.js';
import { processBookImages, deleteBookImages } from '../utils/imageProcessor.js';

// Helper: format book for frontend (add _id alias, flatten categories)
function formatBook(book) {
    if (!book) return null;
    return {
        _id: String(book.id),
        id: book.id,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        isbn: book.isbn,
        description: book.description,
        price: book.price,
        stockQuantity: book.stockQuantity,
        soldCount: book.soldCount,
        images: book.images || [],
        slug: book.slug,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
        categories: {
            origin: book.origin ? { _id: String(book.origin.id), name: book.origin.name, slug: book.origin.slug } : null,
            genres: (book.genres || []).map(bg => ({
                _id: String(bg.category.id),
                name: bg.category.name,
                slug: bg.category.slug
            }))
        }
    };
}

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res, next) => {
    try {
        const { page = 1, limit = 12, search, origin, genre, sort } = req.query;
        const take = parseInt(limit);
        const skip = (parseInt(page) - 1) * take;

        const where = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { author: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (origin) {
            where.originId = parseInt(origin);
        }

        if (genre) {
            const genreCat = await prisma.category.findFirst({ where: { slug: genre } });
            if (genreCat) {
                if (genreCat.type === 'origin') {
                    where.originId = genreCat.id;
                } else {
                    where.genres = { some: { categoryId: genreCat.id } };
                }
            } else {
                return res.json({ success: true, data: { books: [], pagination: { page: parseInt(page), limit: take, total: 0, pages: 0 } } });
            }
        }

        // Parse sort
        let orderBy = { createdAt: 'desc' };
        if (sort) {
            const desc = sort.startsWith('-');
            const field = desc ? sort.slice(1) : sort;
            if (['createdAt', 'price', 'soldCount', 'title'].includes(field)) {
                orderBy = { [field]: desc ? 'desc' : 'asc' };
            }
        }

        const [books, total] = await Promise.all([
            prisma.book.findMany({
                where,
                include: {
                    origin: true,
                    genres: { include: { category: true } }
                },
                orderBy,
                skip,
                take
            }),
            prisma.book.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                books: books.map(formatBook),
                pagination: {
                    page: parseInt(page),
                    limit: take,
                    total,
                    pages: Math.ceil(total / take)
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
        const book = await prisma.book.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                origin: true,
                genres: { include: { category: true } }
            }
        });

        if (!book) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
        }

        res.json({ success: true, data: { book: formatBook(book) } });
    } catch (error) {
        next(error);
    }
};

// @desc    Get book by slug
// @route   GET /api/books/slug/:slug
// @access  Public
export const getBookBySlug = async (req, res, next) => {
    try {
        const book = await prisma.book.findFirst({
            where: { slug: req.params.slug },
            include: {
                origin: true,
                genres: { include: { category: true } }
            }
        });

        if (!book) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
        }

        res.json({ success: true, data: { book: formatBook(book) } });
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

        if (!title || !author || !price) {
            return res.status(400).json({ success: false, message: 'Tên sách, tác giả và giá là bắt buộc' });
        }

        let images = [];
        if (req.files && req.files.length > 0) {
            const processedImages = await processBookImages(req.files);
            images = processedImages.map(img => img.medium);
        }

        const slug = generateSlug(title.trim());
        const genreIds = genres ? JSON.parse(genres) : [];

        const book = await prisma.book.create({
            data: {
                title: title.trim(),
                author: author.trim(),
                publisher: publisher?.trim() || null,
                isbn: isbn && isbn.trim() !== '' ? isbn.trim() : null,
                description: description?.trim() || null,
                price: parseFloat(price),
                stockQuantity: parseInt(stockQuantity) || 0,
                images,
                slug,
                originId: origin ? parseInt(origin) : null,
                genres: {
                    create: genreIds.map(gid => ({ categoryId: parseInt(gid) }))
                }
            },
            include: { origin: true, genres: { include: { category: true } } }
        });

        res.status(201).json({ success: true, message: 'Tạo sách thành công', data: { book: formatBook(book) } });
    } catch (error) {
        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0];
            if (field === 'isbn') return res.status(400).json({ success: false, message: 'ISBN đã tồn tại trong hệ thống' });
            if (field === 'slug') return res.status(400).json({ success: false, message: 'Slug đã tồn tại' });
        }
        next(error);
    }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req, res, next) => {
    try {
        const bookId = parseInt(req.params.id);
        const existing = await prisma.book.findUnique({ where: { id: bookId } });

        if (!existing) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
        }

        const { title, author, publisher, isbn, description, price, stockQuantity, origin, genres } = req.body;

        const data = {};
        if (title && title.trim() !== '') {
            data.title = title.trim();
            if (title.trim() !== existing.title) data.slug = generateSlug(title.trim());
        }
        if (author) data.author = author.trim();
        if (publisher !== undefined) data.publisher = publisher?.trim() || null;
        if (isbn !== undefined) data.isbn = isbn && isbn.trim() !== '' ? isbn.trim() : null;
        if (description !== undefined) data.description = description?.trim() || null;
        if (price !== undefined && price !== '') {
            const n = parseFloat(price);
            if (!isNaN(n)) data.price = n;
        }
        if (stockQuantity !== undefined && stockQuantity !== '') {
            const n = parseInt(stockQuantity);
            if (!isNaN(n)) data.stockQuantity = n;
        }
        if (origin !== undefined) data.originId = origin ? parseInt(origin) : null;

        // Process new images
        if (req.files && req.files.length > 0) {
            const processedImages = await processBookImages(req.files);
            const newImages = processedImages.map(img => img.medium);
            data.images = [...existing.images, ...newImages];
        }

        // Update genres (delete old, create new)
        if (genres) {
            const genreIds = typeof genres === 'string' ? JSON.parse(genres) : genres;
            await prisma.bookGenre.deleteMany({ where: { bookId } });
            await prisma.bookGenre.createMany({
                data: genreIds.map(gid => ({ bookId, categoryId: parseInt(gid) }))
            });
        }

        const book = await prisma.book.update({
            where: { id: bookId },
            data,
            include: { origin: true, genres: { include: { category: true } } }
        });

        res.json({ success: true, message: 'Cập nhật sách thành công', data: { book: formatBook(book) } });
    } catch (error) {
        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0];
            return res.status(400).json({ success: false, message: field === 'isbn' ? 'ISBN đã tồn tại' : 'Lỗi trùng lặp dữ liệu' });
        }
        next(error);
    }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req, res, next) => {
    try {
        const book = await prisma.book.findUnique({ where: { id: parseInt(req.params.id) } });

        if (!book) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
        }

        if (book.images && book.images.length > 0) {
            await deleteBookImages(book.images);
        }

        await prisma.book.delete({ where: { id: book.id } });

        res.json({ success: true, message: 'Xóa sách thành công' });
    } catch (error) {
        next(error);
    }
};

// @desc    Suggest books (autocomplete)
// @route   GET /api/books/suggest
// @access  Public
export const suggestBooks = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.json({ success: true, data: { suggestions: [] } });
        }

        const suggestions = await prisma.book.findMany({
            where: { title: { contains: q, mode: 'insensitive' } },
            select: { id: true, title: true, author: true, images: true, price: true },
            take: 10
        });

        res.json({
            success: true,
            data: {
                suggestions: suggestions.map(s => ({ ...s, _id: String(s.id) }))
            }
        });
    } catch (error) {
        next(error);
    }
};
