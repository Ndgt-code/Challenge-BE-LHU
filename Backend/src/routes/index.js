// ==========================================
// ROUTES INDEX - Combine all routes
// ==========================================

const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const taskRoutes = require('./taskRoutes');
const authRoutes = require('./authRoutes');
const uploadRoutes = require('./uploadRoutes');
const postRoutes = require('./postRoutes');
const weatherRoutes = require('./weatherRoutes');

// Mount routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/uploads', uploadRoutes);
router.use('/posts', postRoutes);
router.use('/weather', weatherRoutes);

module.exports = router;
