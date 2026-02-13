import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['hero-banner', 'about-us'],
            required: true,
            unique: true
        },
        content: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Content = mongoose.model('Content', contentSchema);

export default Content;
