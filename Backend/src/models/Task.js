const mongoose = require('mongoose');

// ==========================================
// TASK SCHEMA
// ==========================================
const taskSchema = new mongoose.Schema({
    // Task title (required)
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },

    // Description
    description: {
        type: String,
        trim: true
    },

    // Status: pending, in-progress, completed
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },

    // Priority: low, medium, high
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },

    // Due date
    dueDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
