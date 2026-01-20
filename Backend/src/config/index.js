// ==========================================
// CONFIG INDEX - Centralized Configuration
// ==========================================

const { validateEnv } = require('./envSchema');
const serverConfig = require('./server');
const { databaseConfig, connectDB, disconnectDB } = require('./database');
const { jwtConfig, JWT_CONFIG, generateToken, generateRefreshToken, verifyToken, decodeToken } = require('./jwt');

// ------------------------------------------
// VALIDATE ENVIRONMENT ON IMPORT
// ------------------------------------------
// This runs when config is first imported
validateEnv();

// ------------------------------------------
// EXPORT ALL CONFIGS
// ------------------------------------------
module.exports = {
    // Server
    server: serverConfig,

    // Database
    database: databaseConfig,
    connectDB,
    disconnectDB,

    // JWT
    jwt: jwtConfig,
    JWT_CONFIG,
    generateToken,
    generateRefreshToken,
    verifyToken,
    decodeToken,

    // Utility function to log config status
    logConfigStatus: () => {
        console.log('\n📋 Configuration Status:');
        console.log(`   Environment: ${serverConfig.nodeEnv}`);
        console.log(`   Port: ${serverConfig.port}`);
        console.log(`   Database: ${databaseConfig.name}`);
        console.log(`   JWT Secret: ${process.env.JWT_SECRET ? '✅ Set' : '⚠️ Using default'}`);
        console.log('');
    }
};
