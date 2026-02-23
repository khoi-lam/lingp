import prisma from '../lib/prisma.js';
import { generateSlug } from '../utils/slug.js';

function fmt(cat) {
    if (!cat) return null;
    return { _id: String(cat.id), id: cat.id, name: cat.name, type: cat.type, slug: cat.slug, description: cat.description, createdAt: cat.createdAt, updatedAt: cat.updatedAt };
}

export const getCategories = async (req, res, next) => {
    try {
        const { type } = req.query;
        const where = type ? { type } : {};
        const categories = await prisma.category.findMany({ where, orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: { categories: categories.map(fmt), count: categories.length } });
    } catch (error) { next(error); }
};

export const getCategoryById = async (req, res, next) => {
    try {
        const category = await prisma.category.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!category) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
        res.json({ success: true, data: { category: fmt(category) } });
    } catch (error) { next(error); }
};

export const createCategory = async (req, res, next) => {
    try {
        const { name, type, description } = req.body;
        if (!name || !type) return res.status(400).json({ success: false, message: 'Tên và loại danh mục là bắt buộc' });

        const existing = await prisma.category.findFirst({ where: { name: name.trim(), type } });
        if (existing) return res.status(400).json({ success: false, message: 'Danh mục này đã tồn tại' });

        const category = await prisma.category.create({
            data: { name: name.trim(), type, slug: generateSlug(name.trim()), description: description?.trim() || null }
        });
        res.status(201).json({ success: true, message: 'Tạo danh mục thành công', data: { category: fmt(category) } });
    } catch (error) { next(error); }
};

export const updateCategory = async (req, res, next) => {
    try {
        const { name, type, description } = req.body;
        const id = parseInt(req.params.id);
        const existing = await prisma.category.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });

        const data = {};
        if (name) { data.name = name.trim(); data.slug = generateSlug(name.trim()); }
        if (type) data.type = type;
        if (description !== undefined) data.description = description?.trim() || null;

        const category = await prisma.category.update({ where: { id }, data });
        res.json({ success: true, message: 'Cập nhật danh mục thành công', data: { category: fmt(category) } });
    } catch (error) { next(error); }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
        await prisma.category.delete({ where: { id } });
        res.json({ success: true, message: 'Xóa danh mục thành công' });
    } catch (error) { next(error); }
};
