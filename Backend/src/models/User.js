const mongoose = require('mongoose');

// ==========================================
// USER SCHEMA
// ==========================================
const userSchema = new mongoose.Schema({
    // User name
    name: {
        type: String,
        required: true
    },

    // Email (unique)
    email: {
        type: String,
        required: true,
        unique: true
    },

    // Age
    age: {
        type: Number
    },

    // Is active?
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
