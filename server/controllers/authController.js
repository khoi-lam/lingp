import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from '../utils/generateToken.js';
import {
    validateRegisterInput,
    validateLoginInput
} from '../utils/validators.js';

export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        const validation = validateRegisterInput(email, password, name);
        if (!validation.isValid) {
            return res.status(400).json({ success: false, errors: validation.errors });
        }

        const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: { email: email.toLowerCase(), password: hashedPassword, name: name.trim() }
        });

        const accessToken = generateAccessToken(user.id, user.email, user.role);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            data: {
                user: { id: user.id, _id: String(user.id), email: user.email, name: user.name, role: user.role },
                accessToken
            }
        });
    } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const validation = validateLoginInput(email, password);
        if (!validation.isValid) {
            return res.status(400).json({ success: false, errors: validation.errors });
        }

        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
        }

        const accessToken = generateAccessToken(user.id, user.email, user.role);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            data: {
                user: { id: user.id, _id: String(user.id), email: user.email, name: user.name, role: user.role },
                accessToken
            }
        });
    } catch (error) { next(error); }
};

export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Không tìm thấy refresh token' });
        }

        const decoded = verifyRefreshToken(refreshToken);
        const user = await prisma.user.findUnique({ where: { id: parseInt(decoded.userId) } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'User không tồn tại' });
        }

        const accessToken = generateAccessToken(user.id, user.email, user.role);
        res.json({ success: true, data: { accessToken } });
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Refresh token không hợp lệ' });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Đăng xuất thành công' });
};
