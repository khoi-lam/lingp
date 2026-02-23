import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false // Allow guest checkout
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Book',
                    required: true
                },
                title: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },
        shippingAddress: {
            fullName: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
            city: {
                type: String
            },
            note: String
        },
        orderStatus: {
            type: String,
            enum: ['processing', 'shipping', 'completed', 'cancelled'],
            default: 'processing'
        },
        paymentMethod: {
            type: String,
            enum: ['cod', 'vnpay', 'transfer'],
            default: 'cod'
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        },
        vnpayTransactionId: String,
        cancelledReason: String,
        trackingNumber: String
    },
    {
        timestamps: true
    }
);

// Indexes for querying
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;

