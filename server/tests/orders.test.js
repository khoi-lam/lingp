import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';

const API_URL = 'http://localhost:5000/api';

describe('Orders API Tests', () => {
    let userToken = '';
    let adminToken = '';
    let testOrderId = '';
    let userId = '';

    beforeAll(async () => {
        // Create test user
        const registerResponse = await request(API_URL)
            .post('/auth/register')
            .send({
                name: 'Order Test User',
                email: `ordertest${Date.now()}@example.com`,
                password: 'Test123456',
                phone: '0987654321'
            });

        userToken = registerResponse.body.data.accessToken;
        userId = registerResponse.body.data.user._id;

        // Login as admin
        const adminResponse = await request(API_URL)
            .post('/auth/login')
            .send({
                email: 'final_admin@gmail.com',
                password: 'Admin@123456'
            });

        adminToken = adminResponse.body.data.accessToken;
    });

    describe('POST /orders', () => {
        test('Should create a new order', async () => {
            // Get a book first
            const booksResponse = await request(API_URL).get('/books?limit=1');
            const book = booksResponse.body.data.books[0];

            const orderData = {
                items: [{
                    book: book._id,
                    quantity: 2,
                    price: book.price
                }],
                shippingAddress: {
                    fullName: 'Test User',
                    phone: '0123456789',
                    address: '123 Test St',
                    city: 'Ho Chi Minh',
                    district: 'District 1'
                },
                paymentMethod: 'COD'
            };

            const response = await request(API_URL)
                .post('/orders')
                .set('Authorization', `Bearer ${userToken}`)
                .send(orderData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.order).toHaveProperty('_id');
            expect(response.body.data.order.orderStatus).toBe('pending');
            testOrderId = response.body.data.order._id;
        });

        test('Should fail without authentication', async () => {
            const response = await request(API_URL)
                .post('/orders')
                .send({ items: [] })
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /orders/my-orders', () => {
        test('Should get user orders', async () => {
            const response = await request(API_URL)
                .get('/orders/my-orders')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data.orders)).toBe(true);
            expect(response.body.data.orders.length).toBeGreaterThan(0);
        });
    });

    describe('GET /orders/:id', () => {
        test('Should get order by ID', async () => {
            const response = await request(API_URL)
                .get(`/orders/${testOrderId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.order._id).toBe(testOrderId);
        });
    });

    describe('PATCH /orders/:id/cancel', () => {
        test('Should cancel order', async () => {
            const response = await request(API_URL)
                .patch(`/orders/${testOrderId}/cancel`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ reason: 'Changed my mind' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.order.orderStatus).toBe('cancelled');
        });
    });

    describe('Admin Order Management', () => {
        test('Should get all orders as admin', async () => {
            const response = await request(API_URL)
                .get('/orders')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('orders');
            expect(response.body.data).toHaveProperty('stats');
        });

        test('Should get order statistics', async () => {
            const response = await request(API_URL)
                .get('/orders/stats')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('totalOrders');
            expect(response.body.data).toHaveProperty('totalRevenue');
        });
    });
});
