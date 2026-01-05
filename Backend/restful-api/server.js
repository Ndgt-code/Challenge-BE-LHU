/**
 * ================================================
 * 🎯 RESTful API DEMO - Todo Application
 * ================================================
 * 
 * Topic: RESTful API Design
 * Description: REST principles, standard GET, POST, PUT, DELETE methods
 * 
 * 📌 6 REST PRINCIPLES:
 * 1. Client-Server: Separation between client and server
 * 2. Stateless: Each request is independent, no state is stored
 * 3. Cacheable: Responses can be cached
 * 4. Uniform Interface: Consistent interface (URL + HTTP methods)
 * 5. Layered System: System with multiple layers
 * 6. Code on Demand: Server can send executable code (optional)
 */

const express = require('express');
const app = express();
const PORT = 3000;

// ================================================
// 📦 MIDDLEWARE
// ================================================
// Enable JSON body parsing from request
app.use(express.json());

// Middleware to log requests (for learning purposes)
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url}`);
    console.log('   Body:', req.body);
    next();
});

// ================================================
// 💾 DATABASE (In-Memory)
// ================================================
// In production, use MongoDB, MySQL, PostgreSQL...
let todos = [
    { id: 1, title: 'Learn RESTful API', completed: false, createdAt: new Date() },
    { id: 2, title: 'Practice Express', completed: true, createdAt: new Date() },
    { id: 3, title: 'Build Todo App', completed: false, createdAt: new Date() }
];

// Auto-increment ID
let nextId = 4;

// ================================================
// 🔗 RESTful ENDPOINTS
// ================================================

/**
 * ----------------------------------------
 * 📖 GET /api/todos
 * ----------------------------------------
 * Purpose: Get ALL todos list
 * 
 * Characteristics:
 * - Safe: Does not modify data
 * - Idempotent: Multiple calls return the same result
 * 
 * Response: Array of todos
 */
app.get('/api/todos', (req, res) => {
    // Query parameters for filter/search
    const { completed, search } = req.query;

    let result = [...todos];

    // Filter by completed status
    if (completed !== undefined) {
        const isCompleted = completed === 'true';
        result = result.filter(todo => todo.completed === isCompleted);
    }

    // Search by title
    if (search) {
        result = result.filter(todo =>
            todo.title.toLowerCase().includes(search.toLowerCase())
        );
    }

    res.status(200).json({
        success: true,
        count: result.length,
        data: result
    });
});

/**
 * ----------------------------------------
 * 📖 GET /api/todos/:id
 * ----------------------------------------
 * Purpose: Get ONE todo by ID
 * 
 * :id is a route parameter
 * 
 * Response: Single todo object
 */
app.get('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).json({
            success: false,
            error: `Todo with id: ${id} not found`
        });
    }

    res.status(200).json({
        success: true,
        data: todo
    });
});

/**
 * ----------------------------------------
 * ✏️ POST /api/todos
 * ----------------------------------------
 * Purpose: CREATE a new todo
 * 
 * Characteristics:
 * - Not Safe: Modifies data on server
 * - Not Idempotent: Multiple calls create multiple todos
 * 
 * Request Body: { title: string, completed?: boolean }
 * Response: Newly created todo
 */
app.post('/api/todos', (req, res) => {
    const { title, completed = false } = req.body;

    // Validation
    if (!title || title.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Title is required and cannot be empty'
        });
    }

    // Create new todo
    const newTodo = {
        id: nextId++,
        title: title.trim(),
        completed: Boolean(completed),
        createdAt: new Date()
    };

    todos.push(newTodo);

    // 201 Created - Resource has been successfully created
    res.status(201).json({
        success: true,
        message: 'Todo created successfully!',
        data: newTodo
    });
});

/**
 * ----------------------------------------
 * 🔄 PUT /api/todos/:id
 * ----------------------------------------
 * Purpose: UPDATE ENTIRE todo (full replacement)
 * 
 * Characteristics:
 * - Idempotent: Multiple calls with same data = same result
 * - Must send ALL fields
 * 
 * Request Body: { title: string, completed: boolean }
 * Response: Updated todo
 */
app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;

    // Find todo index
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: `Todo with id: ${id} not found`
        });
    }

    // Validation - PUT requires all fields
    if (!title || completed === undefined) {
        return res.status(400).json({
            success: false,
            error: 'PUT requires all fields: title, completed'
        });
    }

    // Replace entirely (keep id and createdAt)
    todos[index] = {
        id: id,
        title: title.trim(),
        completed: Boolean(completed),
        createdAt: todos[index].createdAt,
        updatedAt: new Date()
    };

    res.status(200).json({
        success: true,
        message: 'Todo updated successfully!',
        data: todos[index]
    });
});

/**
 * ----------------------------------------
 * 🔧 PATCH /api/todos/:id
 * ----------------------------------------
 * Purpose: PARTIAL UPDATE todo
 * 
 * Characteristics:
 * - Only updates fields that are sent
 * - More flexible than PUT
 * 
 * Request Body: { title?: string, completed?: boolean }
 * Response: Updated todo
 */
app.patch('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updates = req.body;

    // Find todo index
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: `Todo with id: ${id} not found`
        });
    }

    // Only update fields that are sent
    if (updates.title !== undefined) {
        todos[index].title = updates.title.trim();
    }
    if (updates.completed !== undefined) {
        todos[index].completed = Boolean(updates.completed);
    }

    todos[index].updatedAt = new Date();

    res.status(200).json({
        success: true,
        message: 'Todo updated successfully!',
        data: todos[index]
    });
});

/**
 * ----------------------------------------
 * 🗑️ DELETE /api/todos/:id
 * ----------------------------------------
 * Purpose: DELETE todo by ID
 * 
 * Characteristics:
 * - Idempotent: Multiple deletes, same final result
 * - Not Safe: Modifies data
 * 
 * Response: Success message
 */
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: `Todo with id: ${id} not found`
        });
    }

    // Delete todo
    const deletedTodo = todos.splice(index, 1)[0];

    res.status(200).json({
        success: true,
        message: 'Todo deleted successfully!',
        data: deletedTodo
    });
});

/**
 * ----------------------------------------
 * 🗑️ DELETE /api/todos
 * ----------------------------------------
 * Purpose: DELETE ALL completed todos
 * 
 * Response: Number of deleted todos
 */
app.delete('/api/todos', (req, res) => {
    const completedTodos = todos.filter(t => t.completed);
    const count = completedTodos.length;

    // Keep only incomplete todos
    todos = todos.filter(t => !t.completed);

    res.status(200).json({
        success: true,
        message: `Deleted ${count} completed todos`,
        deletedCount: count
    });
});

// ================================================
// ❌ ERROR HANDLING
// ================================================

// 404 - Route does not exist
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.method} ${req.url} does not exist`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    });
});

// ================================================
// 🚀 START SERVER
// ================================================
app.listen(PORT, () => {
    console.log(`
    ================================================
    🚀 RESTful API Server is running!
    ================================================
    🌐 URL: http://localhost:${PORT}
    
    📋 ENDPOINTS:
    ├── GET    /api/todos          → Get all todos
    ├── GET    /api/todos/:id      → Get todo by ID
    ├── POST   /api/todos          → Create new todo
    ├── PUT    /api/todos/:id      → Update entire todo
    ├── PATCH  /api/todos/:id      → Partial update todo
    ├── DELETE /api/todos/:id      → Delete todo by ID
    └── DELETE /api/todos          → Delete completed todos
    
    🧪 Test with Postman or curl!
    ================================================
    `);
});
