// ==========================================
// ROUTES INDEX - Combine all routes
// ==========================================

const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');

// Mount routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);

module.exports = router;
