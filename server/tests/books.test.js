import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';

const API_URL = 'http://localhost:5000/api';

describe('Books API Tests', () => {
    let adminToken = '';
    let testBookId = '';

    beforeAll(async () => {
        // Login as admin
        const response = await request(API_URL)
            .post('/auth/login')
            .send({
                email: 'final_admin@gmail.com',
                password: 'Admin@123456'
            });

        adminToken = response.body.data.accessToken;
    });

    describe('GET /books', () => {
        test('Should get all books with pagination', async () => {
            const response = await request(API_URL)
                .get('/books?page=1&limit=10')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('books');
            expect(response.body.data).toHaveProperty('pagination');
            expect(Array.isArray(response.body.data.books)).toBe(true);
        });

        test('Should filter books by search query', async () => {
            const response = await request(API_URL)
                .get('/books?search=Harry Potter')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.books.length).toBeGreaterThan(0);
        });

        test('Should sort books by price', async () => {
            const response = await request(API_URL)
                .get('/books?sort=price')
                .expect(200);

            expect(response.body.success).toBe(true);
            const books = response.body.data.books;
            if (books.length > 1) {
                expect(books[0].price).toBeLessThanOrEqual(books[1].price);
            }
        });
    });

    describe('GET /books/suggest', () => {
        test('Should get book suggestions', async () => {
            const response = await request(API_URL)
                .get('/books/suggest?q=Harry')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('suggestions');
            expect(Array.isArray(response.body.data.suggestions)).toBe(true);
        });

        test('Should return empty array for short query', async () => {
            const response = await request(API_URL)
                .get('/books/suggest?q=H')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.suggestions).toEqual([]);
        });
    });

    describe('GET /books/:id', () => {
        test('Should get book by ID', async () => {
            // First get a book ID
            const booksResponse = await request(API_URL).get('/books?limit=1');
            const bookId = booksResponse.body.data.books[0]._id;

            const response = await request(API_URL)
                .get(`/books/${bookId}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.book).toHaveProperty('_id', bookId);
        });

        test('Should return 404 for invalid ID', async () => {
            const response = await request(API_URL)
                .get('/books/invalid-id')
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /books (Admin)', () => {
        test('Should create a new book as admin', async () => {
            const newBook = {
                title: 'Test Book ' + Date.now(),
                author: 'Test Author',
                publisher: 'Test Publisher',
                price: 100000,
                stock: 50,
                description: 'Test description',
                isbn: 'TEST-' + Date.now()
            };

            const response = await request(API_URL)
                .post('/books')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newBook)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.book).toHaveProperty('title', newBook.title);
            testBookId = response.body.data.book._id;
        });

        test('Should fail without admin token', async () => {
            const response = await request(API_URL)
                .post('/books')
                .send({ title: 'Test' })
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /books/:id (Admin)', () => {
        test('Should update book as admin', async () => {
            const updates = {
                price: 150000,
                stock: 100
            };

            const response = await request(API_URL)
                .put(`/books/${testBookId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updates)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.book.price).toBe(updates.price);
        });
    });

    describe('DELETE /books/:id (Admin)', () => {
        test('Should delete book as admin', async () => {
            const response = await request(API_URL)
                .delete(`/books/${testBookId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });
});
