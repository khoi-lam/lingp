import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required: true, unique: true, uppercase: true },
        discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
        discountValue: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { type: String, enum: ['active', 'upcoming', 'expired', 'paused'], default: 'active' },
        usedCount: { type: Number, default: 0 },
        minOrderAmount: { type: Number, default: 0 },
        maxUses: { type: Number, default: 0 },
        description: { type: String, default: '' }
    },
    { timestamps: true }
);

export default mongoose.model('Promotion', promotionSchema);
