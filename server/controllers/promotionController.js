import Promotion from '../models/Promotion.js';

export const getPromotions = async (req, res, next) => {
    try {
        const promotions = await Promotion.find().sort({ createdAt: -1 });
        res.json({ success: true, data: { promotions } });
    } catch (error) { next(error); }
};

export const getPromotionById = async (req, res, next) => {
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (!promotion) return res.status(404).json({ success: false, message: 'Không tìm thấy khuyến mãi' });
        res.json({ success: true, data: { promotion } });
    } catch (error) { next(error); }
};

export const createPromotion = async (req, res, next) => {
    try {
        const { name, code, discountType, discountValue, startDate, endDate, minOrderAmount, maxUses, description } = req.body;
        const exists = await Promotion.findOne({ code: code.toUpperCase() });
        if (exists) return res.status(400).json({ success: false, message: 'Mã khuyến mãi đã tồn tại' });

        const now = new Date();
        let status = 'active';
        if (new Date(startDate) > now) status = 'upcoming';
        if (new Date(endDate) < now) status = 'expired';

        const promotion = await Promotion.create({ name, code: code.toUpperCase(), discountType, discountValue, startDate, endDate, status, minOrderAmount, maxUses, description });
        res.status(201).json({ success: true, data: { promotion }, message: 'Đã tạo khuyến mãi' });
    } catch (error) { next(error); }
};

export const updatePromotion = async (req, res, next) => {
    try {
        const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!promotion) return res.status(404).json({ success: false, message: 'Không tìm thấy khuyến mãi' });
        res.json({ success: true, data: { promotion }, message: 'Đã cập nhật khuyến mãi' });
    } catch (error) { next(error); }
};

export const deletePromotion = async (req, res, next) => {
    try {
        const promotion = await Promotion.findByIdAndDelete(req.params.id);
        if (!promotion) return res.status(404).json({ success: false, message: 'Không tìm thấy khuyến mãi' });
        res.json({ success: true, message: 'Đã xoá khuyến mãi' });
    } catch (error) { next(error); }
};

export const togglePause = async (req, res, next) => {
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (!promotion) return res.status(404).json({ success: false, message: 'Không tìm thấy khuyến mãi' });
        promotion.status = promotion.status === 'paused' ? 'active' : 'paused';
        await promotion.save();
        res.json({ success: true, data: { promotion }, message: promotion.status === 'paused' ? 'Đã tạm dừng' : 'Đã kích hoạt lại' });
    } catch (error) { next(error); }
};
