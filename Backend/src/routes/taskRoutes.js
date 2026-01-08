// ==========================================
// TASK ROUTES
// ==========================================

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET - Retrieve all tasks (optional: ?status=pending or ?priority=high)
router.get('/', taskController.getAllTasks);

// GET - Retrieve task by ID
router.get('/:id', taskController.getTaskById);

// POST - Create new task
router.post('/', taskController.createTask);

// PUT - Update task by ID
router.put('/:id', taskController.updateTask);

// PATCH - Update task status only
router.patch('/:id/status', taskController.updateTaskStatus);

// DELETE - Delete task by ID
router.delete('/:id', taskController.deleteTask);

// DELETE - Delete all completed tasks
router.delete('/bulk/completed', taskController.deleteCompletedTasks);

module.exports = router;
