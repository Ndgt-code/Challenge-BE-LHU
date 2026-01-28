// ==========================================
// WEATHER ROUTES - API Endpoints
// ==========================================

const express = require('express');
const router = express.Router();

const weatherController = require('../controllers/weatherController');
const { currentWeatherSchema, forecastSchema } = require('../validations/weatherValidation');
const { validate } = require('../middlewares/validate');

/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: Weather data from OpenWeatherMap API
 */

/**
 * @swagger
 * /api/weather/current:
 *   get:
 *     summary: Get current weather
 *     description: Get current weather data for a city or coordinates. Data is cached for 5 minutes.
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: City name (e.g., "London" or "London,UK")
 *         example: Hanoi
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude (use with lon)
 *         example: 21.0285
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *         description: Longitude (use with lat)
 *         example: 105.8542
 *     responses:
 *       200:
 *         description: Current weather data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 source:
 *                   type: string
 *                   enum: [api, cache]
 *                   example: api
 *                 data:
 *                   type: object
 *                   properties:
 *                     location:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: Hanoi
 *                         country:
 *                           type: string
 *                           example: VN
 *                         coordinates:
 *                           type: object
 *                     current:
 *                       type: object
 *                       properties:
 *                         temperature:
 *                           type: number
 *                           example: 28
 *                         feelsLike:
 *                           type: number
 *                         humidity:
 *                           type: number
 *                         description:
 *                           type: string
 *                         icon:
 *                           type: string
 *                         iconUrl:
 *                           type: string
 *       500:
 *         description: Error fetching weather data
 */
router.get('/current', validate(currentWeatherSchema, 'query'), weatherController.getCurrentWeather);

/**
 * @swagger
 * /api/weather/forecast:
 *   get:
 *     summary: Get weather forecast
 *     description: Get 5-day weather forecast for a city or coordinates. Data is cached for 30 minutes.
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: City name (e.g., "London" or "London,UK")
 *         example: Tokyo
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude (use with lon)
 *         example: 35.6762
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *         description: Longitude (use with lat)
 *         example: 139.6503
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           default: 5
 *         description: Number of days to forecast (1-5)
 *         example: 5
 *     responses:
 *       200:
 *         description: Weather forecast data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 source:
 *                   type: string
 *                   enum: [api, cache]
 *                 data:
 *                   type: object
 *                   properties:
 *                     location:
 *                       type: object
 *                     forecast:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                           temperature:
 *                             type: object
 *                             properties:
 *                               min:
 *                                 type: number
 *                               max:
 *                                 type: number
 *                           description:
 *                             type: string
 *                           icon:
 *                             type: string
 *       500:
 *         description: Error fetching forecast data
 */
router.get('/forecast', validate(forecastSchema, 'query'), weatherController.getForecast);

/**
 * @swagger
 * /api/weather/cache/clear:
 *   delete:
 *     summary: Clear weather cache
 *     description: Clear all cached weather data (admin endpoint)
 *     tags: [Weather]
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 */
router.delete('/cache/clear', weatherController.clearCache);

/**
 * @swagger
 * /api/weather/cache/stats:
 *   get:
 *     summary: Get cache statistics
 *     description: View current cache entries and their TTL (admin endpoint)
 *     tags: [Weather]
 *     responses:
 *       200:
 *         description: Cache statistics
 */
router.get('/cache/stats', weatherController.getCacheStats);

module.exports = router;
