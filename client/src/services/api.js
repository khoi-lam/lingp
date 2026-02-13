import axios from 'axios';
import { API_URL } from '../config';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - attach access token
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const { data } = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // Save new access token
                localStorage.setItem('accessToken', data.data.accessToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed - silently clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');

                // Only redirect if not already on login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }

                // Don't log the error to console to avoid confusion
                return Promise.reject(new Error('Session expired'));
            }
        }

        return Promise.reject(error);
    }
);

export default api;
