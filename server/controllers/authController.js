import User from '../models/User.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from '../utils/generateToken.js';
import {
    validateRegisterInput,
    validateLoginInput
} from '../utils/validators.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        // Validate input
        const validation = validateRegisterInput(email, password, name);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                errors: validation.errors
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được sử dụng'
            });
        }

        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            password,
            name: name.trim()
        });

        // Generate tokens
        const accessToken = generateAccessToken(user._id, user.email, user.role);
        const refreshToken = generateRefreshToken(user._id);

        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                accessToken
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        const validation = validateLoginInput(email, password);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                errors: validation.errors
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id, user.email, user.role);
        const refreshToken = generateRefreshToken(user._id);

        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                accessToken
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy refresh token'
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Find user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User không tồn tại'
            });
        }

        // Generate new access token
        const accessToken = generateAccessToken(user._id, user.email, user.role);

        res.json({
            success: true,
            data: {
                accessToken
            }
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Refresh token không hợp lệ'
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    res.clearCookie('refreshToken');
    res.json({
        success: true,
        message: 'Đăng xuất thành công'
    });
};
