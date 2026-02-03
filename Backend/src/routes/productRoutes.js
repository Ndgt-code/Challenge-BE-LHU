// ==========================================
// PRODUCT ROUTES (with Auth)
// ==========================================

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Import authentication middleware
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { validateCreateProduct, validateUpdateProduct, validateStockOperation } = require('../validations/productValidation');

// ==========================================
// PUBLIC ROUTES (Anyone can view)
// ==========================================

// GET - Retrieve all products
router.get('/', productController.getAllProducts);

// GET - Retrieve single product by ID
router.get('/:id', productController.getProductById);

// ==========================================
// PROTECTED ROUTES (Auth required)
// ==========================================

// POST - Create product (must be logged in)
router.post('/',
    authenticate,
    validateCreateProduct,
    productController.createProduct
);

// PUT - Update product by ID (must be logged in)
router.put('/:id',
    authenticate,
    validateUpdateProduct,
    productController.updateProduct
);

// PATCH - Increase stock (must be logged in)
router.patch('/:id/increase-stock',
    authenticate,
    validateStockOperation,
    productController.increaseStock
);

// PATCH - Decrease stock (must be logged in)
router.patch('/:id/decrease-stock',
    authenticate,
    validateStockOperation,
    productController.decreaseStock
);

// ==========================================
// ADMIN ONLY ROUTES
// ==========================================

// DELETE - Delete product by ID (admin only)
router.delete('/:id',
    authenticate,
    authorize('admin'),              // Only admin can delete
    productController.deleteProduct
);

// DELETE - Delete product using deleteOne() (admin only)
router.delete('/one/:id',
    authenticate,
    authorize('admin'),
    productController.deleteProductOne
);

// DELETE - Delete out of stock products (admin only)
router.delete('/bulk/out-of-stock',
    authenticate,
    authorize('admin'),              // Bulk delete = admin only
    productController.deleteOutOfStockProducts
);

module.exports = router;
