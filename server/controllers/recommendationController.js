import crypto from 'crypto';
import Book from '../models/Book.js';
import BookEmbedding from '../models/BookEmbedding.js';

// Cache duration: 7 days
const CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Generate embedding using Hugging Face API
 */
const generateEmbedding = async (text) => {
    const HF_API_KEY = process.env.HF_API_KEY;

    if (!HF_API_KEY) {
        throw new Error('HF_API_KEY is not configured in environment variables');
    }

    try {
        const response = await fetch(
            'https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: text,
                    options: { wait_for_model: true }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
        }

        const embedding = await response.json();

        // The API returns the embedding directly as an array
        if (Array.isArray(embedding) && embedding.length === 384) {
            return embedding;
        }

        throw new Error('Invalid embedding format from Hugging Face API');
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
};

/**
 * Create hash of text to detect changes
 */
const createTextHash = (text) => {
    return crypto.createHash('md5').update(text).digest('hex');
};

/**
 * Get or create embedding for a book
 */
const getOrCreateEmbedding = async (book) => {
    // Create text representation of the book
    const bookText = `${book.title} ${book.author} ${book.description || ''}`.trim();
    const textHash = createTextHash(bookText);

    // Check if embedding exists and is valid
    let bookEmbedding = await BookEmbedding.findOne({ bookId: book._id });

    const now = new Date();
    const needsUpdate = !bookEmbedding ||
        bookEmbedding.textHash !== textHash ||
        (now - bookEmbedding.lastUpdated) > CACHE_DURATION_MS;

    if (needsUpdate) {
        console.log(`Generating new embedding for book: ${book.title}`);

        // Generate new embedding
        const embedding = await generateEmbedding(bookText);

        if (bookEmbedding) {
            // Update existing
            bookEmbedding.embedding = embedding;
            bookEmbedding.textHash = textHash;
            bookEmbedding.lastUpdated = now;
            await bookEmbedding.save();
        } else {
            // Create new
            bookEmbedding = await BookEmbedding.create({
                bookId: book._id,
                embedding,
                textHash,
                lastUpdated: now
            });
        }
    }

    return bookEmbedding.embedding;
};

/**
 * Calculate cosine similarity between two vectors
 */
const cosineSimilarity = (vecA, vecB) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (normA * normB);
};

/**
 * Calculate hybrid score combining AI similarity, genre, price, and popularity
 */
const calculateHybridScore = (targetBook, candidateBook, targetEmbedding, candidateEmbedding) => {
    // 1. AI Similarity (60%)
    const aiSimilarity = cosineSimilarity(targetEmbedding, candidateEmbedding);
    const aiScore = aiSimilarity * 0.6;

    // 2. Genre Match (20%)
    let genreScore = 0;
    const targetGenres = targetBook.categories?.genres?.map(g => g.toString()) || [];
    const candidateGenres = candidateBook.categories?.genres?.map(g => g.toString()) || [];

    if (targetGenres.length > 0 && candidateGenres.length > 0) {
        const intersection = targetGenres.filter(g => candidateGenres.includes(g));
        if (intersection.length > 0) {
            genreScore = 1.0; // Same genre
        } else {
            genreScore = 0.5; // Different genre but both have genres
        }
    }
    genreScore *= 0.2;

    // 3. Price Range (10%)
    let priceScore = 0;
    if (targetBook.price && candidateBook.price) {
        const priceDiff = Math.abs(targetBook.price - candidateBook.price);
        const priceRange = targetBook.price * 0.2; // 20% range

        if (priceDiff <= priceRange) {
            priceScore = 1.0 - (priceDiff / priceRange) * 0.5; // Linear decay
        } else {
            priceScore = 0.5 * (1 - Math.min(priceDiff / targetBook.price, 1));
        }
    }
    priceScore *= 0.1;

    // 4. Popularity (10%)
    const maxSoldCount = Math.max(targetBook.soldCount || 0, candidateBook.soldCount || 0, 1);
    const popularityScore = ((candidateBook.soldCount || 0) / maxSoldCount) * 0.1;

    // Total score
    const totalScore = aiScore + genreScore + priceScore + popularityScore;

    return {
        total: totalScore,
        breakdown: {
            ai: aiScore,
            genre: genreScore,
            price: priceScore,
            popularity: popularityScore
        }
    };
};

/**
 * Get AI-powered recommendations for a book
 * GET /api/recommendations/books/:bookId/ai-recommendations
 */
export const getAIRecommendations = async (req, res) => {
    try {
        const { bookId } = req.params;

        // Fetch target book
        const targetBook = await Book.findById(bookId).populate('categories.genres');

        if (!targetBook) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách'
            });
        }

        // Get or create embedding for target book
        const targetEmbedding = await getOrCreateEmbedding(targetBook);

        // Fetch all other books with their embeddings
        const allBooks = await Book.find({
            _id: { $ne: bookId },
            stockQuantity: { $gt: 0 } // Only recommend books in stock
        }).populate('categories.genres');

        // Calculate scores for all candidate books
        const scoredBooks = [];

        for (const candidateBook of allBooks) {
            try {
                // Get or create embedding for candidate
                const candidateEmbedding = await getOrCreateEmbedding(candidateBook);

                // Calculate hybrid score
                const scoreData = calculateHybridScore(
                    targetBook,
                    candidateBook,
                    targetEmbedding,
                    candidateEmbedding
                );

                scoredBooks.push({
                    book: candidateBook,
                    score: scoreData.total,
                    breakdown: scoreData.breakdown
                });
            } catch (error) {
                console.error(`Error processing book ${candidateBook._id}:`, error);
                // Skip this book if embedding generation fails
            }
        }

        // Sort by score and take top 8
        scoredBooks.sort((a, b) => b.score - a.score);
        const topRecommendations = scoredBooks.slice(0, 8);

        // Format response
        const recommendations = topRecommendations.map(item => ({
            _id: item.book._id,
            title: item.book.title,
            author: item.book.author,
            price: item.book.price,
            images: item.book.images,
            slug: item.book.slug,
            score: item.score,
            scoreBreakdown: item.breakdown
        }));

        res.json({
            success: true,
            data: {
                recommendations,
                count: recommendations.length,
                targetBook: {
                    _id: targetBook._id,
                    title: targetBook.title
                }
            }
        });

    } catch (error) {
        console.error('Error getting AI recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo gợi ý AI',
            error: error.message
        });
    }
};
