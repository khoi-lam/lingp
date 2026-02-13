import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const generateAccessToken = (userId, email, role) => {
    return jwt.sign(
        { userId, email, role },
        config.jwtAccessSecret,
        { expiresIn: config.jwtAccessExpire }
    );
};

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        config.jwtRefreshSecret,
        { expiresIn: config.jwtRefreshExpire }
    );
};

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, config.jwtAccessSecret);
    } catch (error) {
        throw new Error('Invalid or expired access token');
    }
};

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, config.jwtRefreshSecret);
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};
