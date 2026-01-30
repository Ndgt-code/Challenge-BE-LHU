// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

/**
 * Production-safe error handler
 * Hides sensitive error details in production
 */
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('❌ Error:', err.message);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    // Default error status and message
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Error response structure
    const errorResponse = {
        success: false,
        error: {
            message: message,
            statusCode: statusCode
        }
    };

    // Include stack trace only in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error.stack = err.stack;
        errorResponse.error.details = err.details || null;
    }

    // Send error response
    res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

module.exports = { errorHandler, notFoundHandler };
