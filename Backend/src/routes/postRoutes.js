// ==========================================
// POST ROUTES
// ==========================================

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validateCreatePost, validateUpdatePost } = require('../validations/postValidation');
const { validateCreateComment, validateUpdateComment } = require('../validations/commentValidation');

// ------------------------------------------
// POST routes
// ------------------------------------------
// Public routes - Order matters! Specific routes before param routes
router.get('/user/:userId', postController.getPostsByUser); // MUST be before /:id
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// Protected routes (require authentication)
router.post('/', authenticate, validateCreatePost, postController.createPost);
router.put('/:id', authenticate, validateUpdatePost, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);
router.post('/:id/like', authenticate, postController.toggleLike);

// ------------------------------------------
// Comment routes (nested under posts)
// ------------------------------------------
router.get('/:postId/comments', commentController.getCommentsByPost);
router.post('/:postId/comments', authenticate, validateCreateComment, commentController.createComment);
router.put('/comments/:id', authenticate, validateUpdateComment, commentController.updateComment);
router.delete('/comments/:id', authenticate, commentController.deleteComment);

module.exports = router;
