const mongoose = require('mongoose');

// ==========================================
// PRODUCT SCHEMA - Simple versio
// ==========================================

const productSchema = new mongoose.Schema({
    // STRING - Product name
    name: {
        type: String,
        required: true
    },

    // NUMBER - Price
    price: {
        type: Number,
        required: true,
        min: 0              // Price cannot be negative
    },

    // STRING - Description
    description: {
        type: String
    },

    // NUMBER - Stock quantity
    stock: {
        type: Number,
        default: 0
    },

    // STRING with ENUM - Only accepts specific values
    category: {
        type: String,
        enum: ['electronics', 'clothing', 'food', 'other'],
        default: 'other'
    }
}, {
    timestamps: true
});

// Create Model from Schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
