// ==========================================
// ROUTES INDEX - Combine all routes
// ==========================================

const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const taskRoutes = require('./taskRoutes');
const authRoutes = require('./authRoutes');

// Mount routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;
