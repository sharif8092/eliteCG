import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

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
    console.log('--- Testing WooCommerce Checkout APIs ---');
    try {
        console.log('1. Fetching Payment Gateways...');
        const pg = await woo.get('/payment_gateways');
        console.log(`Found ${pg.data.length} gateways.`);
        pg.data.forEach(g => {
            console.log(` - [${g.id}] ${g.title} (Enabled: ${g.enabled})`);
        });

        console.log('\n2. Fetching Shipping Zones...');
        const sz = await woo.get('/shipping/zones');
        console.log(`Found ${sz.data.length} zones.`);

        for (const zone of sz.data) {
            console.log(` Zone: ${zone.name} (ID: ${zone.id})`);
            const methods = await woo.get(`/shipping/zones/${zone.id}/methods`);
            console.log(`  Methods (${methods.data.length}):`);
            methods.data.forEach(m => {
                console.log(`   - [${m.method_id}] ${m.method_title} (Enabled: ${m.enabled})`);
            });
        }

        // Check zone 0 (Locations not covered by other zones)
        console.log('\n3. Checking Zone 0 (Rest of World)...');
        const zone0Methods = await woo.get('/shipping/zones/0/methods');
        console.log(` Found ${zone0Methods.data.length} methods.`);
        zone0Methods.data.forEach(m => {
            console.log(`  - [${m.method_id}] ${m.method_title} (Enabled: ${m.enabled})`);
        });

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

debug();
