const express = require('express');
const app = express();
const PORT = 3000;

// ==========================================
// BASIC MIDDLEWARE
// ==========================================

// Middleware to parse JSON body
app.use(express.json());

// Middleware to parse URL-encoded body (form data)
app.use(express.urlencoded({ extended: true }));

// ==========================================
// BASIC ROUTING
// ==========================================

// 1. GET Route - Home page
app.get('/', (req, res) => {
    res.send('<h1>🚀 Welcome to Express Server!</h1>');
});

// 2. GET Route - Return JSON
app.get('/api/info', (req, res) => {
    res.json({
        message: 'Hello from Express API!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// 3. GET Route with Parameter (dynamic)
// Example: /api/users/123
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({
        message: `Get user info with ID: ${userId}`,
        userId: userId
    });
});

// 4. GET Route with Query String
// Example: /api/search?keyword=express&page=1
app.get('/api/search', (req, res) => {
    const { keyword, page } = req.query;
    res.json({
        message: 'Search results',
        keyword: keyword || 'none',
        page: page || 1
    });
});

// 5. POST Route - Receive data from body
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    res.status(201).json({
        message: 'User created successfully!',
        user: { name, email }
    });
});

// 6. PUT Route - Update data
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    res.json({
        message: `User ID: ${userId} updated successfully!`,
        user: { id: userId, name, email }
    });
});

// 7. DELETE Route - Delete data
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({
        message: `User ID: ${userId} deleted successfully!`
    });
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Server is running at: http://localhost:${PORT}`);
    console.log('='.repeat(50));
    console.log('\n📋 Available routes:');
    console.log('   GET  /              - Home page');
    console.log('   GET  /api/info      - API information');
    console.log('   GET  /api/users/:id - Get user by ID');
    console.log('   GET  /api/search    - Search with query');
    console.log('   POST /api/users     - Create new user');
    console.log('   PUT  /api/users/:id - Update user');
    console.log('   DELETE /api/users/:id - Delete user');
    console.log('\n');
});
