// ==========================================
// PRODUCT CONTROLLER - Business Logic
// ==========================================

const Product = require('../models/Product');
const { successResponse, errorResponse, listResponse, deleteManyResponse } = require('../views/responseHelper');

// ------------------------------------------
// GET all products
// ------------------------------------------
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return listResponse(res, products);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ------------------------------------------
// CREATE product
// ------------------------------------------
const createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            category: req.body.category
        });

        return successResponse(res, 'Product created successfully!', product, 201);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// UPDATE product by ID
// ------------------------------------------
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        return successResponse(res, 'Product updated successfully!', product);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// INCREASE stock using $inc
// ------------------------------------------
const increaseStock = async (req, res) => {
    try {
        const amount = req.body.amount || 1;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { stock: amount } },
            { new: true }
        );

        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        return successResponse(res, `Stock increased by ${amount}!`, product);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// DECREASE stock using $inc with negative
// ------------------------------------------
const decreaseStock = async (req, res) => {
    try {
        const amount = req.body.amount || 1;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { stock: -amount } },
            { new: true }
        );

        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        return successResponse(res, `Stock decreased by ${amount}!`, product);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// DELETE product by ID using findByIdAndDelete()
// ------------------------------------------
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        return res.json({
            message: 'Product deleted successfully!',
            deletedProduct: product
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ------------------------------------------
// DELETE product using deleteOne()
// ------------------------------------------
const deleteProductOne = async (req, res) => {
    try {
        const result = await Product.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return errorResponse(res, 'Product not found', 404);
        }

        return deleteManyResponse(res, 'Product deleted!', result.deletedCount);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ------------------------------------------
// DELETE out of stock products using deleteMany()
// ------------------------------------------
const deleteOutOfStockProducts = async (req, res) => {
    try {
        const result = await Product.deleteMany({ stock: 0 });
        return deleteManyResponse(res, 'Out of stock products deleted!', result.deletedCount);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    increaseStock,
    decreaseStock,
    deleteProduct,
    deleteProductOne,
    deleteOutOfStockProducts
};
