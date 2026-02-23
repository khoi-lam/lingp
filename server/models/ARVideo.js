import mongoose from 'mongoose';

const arVideoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        videoUrl: { type: String, default: '' },
        duration: { type: String, default: '0:00' },
        views: { type: Number, default: 0 },
        status: { type: String, enum: ['published', 'draft', 'archived'], default: 'draft' },
        description: { type: String, default: '' }
    },
    { timestamps: true }
);

export default mongoose.model('ARVideo', arVideoSchema);
