// ==========================================
// COMMENT MODEL - Nested Relationships
// ==========================================

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    // Reference to Post (Many-to-One)
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post reference is required'],
        index: true
    },
    // Reference to User (Many-to-One)
    author: {
        type: Schema.Types.ObjectId,
        ref: 'AuthUser',
        required: [true, 'Author is required'],
        index: true
    }
}, {
    timestamps: true
});

// ------------------------------------------
// INDEX: Compound index for common queries
// ------------------------------------------
commentSchema.index({ post: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
