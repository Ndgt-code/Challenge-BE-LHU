const express = require('express');
const mongoose = require('mongoose');

// Import Models
const User = require('./models/User');
const Product = require('./models/Product');

const app = express();
const PORT = 3000;

// ==========================================
// MONGODB CONNECTION
// ==========================================
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://nguyendanggiangtruong_db_user:hE9AAqVFCB7m8VFs@cluster0.rwda16v.mongodb.net/dev?appName=Cluster0");
        console.log("✅ MongoDB connected successfully!");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
    }
};

connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(express.json());

// ==========================================
// USER ROUTES - Test CRUD
// ==========================================

// GET - All users
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// GET - Get user by ID
app.get('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

// POST - Create new user
app.post('/api/users', async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json(user);
});

// PUT - Update user
app.put('/api/users/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
});

// DELETE - Delete user
app.delete('/api/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted!' });
});

// ==========================================
// PRODUCT ROUTES - Test CRUD
// ==========================================

// GET - All products
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// POST - Create new product
app.post('/api/products', async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json(product);
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log('='.repeat(50));
    console.log('\n📋 TEST ROUTES:');
    console.log('   GET    /api/users      - Get all users');
    console.log('   GET    /api/users/:id  - Get user by ID');
    console.log('   POST   /api/users      - Create new user');
    console.log('   PUT    /api/users/:id  - Update user');
    console.log('   DELETE /api/users/:id  - Delete user');
    console.log('   GET    /api/products   - Get all products');
    console.log('   POST   /api/products   - Create new product');
    console.log('\n');
});
