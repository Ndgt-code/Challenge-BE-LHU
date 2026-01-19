// ==========================================
// COMMENT CONTROLLER
// ==========================================

const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { successResponse, errorResponse } = require('../views/responseHelper');

// ------------------------------------------
// CREATE comment
// ------------------------------------------
const createComment = async (req, res) => {
    try {
        // Check if post exists
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return errorResponse(res, 'Post not found', 404);
        }

        const comment = await Comment.create({
            content: req.body.content,
            post: req.params.postId,
            author: req.user._id
        });

        // Populate author info
        await comment.populate('author', 'username avatar');

        return successResponse(res, 'Comment added!', comment, 201);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// GET comments by post
// ------------------------------------------
const getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ------------------------------------------
// UPDATE comment
// ------------------------------------------
const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return errorResponse(res, 'Comment not found', 404);
        }

        // Check if user is author
        if (comment.author.toString() !== req.user._id.toString()) {
            return errorResponse(res, 'Not authorized', 403);
        }

        comment.content = req.body.content;
        await comment.save();

        return successResponse(res, 'Comment updated!', comment);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// DELETE comment
// ------------------------------------------
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return errorResponse(res, 'Comment not found', 404);
        }

        // Check if user is author or admin
        if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return errorResponse(res, 'Not authorized', 403);
        }

        await Comment.findByIdAndDelete(req.params.id);

        return successResponse(res, 'Comment deleted!');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

module.exports = {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment
};
