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

/**
 * Compare selected candidates against a job description.
 * @param {string} jobDescription - Job description text
 * @param {Array<{email: string}>} candidates - List of candidates with email
 * @returns {Promise<Object>} Comparison results from backend
 */
export const compareCandidates = async (jobDescription, candidates) => {
    const token = localStorage.getItem('accessToken');
    const payload = {
        jobDescription: jobDescription.trim(),
        candidates: candidates.map(c => ({ email: c.userEmail || c.email })),
    };

    const response = await apiClient.post(
        '/recruiter/candidates/compare',
        payload,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );
    return response.data;
};
