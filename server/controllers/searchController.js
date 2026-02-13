import axios from 'axios';
import BookEmbedding from '../models/BookEmbedding.js';
import Book from '../models/Book.js';
import stringSimilarity from 'string-similarity';
import natural from 'natural';

const { LevenshteinDistance } = natural;

// HuggingFace API configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models/BAAI/bge-small-en-v1.5';
const HF_API_KEY = process.env.HF_API_KEY;

// Vietnamese synonym dictionary for better search
const synonyms = {
    'tình yêu': ['yêu', 'tình cảm', 'lãng mạn', 'romance', 'love'],
    'kinh tế': ['tài chính', 'tiền bạc', 'đầu tư', 'kinh doanh', 'business', 'finance'],
    'tâm lý': ['tâm hồn', 'cảm xúc', 'psychology', 'tư duy', 'mental'],
    'lịch sử': ['history', 'quá khứ', 'cổ đại', 'historical'],
    'khoa học': ['science', 'khoa học kỹ thuật', 'công nghệ', 'technology'],
    'thiếu nhi': ['trẻ em', 'nhi đồng', 'children', 'kids', 'youth'],
    'trinh thám': ['detective', 'phá án', 'bí ẩn', 'mystery', 'crime'],
    'phiêu lưu': ['adventure', 'mạo hiểm', 'thám hiểm', 'exploration'],
    'văn học': ['literature', 'tiểu thuyết', 'novel', 'fiction'],
    'kỹ năng': ['skill', 'năng lực', 'competency', 'ability'],
    'sức khỏe': ['health', 'y tế', 'medical', 'wellness']
};

// Expand query with synonyms
function expandQueryWithSynonyms(query) {
    const queryLower = query.toLowerCase();
    const expandedTerms = [queryLower];

    // Check if query matches any synonym category
    for (const [key, values] of Object.entries(synonyms)) {
        if (queryLower.includes(key) || values.some(v => queryLower.includes(v))) {
            expandedTerms.push(key, ...values);
        }
    }

    return [...new Set(expandedTerms)]; // Remove duplicates
}

// Cosine similarity function
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

// Generate embedding for search query
async function generateQueryEmbedding(query) {
    try {
        const response = await axios.post(
            HF_API_URL,
            { inputs: query },
            {
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            }
        );
        return response.data;
    } catch (error) {
        console.error('HuggingFace API error:', error.message);
        return null;
    }
}

// Enhanced fuzzy search with synonym support and description matching
async function fuzzySearch(query, limit) {
    try {
        const queryLower = query.toLowerCase();
        const expandedTerms = expandQueryWithSynonyms(query);

        console.log(`Fuzzy search for "${query}" with expanded terms:`, expandedTerms);

        // MongoDB text search with expanded terms
        const textSearchPromises = expandedTerms.map(term =>
            Book.find(
                { $text: { $search: term } },
                { score: { $meta: 'textScore' } }
            )
                .populate('categories.origin', 'name slug')
                .populate('categories.genres', 'name slug')
                .limit(limit * 2)
        );

        // Regex search for partial matches in title, author, description, publisher
        const regexSearchPromises = expandedTerms.map(term =>
            Book.find({
                $or: [
                    { title: { $regex: term, $options: 'i' } },
                    { author: { $regex: term, $options: 'i' } },
                    { description: { $regex: term, $options: 'i' } },
                    { publisher: { $regex: term, $options: 'i' } }
                ]
            })
                .populate('categories.origin', 'name slug')
                .populate('categories.genres', 'name slug')
                .limit(limit * 2)
        );

        // Execute all searches in parallel
        const [textResults, regexResults] = await Promise.all([
            Promise.all(textSearchPromises),
            Promise.all(regexSearchPromises)
        ]);

        // Flatten and combine results
        const allTextResults = textResults.flat();
        const allRegexResults = regexResults.flat();

        // Combine and deduplicate
        const combinedMap = new Map();
        [...allTextResults, ...allRegexResults].forEach(book => {
            if (!combinedMap.has(book._id.toString())) {
                combinedMap.set(book._id.toString(), book);
            }
        });

        const allBooks = Array.from(combinedMap.values());

        // Calculate enhanced fuzzy scores
        const scoredBooks = allBooks.map(book => {
            const titleLower = book.title.toLowerCase();
            const authorLower = book.author.toLowerCase();
            const descriptionLower = (book.description || '').toLowerCase();
            const publisherLower = (book.publisher || '').toLowerCase();

            // String similarity for all fields
            const titleSimilarity = stringSimilarity.compareTwoStrings(queryLower, titleLower);
            const authorSimilarity = stringSimilarity.compareTwoStrings(queryLower, authorLower);
            const descriptionSimilarity = stringSimilarity.compareTwoStrings(queryLower, descriptionLower);
            const publisherSimilarity = stringSimilarity.compareTwoStrings(queryLower, publisherLower);

            // Check for exact keyword matches (high priority)
            const titleMatch = titleLower.includes(queryLower) ? 1 : 0;
            const authorMatch = authorLower.includes(queryLower) ? 1 : 0;
            const descriptionMatch = descriptionLower.includes(queryLower) ? 0.5 : 0;

            // Check for synonym matches
            let synonymMatch = 0;
            expandedTerms.forEach(term => {
                if (term !== queryLower) { // Don't double count original query
                    if (titleLower.includes(term)) synonymMatch += 0.8;
                    if (authorLower.includes(term)) synonymMatch += 0.6;
                    if (descriptionLower.includes(term)) synonymMatch += 0.4;
                }
            });

            // Levenshtein distance for typo tolerance
            const titleDistance = LevenshteinDistance(queryLower, titleLower);
            const authorDistance = LevenshteinDistance(queryLower, authorLower);
            const maxLength = Math.max(queryLower.length, titleLower.length, authorLower.length);
            const titleDistanceScore = 1 - (titleDistance / maxLength);
            const authorDistanceScore = 1 - (authorDistance / maxLength);

            // Weighted combined score (prioritizing exact matches and synonyms)
            const score =
                (titleMatch * 0.25) +              // Exact title match
                (authorMatch * 0.15) +             // Exact author match
                (titleSimilarity * 0.15) +         // Title similarity
                (authorSimilarity * 0.1) +         // Author similarity
                (Math.min(synonymMatch, 1) * 0.15) + // Synonym matches (capped at 1)
                (descriptionMatch * 0.08) +        // Description match
                (descriptionSimilarity * 0.05) +   // Description similarity
                (publisherSimilarity * 0.03) +     // Publisher similarity
                (titleDistanceScore * 0.02) +      // Typo tolerance (title)
                (authorDistanceScore * 0.02);      // Typo tolerance (author)

            return { book, score };
        });

        // Sort by score and return top results
        const results = scoredBooks
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.book);

        console.log(`Fuzzy search found ${results.length} results`);
        return results;
    } catch (error) {
        console.error('Fuzzy search error:', error);
        return [];
    }
}

// @desc    Enhanced fuzzy search (prioritized)
// @route   GET /api/search?q=<query>&limit=20
// @access  Public
export const semanticSearch = async (req, res, next) => {
    try {
        const { q: query, limit = 20 } = req.query;

        if (!query || query.trim().length < 2) {
            return res.json({
                success: true,
                data: {
                    results: [],
                    searchType: 'none',
                    message: 'Query too short'
                }
            });
        }

        const trimmedQuery = query.trim();

        // Prioritize fuzzy search (fast and reliable)
        const fuzzyResults = await fuzzySearch(trimmedQuery, parseInt(limit));

        res.json({
            success: true,
            data: {
                results: fuzzyResults,
                searchType: 'fuzzy',
                count: fuzzyResults.length
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Autocomplete suggestions
// @route   GET /api/search/suggest?q=<query>&limit=10
// @access  Public
export const autocompleteSuggestions = async (req, res, next) => {
    try {
        const { q: query, limit = 10 } = req.query;

        if (!query || query.trim().length < 2) {
            return res.json({
                success: true,
                data: { suggestions: [] }
            });
        }

        // Fast regex search for autocomplete
        const suggestions = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } }
            ]
        })
            .select('title author images price stockQuantity')
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: { suggestions }
        });
    } catch (error) {
        next(error);
    }
};
