import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import arVideoRoutes from './routes/arVideoRoutes.js';
import bookLensRoutes from './routes/bookLensRoutes.js';
import settingRoutes from './routes/settingRoutes.js';

const app = express();

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // In development, allow all origins
        if (config.nodeEnv === 'development') {
            return callback(null, true);
        }

        // In production, allow frontend URL and common dev origins
        const allowedOrigins = [
            config.frontendUrl,
            'http://localhost:5173',
            'http://localhost:5174'
        ].filter(Boolean);

        if (allowedOrigins.some(o => origin.startsWith(o))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Quá nhiều request từ IP này, vui lòng thử lại sau'
});

app.use('/api/auth', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (uploads) with proper CORS headers
app.use('/uploads', (req, res, next) => {
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');

    // Set proper Content-Type for images
    if (req.path.endsWith('.png')) {
        res.type('image/png');
    } else if (req.path.endsWith('.jpg') || req.path.endsWith('.jpeg')) {
        res.type('image/jpeg');
    } else if (req.path.endsWith('.webp')) {
        res.type('image/webp');
    } else if (req.path.endsWith('.mp4')) {
        res.type('video/mp4');
    } else if (req.path.endsWith('.webm')) {
        res.type('video/webm');
    } else if (req.path.endsWith('.mov')) {
        res.type('video/quicktime');
    }

    next();
}, express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/ar-videos', arVideoRoutes);
app.use('/api/booklens', bookLensRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route không tồn tại'
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
    console.log(`📡 Accessible at:`);
    console.log(`   - Local:   http://localhost:${PORT}`);
    console.log(`   - Network: http://<your-ip>:${PORT}`);
});

export default app;
