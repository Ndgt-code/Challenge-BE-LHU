// ==========================================
// WEATHER VALIDATION - Joi Schemas
// ==========================================

const Joi = require('joi');

/**
 * Validation schema for current weather requests
 */
const currentWeatherSchema = Joi.object({
    // Either city OR coordinates must be provided
    city: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .pattern(/^[\p{L}\s,.-]+$/u)
        .messages({
            'string.pattern.base': 'City name can only contain letters, spaces, commas, periods, and hyphens',
            'string.min': 'City name must be at least 2 characters',
            'string.max': 'City name cannot exceed 100 characters'
        }),

    lat: Joi.number()
        .min(-90)
        .max(90)
        .messages({
            'number.min': 'Latitude must be between -90 and 90',
            'number.max': 'Latitude must be between -90 and 90'
        }),

    lon: Joi.number()
        .min(-180)
        .max(180)
        .messages({
            'number.min': 'Longitude must be between -180 and 180',
            'number.max': 'Longitude must be between -180 and 180'
        })
}).xor('city', 'lat') // Either city OR lat (if lat, then lon is required)
    .and('lat', 'lon')  // If lat is provided, lon must also be provided
    .messages({
        'object.xor': 'Please provide either city name OR coordinates (lat and lon)',
        'object.and': 'Both latitude and longitude are required when using coordinates'
    });

/**
 * Validation schema for forecast requests
 */
const forecastSchema = Joi.object({
    city: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .pattern(/^[\p{L}\s,.-]+$/u)
        .messages({
            'string.pattern.base': 'City name can only contain letters, spaces, commas, periods, and hyphens',
            'string.min': 'City name must be at least 2 characters',
            'string.max': 'City name cannot exceed 100 characters'
        }),

    lat: Joi.number()
        .min(-90)
        .max(90)
        .messages({
            'number.min': 'Latitude must be between -90 and 90',
            'number.max': 'Latitude must be between -90 and 90'
        }),

    lon: Joi.number()
        .min(-180)
        .max(180)
        .messages({
            'number.min': 'Longitude must be between -180 and 180',
            'number.max': 'Longitude must be between -180 and 180'
        }),

    days: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .default(5)
        .messages({
            'number.min': 'Forecast days must be between 1 and 5',
            'number.max': 'Forecast days must be between 1 and 5'
        })
}).xor('city', 'lat')
    .and('lat', 'lon')
    .messages({
        'object.xor': 'Please provide either city name OR coordinates (lat and lon)',
        'object.and': 'Both latitude and longitude are required when using coordinates'
    });

module.exports = {
    currentWeatherSchema,
    forecastSchema
};
