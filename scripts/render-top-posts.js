import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '..', 'dist');
const SSR_CACHE_DIR = path.join(DIST_DIR, 'ssr-cache');

const WP_URL = process.env.WC_URL; // Re-using WC_URL for base WP
const wpClient = axios.create({ baseURL: `${WP_URL}/wp-json/wp/v2` });

async function preRenderTopPosts() {
    console.log('🚀 Starting Pre-rendering of top 10 blog posts...');

    if (!fs.existsSync(SSR_CACHE_DIR)) {
        fs.mkdirSync(SSR_CACHE_DIR, { recursive: true });
    }

    try {
        const response = await wpClient.get('/posts', { params: { per_page: 10, _embed: true } });
        const posts = response.data;

        for (const post of posts) {
            const fileName = `post_${post.slug}.json`;
            const filePath = path.join(SSR_CACHE_DIR, fileName);
            
            // We save the raw data so server.js can use it for SSR injection
            // This counts as pre-warming the cache
            fs.writeFileSync(filePath, JSON.stringify({
                data: { post, related: posts.filter(p => p.id !== post.id).slice(0, 3) },
                timestamp: Date.now()
            }));
            
            console.log(`✅ Pre-rendered: ${post.slug}`);
        }

        // Also pre-render list
        fs.writeFileSync(path.join(SSR_CACHE_DIR, 'blog_list.json'), JSON.stringify({
            data: posts,
            timestamp: Date.now()
        }));
        console.log('✅ Pre-rendered: Blog List');

    } catch (error) {
        console.error('❌ Pre-rendering failed:', error.message);
    }
}

preRenderTopPosts();
