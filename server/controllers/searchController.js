import prisma from '../lib/prisma.js';
import stringSimilarity from 'string-similarity';

const synonyms = {
    'tình yêu': ['yêu', 'tình cảm', 'lãng mạn', 'romance', 'love'],
    'kinh tế': ['tài chính', 'tiền bạc', 'đầu tư', 'kinh doanh', 'business', 'finance'],
    'tâm lý': ['tâm hồn', 'cảm xúc', 'psychology', 'tư duy', 'mental'],
    'thiếu nhi': ['trẻ em', 'nhi đồng', 'children', 'kids', 'youth'],
    'phiêu lưu': ['adventure', 'mạo hiểm', 'thám hiểm', 'exploration'],
    'khoa học': ['science', 'công nghệ', 'technology'],
};

function expandQuery(query) {
    const q = query.toLowerCase();
    const terms = [q];
    for (const [key, values] of Object.entries(synonyms)) {
        if (q.includes(key) || values.some(v => q.includes(v))) terms.push(key, ...values);
    }
    return [...new Set(terms)];
}

function formatBook(b) {
    return {
        _id: String(b.id), id: b.id, title: b.title, author: b.author, publisher: b.publisher,
        description: b.description, price: b.price, stockQuantity: b.stockQuantity, soldCount: b.soldCount,
        images: b.images, slug: b.slug, createdAt: b.createdAt, updatedAt: b.updatedAt,
        categories: {
            origin: b.origin ? { _id: String(b.origin.id), name: b.origin.name, slug: b.origin.slug } : null,
            genres: (b.genres || []).map(bg => ({ _id: String(bg.category.id), name: bg.category.name, slug: bg.category.slug }))
        }
    };
}

async function fuzzySearch(query, limit) {
    const terms = expandQuery(query);
    const queryLower = query.toLowerCase();

    const whereConditions = terms.map(term => ({
        OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { author: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            { publisher: { contains: term, mode: 'insensitive' } }
        ]
    }));

    const books = await prisma.book.findMany({
        where: { OR: whereConditions },
        include: { origin: true, genres: { include: { category: true } } },
        take: limit * 3
    });

    const scored = books.map(book => {
        const titleSim = stringSimilarity.compareTwoStrings(queryLower, book.title.toLowerCase());
        const authorSim = stringSimilarity.compareTwoStrings(queryLower, book.author.toLowerCase());
        const titleMatch = book.title.toLowerCase().includes(queryLower) ? 1 : 0;
        const score = titleMatch * 0.3 + titleSim * 0.4 + authorSim * 0.3;
        return { book, score };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, limit).map(s => formatBook(s.book));
}

export const semanticSearch = async (req, res, next) => {
    try {
        const { q: query, limit = 20 } = req.query;
        if (!query || query.trim().length < 2) {
            return res.json({ success: true, data: { results: [], searchType: 'none', message: 'Query too short' } });
        }
        const results = await fuzzySearch(query.trim(), parseInt(limit));
        res.json({ success: true, data: { results, searchType: 'fuzzy', count: results.length } });
    } catch (error) { next(error); }
};

export const autocompleteSuggestions = async (req, res, next) => {
    try {
        const { q: query, limit = 10 } = req.query;
        if (!query || query.trim().length < 2) {
            return res.json({ success: true, data: { suggestions: [] } });
        }
        const suggestions = await prisma.book.findMany({
            where: { OR: [{ title: { contains: query, mode: 'insensitive' } }, { author: { contains: query, mode: 'insensitive' } }] },
            select: { id: true, title: true, author: true, images: true, price: true, stockQuantity: true },
            take: parseInt(limit)
        });
        res.json({ success: true, data: { suggestions: suggestions.map(s => ({ ...s, _id: String(s.id) })) } });
    } catch (error) { next(error); }
};
