import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const WC_URL = process.env.WC_URL;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

async function checkProductMeta() {
    if (!WC_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
        console.error('Missing credentials');
        return;
    }

    try {
        const response = await axios.get(`${WC_URL}/wp-json/wc/v3/products`, {
            params: {
                consumer_key: CONSUMER_KEY,
                consumer_secret: CONSUMER_SECRET,
                per_page: 100
            }
        });

        console.log(`--- SCANNING ${response.data.length} PRODUCTS ---`);
        let found = false;
        response.data.forEach(p => {
            // Check for any meta data that might be relevant
            const discountMeta = p.meta_data.filter(m => 
                m.key.toLowerCase().includes('discount') || 
                m.key.toLowerCase().includes('bulk') || 
                m.key.toLowerCase().includes('price') ||
                m.key.toLowerCase().includes('tier')
            );
            
            if (discountMeta.length > 0) {
                found = true;
                console.log(`\nProduct: ${p.name} (ID: ${p.id})`);
                discountMeta.forEach(m => console.log(`  Key: ${m.key}, Value:`, JSON.stringify(m.value)));
            }
        });
        if (!found) console.log('No tiered/bulk pricing meta found in any product.');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkProductMeta();
