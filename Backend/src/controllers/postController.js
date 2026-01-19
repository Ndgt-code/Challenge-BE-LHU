// ==========================================
// POST CONTROLLER - CRUD with Populate
// ==========================================

const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { successResponse, errorResponse } = require('../views/responseHelper');
const { buildAdvancedQuery } = require('../utils/queryBuilder');

// ------------------------------------------
// CREATE new post
// ------------------------------------------
const createPost = async (req, res) => {
    try {
        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id, // From authenticated user
            tags: req.body.tags || [],
            status: req.body.status || 'published'
        });

        // Populate author info before returning
        await post.populate('author', 'username email');

        return successResponse(res, 'Post created successfully!', post, 201);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// GET all posts (with populate & pagination)
// ------------------------------------------
const getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search, status, author } = req.query;

        // Build query
        let query = {};
        if (status) query.status = status;
        if (author) query.author = author;
        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { content: new RegExp(search, 'i') }
            ];
        }

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const sortQuery = { [sort]: order === 'asc' ? 1 : -1 };

        const [posts, total] = await Promise.all([
            Post.find(query)
                .populate('author', 'username email avatar') // Populate author
                .sort(sortQuery)
                .skip(skip)
                .limit(limitNum),
            Post.countDocuments(query)
        ]);

        return res.json({
            success: true,
            data: posts,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ------------------------------------------
// GET post by ID (with comments)
// ------------------------------------------
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username email avatar')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username avatar' },
                options: { sort: { createdAt: -1 } }
            });

        if (!post) {
            return errorResponse(res, 'Post not found', 404);
        }

        return successResponse(res, 'Post retrieved', post);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ------------------------------------------
// GET posts by user
// ------------------------------------------
const getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'username email')
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ------------------------------------------
// UPDATE post
// ------------------------------------------
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return errorResponse(res, 'Post not found', 404);
        }

        // Check if user is author
        if (post.author.toString() !== req.user._id.toString()) {
            return errorResponse(res, 'Not authorized to update this post', 403);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title || post.title,
                content: req.body.content || post.content,
                tags: req.body.tags || post.tags,
                status: req.body.status || post.status
            },
            { new: true, runValidators: true }
        ).populate('author', 'username email');

        return successResponse(res, 'Post updated successfully!', updatedPost);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// ------------------------------------------
// DELETE post (with cascade delete comments)
// ------------------------------------------
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return errorResponse(res, 'Post not found', 404);
        }

        // Check if user is author or admin
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return errorResponse(res, 'Not authorized to delete this post', 403);
        }

        // Cascade delete: remove all comments first
        const deletedComments = await Comment.deleteMany({ post: req.params.id });

        // Then delete the post
        await Post.findByIdAndDelete(req.params.id);

        return res.json({
            success: true,
            message: 'Post and comments deleted successfully!',
            deletedCommentsCount: deletedComments.deletedCount
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// ------------------------------------------
// LIKE/UNLIKE post
// ------------------------------------------
const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return errorResponse(res, 'Post not found', 404);
        }

        const userId = req.user._id;
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // Unlike
            post.likes.pull(userId);
            post.likesCount = Math.max(0, post.likesCount - 1);
        } else {
            // Like
            post.likes.push(userId);
            post.likesCount += 1;
        }

        await post.save();

        return successResponse(res, hasLiked ? 'Post unliked' : 'Post liked', {
            likesCount: post.likesCount,
            hasLiked: !hasLiked
        });
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    getPostsByUser,
    updatePost,
    deletePost,
    toggleLike
};
