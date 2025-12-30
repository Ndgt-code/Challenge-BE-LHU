const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// ==========================================
// WHAT IS MIDDLEWARE?
// ==========================================
// Middleware = functions that run BETWEEN request and response
// Flow: Request -> Middleware1 -> Middleware2 -> ... -> Route Handler -> Response
// Each middleware has access to: req, res, next
// Call next() to pass control to the next middleware

// ==========================================
// 1. BUILT-IN MIDDLEWARE
// ==========================================

// express.json() - Parse JSON body (replaces body-parser)
app.use(express.json());

// express.urlencoded() - Parse form data
app.use(express.urlencoded({ extended: true }));

// express.static() - Serve static files
// app.use(express.static('public'));

// ==========================================
// 2. CORS MIDDLEWARE
// ==========================================
// CORS = Cross-Origin Resource Sharing
// Allows/blocks requests from different domains

// Option 1: Allow all origins
app.use(cors());

// Option 2: Custom configuration (commented for demo)
/*
app.use(cors({
    origin: 'http://localhost:3000',     // Allow specific origin
    methods: ['GET', 'POST', 'PUT'],     // Allowed methods
    allowedHeaders: ['Content-Type'],     // Allowed headers
    credentials: true                     // Allow cookies
}));
*/

// ==========================================
// 3. CUSTOM LOGGING MIDDLEWARE
// ==========================================
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    
    console.log(`[${timestamp}] ${method} ${url}`);
    
    // IMPORTANT: Must call next() to continue
    next();
};

app.use(logger);

// ==========================================
// 4. REQUEST TIME MIDDLEWARE
// ==========================================
const requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    next();
};

app.use(requestTime);

// ==========================================
// 5. AUTHENTICATION MIDDLEWARE (Example)
// ==========================================
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    if (token !== 'Bearer secret123') {
        return res.status(403).json({ error: 'Invalid token' });
    }
    
    // Token is valid, continue
    req.user = { id: 1, name: 'John' };
    next();
};

// ==========================================
// 6. ERROR HANDLING MIDDLEWARE
// ==========================================
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
};

// ==========================================
// ROUTES
// ==========================================

// Public route - no auth needed
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Middleware Demo!',
        requestTime: new Date(req.requestTime).toISOString()
    });
});

// Public route - test logging
app.get('/api/public', (req, res) => {
    res.json({ message: 'This is a public endpoint' });
});

// Protected route - requires auth (using middleware for specific route)
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({
        message: 'This is protected data!',
        user: req.user
    });
});

// Route to test POST with body-parser
app.post('/api/data', (req, res) => {
    console.log('Received body:', req.body);
    res.json({
        message: 'Data received!',
        data: req.body
    });
});

// Route to test error handling
app.get('/api/error', (req, res, next) => {
    // Simulate an error
    const error = new Error('This is a test error!');
    next(error);  // Pass error to error handler
});

// Error handler must be LAST
app.use(errorHandler);

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Middleware Demo running at: http://localhost:${PORT}`);
    console.log('='.repeat(50));
    console.log('\n📋 Test endpoints:');
    console.log('   GET  /              - Home (shows request time)');
    console.log('   GET  /api/public    - Public endpoint');
    console.log('   GET  /api/protected - Protected (needs token)');
    console.log('   POST /api/data      - Test body parsing');
    console.log('   GET  /api/error     - Test error handling');
    console.log('\n🔐 To access protected route, add header:');
    console.log('   Authorization: Bearer secret123');
    console.log('\n');
});
