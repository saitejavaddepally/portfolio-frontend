import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Dedicated Axios instance for public (unauthenticated) requests
const publicApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default publicApi;
