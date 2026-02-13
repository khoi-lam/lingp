import mongoose from 'mongoose';

const bookEmbeddingSchema = new mongoose.Schema(
    {
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
            unique: true
        },
        embedding: {
            type: [Number],
            required: true,
            validate: {
                validator: function (v) {
                    return v.length === 384; // sentence-transformers/all-MiniLM-L6-v2 produces 384-dimensional embeddings
                },
                message: 'Embedding must have exactly 384 dimensions'
            }
        },
        textHash: {
            type: String,
            required: true
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient queries
bookEmbeddingSchema.index({ bookId: 1 });
bookEmbeddingSchema.index({ lastUpdated: 1 });

const BookEmbedding = mongoose.model('BookEmbedding', bookEmbeddingSchema);

export default BookEmbedding;
