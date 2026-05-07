import { wpService } from './wooCommerceService';
import { BlogPost } from '../types';

const mapWPPostToInternal = (post: any): BlogPost => {
    return {
        id: post.id.toString(),
        slug: post.slug,
        title: post.title.rendered,
        content: post.content.rendered,
        author: post._embedded?.author?.[0]?.name || 'Admin',
        date: post.date.split('T')[0],
        status: post.status === 'publish' ? 'Published' : 'Draft',
        comments: 0,
        image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        imageAlt: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
        excerpt: post.excerpt?.rendered || '',
        category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Lifestyle'
    };
};

export const blogService = {
    // Get all blog posts
    async getAllPosts(): Promise<BlogPost[]> {
        const response = await wpService.get('/posts', {
            params: { _embed: true }
        });
        return (response.data as any[]).map(mapWPPostToInternal);
    },

    // Get recent blog posts
    async getRecentPosts(limitCount: number = 3): Promise<BlogPost[]> {
        const response = await wpService.get('/posts', {
            params: { _embed: true, per_page: limitCount }
        });
        return (response.data as any[]).map(mapWPPostToInternal);
    },

    // Get single blog post by ID
    async getPostById(id: string): Promise<BlogPost | null> {
        try {
            const response = await wpService.get(`/posts/${id}`, {
                params: { _embed: true }
            });
            return mapWPPostToInternal(response.data);
        } catch (error) {
            console.error('Error fetching post by ID:', error);
            return null;
        }
    },

    // Get single blog post by Slug
    async getPostBySlug(slug: string): Promise<BlogPost | null> {
        try {
            const response = await wpService.get('/posts', {
                params: { _embed: true, slug }
            });
            const posts = response.data as any[];
            if (posts.length > 0) {
                return mapWPPostToInternal(posts[0]);
            }
            return null;
        } catch (error) {
            console.error('Error fetching post by slug:', error);
            return null;
        }
    },

    // Add new blog post
    async addPost(post: Omit<BlogPost, 'id'>): Promise<string> {
        const response = await wpService.post('/posts', {
            title: post.title,
            content: post.content,
            status: post.status === 'Published' ? 'publish' : 'draft',
            featured_media: post.image ? await this.getMediaIdByUrl(post.image) : undefined
        });
        return (response.data as any).id.toString();
    },

    // Update blog post
    async updatePost(id: string, post: Partial<BlogPost>): Promise<void> {
        await wpService.put(`/posts/${id}`, {
            title: post.title,
            content: post.content,
            status: post.status === 'Published' ? 'publish' : 'draft',
            featured_media: post.image ? await this.getMediaIdByUrl(post.image) : undefined
        });
    },

    // Delete blog post
    async deletePost(id: string): Promise<void> {
        await wpService.delete(`/posts/${id}`, {
            params: { force: true } // Bypass trash
        });
    },

    // Helper to find media ID by URL (limited)
    async getMediaIdByUrl(url: string): Promise<number | undefined> {
        // In a real WP setup, we'd search media by URL or slug
        // For now, return undefined to avoid errors if not found
        return undefined;
    }
};
