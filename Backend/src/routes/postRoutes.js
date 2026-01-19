// ==========================================
// POST ROUTES
// ==========================================

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middlewares/authMiddleware');

// ------------------------------------------
// POST routes
// ------------------------------------------
// Public routes - Order matters! Specific routes before param routes
router.get('/user/:userId', postController.getPostsByUser); // MUST be before /:id
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// Protected routes (require authentication)
router.post('/', authenticate, postController.createPost);
router.put('/:id', authenticate, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);
router.post('/:id/like', authenticate, postController.toggleLike);

// ------------------------------------------
// Comment routes (nested under posts)
// ------------------------------------------
router.get('/:postId/comments', commentController.getCommentsByPost);
router.post('/:postId/comments', authenticate, commentController.createComment);
router.put('/comments/:id', authenticate, commentController.updateComment);
router.delete('/comments/:id', authenticate, commentController.deleteComment);

module.exports = router;
