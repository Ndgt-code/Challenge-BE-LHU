const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');

describe('Auth API', () => {
    // Clean up database before tests
    beforeAll(async () => {
        // Delete test user if exists
        await User.deleteMany({ email: /test.*@example\.com/ });
    });

    // Clean up after all tests
    afterAll(async () => {
        await User.deleteMany({ email: /test.*@example\.com/ });
        await mongoose.connection.close();
    });

    describe('POST /api/auth/register', () => {
        test('Should register a new user successfully', async () => {
            const uniqueEmail = `test${Date.now()}@example.com`;
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: `testuser${Date.now()}`,
                    email: uniqueEmail,
                    password: '123456',
                    confirmPassword: '123456'
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('User registered successfully!');
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data.email).toBe(uniqueEmail);
        });

        test('Should fail with duplicate email', async () => {
            // First registration
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser2',
                    email: 'test2@example.com',
                    password: '123456',
                    confirmPassword: '123456'
                });

            // Try to register again with same email
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser3',
                    email: 'test2@example.com',
                    password: '123456',
                    confirmPassword: '123456'
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('Should fail with password mismatch', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser4',
                    email: 'test4@example.com',
                    password: '123456',
                    confirmPassword: '654321'
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('Should fail with missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test5@example.com'
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        // Create a test user before login tests
        beforeAll(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'logintest',
                    email: 'logintest@example.com',
                    password: '123456',
                    confirmPassword: '123456'
                });
        });

        test('Should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'logintest@example.com',
                    password: '123456'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('accessToken');
            expect(res.body.data).toHaveProperty('refreshToken');
            expect(res.body.data.user.email).toBe('logintest@example.com');
        });

        test('Should fail with wrong password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'logintest@example.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test('Should fail with non-existent email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: '123456'
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test('Should fail with missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'logintest@example.com'
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
});
