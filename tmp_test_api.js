import axios from 'axios';

async function testProducts() {
    console.log('--- Testing /api/woo/products ---');
    try {
        const response = await axios.get('http://localhost:8081/api/woo/products?per_page=1');
        console.log('Status:', response.status);
        console.log('Data Type:', typeof response.data);
        console.log('Is Array:', Array.isArray(response.data));
        if (Array.isArray(response.data)) {
            console.log('Count:', response.data.length);
            if (response.data.length > 0) {
                console.log('First Product ID:', response.data[0].id);
                console.log('First Product Name:', response.data[0].name);
            }
        } else {
            console.log('Raw Data:', JSON.stringify(response.data).substring(0, 200));
        }
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

async function testCart() {
    console.log('\n--- Testing /api/cart ---');
    try {
        const response = await axios.get('http://localhost:8081/api/cart', {
            headers: { 'x-cart-id': 'test-agent-cart' }
        });
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function runTests() {
    await testProducts();
    await testCart();
}

runTests();
