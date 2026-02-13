import api from './api';

export const authService = {
    // Register new user
    register: async (email, password, name) => {
        const response = await api.post('/auth/register', { email, password, name });
        if (response.data.success) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
        }
        return response.data;
    },

    // Login user
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
        }
        return response.data;
    },

    // Logout user
    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('accessToken');
        }
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    }
};
