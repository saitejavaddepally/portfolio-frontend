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
 * @param {Array<{id?: string, name?: string, email?: string, userId?: string, userEmail?: string}>} candidates - List of candidates
 * @returns {Promise<Object>} Comparison results from backend
 */
export const compareCandidates = async (jobDescription, candidates) => {
    const token = localStorage.getItem('accessToken');
    const payload = {
        jobDescription: jobDescription.trim(),
        candidates: candidates.map((candidate) => {
            const email = candidate.userEmail || candidate.email || '';
            const fallbackName = email
                ? email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
                : 'Candidate';

            return {
                id: candidate.id || candidate.userId || '',
                name: candidate.name || candidate.userName || fallbackName,
                email,
            };
        }),
    };

    const response = await apiClient.post(
        '/recruiter/candidates/compare',
        payload,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );
    return response.data;
};
