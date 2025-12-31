const express = require('express');
const app = express();
const PORT = 3001;

// 1. Key Middleware
app.use(express.json()); // Parses incoming JSON requests

// Logging middleware to track requests
app.use((req, res, next) => {
    console.log(`👉 Received request: [${req.method}] ${req.url}`);
    next();
});

// 2. Mock Data (In-memory storage)
let todos = [
    { id: 1, title: "Test server execution", completed: false }
];

// 3. API Routes

// Root route (Health check)
app.get('/', (req, res) => {
    res.send('✅ Server Todo API is running! Ready for Postman testing.');
});

// GET: Retrieve all todos
app.get('/todos', (req, res) => {
    res.json({ success: true, count: todos.length, data: todos });
});

// GET: Retrieve a specific todo by ID
app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    
    if (!todo) return res.status(404).json({ success: false, message: 'ID not found' });
    
    res.json({ success: true, data: todo });
});

// POST: Create a new todo
app.post('/todos', (req, res) => {
    const { title } = req.body;
    
    // Validate input data
    if (!title) {
        return res.status(400).json({ success: false, message: 'Please provide a "title"' });
    }

    const newTodo = {
        id: Date.now(), // Generate unique ID based on timestamp
        title: title,
        completed: false
    };

    todos.push(newTodo);
    console.log("✅ Added:", newTodo);
    res.status(201).json({ success: true, data: newTodo });
});

// PUT: Update an existing todo
app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (!todo) return res.status(404).json({ success: false, message: 'ID not found for update' });

    // Only update fields if data is provided in the request body
    if (req.body.title) todo.title = req.body.title;
    if (req.body.completed !== undefined) todo.completed = req.body.completed;

    res.json({ success: true, message: 'Updated successfully', data: todo });
});

// DELETE: Remove a todo
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) return res.status(404).json({ success: false, message: 'ID not found for deletion' });

    todos.splice(index, 1); // Remove from array
    res.json({ success: true, message: 'Deleted successfully' });
});

// 4. Start the Server
app.listen(PORT, () => {
    console.log('-------------------------------------------------');
    console.log(`🚀 Server started at: http://localhost:3001`);
    console.log('👉 Press Ctrl + C to stop the server');
    console.log('-------------------------------------------------');
});