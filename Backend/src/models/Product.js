const mongoose = require('mongoose');

// ==========================================
// PRODUCT SCHEMA
// ==========================================
const productSchema = new mongoose.Schema({
    // Product name
    name: {
        type: String,
        required: true
    },

    // Price (non-negative)
    price: {
        type: Number,
        required: true,
        min: 0
    },

    // Description
    description: {
        type: String
    },

    // Stock quantity
    stock: {
        type: Number,
        default: 0
    },

    // Category (enum)
    category: {
        type: String,
        enum: ['electronics', 'clothing', 'food', 'other'],
        default: 'other'
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
