// ==========================================
// PRODUCT VALIDATION SCHEMAS
// ==========================================

const Joi = require('joi');

// ------------------------------------------
// Create Product Validation
// ------------------------------------------
const createProductSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Product name is required',
            'string.min': 'Product name must be at least 3 characters',
            'string.max': 'Product name cannot exceed 100 characters'
        }),

    price: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Price must be a number',
            'number.positive': 'Price must be a positive number',
            'any.required': 'Price is required'
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .max(2000)
        .optional()
        .allow('')
        .messages({
            'string.min': 'Description must be at least 10 characters',
            'string.max': 'Description cannot exceed 2000 characters'
        }),

    stock: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            'number.base': 'Stock must be a number',
            'number.integer': 'Stock must be an integer',
            'number.min': 'Stock cannot be negative'
        }),

    category: Joi.string()
        .valid('electronics', 'clothing', 'food', 'other')
        .optional()
        .messages({
            'any.only': 'Category must be one of: electronics, clothing, food, other'
        }),

    featuredImage: Joi.string()
        .uri()
        .optional()
        .allow(null, '')
        .messages({
            'string.uri': 'Featured image must be a valid URL'
        }),

    images: Joi.array()
        .items(Joi.string().uri())
        .max(10)
        .optional()
        .messages({
            'string.uri': 'All images must be valid URLs',
            'array.max': 'Maximum 10 images allowed'
        })
});

// ------------------------------------------
// Update Product Validation
// ------------------------------------------
const updateProductSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Product name must be at least 3 characters',
            'string.max': 'Product name cannot exceed 100 characters'
        }),

    price: Joi.number()
        .positive()
        .optional()
        .messages({
            'number.positive': 'Price must be a positive number'
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .max(2000)
        .optional()
        .allow(''),

    stock: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            'number.integer': 'Stock must be an integer',
            'number.min': 'Stock cannot be negative'
        }),

    category: Joi.string()
        .valid('electronics', 'clothing', 'food', 'other')
        .optional(),

    featuredImage: Joi.string()
        .uri()
        .optional()
        .allow(null, ''),

    images: Joi.array()
        .items(Joi.string().uri())
        .max(10)
        .optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

// ------------------------------------------
// Stock Operation Validation
// ------------------------------------------
const stockOperationSchema = Joi.object({
    amount: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Amount must be a number',
            'number.integer': 'Amount must be an integer',
            'number.positive': 'Amount must be positive',
            'any.required': 'Amount is required'
        })
});

// ------------------------------------------
// Validation Middleware
// ------------------------------------------
const validateCreateProduct = (req, res, next) => {
    const { error } = createProductSchema.validate(req.body, { abortEarly: false });

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

const validateUpdateProduct = (req, res, next) => {
    const { error } = updateProductSchema.validate(req.body, { abortEarly: false });

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

const validateStockOperation = (req, res, next) => {
    const { error } = stockOperationSchema.validate(req.body, { abortEarly: false });

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
    createProductSchema,
    updateProductSchema,
    stockOperationSchema,
    validateCreateProduct,
    validateUpdateProduct,
    validateStockOperation
};
