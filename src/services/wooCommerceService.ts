import axios from 'axios';

// @ts-ignore
const WC_URL = import.meta.env.VITE_WC_URL;
// @ts-ignore
const CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY;
// @ts-ignore
const CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET;

if (!WC_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    console.error('WooCommerce configuration is missing in environment variables.');
}

const wooCommerceService = axios.create({
    baseURL: `${WC_URL}/wp-json/wc/v3`,
    params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
    },
});

export const wpService = axios.create({
    baseURL: `${WC_URL}/wp-json/wp/v2`,
    params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
    },
});

export default wooCommerceService;
