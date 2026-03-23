import prisma from '../lib/prisma.js';

function fmt(p) {
    if (!p) return null;
    return { _id: String(p.id), ...p };
}

export const getPromotions = async (req, res, next) => {
    try {
        const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: { promotions: promotions.map(fmt) } });
    } catch (error) { next(error); }
};

export const getPromotionById = async (req, res, next) => {
    try {
        const promotion = await prisma.promotion.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!promotion) return res.status(404).json({ success: false, message: 'Không tìm thấy khuyến mãi' });
        res.json({ success: true, data: { promotion: fmt(promotion) } });
    } catch (error) { next(error); }
};

export const createPromotion = async (req, res, next) => {
    try {
        const { name, code, discountType, discountValue, startDate, endDate, minOrderAmount, maxUses, description } = req.body;

        const exists = await prisma.promotion.findUnique({ where: { code: code.toUpperCase() } });
        if (exists) return res.status(400).json({ success: false, message: 'Mã khuyến mãi đã tồn tại' });

        const now = new Date();
        let status = 'active';
        if (new Date(startDate) > now) status = 'upcoming';
        if (new Date(endDate) < now) status = 'expired';

        const promotion = await prisma.promotion.create({
            data: {
                name, code: code.toUpperCase(), discountType,
                discountValue: parseFloat(discountValue),
                startDate: new Date(startDate), endDate: new Date(endDate),
                status, minOrderAmount: parseFloat(minOrderAmount) || 0,
                maxUses: parseInt(maxUses) || 0, description: description || ''
            }
        });
        res.status(201).json({ success: true, data: { promotion: fmt(promotion) }, message: 'Đã tạo khuyến mãi' });
    } catch (error) { next(error); }
};

export const updatePromotion = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await prisma.promotion.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy khuyến mãi' });

        const { name, code, discountType, discountValue, startDate, endDate, minOrderAmount, maxUses, description, status } = req.body;
        const data = {};
        if (name !== undefined) data.name = name;
        if (code !== undefined) data.code = code.toUpperCase();
        if (discountType !== undefined) data.discountType = discountType;
        if (discountValue !== undefined) data.discountValue = parseFloat(discountValue);
        if (startDate !== undefined) data.startDate = new Date(startDate);
        if (endDate !== undefined) data.endDate = new Date(endDate);
        if (minOrderAmount !== undefined) data.minOrderAmount = parseFloat(minOrderAmount);
        if (maxUses !== undefined) data.maxUses = parseInt(maxUses);
        if (description !== undefined) data.description = description;
        if (status !== undefined) data.status = status;

        const promotion = await prisma.promotion.update({ where: { id }, data });
        res.json({ success: true, data: { promotion: fmt(promotion) }, message: 'Đã cập nhật khuyến mãi' });
    } catch (error) { next(error); }
};

export const deletePromotion = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await prisma.promotion.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy khuyến mãi' });
        await prisma.promotion.delete({ where: { id } });
        res.json({ success: true, message: 'Đã xoá khuyến mãi' });
    } catch (error) { next(error); }
};

export const togglePause = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const promotion = await prisma.promotion.findUnique({ where: { id } });
        if (!promotion) return res.status(404).json({ success: false, message: 'Không tìm thấy khuyến mãi' });

        const newStatus = promotion.status === 'paused' ? 'active' : 'paused';
        const updated = await prisma.promotion.update({ where: { id }, data: { status: newStatus } });
        res.json({ success: true, data: { promotion: fmt(updated) }, message: newStatus === 'paused' ? 'Đã tạm dừng' : 'Đã kích hoạt lại' });
    } catch (error) { next(error); }
};
