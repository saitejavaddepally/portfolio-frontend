import apiClient from './apiClient';

/**
 * Search candidates using semantic vector search.
 * @param {string} query - Natural language search query
 * @returns {Promise<Array<{userEmail: string, score: number}>>}
 */
export const searchCandidates = async (query) => {
    const response = await apiClient.get('/recruiter/search', {
        params: { query: query.trim() },
    });
    return Array.isArray(response.data) ? response.data : [];
};
