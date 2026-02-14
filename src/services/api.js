import axios from 'axios';

const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper variables to manage token and refresh logic from AuthContext
let currentAccessToken = null;
let refreshAccessTokenFn = null;
let logoutUserFn = null;
let isRefreshing = false;
let failedQueue = [];

// Allow AuthContext to set the token
export const setAccessToken = (token) => {
    currentAccessToken = token;
};

// Allow AuthContext to set the refresh and logout functions
export const setupInterceptors = (refreshFn, logoutFn) => {
    refreshAccessTokenFn = refreshFn;
    logoutUserFn = logoutFn;
};

// Helper to queue failed requests
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
    (config) => {
        if (currentAccessToken) {
            config.headers['Authorization'] = `Bearer ${currentAccessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip interceptor loop for login/register requests
        if (originalRequest.url.includes('/login') || originalRequest.url.includes('/register')) {
            return Promise.reject(error);
        }

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {

            // If we are already refreshing, queue this request
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call the injected refresh function from AuthContext
                if (!refreshAccessTokenFn) {
                    throw new Error("Refresh function not initialized");
                }

                const { accessToken } = await refreshAccessTokenFn();

                // Update local token immediately for this retry
                setAccessToken(accessToken);
                api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;

                // Process any queued requests
                processQueue(null, accessToken);

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                // Logout user if refresh fails
                if (logoutUserFn) logoutUserFn();

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
