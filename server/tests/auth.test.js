import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

const API_URL = 'http://localhost:5000/api';

describe('Authentication API Tests', () => {
    let accessToken = '';
    let userId = '';
    const testUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'Test123456',
        phone: '0123456789'
    };

    describe('POST /auth/register', () => {
        test('Should register a new user successfully', async () => {
            const response = await request(API_URL)
                .post('/auth/register')
                .send(testUser)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toHaveProperty('email', testUser.email);
            expect(response.body.data.user).toHaveProperty('name', testUser.name);
            expect(response.body.data).toHaveProperty('accessToken');

            accessToken = response.body.data.accessToken;
            userId = response.body.data.user._id;
        });

        test('Should fail with duplicate email', async () => {
            const response = await request(API_URL)
                .post('/auth/register')
                .send(testUser)
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        test('Should fail with invalid email', async () => {
            const response = await request(API_URL)
                .post('/auth/register')
                .send({ ...testUser, email: 'invalid-email' })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /auth/login', () => {
        test('Should login successfully with correct credentials', async () => {
            const response = await request(API_URL)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data.user).toHaveProperty('email', testUser.email);
        });

        test('Should fail with incorrect password', async () => {
            const response = await request(API_URL)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                })
                .expect(401);

            expect(response.body.success).toBe(false);
        });

        test('Should fail with non-existent email', async () => {
            const response = await request(API_URL)
                .post('/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                })
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /auth/me', () => {
        test('Should get current user with valid token', async () => {
            const response = await request(API_URL)
                .get('/auth/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toHaveProperty('email', testUser.email);
        });

        test('Should fail without token', async () => {
            const response = await request(API_URL)
                .get('/auth/me')
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /auth/logout', () => {
        test('Should logout successfully', async () => {
            const response = await request(API_URL)
                .post('/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });
});

export { API_URL };
