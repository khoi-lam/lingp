import { verifyAccessToken } from '../utils/generateToken.js';

export const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token xác thực'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verifyAccessToken(token);

        // Attach user info to request
        req.user = {
            id: decoded.userId,
            _id: decoded.userId,
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
};

// Optional authentication - verifies token if present, but allows request to continue if not
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // If no token, continue without user info (guest checkout)
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.user = null;
            return next();
        }

        const token = authHeader.split(' ')[1];

        try {
            // Verify token if present
            const decoded = verifyAccessToken(token);
            req.user = {
                _id: decoded.userId,
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            };
        } catch (error) {
            // If token is invalid, treat as guest
            req.user = null;
        }

        next();
    } catch (error) {
        next(error);
    }
};
