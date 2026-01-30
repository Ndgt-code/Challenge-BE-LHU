// ==========================================
// INPUT SANITIZATION UTILITIES
// ==========================================

/**
 * Sanitize user input to prevent security issues
 * @param {string} input - User input string
 * @returns {string} - Sanitized string
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    // Trim whitespace
    let sanitized = input.trim();

    // Remove potentially dangerous characters
    sanitized = sanitized.replace(/[<>]/g, '');

    return sanitized;
};

/**
 * Sanitize object properties recursively
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    const sanitized = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            sanitized[key] = sanitizeInput(obj[key]);
        } else if (typeof obj[key] === 'object') {
            sanitized[key] = sanitizeObject(obj[key]);
        } else {
            sanitized[key] = obj[key];
        }
    }

    return sanitized;
};

module.exports = { sanitizeInput, sanitizeObject };
