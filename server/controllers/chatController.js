import Book from '../models/Book.js';
import BookEmbedding from '../models/BookEmbedding.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from the server root
dotenv.config({ path: path.join(__dirname, '../.env') });

// ============================================
// AI UTILITIES - ADVANCED RESEARCH FLOW
// ============================================

/**
 * Generate embedding for user query
 */
const generateQueryEmbedding = async (text) => {
    const HF_API_KEY = process.env.HF_API_KEY;
    if (!HF_API_KEY) return null;

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
            console.error(`[ChatAI] Embedding API Error: ${response.status}`);
            return null;
        }

        const embedding = await response.json();
        return Array.isArray(embedding) ? embedding : null;
    } catch (e) {
        console.error('[ChatAI] Embedding Fetch Error:', e);
        return null;
    }
};

const cosineSimilarity = (vecA, vecB) => {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    return (normA === 0 || normB === 0) ? 0 : dotProduct / (normA * normB);
};

/**
 * Semantic Search in Local Database
 */
const semanticSearch = async (queryText, limit = 5) => {
    try {
        const queryVector = await generateQueryEmbedding(queryText);
        if (!queryVector) {
            console.log('[ChatAI] No query vector, falling back to regex search');
            return await basicRegexSearch(queryText, limit);
        }

        // Fetch embeddings with a timeout protection
        const allEmbeddings = await BookEmbedding.find().lean().maxTimeMS(5000);

        const scoredIds = allEmbeddings.map(emb => ({
            bookId: emb.bookId,
            score: cosineSimilarity(queryVector, emb.embedding)
        }))
            .filter(item => item.score > 0.65)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        if (scoredIds.length === 0) return [];

        const books = await Book.find({
            _id: { $in: scoredIds.map(s => s.bookId) },
            stockQuantity: { $gt: 0 }
        }).lean();

        return scoredIds.map(s => {
            const book = books.find(b => b._id.toString() === s.bookId.toString());
            return book ? { ...book, aiScore: s.score } : null;
        }).filter(b => b !== null);
    } catch (error) {
        console.error('[ChatAI] Semantic Search Error:', error);
        return await basicRegexSearch(queryText, limit);
    }
};

const basicRegexSearch = async (queryText, limit = 5) => {
    const keywords = queryText.split(/\s+/).filter(w => w.length > 2);
    if (keywords.length === 0) return [];

    const conditions = keywords.map(k => ({
        $or: [{ title: new RegExp(k, 'i') }, { description: new RegExp(k, 'i') }]
    }));

    return await Book.find({
        $and: conditions,
        stockQuantity: { $gt: 0 }
    }).limit(limit).lean();
};

/**
 * Advanced Response Generation (Using Zephyr - more stable on HF router)
 */
/**
 * Advanced Response Generation with Multi-Model Fallback
 */
const generateAdvancedAIResponse = async (userMessage, localBooks) => {
    const HF_API_KEY = process.env.HF_API_KEY;
    if (!HF_API_KEY) {
        console.error('[ChatAI] HF_API_KEY is missing');
        return "Chào bạn! Tôi có thể giúp gì cho bạn?";
    }

    const localBookList = localBooks.length > 0
        ? localBooks.map(b => `- "${b.title}" (${b.author}): ${b.description?.substring(0, 100)}`).join('\n')
        : "Không có sách phù hợp trong kho.";

    const messages = [
        {
            role: "system",
            content: "Bạn là trợ lý tư vấn sách chuyên nghiệp của Bookstore. Hãy trả lời câu hỏi của khách hàng bằng tiếng Việt một cách thông minh, nhiệt tình và có tâm."
        },
        {
            role: "user",
            content: `Hãy giải quyết yêu cầu khách hàng: "${userMessage}"

Yêu cầu định dạng câu trả lời (Markdown):
1. **Mô tả về thể loại**: Hãy giải thích ngắn gọn về thể loại/chủ đề mà khách hàng đang hỏi.
2. **Top 5 cuốn sách hay nhất**: Đề xuất 5 cuốn sách nổi tiếng nhất thế giới trong lĩnh vực này (kèm tác giả).
3. **Sách hiện có tại Bookstore**: Dựa vào danh sách dưới đây, hãy giới thiệu những cuốn phù hợp nhất đang có tại cửa hàng chúng tôi. Nếu danh sách dưới đây không phù hợp hoặc không có, hãy lịch sự thông báo là hiện tại cửa hàng chưa nhập loại sách đó và gợi ý họ xem các chủ đề khác.

Dữ liệu sách tại cửa hàng:
${localBookList}`
        }
    ];

    // List of models to try in order (Fallback System)
    const MODELS = [
        'meta-llama/Meta-Llama-3-8B-Instruct',
        'mistralai/Mistral-7B-Instruct-v0.2',
        'microsoft/Phi-3-mini-4k-instruct'
    ];

    for (const modelId of MODELS) {
        let retries = 2; // Retry each model twice if it's a transient error
        while (retries > 0) {
            try {
                console.log(`[ChatAI] Attempting AI generation with model: ${modelId} (Retries left: ${retries - 1})`);
                const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${HF_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: modelId,
                        messages: messages,
                        max_tokens: 800,
                        temperature: 0.7
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const content = data.choices?.[0]?.message?.content?.trim();
                    if (content) {
                        console.log(`[ChatAI] Successfully generated response using ${modelId}`);
                        return content;
                    }
                }

                const errData = await response.json().catch(() => ({}));
                console.warn(`[ChatAI] Model ${modelId} failed (${response.status}):`, errData.error?.message || 'Unknown error');

                // If its a 429 (Rate Limit) or 503 (Overloaded), wait and retry
                if (response.status === 429 || response.status === 503) {
                    await new Promise(r => setTimeout(r, 1000));
                    retries--;
                    continue;
                }

                // Otherwise move to next model
                break;
            } catch (e) {
                console.error(`[ChatAI] Fetch Error for ${modelId}:`, e.message);
                retries--;
            }
        }
    }

    return "Tôi thấy chủ đề bạn quan tâm rất hay, nhưng hiện tại các bộ não AI của tôi đang bận xử lý dữ liệu một chút. Bạn có thể hỏi lại sau hoặc tìm kiếm trực tiếp trên thanh công cụ nhé!";
};

const OFF_TOPIC_PATTERNS = [
    /thời tiết|weather|trời.*nắng|trời.*mưa|địa chỉ|bản đồ/i
];

const isOffTopic = (message) => OFF_TOPIC_PATTERNS.some(p => p.test(message));

// ============================================
// MAIN CONTROLLER
// ============================================

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message?.trim()) return res.status(400).json({ success: false, message: 'Nhập tin nhắn' });

        console.log(`[ChatAI] Request: "${message}"`);

        if (isOffTopic(message)) {
            return res.json({ success: true, data: { response: 'Tôi chỉ có thể hỗ trợ bạn về sách thôi nhé! Bạn có thể hỏi về các chủ đề như tâm lý, lập trình, hay tình yêu chẳng hạn.', books: [], isBookRelated: false } });
        }

        const foundBooks = await semanticSearch(message);

        const aiResponse = await generateAdvancedAIResponse(message, foundBooks);

        const bookSuggestions = foundBooks.map(book => ({
            _id: book._id,
            title: book.title,
            author: book.author,
            priceFormatted: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price),
            image: book.images?.[0] || '/uploads/books/default-book-cover.png',
            description: book.description?.substring(0, 100) || ''
        }));

        res.json({
            success: true,
            data: {
                response: aiResponse,
                books: bookSuggestions,
                isBookRelated: true
            }
        });
    } catch (error) {
        console.error('[ChatAI] Controller Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

export const getChatSuggestions = async (req, res) => {
    res.json({ success: true, data: ['Sách về lập trình', 'Phát triển bản thân', 'Tiểu thuyết kinh điển', 'Sách kinh doanh'] });
};
