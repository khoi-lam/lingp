import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(req.user.userId) } });
        if (!user) return res.status(404).json({ success: false, message: 'User không tồn tại' });

        res.json({
            success: true,
            data: {
                user: { id: user.id, _id: String(user.id), email: user.email, name: user.name, role: user.role, addresses: user.addresses, createdAt: user.createdAt }
            }
        });
    } catch (error) { next(error); }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { name, addresses } = req.body;
        const data = {};
        if (name) data.name = name.trim();
        if (addresses) data.addresses = addresses;

        const user = await prisma.user.update({ where: { id: parseInt(req.user.userId) }, data });
        res.json({
            success: true,
            message: 'Cập nhật profile thành công',
            data: { user: { id: user.id, _id: String(user.id), email: user.email, name: user.name, role: user.role, addresses: user.addresses } }
        });
    } catch (error) { next(error); }
};

export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới' });
        if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });

        const user = await prisma.user.findUnique({ where: { id: parseInt(req.user.userId) } });
        if (!user) return res.status(404).json({ success: false, message: 'User không tồn tại' });

        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid) return res.status(401).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

        res.json({ success: true, message: 'Đổi mật khẩu thành công' });
    } catch (error) { next(error); }
};
