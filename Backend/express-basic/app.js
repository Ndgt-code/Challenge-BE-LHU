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

// GET - Lấy tất cả users
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// GET - Lấy 1 user theo ID
app.get('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

// POST - Tạo user mới
app.post('/api/users', async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json(user);
});

// PUT - Cập nhật user
app.put('/api/users/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
});

// DELETE - Xóa user
app.delete('/api/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted!' });
});

// ==========================================
// PRODUCT ROUTES - Test CRUD
// ==========================================

// GET - Lấy tất cả products
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// POST - Tạo product mới
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
    console.log('   GET    /api/users      - Lấy tất cả users');
    console.log('   GET    /api/users/:id  - Lấy 1 user');
    console.log('   POST   /api/users      - Tạo user mới');
    console.log('   PUT    /api/users/:id  - Cập nhật user');
    console.log('   DELETE /api/users/:id  - Xóa user');
    console.log('   GET    /api/products   - Lấy tất cả products');
    console.log('   POST   /api/products   - Tạo product mới');
    console.log('\n');
});
