// ==========================================
// POST MODEL - Relationships Example
// ==========================================

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    // Reference to User (One-to-Many: 1 User has many Posts)
    author: {
        type: Schema.Types.ObjectId,
        ref: 'AuthUser', // Reference to AuthUser model
        required: [true, 'Author is required'],
        index: true // Index for faster queries
    },
    // Array of users who liked this post
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'AuthUser'
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    }
}, {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ------------------------------------------
// VIRTUAL: Get comments count (reverse populate)
// ------------------------------------------
postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post'
});

// ------------------------------------------
// INDEX: Compound index for common queries
// ------------------------------------------
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ status: 1, createdAt: -1 });

// ------------------------------------------
// PRE-REMOVE: Cascade delete comments
// ------------------------------------------
postSchema.pre('deleteOne', { document: true, query: false }, async function () {
    await mongoose.model('Comment').deleteMany({ post: this._id });
});

// Static method to delete post with cascade
postSchema.statics.deleteWithCascade = async function (postId) {
    // Delete all comments of this post
    await mongoose.model('Comment').deleteMany({ post: postId });
    // Delete the post
    return this.findByIdAndDelete(postId);
};

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
