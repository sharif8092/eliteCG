const axios = require('axios');
require('dotenv').config();

const WC_URL = process.env.VITE_WC_URL;
const CONSUMER_KEY = process.env.VITE_WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.VITE_WC_CONSUMER_SECRET;

const woo = axios.create({
    baseURL: `${WC_URL}/wp-json/wc/v3`,
    params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
    },
});

async function debug() {
    console.log('--- WOOCOMMERCE DEBUG START ---');
    console.log('URL:', WC_URL);

    try {
        console.log('\n[1] Payment Gateways:');
        const pg = await woo.get('/payment_gateways');
        console.log(`- Count: ${pg.data.length}`);
        pg.data.forEach(g => {
            console.log(`  - ID: ${g.id}, Title: ${g.title}, Enabled: ${g.enabled}`);
        });

        console.log('\n[2] Shipping Zones:');
        const zones = await woo.get('/shipping/zones');
        console.log(`- Count: ${zones.data.length}`);

        // Always check Zone 0 (Default)
        console.log('\n[3] Shipping Methods (Zone 0 - Default):');
        const z0 = await woo.get('/shipping/zones/0/methods');
        console.log(`- Count: ${z0.data.length}`);
        z0.data.forEach(m => {
            console.log(`  - ID: ${m.method_id}, Title: ${m.method_title}, Enabled: ${m.enabled}, Cost: ${m.settings.cost?.value || '0'}`);
        });

        if (zones.data.length > 0) {
            for (const zone of zones.data) {
                console.log(`\n[4] Shipping Methods (Zone: ${zone.name}, ID: ${zone.id}):`);
                const methods = await woo.get(`/shipping/zones/${zone.id}/methods`);
                console.log(`- Count: ${methods.data.length}`);
                methods.data.forEach(m => {
                    console.log(`  - ID: ${m.method_id}, Title: ${m.method_title}, Enabled: ${m.enabled}`);
                });
            }
        }
    } catch (err) {
        console.error('ERROR FETCHING DATA:', err.message);
        if (err.response) console.error('API Error:', err.response.data);
    }
    console.log('\n--- DEBUG END ---');
}

debug();
