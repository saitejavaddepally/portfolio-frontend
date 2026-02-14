import axios from 'axios';

// Dedicated Axios instance for public (unauthenticated) requests
// Uses the same relative path strategy to go through Vite proxy
const publicApi = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

export default publicApi;
