import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../services/apiClient';
import Loader from '../components/Loader';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);

    const handleTokenUpdate = (newAccessToken, newRefreshToken, role) => {
        setAccessToken(newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);

        if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Decode user from token OR use the role returned from backend if available
        try {
            const decoded = jwtDecode(newAccessToken);
            const userRole = role || decoded.role || decoded.authorities?.[0] || 'USER';

            setUser({
                email: decoded.sub,
                role: userRole
            });
        } catch (e) {
            console.error("Failed to decode token", e);
            if (role) {
                setUser({
                    email: "User",
                    role: role
                });
            }
        }
    };

    const logout = () => {
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    };

    // Initial load: Check for tokens
    useEffect(() => {
        const initAuth = async () => {
            const storedAccessToken = localStorage.getItem('accessToken');
            const storedRefreshToken = localStorage.getItem('refreshToken');

            if (storedAccessToken) {
                try {
                    // Start with existing token
                    handleTokenUpdate(storedAccessToken, null, null);
                } catch (e) {
                    console.error("Invalid stored access token", e);
                    // If access token invalid, try refresh logic below
                    localStorage.removeItem('accessToken');
                }
            }

            // If no access token (or invalid) but we have refresh token, try to refresh
            if (!localStorage.getItem('accessToken') && storedRefreshToken) {
                try {
                    const response = await apiClient.post('/auth/refresh', { refreshToken: storedRefreshToken });
                    const { accessToken: newAccess, refreshToken: newRefresh, role } = response.data;
                    handleTokenUpdate(newAccess, newRefresh, role);
                } catch (error) {
                    console.error("Session restore failed", error);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        const { accessToken, refreshToken, role } = response.data;
        handleTokenUpdate(accessToken, refreshToken, role);
        return response.data;
    };

    const register = async (email, password, role) => {
        // Step 1: Register and send OTP
        const response = await apiClient.post('/auth/register', { email, password, role });
        return response.data;
    };

    const verifyOtp = async (email, otp) => {
        // Step 2: Verify OTP and get tokens
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
    }), [user, accessToken, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}><Loader fullScreen={true} size="large" /></div>}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
