import prisma from '../lib/prisma.js';

const DEFAULT_SETTINGS = { bankName: '', bankAccount: '', bankHolder: '', bankContent: '', bankQR: '' };

export const getSettings = async (req, res, next) => {
    try {
        const settings = await prisma.setting.findMany();
        const result = { ...DEFAULT_SETTINGS };
        settings.forEach(s => { result[s.key] = s.value; });
        res.json({ success: true, data: { settings: result } });
    } catch (error) { next(error); }
};

export const updateSettings = async (req, res, next) => {
    try {
        const updates = req.body;
        const ops = Object.entries(updates).map(([key, value]) =>
            prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
        );
        await Promise.all(ops);
        res.json({ success: true, message: 'Đã cập nhật cài đặt' });
    } catch (error) { next(error); }
};
