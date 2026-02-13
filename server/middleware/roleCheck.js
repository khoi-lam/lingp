export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập'
            });
        }

        next();
    };
};

// Shorthand middlewares
export const requireAdmin = requireRole('admin');
export const requireUser = requireRole('user', 'admin');
