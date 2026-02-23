import prisma from '../lib/prisma.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const basicSearch = async (queryText, limit = 5) => {
    const keywords = queryText.split(/\s+/).filter(w => w.length > 2);
    if (keywords.length === 0) return [];

    const where = {
        AND: keywords.map(k => ({
            OR: [
                { title: { contains: k, mode: 'insensitive' } },
                { description: { contains: k, mode: 'insensitive' } }
            ]
        })),
        stockQuantity: { gt: 0 }
    };

    return await prisma.book.findMany({ where, take: limit });
};

const generateAdvancedAIResponse = async (userMessage, localBooks) => {
    const HF_API_KEY = process.env.HF_API_KEY;
    if (!HF_API_KEY) return "Chào bạn! Tôi có thể giúp gì cho bạn?";

    const localBookList = localBooks.length > 0
        ? localBooks.map(b => `- "${b.title}" (${b.author}): ${b.description?.substring(0, 100)}`).join('\n')
        : "Không có sách phù hợp trong kho.";

    const messages = [
        { role: "system", content: "Bạn là trợ lý tư vấn sách chuyên nghiệp của Bookstore. Hãy trả lời câu hỏi của khách hàng bằng tiếng Việt một cách thông minh, nhiệt tình và có tâm." },
        { role: "user", content: `Hãy giải quyết yêu cầu khách hàng: "${userMessage}"\n\nDữ liệu sách tại cửa hàng:\n${localBookList}` }
    ];

    const MODELS = ['meta-llama/Meta-Llama-3-8B-Instruct', 'mistralai/Mistral-7B-Instruct-v0.2', 'microsoft/Phi-3-mini-4k-instruct'];

    for (const modelId of MODELS) {
        let retries = 2;
        while (retries > 0) {
            try {
                const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${HF_API_KEY}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: modelId, messages, max_tokens: 800, temperature: 0.7 })
                });
                if (response.ok) {
                    const data = await response.json();
                    const content = data.choices?.[0]?.message?.content?.trim();
                    if (content) return content;
                }
                if (response.status === 429 || response.status === 503) { await new Promise(r => setTimeout(r, 1000)); retries--; continue; }
                break;
            } catch (e) { retries--; }
        }
    }
    return "Hiện tại AI đang bận. Bạn có thể tìm kiếm trực tiếp trên thanh công cụ nhé!";
};

const OFF_TOPIC_PATTERNS = [/thời tiết|weather|trời.*nắng|trời.*mưa|địa chỉ|bản đồ/i];
const isOffTopic = (message) => OFF_TOPIC_PATTERNS.some(p => p.test(message));

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message?.trim()) return res.status(400).json({ success: false, message: 'Nhập tin nhắn' });

        if (isOffTopic(message)) {
            return res.json({ success: true, data: { response: 'Tôi chỉ có thể hỗ trợ bạn về sách thôi nhé!', books: [], isBookRelated: false } });
        }

        const foundBooks = await basicSearch(message);
        const aiResponse = await generateAdvancedAIResponse(message, foundBooks);

        const bookSuggestions = foundBooks.map(book => ({
            _id: String(book.id),
            title: book.title,
            author: book.author,
            priceFormatted: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price),
            image: book.images?.[0] || '/uploads/books/default-book-cover.png',
            description: book.description?.substring(0, 100) || ''
        }));

        res.json({ success: true, data: { response: aiResponse, books: bookSuggestions, isBookRelated: true } });
    } catch (error) {
        console.error('[ChatAI] Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

export const getChatSuggestions = async (req, res) => {
    res.json({ success: true, data: ['Sách về lập trình', 'Phát triển bản thân', 'Tiểu thuyết kinh điển', 'Sách kinh doanh'] });
};
