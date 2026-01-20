// ==========================================
// JWT CONFIGURATION & UTILITIES
// ==========================================

const jwt = require('jsonwebtoken');

// ------------------------------------------
// JWT CONFIGURATION (frozen to prevent modifications)
// ------------------------------------------
const jwtConfig = Object.freeze({
    secretKey: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
});

// Legacy export for backward compatibility
const JWT_CONFIG = {
    SECRET_KEY: jwtConfig.secretKey,
    EXPIRES_IN: jwtConfig.expiresIn,
    REFRESH_EXPIRES_IN: jwtConfig.refreshExpiresIn
};

// ------------------------------------------
// GENERATE ACCESS TOKEN
// ------------------------------------------
/**
 * Create a JWT token for authenticated user
 * @param {Object} payload - User data to include in token
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
    return jwt.sign(
        payload,
        JWT_CONFIG.SECRET_KEY,
        { expiresIn: JWT_CONFIG.EXPIRES_IN }
    );
};

// ------------------------------------------
// GENERATE REFRESH TOKEN (Optional)
// ------------------------------------------
/**
 * Create a refresh token with longer expiration
 * @param {Object} payload - User data to include in token
 * @returns {String} Refresh token
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        JWT_CONFIG.SECRET_KEY,
        { expiresIn: JWT_CONFIG.REFRESH_EXPIRES_IN }
    );
};

// ------------------------------------------
// VERIFY TOKEN
// ------------------------------------------
/**
 * Verify and decode a JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded payload if valid
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_CONFIG.SECRET_KEY);
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        }
        throw new Error('Token verification failed');
    }
};

// ------------------------------------------
// DECODE TOKEN (without verification)
// ------------------------------------------
/**
 * Decode token without verifying signature
 * Useful for getting payload from expired tokens
 * @param {String} token - JWT token
 * @returns {Object|null} Decoded payload or null
 */
const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = {
    jwtConfig,
    JWT_CONFIG,
    generateToken,
    generateRefreshToken,
    verifyToken,
    decodeToken
};
