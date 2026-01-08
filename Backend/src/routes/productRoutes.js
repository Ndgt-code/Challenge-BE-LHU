// ==========================================
// PRODUCT ROUTES
// ==========================================

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET - Retrieve all products
router.get('/', productController.getAllProducts);

// POST - Create product
router.post('/', productController.createProduct);

// PUT - Update product by ID
router.put('/:id', productController.updateProduct);

// PATCH - Increase stock
router.patch('/:id/increase-stock', productController.increaseStock);

// PATCH - Decrease stock
router.patch('/:id/decrease-stock', productController.decreaseStock);

// DELETE - Delete product by ID
router.delete('/:id', productController.deleteProduct);

// DELETE - Delete product using deleteOne()
router.delete('/one/:id', productController.deleteProductOne);

// DELETE - Delete out of stock products
router.delete('/bulk/out-of-stock', productController.deleteOutOfStockProducts);

module.exports = router;
