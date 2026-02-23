import prisma from '../lib/prisma.js';

export const getAIRecommendations = async (req, res) => {
    try {
        const { bookId } = req.params;
        const targetBook = await prisma.book.findUnique({
            where: { id: parseInt(bookId) },
            include: { genres: true }
        });

        if (!targetBook) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
        }

        const targetGenreIds = targetBook.genres.map(g => g.categoryId);

        // Find books with same genres, excluding the target
        let recommendations = [];
        if (targetGenreIds.length > 0) {
            recommendations = await prisma.book.findMany({
                where: {
                    id: { not: targetBook.id },
                    stockQuantity: { gt: 0 },
                    genres: { some: { categoryId: { in: targetGenreIds } } }
                },
                orderBy: { soldCount: 'desc' },
                take: 8
            });
        }

        // If not enough, fill with popular books
        if (recommendations.length < 8) {
            const existingIds = [targetBook.id, ...recommendations.map(r => r.id)];
            const more = await prisma.book.findMany({
                where: { id: { notIn: existingIds }, stockQuantity: { gt: 0 } },
                orderBy: { soldCount: 'desc' },
                take: 8 - recommendations.length
            });
            recommendations.push(...more);
        }

        res.json({
            success: true,
            data: {
                recommendations: recommendations.map(b => ({
                    _id: String(b.id), title: b.title, author: b.author, price: b.price,
                    images: b.images, slug: b.slug, score: 0
                })),
                count: recommendations.length,
                targetBook: { _id: String(targetBook.id), title: targetBook.title }
            }
        });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi tạo gợi ý', error: error.message });
    }
};
