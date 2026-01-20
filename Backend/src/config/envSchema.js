// ==========================================
// ENVIRONMENT SCHEMA - Joi Validation
// ==========================================

const Joi = require('joi');

// ------------------------------------------
// ENVIRONMENT VARIABLES SCHEMA
// ------------------------------------------
const envSchema = Joi.object({
    // Node Environment
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development')
        .description('Application environment'),

    // Server Configuration
    PORT: Joi.number()
        .port()
        .default(3002)
        .description('Server port'),

    HOST: Joi.string()
        .default('localhost')
        .description('Server host'),

    // MongoDB Configuration
    MONGODB_URI: Joi.string()
        .required()
        .description('MongoDB connection URI'),

    DB_NAME: Joi.string()
        .default('dev')
        .description('Database name'),

    // JWT Configuration
    JWT_SECRET: Joi.string()
        .min(32)
        .required()
        .description('JWT secret key (minimum 32 characters)'),

    JWT_EXPIRES_IN: Joi.string()
        .default('24h')
        .description('JWT access token expiration'),

    JWT_REFRESH_EXPIRES_IN: Joi.string()
        .default('7d')
        .description('JWT refresh token expiration'),

    // CORS Configuration
    CORS_ORIGIN: Joi.string()
        .default('*')
        .description('Allowed CORS origins')

}).unknown(); // Allow unknown keys (system env vars)

// ------------------------------------------
// VALIDATE ENVIRONMENT VARIABLES
// ------------------------------------------
const validateEnv = () => {
    const { error, value } = envSchema.validate(process.env, {
        abortEarly: false, // Show all errors at once
        stripUnknown: false
    });

    if (error) {
        const errorMessages = error.details
            .map(detail => `  - ${detail.message}`)
            .join('\n');

        console.error('\n❌ Environment validation failed:\n');
        console.error(errorMessages);
        console.error('\n💡 Please check your .env file\n');

        // Exit in production, warn in development
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }

    return value;
};

module.exports = { envSchema, validateEnv };
