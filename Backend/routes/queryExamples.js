const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Import Models
const User = require('../express-basic/models/User');
const Product = require('../express-basic/models/Product');

const app = express();
const PORT = 3001;

// ==========================================
// SWAGGER CONFIGURATION
// ==========================================
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '📚 CRUD (R) - Query Examples API',
            version: '1.0.0',
            description: 'API tutorial for MongoDB queries: find, findOne, basic filters'
        },
        servers: [
            { url: `http://localhost:${PORT}` }
        ]
    },
    apis: ['./queryExamples.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

// HOME ROUTE - Usage guide
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Query Examples API - CRUD (R)',
        routes: {
            'GET /api/users': 'Lấy tất cả users',
            'GET /api/products': 'Lấy tất cả products',
            'GET /api/users/:id': 'Tìm user theo ID',
            'GET /api/users/email/:email': 'Tìm user theo email',
            'GET /api/users/filter/active': 'Users đang active',
            'GET /api/users/filter/age-gte/:age': 'Users tuổi >= giá trị',
            'GET /api/products/filter/category/:cat': 'Products theo category',
            'GET /api/products/filter/price?min=&max=': 'Products theo khoảng giá',
            'GET /api/products/filter/in-stock': 'Products còn hàng',
            'GET /api/products/query/paginate?page=&limit=': 'Pagination'
        }
    });
});

// ------------------------------------------
// 1️⃣ find() - Get all documents
// ------------------------------------------

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [1. find()]
 *     responses:
 *       200:
 *         description: List of users
 */
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

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [1. find()]
 *     responses:
 *       200:
 *         description: List of products
 */
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
// 2️⃣ findOne() - Find first matching document
// ------------------------------------------

/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Find user by email
 *     tags: [2. findOne()]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         example: nguyenvana@gmail.com
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
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

// GET - Find product by name
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
// 3️⃣ findById() - Find by ID
// ------------------------------------------

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Find user by ID
 *     tags: [3. findById()]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
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
// 4️⃣ BASIC FILTER - Comparison Operators
// ------------------------------------------

/**
 * @swagger
 * /api/users/filter/active:
 *   get:
 *     summary: Get active users (isActive = true)
 *     tags: [4. Basic Filter]
 *     responses:
 *       200:
 *         description: List of active users
 */
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

/**
 * @swagger
 * /api/users/filter/age-gte/{age}:
 *   get:
 *     summary: Users with age >= value ($gte operator)
 *     tags: [4. Basic Filter]
 *     parameters:
 *       - in: path
 *         name: age
 *         required: true
 *         schema:
 *           type: integer
 *         example: 25
 *     responses:
 *       200:
 *         description: List of users
 */
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

/**
 * @swagger
 * /api/products/filter/category/{category}:
 *   get:
 *     summary: Products by category
 *     tags: [4. Basic Filter]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [electronics, clothing, food, other]
 *         example: electronics
 *     responses:
 *       200:
 *         description: List of products
 */
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

/**
 * @swagger
 * /api/products/filter/price:
 *   get:
 *     summary: Products by price range ($gte, $lte)
 *     tags: [4. Basic Filter]
 *     parameters:
 *       - in: query
 *         name: min
 *         schema:
 *           type: integer
 *         example: 100000
 *       - in: query
 *         name: max
 *         schema:
 *           type: integer
 *         example: 1000000
 *     responses:
 *       200:
 *         description: List of products in price range
 */
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

/**
 * @swagger
 * /api/products/filter/in-stock:
 *   get:
 *     summary: Products in stock (stock > 0)
 *     tags: [4. Basic Filter]
 *     responses:
 *       200:
 *         description: List of products in stock
 */
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
// 5️⃣ $in OPERATOR - Find in array of values
// ------------------------------------------

/**
 * @swagger
 * /api/products/filter/categories:
 *   get:
 *     summary: Products in multiple categories ($in operator)
 *     tags: [5. $in & $or]
 *     parameters:
 *       - in: query
 *         name: cats
 *         schema:
 *           type: string
 *         example: electronics,food
 *         description: List of categories separated by comma
 *     responses:
 *       200:
 *         description: List of products
 */
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
// 6️⃣ $or OPERATOR - Logical OR
// ------------------------------------------

// GET - Products cheap OR high stock available
app.get('/api/products/filter/cheap-or-available', async (req, res) => {
    try {
        const products = await Product.find({
            $or: [
                { price: { $lt: 100 } },      // Price < 100
                { stock: { $gte: 50 } }       // OR stock >= 50
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

// GET - Users with only name and email, sorted by name
app.get('/api/users/query/select-sort', async (req, res) => {
    try {
        const users = await User.find()
            .select('name email')           // Select only name, email
            .sort({ name: 1 });             // Sort A-Z

        res.json({
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Products with pagination
// URL: /api/products/query/paginate?page=1&limit=10
app.get('/api/products/query/paginate', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .sort({ createdAt: -1 })        // Newest first
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

// GET - Count active users
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
