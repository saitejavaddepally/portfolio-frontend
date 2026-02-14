import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api, { setAccessToken as setInterceptorToken, setupInterceptors } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);

    // Initial load: Check for refresh token
    useEffect(() => {
        const initAuth = async () => {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    await refreshAccessToken();
                } catch (error) {
                    console.error("Session restore failed", error);
                    // No need to call logout() here necessarily, refreshAccessToken handles throw -> catch -> effect?
                    // Actually refreshAccessToken throws on failure, so we should clean up.
                    // But setupInterceptors hasn't run yet if we just define functions... 
                    // Wait, we need to ensure functions are defined before initAuth runs or inside it.
                    // They are defined below, which is fine in function scope due to hoisting or useCallback.
                    // However, interceptors should be set up ASAP.
                    logout(); // Clean slate
                }
            }
            setLoading(false);
        };

        // We need to set up interceptors BEFORE potential API calls in initAuth
        setupInterceptors(refreshAccessToken, logout);

        // Run init logic
        initAuth();
    }, []); // Empty dependency array means this runs once on mount

    const handleTokenUpdate = (newAccessToken, newRefreshToken, role) => {
        setAccessToken(newAccessToken);
        setInterceptorToken(newAccessToken); // Update Axios interceptor memory

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

    // Defined as a standalone async function we can pass around
    // Using useCallback to ensure stability if passed to deps, 
    // but here mainly just seeking a stable reference for setupInterceptors.
    // Since initAuth uses it, we'll define it normally or via useCallback.
    // Let's use a standard function but beware of closure staleness if it depended on state (it doesn't much).
    const refreshAccessToken = async () => {
        try {
            const currentRefreshToken = localStorage.getItem('refreshToken');
            if (!currentRefreshToken) throw new Error("No refresh token available");

            // Sending JSON body: { refreshToken: "..." }
            const response = await api.post('/auth/refresh', { refreshToken: currentRefreshToken });

            const { accessToken: newAccessToken, refreshToken: newRefreshToken, role } = response.data;

            handleTokenUpdate(newAccessToken, newRefreshToken, role);

            return { accessToken: newAccessToken };
        } catch (error) {
            console.error("Refresh token failed", error);
            throw error; // Propagate to interceptor to handle logout/queue rejection
        }
    };

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { accessToken, refreshToken, role } = response.data;
        handleTokenUpdate(accessToken, refreshToken, role);
        return response.data;
    };

    const register = async (email, password, role) => {
        const response = await api.post('/auth/register', { email, password, role });
        const { accessToken, refreshToken, role: returnedRole } = response.data;
        handleTokenUpdate(accessToken, refreshToken, returnedRole || role);
        return response.data;
    };

    const logout = () => {
        setAccessToken(null);
        setInterceptorToken(null);
        setUser(null);
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    };

    const value = {
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        refreshAccessToken // Exposed just in case, though mostly internal
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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
