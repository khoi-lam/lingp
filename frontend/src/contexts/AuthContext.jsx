import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });
    const [loading, setLoading] = useState(false);

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';

    const login = async (email, password) => {
        setLoading(true);
        try {
            const { data } = await authAPI.login(email, password);
            if (data.success) {
                localStorage.setItem('accessToken', data.data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                setUser(data.data.user);
                return { success: true, user: data.data.user };
            }
            return { success: false, message: data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Lỗi kết nối' };
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password, name) => {
        setLoading(true);
        try {
            const { data } = await authAPI.register(email, password, name);
            if (data.success) {
                localStorage.setItem('accessToken', data.data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                setUser(data.data.user);
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Lỗi kết nối' };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try { await authAPI.logout(); } catch { }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
