const mongoose = require('mongoose');

// ==========================================
// USER SCHEMA - Simple version
// ==========================================

const userSchema = new mongoose.Schema({
    // STRING - User name
    name: {
        type: String,
        required: true      // Required fiel
    },

    // STRING - Email
    email: {
        type: String,
        required: true,
        unique: true        // Must be unique
    },

    // NUMBER - Age
    age: {
        type: Number
    },

    // BOOLEAN - Is active?
    isActive: {
        type: Boolean,
        default: true       // Default is true
    }
}, {
    timestamps: true        // Auto add createdAt, updatedAt
});

// Create Model from Schema
const User = mongoose.model('User', userSchema);

module.exports = User;
