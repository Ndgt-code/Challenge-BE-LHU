// ==========================================
// VIEWS - API Response Helper
// ==========================================

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, message, data = null, statusCode = 200) => {
    const response = { message };
    if (data !== null) {
        response.data = data;
    }
    return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 */
const errorResponse = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({ error: message });
};

/**
 * Send list response with count
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const listResponse = (res, data, statusCode = 200) => {
    return res.status(statusCode).json({
        count: data.length,
        data: data
    });
};

/**
 * Send response with matched/modified counts (for update operations)
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object} result - MongoDB update result
 */
const updateManyResponse = (res, message, result) => {
    return res.json({
        message,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
    });
};

/**
 * Send response with deleted count
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {number} deletedCount - Number of deleted documents
 */
const deleteManyResponse = (res, message, deletedCount) => {
    return res.json({
        message,
        deletedCount
    });
};

module.exports = {
    successResponse,
    errorResponse,
    listResponse,
    updateManyResponse,
    deleteManyResponse
};
