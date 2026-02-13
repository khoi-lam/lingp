import Content from '../models/Content.js';

// @desc    Get content by type
// @route   GET /api/content/:type
// @access  Public
export const getContent = async (req, res, next) => {
    try {
        const { type } = req.params;

        const content = await Content.findOne({ type });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy nội dung'
            });
        }

        res.json({
            success: true,
            data: { content }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update hero banner
// @route   PUT /api/content/hero-banner
// @access  Private/Admin
export const updateHeroBanner = async (req, res, next) => {
    try {
        const { images } = req.body;

        let content = await Content.findOne({ type: 'hero-banner' });

        if (!content) {
            content = await Content.create({
                type: 'hero-banner',
                content: { images: images || [] }
            });
        } else {
            content.content = { images: images || [] };
            await content.save();
        }

        res.json({
            success: true,
            message: 'Cập nhật hero banner thành công',
            data: { content }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update about us
// @route   PUT /api/content/about-us
// @access  Private/Admin
export const updateAboutUs = async (req, res, next) => {
    try {
        const { content: htmlContent } = req.body;

        let content = await Content.findOne({ type: 'about-us' });

        if (!content) {
            content = await Content.create({
                type: 'about-us',
                content: { data: htmlContent || '' }
            });
        } else {
            content.content = { data: htmlContent || '' };
            await content.save();
        }

        res.json({
            success: true,
            message: 'Cập nhật about us thành công',
            data: { content }
        });
    } catch (error) {
        next(error);
    }
};
