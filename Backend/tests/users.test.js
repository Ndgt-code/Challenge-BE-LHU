const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');

describe('Users API', () => {
    let testUserId;

    // Setup: Clean up test users
    beforeAll(async () => {
        await User.deleteMany({ email: /usertest.*@example\.com/ });
    });

    // Clean up after all tests
    afterAll(async () => {
        await User.deleteMany({ email: /usertest.*@example\.com/ });
        await mongoose.connection.close();
    });

    describe('GET /api/users', () => {
        test('Should get all users', async () => {
            const res = await request(app)
                .get('/api/users');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('POST /api/users', () => {
        test('Should create a new user', async () => {
            const uniqueEmail = `usertest${Date.now()}@example.com`;
            const res = await request(app)
                .post('/api/users')
                .send({
                    username: `newuser${Date.now()}`,
                    email: uniqueEmail,
                    password: '123456'
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe(uniqueEmail);

            // Save user ID for later tests
            testUserId = res.body.data._id;
        });

        test('Should fail with missing fields', async () => {
            const res = await request(app)
                .post('/api/users')
                .send({
                    email: 'incomplete@example.com'
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PUT /api/users/:id', () => {
        test('Should update user by ID', async () => {
            const res = await request(app)
                .put(`/api/users/${testUserId}`)
                .send({
                    username: 'updatedUsername'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.username).toBe('updatedUsername');
        });

        test('Should fail with invalid ID', async () => {
            const res = await request(app)
                .put('/api/users/invalid-id')
                .send({
                    username: 'test'
                });

            expect(res.status).toBe(400);
        });
    });

    describe('DELETE /api/users/:id', () => {
        test('Should delete user by ID', async () => {
            const res = await request(app)
                .delete(`/api/users/${testUserId}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test('Should fail with non-existent ID', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .delete(`/api/users/${fakeId}`);

            expect(res.status).toBe(404);
        });
    });
});
