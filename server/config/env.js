import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET'
];

// Validate required environment variables
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});

export const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtAccessExpire: process.env.JWT_ACCESS_EXPIRE || '15m',
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
    nodeEnv: process.env.NODE_ENV || 'development'
};
