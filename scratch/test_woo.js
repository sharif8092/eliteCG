
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const { WC_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env;

async function testConnection() {
    console.log('Testing connection to:', WC_URL);
    try {
        const url = `${WC_URL}/wp-json/wc/v3/products`;
        console.log('Request URL:', url);
        const response = await axios.get(url, {
            params: {
                consumer_key: WC_CONSUMER_KEY,
                consumer_secret: WC_CONSUMER_SECRET,
                per_page: 1
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2).substring(0, 500));
    } catch (error) {
        console.error('Error Status:', error.response?.status);
        console.error('Error Data:', error.response?.data);
        console.error('Error Message:', error.message);
    }
}

testConnection();
