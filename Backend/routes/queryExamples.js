const express = require('express');
const mongoose = require('mongoose');

// Import Models
const User = require('../express-basic/models/User');
const Product = require('../express-basic/models/Product');

const app = express();
const PORT = 3001;

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
// 📚 CRUD (R) - QUERY EXAMPLES
// ==========================================

// ------------------------------------------
// 1️⃣ find() - Lấy tất cả documents
// ------------------------------------------

// GET - Lấy tất cả users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Lấy tất cả products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 2️⃣ findOne() - Tìm 1 document đầu tiên
// ------------------------------------------

// GET - Tìm user theo email
app.get('/api/users/email/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Tìm product theo name
app.get('/api/products/name/:name', async (req, res) => {
    try {
        const product = await Product.findOne({ name: req.params.name });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 3️⃣ findById() - Tìm theo ID
// ------------------------------------------

// GET - Tìm user theo ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 4️⃣ FILTER CƠ BẢN - Comparison Operators
// ------------------------------------------

// GET - Users đang active
app.get('/api/users/filter/active', async (req, res) => {
    try {
        const users = await User.find({ isActive: true });
        res.json({
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Users có tuổi >= giá trị
app.get('/api/users/filter/age-gte/:age', async (req, res) => {
    try {
        // $gte = greater than or equal (>=)
        const users = await User.find({
            age: { $gte: Number(req.params.age) }
        });
        res.json({
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Products theo category
app.get('/api/products/filter/category/:category', async (req, res) => {
    try {
        const products = await Product.find({
            category: req.params.category
        });
        res.json({
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Products theo khoảng giá (min-max)
// URL: /api/products/filter/price?min=100&max=500
app.get('/api/products/filter/price', async (req, res) => {
    try {
        const { min, max } = req.query;

        const filter = {};
        if (min) filter.$gte = Number(min);
        if (max) filter.$lte = Number(max);

        const products = await Product.find({
            price: filter
        });

        res.json({
            count: products.length,
            filter: { minPrice: min, maxPrice: max },
            data: products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Products còn hàng (stock > 0)
app.get('/api/products/filter/in-stock', async (req, res) => {
    try {
        // $gt = greater than (>)
        const products = await Product.find({
            stock: { $gt: 0 }
        });
        res.json({
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 5️⃣ $in OPERATOR - Tìm trong mảng giá trị
// ------------------------------------------

// GET - Products thuộc nhiều categories
// URL: /api/products/filter/categories?cats=electronics,clothing
app.get('/api/products/filter/categories', async (req, res) => {
    try {
        const categories = req.query.cats?.split(',') || [];

        const products = await Product.find({
            category: { $in: categories }
        });

        res.json({
            count: products.length,
            categories: categories,
            data: products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 6️⃣ $or OPERATOR - Hoặc
// ------------------------------------------

// GET - Products giá rẻ HOẶC còn nhiều hàng
app.get('/api/products/filter/cheap-or-available', async (req, res) => {
    try {
        const products = await Product.find({
            $or: [
                { price: { $lt: 100 } },      // Giá < 100
                { stock: { $gte: 50 } }       // Hoặc stock >= 50
            ]
        });
        res.json({
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 7️⃣ SELECT, SORT, LIMIT, SKIP
// ------------------------------------------

// GET - Users chỉ lấy name và email, sắp xếp theo name
app.get('/api/users/query/select-sort', async (req, res) => {
    try {
        const users = await User.find()
            .select('name email')           // Chỉ lấy name, email
            .sort({ name: 1 });             // Sắp xếp A-Z

        res.json({
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Products với pagination
// URL: /api/products/query/paginate?page=1&limit=10
app.get('/api/products/query/paginate', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .sort({ createdAt: -1 })        // Mới nhất trước
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments();

        res.json({
            page: page,
            limit: limit,
            total: total,
            totalPages: Math.ceil(total / limit),
            data: products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 8️⃣ COUNT DOCUMENTS
// ------------------------------------------

// GET - Đếm số users active
app.get('/api/users/count/active', async (req, res) => {
    try {
        const count = await User.countDocuments({ isActive: true });
        res.json({ activeUsers: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log(`🚀 Query Examples Server: http://localhost:${PORT}`);
    console.log('='.repeat(60));
    console.log('\n📋 QUERY ROUTES:');
    console.log('\n🔹 BASIC FIND:');
    console.log('   GET /api/users                        - Lấy tất cả users');
    console.log('   GET /api/products                     - Lấy tất cả products');
    console.log('\n🔹 FIND ONE:');
    console.log('   GET /api/users/email/:email           - Tìm user theo email');
    console.log('   GET /api/products/name/:name          - Tìm product theo name');
    console.log('   GET /api/users/:id                    - Tìm user theo ID');
    console.log('\n🔹 FILTER:');
    console.log('   GET /api/users/filter/active          - Users đang active');
    console.log('   GET /api/users/filter/age-gte/:age    - Users tuổi >= giá trị');
    console.log('   GET /api/products/filter/category/:cat - Products theo category');
    console.log('   GET /api/products/filter/price?min=&max= - Products theo giá');
    console.log('   GET /api/products/filter/in-stock     - Products còn hàng');
    console.log('   GET /api/products/filter/categories?cats= - Products nhiều category');
    console.log('   GET /api/products/filter/cheap-or-available - Giá rẻ hoặc nhiều hàng');
    console.log('\n🔹 SELECT, SORT, PAGINATION:');
    console.log('   GET /api/users/query/select-sort      - Select + Sort');
    console.log('   GET /api/products/query/paginate?page=&limit= - Pagination');
    console.log('\n🔹 COUNT:');
    console.log('   GET /api/users/count/active           - Đếm users active');
    console.log('\n');
});
