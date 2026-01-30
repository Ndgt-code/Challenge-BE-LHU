// ==========================================
// CENTRALIZED CONFIGURATION
// ==========================================

require('dotenv').config();

const config = {
    // Server Configuration
    server: {
        port: parseInt(process.env.PORT) || 3002,
        env: process.env.NODE_ENV || 'development',
        isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
        isProduction: process.env.NODE_ENV === 'production'
    },

    // Database Configuration
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/challenge-be',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key-here',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },

    // OpenWeatherMap Configuration
    weather: {
        apiKey: process.env.OPENWEATHER_API_KEY,
        baseUrl: process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
        geocodingUrl: 'http://api.openweathermap.org/geo/1.0',
        timeout: 10000,
        geocodingLimit: 5
    },

    // Cache Configuration
    cache: {
        ttl: {
            current: parseInt(process.env.CACHE_TTL_CURRENT) || 300000,  // 5 minutes
            forecast: parseInt(process.env.CACHE_TTL_FORECAST) || 1800000 // 30 minutes
        }
    },

    // Security Configuration
    security: {
        rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
        rateLimitMax: 100, // requests per window
        corsOrigin: process.env.CORS_ORIGIN || '*'
    },

    // Upload Configuration
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
    }
};

// Validate required configurations
const validateConfig = () => {
    const errors = [];

    if (!config.jwt.secret || config.jwt.secret === 'your-secret-key-here') {
        errors.push('JWT_SECRET is not properly configured');
    }

    if (!config.weather.apiKey || config.weather.apiKey === 'your_api_key_here') {
        errors.push('OPENWEATHER_API_KEY is not properly configured');
    }

    if (errors.length > 0 && config.server.isProduction) {
        throw new Error(`Configuration errors:\n${errors.join('\n')}`);
    } else if (errors.length > 0) {
        console.warn('⚠️  Configuration warnings:');
        errors.forEach(err => console.warn(`   - ${err}`));
    }
};

module.exports = { config, validateConfig };
