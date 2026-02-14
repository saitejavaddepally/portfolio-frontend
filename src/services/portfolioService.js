import apiClient from './apiClient';
import publicApi from './publicApi';

export const getPortfolio = async () => {
    // Authenticated GET request to fetch user's portfolio
    const response = await apiClient.get('/portfolio');
    return response.data;
};

export const savePortfolio = async (data) => {
    // Authenticated POST request to save/update user's portfolio
    const response = await apiClient.post('/portfolio', data);
    return response.data;
};

// Authenticated: Publish current portfolio
// Authenticated: Publish current portfolio
export const publishPortfolio = async () => {
    // Send empty object as body to ensure Content-Type header is set if needed
    const response = await apiClient.post('/portfolio/publish', {});
    return response.data; // Expected: { message, publicUrl, slug }
};

// Unauthenticated: Fetch public portfolio by slug
export const getPublicPortfolio = async (slug) => {
    // User requested GET /public/{slug}
    const response = await publicApi.get(`/public/${slug}`);
    return response.data;
};

