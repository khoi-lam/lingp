import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
    try {
        const { type } = req.query;

        const filter = {};
        if (type) {
            filter.type = type;
        }

        const categories = await Category.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                categories,
                count: categories.length
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        res.json({
            success: true,
            data: { category }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
    try {
        const { name, type, description } = req.body;

        // Validate required fields
        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: 'Tên và loại danh mục là bắt buộc'
            });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({
            name: name.trim(),
            type
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Danh mục này đã tồn tại'
            });
        }

        const category = await Category.create({
            name: name.trim(),
            type,
            description: description?.trim()
        });

        res.status(201).json({
            success: true,
            message: 'Tạo danh mục thành công',
            data: { category }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
    try {
        const { name, type, description } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        // Update fields
        if (name) category.name = name.trim();
        if (type) category.type = type;
        if (description !== undefined) category.description = description?.trim();

        await category.save();

        res.json({
            success: true,
            message: 'Cập nhật danh mục thành công',
            data: { category }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        // TODO: Check if category is being used by any books
        // For now, we'll allow deletion

        await category.deleteOne();

        res.json({
            success: true,
            message: 'Xóa danh mục thành công'
        });
    } catch (error) {
        next(error);
    }
};
