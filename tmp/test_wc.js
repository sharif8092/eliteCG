const axios = require('axios');

const WC_URL = "https://backend.corporategifting.store";
const CONSUMER_KEY = "ck_f36f4af88b0289270752838d9df26e595c2ac903";
const CONSUMER_SECRET = "cs_5e01b47bf3952311140cf62273fb2581fb7dba63";

async function testConnection() {
    console.log('--- WooCommerce Diagnostic ---');
    console.log(`URL: ${WC_URL}`);
    
    try {
        const response = await axios.get(`${WC_URL}/wp-json/wc/v3/products`, {
            params: {
                consumer_key: CONSUMER_KEY,
                consumer_secret: CONSUMER_SECRET,
                per_page: 5
            }
        });
        
        console.log('\n✅ Connection Successful!');
        console.log(`Status Code: ${response.status}`);
        console.log(`Products Found: ${response.data.length}`);
        
        if (response.data.length > 0) {
            console.log('\nFirst Product Details:');
            const p = response.data[0];
            console.log(`- ID: ${p.id}`);
            console.log(`- Name: ${p.name}`);
            console.log(`- Status: ${p.status}`);
            console.log(`- Categories: ${p.categories.map(c => c.name).join(', ')}`);
            console.log(`- Price: ${p.price}`);
        } else {
            console.log('\n⚠️ No products found in the store.');
        }
    } catch (error) {
        console.error('\n❌ Connection Failed!');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

testConnection();
