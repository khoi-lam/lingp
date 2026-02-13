import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Tên sách là bắt buộc'],
            trim: true
        },
        author: {
            type: String,
            required: [true, 'Tác giả là bắt buộc'],
            trim: true
        },
        publisher: {
            type: String,
            trim: true
        },
        isbn: {
            type: String,
            unique: true,
            sparse: true // Allow multiple null values
        },
        description: {
            type: String,
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Giá là bắt buộc'],
            min: [0, 'Giá phải lớn hơn 0']
        },
        stockQuantity: {
            type: Number,
            required: [true, 'Số lượng là bắt buộc'],
            min: [0, 'Số lượng không thể âm'],
            default: 0
        },
        soldCount: {
            type: Number,
            default: 0,
            min: 0
        },
        images: [
            {
                type: String
            }
        ],
        categories: {
            origin: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category'
            },
            genres: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Category'
                }
            ]
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true
        }
    },
    {
        timestamps: true
    }
);

// Generate slug from title before saving
bookSchema.pre('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    next();
});

// Text index for search
bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ slug: 1 });
bookSchema.index({ 'categories.genres': 1 });

const Book = mongoose.model('Book', bookSchema);

export default Book;
