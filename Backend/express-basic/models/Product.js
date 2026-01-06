const mongoose = require('mongoose');

// ==========================================
// PRODUCT SCHEMA - Phiên bản đơn giản
// ==========================================

const productSchema = new mongoose.Schema({
    // STRING - Tên sản phẩm
    name: {
        type: String,
        required: true
    },

    // NUMBER - Giá
    price: {
        type: Number,
        required: true,
        min: 0              // Giá không được âm
    },

    // STRING - Mô tả
    description: {
        type: String
    },

    // NUMBER - Số lượng trong kho
    stock: {
        type: Number,
        default: 0
    },

    // STRING với ENUM - Chỉ chấp nhận một số giá trị
    category: {
        type: String,
        enum: ['electronics', 'clothing', 'food', 'other'],
        default: 'other'
    }
}, {
    timestamps: true
});

// Tạo Model từ Schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
