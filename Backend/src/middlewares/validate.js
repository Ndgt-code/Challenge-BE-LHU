// ==========================================
// VALIDATION MIDDLEWARE (Joi)
// ==========================================

/**
 * Middleware factory for validating request data with Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} source - Source of data to validate: 'body' (default), 'query', 'params'
 * @returns {Function} Express middleware
 */
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const dataToValidate = req[source];

        const { error, value } = schema.validate(dataToValidate, {
            abortEarly: false,    // Return all errors, not just the first
            stripUnknown: true,   // Remove unknown fields
            convert: true         // Convert types when possible (e.g., string to number)
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

        // Replace req[source] with validated & sanitized value
        req[source] = value;
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
