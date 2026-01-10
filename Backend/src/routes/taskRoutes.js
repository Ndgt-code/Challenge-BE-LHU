// ==========================================
// TASK ROUTES (with Auth & Validation)
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

// Import authentication middleware
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// ==========================================
// PUBLIC ROUTES (No auth required)
// ==========================================

// GET - Retrieve all tasks (optional: ?status=pending or ?priority=high)
router.get('/', taskController.getAllTasks);

// GET - Retrieve task by ID
router.get('/:id', validateObjectId(), taskController.getTaskById);

// ==========================================
// PROTECTED ROUTES (Auth required - any logged-in user)
// ==========================================

// POST - Create new task (must be logged in)
router.post('/',
    authenticate,                    // Must be logged in
    validate(createTaskSchema),
    taskController.createTask
);

// PUT - Update task by ID (must be logged in)
router.put('/:id',
    authenticate,
    validateObjectId(),
    validate(updateTaskSchema),
    taskController.updateTask
);

// PATCH - Update task status only (must be logged in)
router.patch('/:id/status',
    authenticate,
    validateObjectId(),
    validate(updateStatusSchema),
    taskController.updateTaskStatus
);

// DELETE - Delete task by ID (must be logged in)
router.delete('/:id',
    authenticate,
    validateObjectId(),
    taskController.deleteTask
);

// ==========================================
// ADMIN ONLY ROUTES
// ==========================================

// DELETE - Delete all completed tasks (admin only)
router.delete('/bulk/completed',
    authenticate,
    authorize('admin'),              // Only admin can bulk delete
    taskController.deleteCompletedTasks
);

module.exports = router;
