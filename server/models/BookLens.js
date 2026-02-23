import mongoose from 'mongoose';

const bookLensSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, 'Vui lòng nhập tiêu đề'] },
        book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        videoPath: { type: String, default: '' },
        qrCodeUrl: { type: String, default: '' },
        duration: { type: String, default: '0:00' },
        views: { type: Number, default: 0 },
        status: { type: String, enum: ['published', 'draft', 'archived'], default: 'draft' },
        description: { type: String, default: '' }
    },
    { timestamps: true }
);

export default mongoose.model('BookLens', bookLensSchema);
