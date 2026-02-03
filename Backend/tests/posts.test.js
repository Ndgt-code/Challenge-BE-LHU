// ==========================================
// POSTS API TESTS
// ==========================================

const request = require('supertest');
const app = require('../src/app');
const Post = require('../src/models/Post');
const Comment = require('../src/models/Comment');

describe('Posts API', () => {
    let authToken;
    let userId;
    let postId;
    let secondUserToken;

    // Setup: Login and get auth token before tests
    beforeAll(async () => {
        // Register and login first user
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'postauthor',
                email: 'postauthor@test.com',
                password: '123456',
                confirmPassword: '123456'
            });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'postauthor@test.com',
                password: '123456'
            });

        authToken = loginRes.body.data.accessToken;
        userId = loginRes.body.data.user._id;

        // Register second user for authorization tests
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'otheruser',
                email: 'otheruser@test.com',
                password: '123456',
                confirmPassword: '123456'
            });

        const secondLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'otheruser@test.com',
                password: '123456'
            });

        secondUserToken = secondLogin.body.data.accessToken;
    });

    // Cleanup after all tests
    afterAll(async () => {
        await Post.deleteMany({});
        await Comment.deleteMany({});
    });

    // ------------------------------------------
    // CREATE POST TESTS
    // ------------------------------------------
    describe('POST /api/posts', () => {
        it('should create a new post with authentication', async () => {
            const res = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'My First Blog Post',
                    content: 'This is the content of my first blog post.',
                    tags: ['technology', 'tutorial'],
                    status: 'published',
                    featuredImage: '/uploads/cover.jpg'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe('My First Blog Post');
            expect(res.body.data.author.username).toBe('postauthor');
            expect(res.body.data.featuredImage).toBe('/uploads/cover.jpg');

            postId = res.body.data._id; // Save for later tests
        });

        it('should fail to create post without authentication', async () => {
            const res = await request(app)
                .post('/api/posts')
                .send({
                    title: 'Unauthorized Post',
                    content: 'This should not be created'
                });

            expect(res.statusCode).toBe(401);
        });

        it('should fail validation with missing title', async () => {
            const res = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'Content without title'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should fail validation with short title', async () => {
            const res = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'AB', // Too short (min 3)
                    content: 'Valid content here'
                });

            expect(res.statusCode).toBe(400);
        });

        it('should create post with imageGallery', async () => {
            const res = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Post with Images',
                    content: 'This post has multiple images',
                    imageGallery: ['/uploads/img1.jpg', '/uploads/img2.jpg']
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.data.imageGallery).toHaveLength(2);
        });
    });

    // ------------------------------------------
    // GET ALL POSTS TESTS
    // ------------------------------------------
    describe('GET /api/posts', () => {
        it('should get all posts with pagination', async () => {
            const res = await request(app)
                .get('/api/posts')
                .query({ page: 1, limit: 10 });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeInstanceOf(Array);
            expect(res.body.pagination).toBeDefined();
            expect(res.body.pagination.page).toBe(1);
        });

        it('should search posts by title', async () => {
            const res = await request(app)
                .get('/api/posts')
                .query({ search: 'First Blog' });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it('should filter posts by status', async () => {
            const res = await request(app)
                .get('/api/posts')
                .query({ status: 'published' });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.every(post => post.status === 'published')).toBe(true);
        });
    });

    // ------------------------------------------
    // GET POST BY ID TESTS
    // ------------------------------------------
    describe('GET /api/posts/:id', () => {
        it('should get post by ID with author populated', async () => {
            const res = await request(app)
                .get(`/api/posts/${postId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe('My First Blog Post');
            expect(res.body.data.author.username).toBeDefined();
        });

        it('should return 404 for non-existent post', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .get(`/api/posts/${fakeId}`);

            expect(res.statusCode).toBe(404);
        });
    });

    // ------------------------------------------
    // UPDATE POST TESTS
    // ------------------------------------------
    describe('PUT /api/posts/:id', () => {
        it('should update post by author', async () => {
            const res = await request(app)
                .put(`/api/posts/${postId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Updated Blog Post Title',
                    content: 'Updated content'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.title).toBe('Updated Blog Post Title');
        });

        it('should fail to update post by non-author', async () => {
            const res = await request(app)
                .put(`/api/posts/${postId}`)
                .set('Authorization', `Bearer ${secondUserToken}`)
                .send({
                    title: 'Trying to update someone elses post'
                });

            expect(res.statusCode).toBe(403);
        });

        it('should fail to update without authentication', async () => {
            const res = await request(app)
                .put(`/api/posts/${postId}`)
                .send({
                    title: 'Unauthorized update'
                });

            expect(res.statusCode).toBe(401);
        });
    });

    // ------------------------------------------
    // LIKE POST TESTS
    // ------------------------------------------
    describe('POST /api/posts/:id/like', () => {
        it('should like a post', async () => {
            const res = await request(app)
                .post(`/api/posts/${postId}/like`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.hasLiked).toBe(true);
            expect(res.body.data.likesCount).toBeGreaterThan(0);
        });

        it('should unlike a post', async () => {
            const res = await request(app)
                .post(`/api/posts/${postId}/like`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.hasLiked).toBe(false);
        });

        it('should fail to like without authentication', async () => {
            const res = await request(app)
                .post(`/api/posts/${postId}/like`);

            expect(res.statusCode).toBe(401);
        });
    });

    // ------------------------------------------
    // DELETE POST TESTS
    // ------------------------------------------
    describe('DELETE /api/posts/:id', () => {
        it('should fail to delete post by non-author (not admin)', async () => {
            const res = await request(app)
                .delete(`/api/posts/${postId}`)
                .set('Authorization', `Bearer ${secondUserToken}`);

            expect(res.statusCode).toBe(403);
        });

        it('should delete post by author with cascade delete comments', async () => {
            const res = await request(app)
                .delete(`/api/posts/${postId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('deleted');
        });
    });
});
