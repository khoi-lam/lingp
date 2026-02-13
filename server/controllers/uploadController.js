import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

        // Get uploaded file URLs
        const urls = req.files.map(file => {
            return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        });

        res.json({
            success: true,
            message: 'Upload ảnh thành công',
            data: { urls }
        });
    } catch (error) {
        next(error);
    }
};
