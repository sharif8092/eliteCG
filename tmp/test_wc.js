import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const WC_URL = process.env.VITE_WC_URL;
const CONSUMER_KEY = process.env.VITE_WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.VITE_WC_CONSUMER_SECRET;

console.log('Testing WooCommerce Connection...');
console.log('URL:', WC_URL);
console.log('Key:', CONSUMER_KEY ? 'Present' : 'Missing');
console.log('Secret:', CONSUMER_SECRET ? 'Present' : 'Missing');

const testApi = async () => {
    try {
        const response = await axios.get(`${WC_URL}/wp-json/wc/v3/products`, {
            params: {
                consumer_key: CONSUMER_KEY,
                consumer_secret: CONSUMER_SECRET,
            },
            timeout: 10000
        });
        console.log('Success! Found', response.data.length, 'products.');
        if (response.data.length > 0) {
            console.log('First product name:', response.data[0].name);
        }
    } catch (error) {
        console.error('API Error:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Message:', error.message);
        }
    }
};

testApi();
