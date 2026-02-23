import axios from 'axios';

import { API_URL } from '../config.js';
const API_BASE = API_URL;

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

// Attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            try {
                const { data } = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
                if (data.success) {
                    localStorage.setItem('accessToken', data.data.accessToken);
                    original.headers.Authorization = `Bearer ${data.data.accessToken}`;
                    return api(original);
                }
            } catch {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ── Auth ──
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (email, password, name) => api.post('/auth/register', { email, password, name }),
    logout: () => api.post('/auth/logout'),
    refresh: () => api.post('/auth/refresh'),
};

// ── Stats (Admin Dashboard) ──
export const statsAPI = {
    getDashboard: () => api.get('/stats/dashboard'),
    getRevenue: (period) => api.get('/stats/revenue', { params: { period } }),
    getTopProducts: () => api.get('/stats/top-products'),
};

// ── Books ──
export const booksAPI = {
    getAll: (params) => api.get('/books', { params }),
    getById: (id) => api.get(`/books/${id}`),
    getBySlug: (slug) => api.get(`/books/slug/${slug}`),
    create: (formData) => api.post('/books', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, formData) => api.put(`/books/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id) => api.delete(`/books/${id}`),
};

// ── Categories ──
export const categoriesAPI = {
    getAll: (params) => api.get('/categories', { params }),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// ── Orders ──
export const ordersAPI = {
    create: (data) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders/my-orders'),
    getById: (id) => api.get(`/orders/${id}`),
    adminGetAll: (params) => api.get('/orders/admin/all', { params }),
    adminGetStats: () => api.get('/orders/admin/stats'),
    updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

// ── Users (Admin) ──
export const usersAPI = {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
    adminGetAll: (params) => api.get('/user/admin/all', { params }),
    adminToggleBlock: (id) => api.put(`/user/admin/${id}/block`),
};

// ── Support ──
export const supportAPI = {
    create: (data) => api.post('/support', data),
    getMy: () => api.get('/support/my'),
    adminGetAll: (params) => api.get('/support', { params }),
    adminUpdate: (id, data) => api.patch(`/support/${id}`, data),
};

// ── Promotions ──
export const promotionsAPI = {
    getAll: (params) => api.get('/promotions', { params }),
    getById: (id) => api.get(`/promotions/${id}`),
    create: (data) => api.post('/promotions', data),
    update: (id, data) => api.put(`/promotions/${id}`, data),
    delete: (id) => api.delete(`/promotions/${id}`),
    togglePause: (id) => api.put(`/promotions/${id}/toggle-pause`),
};

// ── BookLens ──
export const bookLensAPI = {
    getAll: (params) => api.get('/booklens', { params }),
    getById: (id) => api.get(`/booklens/${id}`),
    create: (formData) => api.post('/booklens', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, formData) => api.put(`/booklens/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id) => api.delete(`/booklens/${id}`),
    getPublicVideo: (id) => api.get(`/booklens/watch/${id}`),
};

// ── Settings ──
export const settingsAPI = {
    get: () => api.get('/settings'),
    update: (data) => api.put('/settings', data),
};

export default api;
