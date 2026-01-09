// ==========================================
// TASK ROUTES (with Joi Validation)
// ==========================================

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Import validation middleware and schemas
const { validate, validateObjectId } = require('../middlewares/validate');
const {
    createTaskSchema,
    updateTaskSchema,
    updateStatusSchema
} = require('../validations/taskValidation');

// GET - Retrieve all tasks (optional: ?status=pending or ?priority=high)
router.get('/', taskController.getAllTasks);

// GET - Retrieve task by ID (validate ObjectId)
router.get('/:id', validateObjectId(), taskController.getTaskById);

// POST - Create new task (with validation)
router.post('/', validate(createTaskSchema), taskController.createTask);

// PUT - Update task by ID (validate ObjectId + body)
router.put('/:id', validateObjectId(), validate(updateTaskSchema), taskController.updateTask);

// PATCH - Update task status only (validate ObjectId + status)
router.patch('/:id/status', validateObjectId(), validate(updateStatusSchema), taskController.updateTaskStatus);

// DELETE - Delete task by ID (validate ObjectId)
router.delete('/:id', validateObjectId(), taskController.deleteTask);

// DELETE - Delete all completed tasks
router.delete('/bulk/completed', taskController.deleteCompletedTasks);

module.exports = router;
