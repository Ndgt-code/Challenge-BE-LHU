// ==========================================
// SERVER CONFIGURATION
// ==========================================

// Server config object - frozen to prevent modifications
const serverConfig = Object.freeze({
    port: parseInt(process.env.PORT, 10) || 3002,
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',

    // Check if running in specific environment
    isDevelopment: process.env.NODE_ENV !== 'production',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',

    // CORS settings
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});

module.exports = serverConfig;
