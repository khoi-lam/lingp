export const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // Prisma known request errors
    if (err.code === 'P2002') {
        const field = err.meta?.target?.[0] || 'field';
        return res.status(400).json({
            success: false,
            message: `${field} đã tồn tại`
        });
    }

    if (err.code === 'P2022') {
        return res.status(500).json({
            success: false,
            message: 'Lỗi cấu trúc database. Vui lòng liên hệ admin.'
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy bản ghi'
        });
    }

    // Prisma validation errors
    if (err.name === 'PrismaClientValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ'
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token đã hết hạn'
        });
    }

    // Default error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Lỗi server'
    });
};
