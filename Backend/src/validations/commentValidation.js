// ==========================================
// COMMENT VALIDATION SCHEMAS
// ==========================================

const Joi = require('joi');

// ------------------------------------------
// Create Comment Validation
// ------------------------------------------
const createCommentSchema = Joi.object({
    content: Joi.string()
        .trim()
        .min(1)
        .max(1000)
        .required()
        .messages({
            'string.empty': 'Comment content is required',
            'string.min': 'Comment must be at least 1 character',
            'string.max': 'Comment cannot exceed 1000 characters'
        })
});

// ------------------------------------------
// Update Comment Validation
// ------------------------------------------
const updateCommentSchema = Joi.object({
    content: Joi.string()
        .trim()
        .min(1)
        .max(1000)
        .required()
        .messages({
            'string.empty': 'Comment content is required',
            'string.min': 'Comment must be at least 1 character',
            'string.max': 'Comment cannot exceed 1000 characters'
        })
});

// ------------------------------------------
// Validation Middleware
// ------------------------------------------
const validateCreateComment = (req, res, next) => {
    const { error } = createCommentSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

const validateUpdateComment = (req, res, next) => {
    const { error } = updateCommentSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

module.exports = {
    createCommentSchema,
    updateCommentSchema,
    validateCreateComment,
    validateUpdateComment
};
