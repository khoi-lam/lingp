import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    guestName: {
        type: String,
        trim: true
    },
    guestEmail: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['support', 'return'],
        default: 'support'
    },
    title: {
        type: String,
        required: [true, 'Vui lòng nhập tiêu đề'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Vui lòng nhập nội dung'],
        trim: true
    },
    images: [{
        type: String
    }],
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'resolved', 'rejected'],
        default: 'pending'
    },
    adminReply: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Support = mongoose.model('Support', supportSchema);

export default Support;
