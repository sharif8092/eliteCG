import axios from 'axios';

// Point to our Express backend proxy
// Use environment variable in production, fallback to relative /api for local dev/proxy
const BACKEND_URL = import.meta.env.VITE_API_URL || '/api';

const wooCommerceService = axios.create({
    baseURL: `${BACKEND_URL}/woo`,
});

export const wpService = axios.create({
    baseURL: `${BACKEND_URL}/wp`,
});


// Add interceptor for JWT token (if still needed for backend auth)
const addAuthInterceptor = (instance: any) => {
    instance.interceptors.request.use((config: any) => {
        const token = localStorage.getItem('wc_jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};

addAuthInterceptor(wooCommerceService);
addAuthInterceptor(wpService);

export default wooCommerceService;
