// ==========================================
// TASK CONTROLLER - Business Logic
// ==========================================

const Task = require('../models/Task');
const { successResponse, errorResponse, listResponse, deleteManyResponse } = require('../views/responseHelper');

// ------------------------------------------
// GET all tasks (with optional status filter)
// ------------------------------------------
const getAllTasks = async (req, res) => {
    try {
        const filter = {};

        // Filter by status if provided
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Filter by priority if provided
        if (req.query.priority) {
            filter.priority = req.query.priority;
        }

        const tasks = await Task.find(filter).sort({ createdAt: -1 });
        return listResponse(res, tasks);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ------------------------------------------
// GET task by ID
// ------------------------------------------
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return errorResponse(res, 'Task not found', 404);
        }

        return successResponse(res, 'Task retrieved successfully!', task);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ------------------------------------------
// CREATE new task
// ------------------------------------------
const createTask = async (req, res) => {
    try {
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            priority: req.body.priority,
            dueDate: req.body.dueDate
        });

        return successResponse(res, 'Task created successfully!', task, 201);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// UPDATE task by ID
// ------------------------------------------
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) {
            return errorResponse(res, 'Task not found', 404);
        }

        return successResponse(res, 'Task updated successfully!', task);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// UPDATE task status only
// ------------------------------------------
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'in-progress', 'completed'].includes(status)) {
            return errorResponse(res, 'Invalid status. Must be: pending, in-progress, or completed');
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!task) {
            return errorResponse(res, 'Task not found', 404);
        }

        return successResponse(res, `Task status updated to '${status}'!`, task);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// DELETE task by ID
// ------------------------------------------
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return errorResponse(res, 'Task not found', 404);
        }

        return res.json({
            message: 'Task deleted successfully!',
            deletedTask: task
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ------------------------------------------
// DELETE all completed tasks
// ------------------------------------------
const deleteCompletedTasks = async (req, res) => {
    try {
        const result = await Task.deleteMany({ status: 'completed' });
        return deleteManyResponse(res, 'Completed tasks deleted!', result.deletedCount);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    deleteCompletedTasks
};
