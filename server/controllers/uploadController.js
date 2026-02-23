import cloudinary from '../config/cloudinary.js';

/**
 * Upload buffer to Cloudinary
 */
const uploadToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
        stream.end(buffer);
    });
};

// @desc    Upload images
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
        }

        const urls = [];
        for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer, {
                folder: 'lingoland/uploads',
                resource_type: 'image',
            });
            urls.push(result.secure_url);
        }

        res.json({
            success: true,
            message: 'Upload ảnh thành công',
            data: { urls }
        });
    } catch (error) {
        next(error);
    }
};
