const mongoose = require('mongoose');

// ==========================================
// USER SCHEMA - Phiên bản đơn giản
// ==========================================

const userSchema = new mongoose.Schema({
    // STRING - Tên người dùng
    name: {
        type: String,
        required: true      // Bắt buộc phải có
    },

    // STRING - Email
    email: {
        type: String,
        required: true,
        unique: true        // Không được trùng
    },

    // NUMBER - Tuổi
    age: {
        type: Number
    },

    // BOOLEAN - Đang hoạt động?
    isActive: {
        type: Boolean,
        default: true       // Mặc định là true
    }
}, {
    timestamps: true        // Tự động thêm createdAt, updatedAt
});

// Tạo Model từ Schema
const User = mongoose.model('User', userSchema);

module.exports = User;
