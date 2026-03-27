import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import Loader from '../components/Loader';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);
    const navigate = useNavigate();

    const handleTokenUpdate = useCallback((newAccessToken, newRefreshToken, role) => {
        setAccessToken(newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);

        if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
        }

        try {
            const decoded = jwtDecode(newAccessToken);
            const userRole = role || decoded.role || decoded.authorities?.[0] || 'USER';
            setUser({
                email: decoded.sub,
                role: userRole
            });
        } catch (e) {
            console.error('Failed to decode token', e);
            if (role) {
                setUser({ email: 'User', role });
            }
        }
    }, []);

    const logout = useCallback(() => {
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login', { replace: true });
    }, [navigate]);

    // Listen for session expiry events dispatched by apiClient interceptor
    useEffect(() => {
        const handleSessionExpired = () => {
            console.warn('[AuthContext] Session expired — logging out.');
            setAccessToken(null);
            setUser(null);
            // Tokens already cleared by apiClient before dispatching
            navigate('/login', { replace: true });
        };

        window.addEventListener('auth:session-expired', handleSessionExpired);
        return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
    }, [navigate]);

    // Initial load: restore auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            const storedAccessToken = localStorage.getItem('accessToken');
            const storedRefreshToken = localStorage.getItem('refreshToken');

            if (storedAccessToken) {
                try {
                    // Check if token is still valid (not expired)
                    const decoded = jwtDecode(storedAccessToken);
                    const now = Date.now() / 1000;
                    if (decoded.exp && decoded.exp > now) {
                        handleTokenUpdate(storedAccessToken, null, null);
                    } else {
                        // Token expired — try refresh
                        localStorage.removeItem('accessToken');
                        throw new Error('Token expired');
                    }
                } catch (e) {
                    // Access token invalid/expired — try refresh token
                    if (storedRefreshToken) {
                        try {
                            const response = await apiClient.post('/auth/refresh', { refreshToken: storedRefreshToken });
                            const { accessToken: newAccess, refreshToken: newRefresh, role } = response.data;
                            handleTokenUpdate(newAccess, newRefresh, role);
                        } catch (refreshError) {
                            console.error('Session restore failed', refreshError);
                            localStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken');
                            setUser(null);
                        }
                    } else {
                        localStorage.removeItem('accessToken');
                        setUser(null);
                    }
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const login = async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        const { accessToken, refreshToken, role } = response.data;
        handleTokenUpdate(accessToken, refreshToken, role);
        return response.data;
    };

    const register = async (email, password, role) => {
        const response = await apiClient.post('/auth/register', { email, password, role });
        return response.data;
    };

    const verifyOtp = async (email, otp) => {
        const response = await apiClient.post('/auth/register/verify-otp', { email, otp });
        const { accessToken, refreshToken, role } = response.data;
        handleTokenUpdate(accessToken, refreshToken, role);
        return response.data;
    };

    const value = React.useMemo(() => ({
        user,
        accessToken,
        loading,
        login,
        register,
        verifyOtp,
        logout
    }), [user, accessToken, loading, logout]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : <Loader fullScreen={true} size="large" />}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
