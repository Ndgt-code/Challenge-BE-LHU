// ==========================================
// AUTH ROUTES - With JWT Authentication
// ==========================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Import validation middleware and schemas
const { validate, validateObjectId } = require('../middlewares/validate');
const {
    registerSchema,
    loginSchema,
    changePasswordSchema,
    updateProfileSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require('../validations/authValidation');

// Import JWT authentication middleware
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// ------------------------------------------
// PUBLIC ROUTES (No authentication required)
// ------------------------------------------

// POST /api/auth/register - Register new user
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login - Login user (returns JWT tokens)
router.post('/login', validate(loginSchema), authController.login);

// POST /api/auth/refresh-token - Get new access token using refresh token
router.post('/refresh-token', authController.refreshToken);

// POST /api/auth/forgot-password - Request password reset token
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// ------------------------------------------
// PROTECTED ROUTES (JWT Authentication required)
// ------------------------------------------

// GET /api/auth/profile - Get current user's profile (requires valid JWT)
router.get('/profile', authenticate, authController.getProfile);

// PUT /api/auth/profile - Update current user's profile
router.put(
    '/profile',
    authenticate,
    validate(updateProfileSchema),
    authController.updateProfile
);

// PUT /api/auth/change-password - Change current user's password
router.put(
    '/change-password',
    authenticate,
    validate(changePasswordSchema),
    authController.changePassword
);

// ------------------------------------------
// AVATAR UPLOAD ROUTE
// ------------------------------------------
const upload = require('../config/multer');

// PUT /api/auth/avatar - Upload user avatar
router.put(
    '/avatar',
    authenticate,
    upload.single('avatar'),
    authController.uploadAvatar
);

// ------------------------------------------
// ADMIN ROUTES (JWT + Admin role required)
// ------------------------------------------

// GET /api/auth/users/:userId - Admin can view any user's profile
router.get(
    '/users/:userId',
    authenticate,
    authorize('admin'),
    validateObjectId('userId'),
    authController.getUserById
);

module.exports = router;
