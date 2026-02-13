import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        items: [
            {
                bookId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Book',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

// Index for faster lookups
cartSchema.index({ userId: 1 });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
