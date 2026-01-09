// ==========================================
// AUTH ROUTES
// ==========================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Import validation middleware and schemas
const { validate, validateObjectId } = require('../middlewares/validate');
const {
    registerSchema,
    loginSchema,
    changePasswordSchema
} = require('../validations/authValidation');

// ------------------------------------------
// PUBLIC ROUTES (No authentication required)
// ------------------------------------------

// POST /api/auth/register - Register new user
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login - Login user
router.post('/login', validate(loginSchema), authController.login);

// ------------------------------------------
// PROTECTED ROUTES (Authentication required - will add JWT later)
// ------------------------------------------

// GET /api/auth/profile/:userId - Get user profile
router.get('/profile/:userId', validateObjectId('userId'), authController.getProfile);

// PUT /api/auth/change-password/:userId - Change password
router.put(
    '/change-password/:userId',
    validateObjectId('userId'),
    validate(changePasswordSchema),
    authController.changePassword
);

module.exports = router;
