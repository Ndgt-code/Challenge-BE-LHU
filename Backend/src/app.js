// ==========================================
// MAIN APPLICATION - MVC Pattern
// ==========================================

// IMPORTANT: Load dotenv FIRST before any other imports
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');

// Import centralized config
const { server, connectDB, logConfigStatus } = require('./config');

// Import Swagger (using existing swagger config)
const { swaggerUi, specs } = require('../routes/swagger');

// Import Routes
const apiRoutes = require('./routes');

const app = express();

// ==========================================
// CONFIGURATION STATUS
// ==========================================
logConfigStatus();

// ==========================================
// DATABASE CONNECTION
// ==========================================
connectDB();

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================
// Helmet - Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://openweathermap.org"]
        }
    }
}));

// Rate limiting - Protect against brute force
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

// MongoDB Sanitization - Prevent NoSQL injection
app.use(mongoSanitize());

// ==========================================
// MIDDLEWARE
// ==========================================
// Request logging
const requestLogger = require('./middlewares/requestLogger');
app.use(requestLogger);

// Compression - Reduce response size
app.use(compression());

app.use(express.json());

// Enable CORS for cross-origin requests
const cors = require('cors');
app.use(cors());

// Swagger UI - Access: http://localhost:3002/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customSiteTitle: "Challenge BE API Docs",
    customfavIcon: "/favicon.ico"
}));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Weather demo page
app.get('/weather-demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'weather-demo.html'));
});

// ==========================================
// ROUTES
// ==========================================
// Apply rate limiting to all API routes
app.use('/api', apiLimiter, apiRoutes);

// ==========================================
// ERROR HANDLING MIDDLEWARE
// ==========================================
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

// ==========================================
// START SERVER (only if not testing)
// ==========================================
// Export app for testing
module.exports = app;

// Only start server if this file is run directly (not imported for testing)
if (require.main === module) {
    const PORT = server.port;
    const HOST = server.isProduction ? '0.0.0.0' : 'localhost';

    app.listen(PORT, HOST, () => {
        console.log('='.repeat(65));
        console.log(`🚀 MVC Server: http://${HOST}:${PORT}`);
        console.log(`   Environment: ${server.nodeEnv}`);
        console.log('='.repeat(65));

        console.log('\n📁 MVC STRUCTURE:');
        console.log('   src/models/      - Data Models (User, Product)');
        console.log('   src/views/       - Response Helpers');
        console.log('   src/controllers/ - Business Logic');
        console.log('   src/routes/      - Route Definitions');

        console.log('\n📋 USER ROUTES:');
        console.log('   GET    /api/users              - View all users');
        console.log('   POST   /api/users              - Create user (create)');
        console.log('   POST   /api/users/v2           - Create user (new + save)');
        console.log('   POST   /api/users/bulk         - Create multiple users');
        console.log('   PUT    /api/users/:id          - Update user by ID');
        console.log('   PUT    /api/users/email/:email - Update user by email');
        console.log('   PATCH  /api/users/:id/deactivate - Deactivate user');
        console.log('   PATCH  /api/users/bulk/deactivate-old - Deactivate old users');
        console.log('   DELETE /api/users/:id          - Delete user by ID');
        console.log('   DELETE /api/users/email/:email - Delete user by email');
        console.log('   DELETE /api/users/bulk/inactive - Delete inactive users');

        console.log('\n📦 PRODUCT ROUTES:');
        console.log('   GET    /api/products           - View all products');
        console.log('   POST   /api/products           - Create product');
        console.log('   PUT    /api/products/:id       - Update product');
        console.log('   PATCH  /api/products/:id/increase-stock - Increase stock');
        console.log('   PATCH  /api/products/:id/decrease-stock - Decrease stock');
        console.log('   DELETE /api/products/:id       - Delete product');
        console.log('   DELETE /api/products/one/:id   - Delete product (deleteOne)');
        console.log('   DELETE /api/products/bulk/out-of-stock - Delete out of stock');

        console.log('\n📤 UPLOAD ROUTES:');
        console.log('   GET    /api/uploads             - Get all uploaded files');
        console.log('   POST   /api/uploads/single      - Upload single file');
        console.log('   POST   /api/uploads/multiple    - Upload multiple files (max 5)');
        console.log('   DELETE /api/uploads/:filename   - Delete a file');
        console.log('   Static: /uploads/:filename      - Access uploaded files');

        console.log('\n☀️  WEATHER ROUTES:');
        console.log('   GET    /api/weather/current     - Current weather (by city or coords)');
        console.log('   GET    /api/weather/forecast    - 5-day forecast');
        console.log('   GET    /api/weather/cache/stats - Cache statistics');
        console.log('   DELETE /api/weather/cache/clear - Clear cache');

        console.log('\n📖 Swagger UI: http://localhost:' + PORT + '/api-docs');
        console.log('🌤️  Weather Demo: http://localhost:' + PORT + '/weather-demo');
        console.log('\n');
    });
}

