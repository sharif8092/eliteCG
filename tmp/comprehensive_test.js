import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const WC_URL = process.env.VITE_WC_URL;
const CONSUMER_KEY = process.env.VITE_WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.VITE_WC_CONSUMER_SECRET;

const api = axios.create({
    baseURL: `${WC_URL}/wp-json/wc/v3`,
    params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
    },
    timeout: 10000
});

async function runTests() {
    console.log('--- WooCommerce Backend Test ---');

    // Test 1: Products
    try {
        const productsRes = await api.get('/products');
        console.log(`[PASS] Products: Found ${productsRes.data.length} products.`);
        if (productsRes.data.length > 0) {
            console.log(`      Sample: ${productsRes.data[0].name} (ID: ${productsRes.data[0].id})`);
        }
    } catch (err) {
        console.log('[FAIL] Products:', err.message);
    }

    // Test 2: Categories
    try {
        const categoriesRes = await api.get('/products/categories');
        console.log(`[PASS] Categories: Found ${categoriesRes.data.length} categories.`);
        if (categoriesRes.data.length > 0) {
            console.log(`      Sample: ${categoriesRes.data[0].name} (Slug: ${categoriesRes.data[0].slug})`);
        }
    } catch (err) {
        console.log('[FAIL] Categories:', err.message);
    }

    // Test 3: Orders
    try {
        const ordersRes = await api.get('/orders');
        console.log(`[PASS] Orders: Found ${ordersRes.data.length} orders.`);
    } catch (err) {
        console.log('[FAIL] Orders:', err.message);
    }

    console.log('--------------------------------');
}

runTests();
