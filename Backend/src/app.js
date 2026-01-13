// ==========================================
// MAIN APPLICATION - MVC Pattern
// ==========================================

const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

// Import Swagger (using existing swagger config)
const { swaggerUi, specs } = require('../routes/swagger');

// Import Routes
const apiRoutes = require('./routes');

const app = express();
const PORT = 3002;

// ==========================================
// DATABASE CONNECTION
// ==========================================
connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(express.json());

// Enable CORS for cross-origin requests
const cors = require('cors');
app.use(cors());

// Swagger UI - Access: http://localhost:3002/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==========================================
// ROUTES
// ==========================================
app.use('/api', apiRoutes);

// ==========================================
// ERROR HANDLING MIDDLEWARE
// ==========================================
// Global error handler - catches all unhandled errors
app.use((err, req, res, next) => {
    console.error('❌ Unhandled Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log('='.repeat(65));
    console.log(`🚀 MVC Server: http://localhost:${PORT}`);
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

    console.log('\n📖 Swagger UI: http://localhost:' + PORT + '/api-docs');
    console.log('\n');
});
