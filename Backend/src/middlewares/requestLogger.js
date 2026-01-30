// ==========================================
// REQUEST LOGGING MIDDLEWARE
// ==========================================

/**
 * Simple request logger middleware
 * Logs all incoming requests with method, URL, and response time
 */
const requestLogger = (req, res, next) => {
    const startTime = Date.now();

    // Log when response finishes
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const timestamp = new Date().toISOString();
        const method = req.method;
        const url = req.originalUrl || req.url;
        const status = res.statusCode;

        // Color code based on status
        let statusColor = '\x1b[32m'; // Green for 2xx
        if (status >= 400 && status < 500) {
            statusColor = '\x1b[33m'; // Yellow for 4xx
        } else if (status >= 500) {
            statusColor = '\x1b[31m'; // Red for 5xx
        }

        console.log(
            `${timestamp} | ${method.padEnd(6)} | ${statusColor}${status}\x1b[0m | ${duration}ms | ${url}`
        );
    });

    next();
};

module.exports = requestLogger;
