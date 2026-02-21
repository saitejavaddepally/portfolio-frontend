// Platform metadata for Coding Profiles section
// Icons are served via Google's public Favicon API

const GOOGLE_FAVICON = (domain, size = 64) =>
    `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;

export const PLATFORMS = [
    { name: 'LeetCode', domain: 'leetcode.com', color: '#FFA116' },
    { name: 'GitHub', domain: 'github.com', color: '#24292e' },
    { name: 'Codeforces', domain: 'codeforces.com', color: '#1F8ACB' },
    { name: 'HackerRank', domain: 'hackerrank.com', color: '#00EA64' },
    { name: 'GeeksForGeeks', domain: 'geeksforgeeks.org', color: '#2F8D46' },
    { name: 'CodeChef', domain: 'codechef.com', color: '#5B4638' },
    { name: 'HackerEarth', domain: 'hackerearth.com', color: '#2C3E8C' },
    { name: 'AtCoder', domain: 'atcoder.jp', color: '#222222' },
    { name: 'TUF+', domain: 'takeuforward.org', color: '#e84118' },
];

/**
 * Returns the platform metadata for a given platform name.
 * Falls back to a generic link icon if not found.
 */
export const getPlatformMeta = (name) =>
    PLATFORMS.find(p => p.name === name) || { name, domain: 'google.com', color: '#555' };

/**
 * Returns the Google Favicon API URL for a platform domain.
 * @param {string} domain - e.g. 'leetcode.com'
 * @param {number} size   - icon size in px (default 64)
 */
export const getPlatformIconUrl = (domain, size = 64) =>
    GOOGLE_FAVICON(domain, size);
