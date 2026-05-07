const axios = require('axios');
require('dotenv').config();

const wcUrl = process.env.VITE_WC_URL;
const consumerKey = process.env.VITE_WC_CONSUMER_KEY;
const consumerSecret = process.env.VITE_WC_CONSUMER_SECRET;

const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

const requiredCategories = [
    'Abaya',
    'Kurta',
    'Itter',
    'Janamaz',
    'Tasbih',
    'Miswaq',
    'Cap',
    'Home Decor',
    'Prayer Essentials',
    'New Arrivals'
];

async function ensureCategories() {
    try {
        // 1. Get existing categories
        const response = await axios.get(`${wcUrl}/wp-json/wc/v3/products/categories`, {
            headers: { 'Authorization': `Basic ${auth}` },
            params: { per_page: 100 }
        });

        const existingNames = response.data.map(c => c.name.toLowerCase());

        // 2. Create missing ones
        for (const catName of requiredCategories) {
            if (!existingNames.includes(catName.toLowerCase())) {
                console.log(`Creating category: ${catName}`);
                await axios.post(`${wcUrl}/wp-json/wc/v3/products/categories`, {
                    name: catName
                }, {
                    headers: { 'Authorization': `Basic ${auth}` }
                });
            } else {
                console.log(`Category already exists: ${catName}`);
            }
        }
        console.log('Category check/creation complete!');
    } catch (error) {
        console.error('Error ensuring categories:', error.response ? error.response.data : error.message);
    }
}

ensureCategories();
