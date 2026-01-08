// ==========================================
// USER ROUTES
// ==========================================

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET - Retrieve all users
router.get('/', userController.getAllUsers);

// POST - Create user (using create())
router.post('/', userController.createUser);

// POST - Create user (using new + save())
router.post('/v2', userController.createUserV2);

// POST - Create multiple users (using insertMany())
router.post('/bulk', userController.createBulkUsers);

// PUT - Update user by ID
router.put('/:id', userController.updateUserById);

// PUT - Update user by email
router.put('/email/:email', userController.updateUserByEmail);

// PATCH - Deactivate user
router.patch('/:id/deactivate', userController.deactivateUser);

// PATCH - Deactivate users > 50 years old
router.patch('/bulk/deactivate-old', userController.deactivateOldUsers);

// DELETE - Delete user by ID
router.delete('/:id', userController.deleteUserById);

// DELETE - Delete user by email
router.delete('/email/:email', userController.deleteUserByEmail);

// DELETE - Delete all inactive users
router.delete('/bulk/inactive', userController.deleteInactiveUsers);

module.exports = router;
