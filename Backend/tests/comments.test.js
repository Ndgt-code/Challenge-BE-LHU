// ==========================================
// COMMENTS API TESTS
// ==========================================

const request = require('supertest');
const app = require('../src/app');
const Post = require('../src/models/Post');
const Comment = require('../src/models/Comment');

describe('Comments API', () => {
    let authToken;
    let postId;
    let commentId;
    let secondUserToken;

    // Setup: Create post and login before tests
    beforeAll(async () => {
        // Register and login first user
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'commentuser',
                email: 'commentuser@test.com',
                password: '123456',
                confirmPassword: '123456'
            });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'commentuser@test.com',
                password: '123456'
            });

        authToken = loginRes.body.data.accessToken;

        // Create a post to comment on
        const postRes = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Test Post for Comments',
                content: 'This post will have comments'
            });

        postId = postRes.body.data._id;

        // Register second user
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'commentuser2',
                email: 'commentuser2@test.com',
                password: '123456',
                confirmPassword: '123456'
            });

        const secondLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'commentuser2@test.com',
                password: '123456'
            });

        secondUserToken = secondLogin.body.data.accessToken;
    });

    // Cleanup
    afterAll(async () => {
        await Post.deleteMany({});
        await Comment.deleteMany({});
    });

    // ------------------------------------------
    // CREATE COMMENT TESTS
    // ------------------------------------------
    describe('POST /api/posts/:postId/comments', () => {
        it('should create a comment on a post', async () => {
            const res = await request(app)
                .post(`/api/posts/${postId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'This is a great post! Thanks for sharing.'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.content).toBe('This is a great post! Thanks for sharing.');
            expect(res.body.data.author.username).toBe('commentuser');

            commentId = res.body.data._id;
        });

        it('should fail to create comment without authentication', async () => {
            const res = await request(app)
                .post(`/api/posts/${postId}/comments`)
                .send({
                    content: 'Anonymous comment'
                });

            expect(res.statusCode).toBe(401);
        });

        it('should fail validation with empty content', async () => {
            const res = await request(app)
                .post(`/api/posts/${postId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: ''
                });

            expect(res.statusCode).toBe(400);
        });

        it('should fail validation with content too long (>1000 chars)', async () => {
            const longContent = 'a'.repeat(1001);
            const res = await request(app)
                .post(`/api/posts/${postId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: longContent
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it('should fail to comment on non-existent post', async () => {
            const fakePostId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .post(`/api/posts/${fakePostId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'Comment on fake post'
                });

            expect(res.statusCode).toBe(404);
        });
    });

    // ------------------------------------------
    // GET COMMENTS TESTS
    // ------------------------------------------
    describe('GET /api/posts/:postId/comments', () => {
        it('should get all comments for a post', async () => {
            const res = await request(app)
                .get(`/api/posts/${postId}/comments`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeInstanceOf(Array);
            expect(res.body.count).toBeGreaterThan(0);
        });

        it('should return empty array for post with no comments', async () => {
            // Create new post
            const postRes = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Post Without Comments',
                    content: 'No one will comment here'
                });

            const res = await request(app)
                .get(`/api/posts/${postRes.body.data._id}/comments`);

            expect(res.statusCode).toBe(200);
            expect(res.body.count).toBe(0);
            expect(res.body.data).toHaveLength(0);
        });
    });

    // ------------------------------------------
    // UPDATE COMMENT TESTS
    // ------------------------------------------
    describe('PUT /api/posts/comments/:id', () => {
        it('should update comment by author', async () => {
            const res = await request(app)
                .put(`/api/posts/comments/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'Updated comment content'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.content).toBe('Updated comment content');
        });

        it('should fail to update comment by non-author', async () => {
            const res = await request(app)
                .put(`/api/posts/comments/${commentId}`)
                .set('Authorization', `Bearer ${secondUserToken}`)
                .send({
                    content: 'Trying to update someone elses comment'
                });

            expect(res.statusCode).toBe(403);
        });

        it('should fail to update without authentication', async () => {
            const res = await request(app)
                .put(`/api/posts/comments/${commentId}`)
                .send({
                    content: 'Unauthorized update'
                });

            expect(res.statusCode).toBe(401);
        });

        it('should fail validation with empty content', async () => {
            const res = await request(app)
                .put(`/api/posts/comments/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: ''
                });

            expect(res.statusCode).toBe(400);
        });
    });

    // ------------------------------------------
    // DELETE COMMENT TESTS
    // ------------------------------------------
    describe('DELETE /api/posts/comments/:id', () => {
        it('should fail to delete comment by non-author (not admin)', async () => {
            const res = await request(app)
                .delete(`/api/posts/comments/${commentId}`)
                .set('Authorization', `Bearer ${secondUserToken}`);

            expect(res.statusCode).toBe(403);
        });

        it('should delete comment by author', async () => {
            const res = await request(app)
                .delete(`/api/posts/comments/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 404 for non-existent comment', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .delete(`/api/posts/comments/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(404);
        });
    });
});
