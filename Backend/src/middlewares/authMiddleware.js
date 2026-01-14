// ==========================================
// AUTH MIDDLEWARE - Protect Routes with JWT
// ==========================================

const { verifyToken } = require('../config/jwt');
const AuthUser = require('../models/Auth');

// ------------------------------------------
// AUTHENTICATE - Verify JWT Token
// ------------------------------------------
/**
 * Middleware to verify JWT token from Authorization header
 * Format: "Bearer <token>"
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        // DEBUG LOG
        console.log('🔍 Auth Header:', authHeader ? authHeader.substring(0, 50) + '...' : 'NO HEADER');

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Check Bearer format
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format. Use: Bearer <token>'
            });
        }

        // Extract token (remove "Bearer " prefix)
        const token = authHeader.split(' ')[1];

        // DEBUG LOG
        console.log('🔍 Token (first 20 chars):', token ? token.substring(0, 20) : 'NO TOKEN');

        // Verify token
        const decoded = verifyToken(token);
        console.log('✅ Token decoded successfully, userId:', decoded.userId);

        // Find user from token payload
        const user = await AuthUser.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Token may be invalid.'
            });
        }

        // Check if user is still active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated.'
            });
        }

        // Attach user to request object for use in controllers
        req.user = user;
        req.userId = decoded.userId;

        // Continue to next middleware/controller
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message || 'Authentication failed'
        });
    }
};

// ------------------------------------------
// AUTHORIZE - Check User Role
// ------------------------------------------
/**
 * Middleware to check if user has required role
 * Must be used AFTER authenticate middleware
 * @param  {...String} roles - Allowed roles (e.g., 'admin', 'user')
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        // Check if user exists (authenticate should run first)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Check if user's role is in allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(' or ')}`
            });
        }

        next();
    };
};

// ------------------------------------------
// OPTIONAL AUTH - Don't fail if no token
// ------------------------------------------
/**
 * Middleware that tries to authenticate but doesn't fail
 * Useful for routes that work differently for logged-in users
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);
            const user = await AuthUser.findById(decoded.userId);

            if (user && user.isActive) {
                req.user = user;
                req.userId = decoded.userId;
            }
        }
    } catch (error) {
        // Silently ignore auth errors for optional auth
    }

    next();
};

module.exports = {
    authenticate,
    authorize,
    optionalAuth
};
