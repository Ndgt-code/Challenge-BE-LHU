// ==========================================
// AUTH VALIDATION SCHEMAS (Joi)
// ==========================================

const Joi = require('joi');

// ------------------------------------------
// Schema for user registration
// ------------------------------------------
const registerSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.empty': 'Username is required',
            'string.alphanum': 'Username must only contain letters and numbers',
            'string.min': 'Username must be at least 3 characters',
            'string.max': 'Username must not exceed 30 characters',
            'any.required': 'Username is required'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(6)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters',
            'string.max': 'Password must not exceed 50 characters',
            'any.required': 'Password is required'
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'string.empty': 'Confirm password is required',
            'any.only': 'Passwords do not match',
            'any.required': 'Confirm password is required'
        })
});

// ------------------------------------------
// Schema for user login
// ------------------------------------------
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        })
});

// ------------------------------------------
// Schema for changing password
// ------------------------------------------
const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            'string.empty': 'Current password is required',
            'any.required': 'Current password is required'
        }),

    newPassword: Joi.string()
        .min(6)
        .max(50)
        .required()
        .messages({
            'string.empty': 'New password is required',
            'string.min': 'New password must be at least 6 characters',
            'string.max': 'New password must not exceed 50 characters',
            'any.required': 'New password is required'
        }),

    confirmNewPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            'string.empty': 'Confirm new password is required',
            'any.only': 'New passwords do not match',
            'any.required': 'Confirm new password is required'
        })
});

// ------------------------------------------
// Schema for updating profile
// ------------------------------------------
const updateProfileSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .optional()
        .messages({
            'string.alphanum': 'Username must only contain letters and numbers',
            'string.min': 'Username must be at least 3 characters',
            'string.max': 'Username must not exceed 30 characters'
        })
});

// ------------------------------------------
// Schema for forgot password
// ------------------------------------------
const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        })
});

// ------------------------------------------
// Schema for reset password
// ------------------------------------------
const resetPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),

    token: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            'string.empty': 'Reset token is required',
            'string.length': 'Reset token must be 6 digits',
            'string.pattern.base': 'Reset token must contain only numbers',
            'any.required': 'Reset token is required'
        }),

    newPassword: Joi.string()
        .min(6)
        .max(50)
        .required()
        .messages({
            'string.empty': 'New password is required',
            'string.min': 'New password must be at least 6 characters',
            'string.max': 'New password must not exceed 50 characters',
            'any.required': 'New password is required'
        }),

    confirmNewPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            'string.empty': 'Confirm new password is required',
            'any.only': 'New passwords do not match',
            'any.required': 'Confirm new password is required'
        })
});

module.exports = {
    registerSchema,
    loginSchema,
    changePasswordSchema,
    updateProfileSchema,
    forgotPasswordSchema,
    resetPasswordSchema
};
