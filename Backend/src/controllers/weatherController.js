// ==========================================
// WEATHER CONTROLLER - Business Logic with Caching
// ==========================================

const weatherService = require('../services/weatherService');

// In-memory cache
const cache = new Map();

// Cache TTL from environment (default: 5 minutes for current, 30 minutes for forecast)
const CACHE_TTL_CURRENT = parseInt(process.env.CACHE_TTL_CURRENT) || 300000;
const CACHE_TTL_FORECAST = parseInt(process.env.CACHE_TTL_FORECAST) || 1800000;

/**
 * Generate cache key from request parameters
 */
const generateCacheKey = (type, params) => {
    if (params.city) {
        return `${type}:city:${params.city.toLowerCase()}`;
    } else if (params.lat && params.lon) {
        return `${type}:coords:${params.lat},${params.lon}`;
    }
    return null;
};

/**
 * Get data from cache
 */
const getFromCache = (key) => {
    const cached = cache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
        console.log(`✅ Cache HIT: ${key}`);
        return cached.data;
    }

    if (cached) {
        console.log(`⏰ Cache EXPIRED: ${key}`);
        cache.delete(key);
    }

    console.log(`❌ Cache MISS: ${key}`);
    return null;
};

/**
 * Save data to cache
 */
const saveToCache = (key, data, ttl) => {
    cache.set(key, {
        data: data,
        expiresAt: Date.now() + ttl
    });
    console.log(`💾 Cached: ${key} (TTL: ${ttl}ms)`);
};

/**
 * Get current weather
 * Query params: city OR (lat AND lon)
 */
const getCurrentWeather = async (req, res) => {
    try {
        const { city, lat, lon } = req.query;

        // Generate cache key
        const cacheKey = generateCacheKey('current', { city, lat, lon });

        // Check cache first
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                source: 'cache',
                data: cachedData
            });
        }

        // Fetch from API
        let weatherData;
        if (city) {
            weatherData = await weatherService.getCurrentWeatherByCity(city);
        } else {
            weatherData = await weatherService.getCurrentWeatherByCoords(parseFloat(lat), parseFloat(lon));
        }

        // Save to cache
        saveToCache(cacheKey, weatherData, CACHE_TTL_CURRENT);

        res.status(200).json({
            success: true,
            source: 'api',
            data: weatherData
        });

    } catch (error) {
        console.error('❌ Weather Controller Error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch weather data'
        });
    }
};

/**
 * Get weather forecast
 * Query params: city OR (lat AND lon), days (optional, default 5)
 */
const getForecast = async (req, res) => {
    try {
        const { city, lat, lon, days = 5 } = req.query;

        // Generate cache key
        const cacheKey = generateCacheKey('forecast', { city, lat, lon });

        // Check cache first
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
            // Filter by days if different from cached
            const filteredData = {
                ...cachedData,
                forecast: cachedData.forecast.slice(0, parseInt(days))
            };

            return res.status(200).json({
                success: true,
                source: 'cache',
                data: filteredData
            });
        }

        // Fetch from API
        let forecastData;
        if (city) {
            forecastData = await weatherService.getForecastByCity(city, parseInt(days));
        } else {
            forecastData = await weatherService.getForecastByCoords(parseFloat(lat), parseFloat(lon), parseInt(days));
        }

        // Save to cache (full 5 days)
        saveToCache(cacheKey, forecastData, CACHE_TTL_FORECAST);

        // Return filtered by days
        const filteredData = {
            ...forecastData,
            forecast: forecastData.forecast.slice(0, parseInt(days))
        };

        res.status(200).json({
            success: true,
            source: 'api',
            data: filteredData
        });

    } catch (error) {
        console.error('❌ Forecast Controller Error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch forecast data'
        });
    }
};

/**
 * Clear cache (admin endpoint)
 */
const clearCache = (req, res) => {
    const size = cache.size;
    cache.clear();
    res.status(200).json({
        success: true,
        message: `Cache cleared successfully. Removed ${size} entries.`
    });
};

/**
 * Get cache stats (admin endpoint)
 */
const getCacheStats = (req, res) => {
    const stats = {
        totalEntries: cache.size,
        entries: []
    };

    cache.forEach((value, key) => {
        stats.entries.push({
            key: key,
            expiresAt: new Date(value.expiresAt).toISOString(),
            ttl: value.expiresAt - Date.now()
        });
    });

    res.status(200).json({
        success: true,
        data: stats
    });
};

module.exports = {
    getCurrentWeather,
    getForecast,
    clearCache,
    getCacheStats
};
