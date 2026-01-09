// ==========================================
// TASK VALIDATION SCHEMAS (Joi)
// ==========================================

const Joi = require('joi');

// ------------------------------------------
// Schema for creating a new task
// ------------------------------------------
const createTaskSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Title is required',
            'string.min': 'Title must be at least 3 characters',
            'string.max': 'Title must not exceed 100 characters',
            'any.required': 'Title is required'
        }),

    description: Joi.string()
        .max(500)
        .optional()
        .allow('')
        .messages({
            'string.max': 'Description must not exceed 500 characters'
        }),

    status: Joi.string()
        .valid('pending', 'in-progress', 'completed')
        .default('pending')
        .messages({
            'any.only': 'Status must be: pending, in-progress, or completed'
        }),

    priority: Joi.string()
        .valid('low', 'medium', 'high')
        .default('medium')
        .messages({
            'any.only': 'Priority must be: low, medium, or high'
        }),

    dueDate: Joi.date()
        .greater('now')
        .optional()
        .messages({
            'date.base': 'Due date must be a valid date',
            'date.greater': 'Due date must be in the future'
        })
});

// ------------------------------------------
// Schema for updating a task (all fields optional)
// ------------------------------------------
const updateTaskSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .messages({
            'string.min': 'Title must be at least 3 characters',
            'string.max': 'Title must not exceed 100 characters'
        }),

    description: Joi.string()
        .max(500)
        .allow('')
        .messages({
            'string.max': 'Description must not exceed 500 characters'
        }),

    status: Joi.string()
        .valid('pending', 'in-progress', 'completed')
        .messages({
            'any.only': 'Status must be: pending, in-progress, or completed'
        }),

    priority: Joi.string()
        .valid('low', 'medium', 'high')
        .messages({
            'any.only': 'Priority must be: low, medium, or high'
        }),

    dueDate: Joi.date()
        .messages({
            'date.base': 'Due date must be a valid date'
        })
}).min(1).messages({
    'object.min': 'At least one field is required to update'
});

// ------------------------------------------
// Schema for updating status only
// ------------------------------------------
const updateStatusSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'in-progress', 'completed')
        .required()
        .messages({
            'any.only': 'Status must be: pending, in-progress, or completed',
            'any.required': 'Status is required',
            'string.empty': 'Status is required'
        })
});

module.exports = {
    createTaskSchema,
    updateTaskSchema,
    updateStatusSchema
};
