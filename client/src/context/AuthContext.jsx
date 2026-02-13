import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            if (authService.isAuthenticated()) {
                try {
                    const response = await userService.getProfile();
                    if (response.success) {
                        setUser(response.data.user);
                    }
                } catch (error) {
                    console.error('Failed to load user:', error);
                    localStorage.removeItem('accessToken');
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const register = async (email, password, name) => {
        const response = await authService.register(email, password, name);
        if (response.success) {
            setUser(response.data.user);
        }
        return response;
    };

    const login = async (email, password) => {
        const response = await authService.login(email, password);
        if (response.success) {
            setUser(response.data.user);
        }
        return response;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
