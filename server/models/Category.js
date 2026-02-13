import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên danh mục là bắt buộc'],
            trim: true
        },
        type: {
            type: String,
            enum: ['origin', 'genre'], // xuất xứ (trong nước/ngoài nước) hoặc thể loại (văn học, khoa học, etc.)
            required: [true, 'Loại danh mục là bắt buộc']
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true
        },
        description: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Generate slug from name before saving
categorySchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
