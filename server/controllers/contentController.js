import prisma from '../lib/prisma.js';

export const getContent = async (req, res, next) => {
    try {
        const { type } = req.params;
        const typeMap = { 'hero-banner': 'hero_banner', 'about-us': 'about_us' };
        const content = await prisma.content.findUnique({ where: { type: typeMap[type] || type } });
        if (!content) return res.status(404).json({ success: false, message: 'Không tìm thấy nội dung' });
        res.json({ success: true, data: { content: { ...content, _id: String(content.id) } } });
    } catch (error) { next(error); }
};

export const updateHeroBanner = async (req, res, next) => {
    try {
        const { images } = req.body;
        const content = await prisma.content.upsert({
            where: { type: 'hero_banner' },
            update: { content: { images: images || [] } },
            create: { type: 'hero_banner', content: { images: images || [] } }
        });
        res.json({ success: true, message: 'Cập nhật hero banner thành công', data: { content: { ...content, _id: String(content.id) } } });
    } catch (error) { next(error); }
};

export const updateAboutUs = async (req, res, next) => {
    try {
        const { content: htmlContent } = req.body;
        const content = await prisma.content.upsert({
            where: { type: 'about_us' },
            update: { content: { data: htmlContent || '' } },
            create: { type: 'about_us', content: { data: htmlContent || '' } }
        });
        res.json({ success: true, message: 'Cập nhật about us thành công', data: { content: { ...content, _id: String(content.id) } } });
    } catch (error) { next(error); }
};
