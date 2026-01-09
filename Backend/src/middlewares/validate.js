// ==========================================
// VALIDATION MIDDLEWARE (Joi)
// ==========================================

/**
 * Middleware factory for validating request body with Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,    // Return all errors, not just the first
            stripUnknown: true,   // Remove unknown fields from the body
            convert: true         // Convert types when possible (e.g., string to date)
        });

        if (error) {
            // Format error messages
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message.replace(/"/g, "'")
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        // Replace req.body with validated & sanitized value
        req.body = value;
        next();
    };
};

/**
 * Middleware to validate MongoDB ObjectId in params
 * @param {string} paramName - Name of the param to validate (default: 'id')
 * @returns {Function} Express middleware
 */
const validateObjectId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];

        // MongoDB ObjectId regex pattern
        const objectIdPattern = /^[0-9a-fA-F]{24}$/;

        if (!objectIdPattern.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: [{
                    field: paramName,
                    message: `Invalid ${paramName} format. Must be a valid MongoDB ObjectId`
                }]
            });
        }

        next();
    };
};

module.exports = {
    validate,
    validateObjectId
};
