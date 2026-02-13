import api from './api';

export const userService = {
    // Get user profile
    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    },

    // Update user profile
    updateProfile: async (name, addresses) => {
        const response = await api.put('/user/profile', { name, addresses });
        return response.data;
    },

    // Change password
    changePassword: async (currentPassword, newPassword) => {
        const response = await api.put('/user/password', {
            currentPassword,
            newPassword
        });
        return response.data;
    }
};
