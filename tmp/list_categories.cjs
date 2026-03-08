const axios = require('axios');
require('dotenv').config();

const wcUrl = process.env.VITE_WC_URL;
const consumerKey = process.env.VITE_WC_CONSUMER_KEY;
const consumerSecret = process.env.VITE_WC_CONSUMER_SECRET;

const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

async function listCategories() {
    try {
        const response = await axios.get(`${wcUrl}/wp-json/wc/v3/products/categories`, {
            headers: {
                'Authorization': `Basic ${auth}`
            },
            params: {
                per_page: 100
            }
        });

        console.log('Categories found in WooCommerce:');
        response.data.forEach(cat => {
            console.log(`- ID: ${cat.id}, Name: "${cat.name}", Slug: "${cat.slug}", Count: ${cat.count}`);
        });
    } catch (error) {
        console.error('Error fetching categories:', error.response ? error.response.data : error.message);
    }
}

listCategories();
