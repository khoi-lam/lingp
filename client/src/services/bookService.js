import api from './api';

export const bookService = {
    // Get all books
    getBooks: async (params = {}) => {
        const response = await api.get('/books', { params });
        return response.data;
    },

    // Get book by ID
    getBookById: async (id) => {
        const response = await api.get(`/books/${id}`);
        return response.data;
    },

    // Get book by slug
    getBookBySlug: async (slug) => {
        const response = await api.get(`/books/slug/${slug}`);
        return response.data;
    },

    // Create book
    createBook: async (formData) => {
        const response = await api.post('/books', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Update book
    updateBook: async (id, formData) => {
        const response = await api.put(`/books/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Delete book
    deleteBook: async (id) => {
        const response = await api.delete(`/books/${id}`);
        return response.data;
    }
};
