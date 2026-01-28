// ==========================================
// WEATHER SERVICE - OpenWeatherMap Integration with Geocoding
// ==========================================

const axios = require('axios');

// API Configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';
const GEOCODING_BASE_URL = 'http://api.openweathermap.org/geo/1.0';

/**
 * Validate API key configuration
 */
const validateApiKey = () => {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_api_key_here') {
        throw new Error(
            'OpenWeatherMap API key is not configured. ' +
            'Please set OPENWEATHER_API_KEY in your .env file. ' +
            'Get your free API key at: https://openweathermap.org/api'
        );
    }
};

/**
 * Handle API errors with user-friendly messages
 */
const handleApiError = (error) => {
    if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Unknown error';

        switch (status) {
            case 401:
                return new Error('Invalid API key. Please check your OPENWEATHER_API_KEY in .env file.');
            case 404:
                return new Error('Location not found. Please check the spelling and try again.');
            case 429:
                return new Error('API rate limit exceeded. Please try again later.');
            default:
                return new Error(`Weather API error: ${message}`);
        }
    } else if (error.request) {
        return new Error('Unable to connect to weather service. Please check your internet connection.');
    } else {
        return new Error(`Weather service error: ${error.message}`);
    }
};

/**
 * Geocode a location name to coordinates with smart selection
 * Supports: cities, landmarks, districts, provinces, postal codes, etc.
 * Prioritizes: VN country > larger administrative areas > exact name matches
 * @param {string} locationName - Any location name
 * @returns {Promise<Object>} - {name, lat, lon, country, state}
 */
const geocodeLocation = async (locationName) => {
    validateApiKey();

    try {
        const url = `${GEOCODING_BASE_URL}/direct`;
        const response = await axios.get(url, {
            params: {
                q: locationName,
                limit: 5, // Get top 5 matches for better selection
                appid: OPENWEATHER_API_KEY
            },
            timeout: 10000
        });

        if (!response.data || response.data.length === 0) {
            throw new Error(`Location "${locationName}" not found. Please try:\n- Adding country code (e.g., "Phú Yên, VN")\n- Using English name (e.g., "Phu Yen")\n- Trying a nearby major city`);
        }

        // Log all matches for debugging
        console.log(`📍 Found ${response.data.length} matches for "${locationName}":`);
        response.data.forEach((loc, i) => {
            console.log(`   ${i + 1}. ${loc.name}${loc.state ? ', ' + loc.state : ''}, ${loc.country} (${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)})`);
        });

        // STRONG Smart Selection Algorithm
        let bestMatch = response.data[0]; // Default fallback

        // PRIORITY 1: ALWAYS prefer Vietnam (VN) if available
        const vnMatches = response.data.filter(loc => loc.country === 'VN');

        if (vnMatches.length > 0) {
            // We have VN matches - ONLY consider these

            // PRIORITY 2: Filter out small administrative units (communes/wards)
            const notCommunes = vnMatches.filter(loc => {
                const name = loc.name.toLowerCase();
                // Exclude: "Xã" (commune), very small districts
                const isCommune = name.startsWith('xã ') || name.includes('commune');
                return !isCommune;
            });

            // PRIORITY 3: Prefer locations with state/province info (larger areas)
            const withState = (notCommunes.length > 0 ? notCommunes : vnMatches).filter(loc => Boolean(loc.state));

            // PRIORITY 4: Exact name match (case-insensitive)
            const searchNameLower = locationName.toLowerCase().trim();
            const exactMatches = (withState.length > 0 ? withState : vnMatches).filter(loc => {
                const locNameLower = loc.name.toLowerCase();
                // Check if names match closely
                return locNameLower.includes(searchNameLower) || searchNameLower.includes(locNameLower);
            });

            // Select best from available filters
            if (exactMatches.length > 0) {
                bestMatch = exactMatches[0];
            } else if (withState.length > 0) {
                bestMatch = withState[0];
            } else if (notCommunes.length > 0) {
                bestMatch = notCommunes[0];
            } else {
                bestMatch = vnMatches[0]; // Any VN match is better than non-VN
            }
        }

        console.log(`✅ Selected: ${bestMatch.name}${bestMatch.state ? ', ' + bestMatch.state : ''}, ${bestMatch.country} (${bestMatch.lat.toFixed(4)}, ${bestMatch.lon.toFixed(4)})`);

        return {
            name: bestMatch.name,
            lat: bestMatch.lat,
            lon: bestMatch.lon,
            country: bestMatch.country,
            state: bestMatch.state || ''
        };

    } catch (error) {
        if (error.message.includes('not found')) {
            throw error;
        }
        throw handleApiError(error);
    }
};

/**
 * Get current weather by location name (with geocoding)
 * Supports cities, landmarks, districts, provinces, etc.
 * @param {string} locationName - Any location name
 * @returns {Promise<Object>} - Formatted weather data
 */
const getCurrentWeatherByCity = async (locationName) => {
    validateApiKey();

    try {
        // Step 1: Geocode the location to get coordinates
        console.log(`🔍 Geocoding location: "${locationName}"`);
        const geoData = await geocodeLocation(locationName);
        console.log(`✅ Found: ${geoData.name}, ${geoData.country} (${geoData.lat.toFixed(4)}, ${geoData.lon.toFixed(4)})`);

        // Step 2: Get weather using coordinates
        return await getCurrentWeatherByCoords(geoData.lat, geoData.lon);

    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Get current weather by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} - Formatted weather data
 */
const getCurrentWeatherByCoords = async (lat, lon) => {
    validateApiKey();

    try {
        const url = `${OPENWEATHER_BASE_URL}/weather`;
        const response = await axios.get(url, {
            params: {
                lat: lat,
                lon: lon,
                appid: OPENWEATHER_API_KEY,
                units: 'metric'
            },
            timeout: 10000
        });

        return formatWeatherData(response.data);

    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Get 5-day forecast by location name (with geocoding)
 * @param {string} locationName - Any location name
 * @param {number} days - Number of days (1-5, default 5)
 * @returns {Promise<Object>} - Formatted forecast data
 */
const getForecastByCity = async (locationName, days = 5) => {
    validateApiKey();

    try {
        // Geocode the location
        const geoData = await geocodeLocation(locationName);

        // Get forecast using coordinates
        return await getForecastByCoords(geoData.lat, geoData.lon, days);

    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Get 5-day forecast by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} days - Number of days (1-5, default 5)
 * @returns {Promise<Object>} - Formatted forecast data
 */
const getForecastByCoords = async (lat, lon, days = 5) => {
    validateApiKey();

    try {
        const url = `${OPENWEATHER_BASE_URL}/forecast`;
        const response = await axios.get(url, {
            params: {
                lat: lat,
                lon: lon,
                appid: OPENWEATHER_API_KEY,
                units: 'metric',
                cnt: days * 8 // API returns data every 3 hours, ~8 per day
            },
            timeout: 10000
        });

        return formatForecastData(response.data, days);

    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Format current weather data
 */
const formatWeatherData = (data) => {
    return {
        location: {
            name: data.name,
            country: data.sys.country,
            coordinates: {
                lat: data.coord.lat,
                lon: data.coord.lon
            }
        },
        current: {
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            tempMin: Math.round(data.main.temp_min),
            tempMax: Math.round(data.main.temp_max),
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            description: data.weather[0].description,
            main: data.weather[0].main,
            icon: data.weather[0].icon,
            iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        },
        wind: {
            speed: data.wind.speed,
            deg: data.wind.deg
        },
        clouds: data.clouds.all,
        visibility: data.visibility,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timezone: data.timezone,
        timestamp: data.dt
    };
};

/**
 * Format forecast data - group by day
 */
const formatForecastData = (data, days) => {
    // Group forecasts by day
    const dailyForecasts = {};

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US');

        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                date: date,
                timestamp: item.dt,
                temps: [],
                descriptions: [],
                icons: [],
                humidity: [],
                wind: []
            };
        }

        dailyForecasts[date].temps.push(item.main.temp);
        dailyForecasts[date].descriptions.push(item.weather[0].description);
        dailyForecasts[date].icons.push(item.weather[0].icon);
        dailyForecasts[date].humidity.push(item.main.humidity);
        dailyForecasts[date].wind.push(item.wind.speed);
    });

    // Calculate daily summaries
    const forecast = Object.values(dailyForecasts).slice(0, days).map(day => {
        const temps = day.temps;
        const mostCommonIcon = getMostCommon(day.icons);
        const mostCommonDesc = getMostCommon(day.descriptions);

        return {
            date: day.date,
            timestamp: day.timestamp,
            temperature: {
                min: Math.round(Math.min(...temps)),
                max: Math.round(Math.max(...temps)),
                avg: Math.round(temps.reduce((a, b) => a + b) / temps.length)
            },
            description: mostCommonDesc,
            icon: mostCommonIcon,
            iconUrl: `https://openweathermap.org/img/wn/${mostCommonIcon}@2x.png`,
            humidity: Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length),
            windSpeed: Math.round(day.wind.reduce((a, b) => a + b) / day.wind.length)
        };
    });

    return {
        location: {
            name: data.city.name,
            country: data.city.country,
            coordinates: {
                lat: data.city.coord.lat,
                lon: data.city.coord.lon
            }
        },
        forecast: forecast
    };
};

/**
 * Get most common element in array
 */
const getMostCommon = (arr) => {
    const frequency = {};
    let maxCount = 0;
    let mostCommon = arr[0];

    arr.forEach(item => {
        frequency[item] = (frequency[item] || 0) + 1;
        if (frequency[item] > maxCount) {
            maxCount = frequency[item];
            mostCommon = item;
        }
    });

    return mostCommon;
};

module.exports = {
    getCurrentWeatherByCity,
    getCurrentWeatherByCoords,
    getForecastByCity,
    getForecastByCoords,
    geocodeLocation
};
