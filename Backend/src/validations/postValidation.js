// ==========================================
// POST VALIDATION SCHEMAS
// ==========================================

const Joi = require('joi');

// ------------------------------------------
// Create Post Validation
// ------------------------------------------
const createPostSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.empty': 'Title is required',
            'string.min': 'Title must be at least 3 characters',
            'string.max': 'Title cannot exceed 200 characters'
        }),

    content: Joi.string()
        .trim()
        .min(10)
        .required()
        .messages({
            'string.empty': 'Content is required',
            'string.min': 'Content must be at least 10 characters'
        }),

    tags: Joi.array()
        .items(Joi.string().trim())
        .max(10)
        .optional()
        .messages({
            'array.max': 'Maximum 10 tags allowed'
        }),

    status: Joi.string()
        .valid('draft', 'published', 'archived')
        .optional()
        .messages({
            'any.only': 'Status must be one of: draft, published, archived'
        }),

    featuredImage: Joi.string()
        .uri()
        .optional()
        .allow(null, '')
        .messages({
            'string.uri': 'Featured image must be a valid URL'
        }),

    imageGallery: Joi.array()
        .items(Joi.string().uri())
        .max(10)
        .optional()
        .messages({
            'string.uri': 'All images must be valid URLs',
            'array.max': 'Maximum 10 images allowed in gallery'
        })
});

// ------------------------------------------
// Update Post Validation
// ------------------------------------------
const updatePostSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .max(200)
        .optional()
        .messages({
            'string.min': 'Title must be at least 3 characters',
            'string.max': 'Title cannot exceed 200 characters'
        }),

    content: Joi.string()
        .trim()
        .min(10)
        .optional()
        .messages({
            'string.min': 'Content must be at least 10 characters'
        }),

    tags: Joi.array()
        .items(Joi.string().trim())
        .max(10)
        .optional(),

    status: Joi.string()
        .valid('draft', 'published', 'archived')
        .optional(),

    featuredImage: Joi.string()
        .uri()
        .optional()
        .allow(null, ''),

    imageGallery: Joi.array()
        .items(Joi.string().uri())
        .max(10)
        .optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

// ------------------------------------------
// Validation Middleware
// ------------------------------------------
const validateCreatePost = (req, res, next) => {
    const { error } = createPostSchema.validate(req.body, { abortEarly: false });

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

const validateUpdatePost = (req, res, next) => {
    const { error } = updatePostSchema.validate(req.body, { abortEarly: false });

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
    createPostSchema,
    updatePostSchema,
    validateCreatePost,
    validateUpdatePost
};
