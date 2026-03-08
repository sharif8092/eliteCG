import wooCommerceService from './wooCommerceService';
import { Product } from '../types';

const mapWooProductToInternal = (wooProduct: any): Product => {
    return {
        id: wooProduct.id.toString(),
        name: wooProduct.name,
        description: wooProduct.description,
        price: parseFloat(wooProduct.price),
        originalPrice: wooProduct.regular_price ? parseFloat(wooProduct.regular_price) : undefined,
        categories: (wooProduct.categories && wooProduct.categories.length > 0)
            ? wooProduct.categories.map((c: any) => c.name)
            : ['Collection'],
        images: wooProduct.images.map((img: any) => img.src),
        imageAlts: wooProduct.images.map((img: any) => img.alt || wooProduct.name),
        stock: wooProduct.stock_quantity || 0,
        featured: wooProduct.featured,
        rating: parseFloat(wooProduct.average_rating) || 0,
        reviewCount: wooProduct.review_count || 0,
    };
};

export const productService = {
    // Get all products
    async getAllProducts(): Promise<Product[]> {
        const response = await wooCommerceService.get('/products', {
            params: {
                orderby: 'date',
                order: 'desc',
                per_page: 100 // Fetch a good chunk
            }
        });
        return (response.data as any[]).map(mapWooProductToInternal);
    },

    // Get featured products
    async getFeaturedProducts(limitCount: number = 4): Promise<Product[]> {
        const response = await wooCommerceService.get('/products', {
            params: {
                featured: true,
                per_page: limitCount
            }
        });
        return (response.data as any[]).map(mapWooProductToInternal);
    },

    // Get products by category
    async getProductsByCategory(category: string): Promise<Product[]> {
        // First, we might need to find the category ID if we only have the name
        // For simplicity, let's assume we can fetch all and filter, or use search
        // A better way would be to fetch by category ID.
        const response = await wooCommerceService.get('/products', {
            params: {
                category: category // WooCommerce supports category ID or slug, but let's check if name works or if we need to fetch categories first.
            }
        });
        return (response.data as any[]).map(mapWooProductToInternal);
    },

    // Get single product
    async getProductById(id: string): Promise<Product | null> {
        try {
            const response = await wooCommerceService.get(`/products/${id}`);
            return mapWooProductToInternal(response.data);
        } catch (error) {
            console.error(`Error fetching product with id ${id}:`, error);
            return null;
        }
    },

    // Add new product (Admin)
    async addProduct(product: Omit<Product, 'id'>): Promise<string> {
        const response = await wooCommerceService.post('/products', {
            name: product.name,
            type: 'simple',
            regular_price: product.price.toString(),
            description: product.description,
            categories: product.categories.map(catName => ({ name: catName })),
            images: product.images.map(url => ({ src: url })),
            featured: product.featured,
            stock_quantity: product.stock,
            manage_stock: true
        });
        return (response.data as any).id.toString();
    },

    // Update product (Admin)
    async updateProduct(id: string, product: Partial<Product>): Promise<void> {
        const updateData: any = {};
        if (product.name) updateData.name = product.name;
        if (product.price !== undefined) updateData.regular_price = product.price.toString();
        if (product.description) updateData.description = product.description;
        if (product.featured !== undefined) updateData.featured = product.featured;
        if (product.categories) updateData.categories = product.categories.map(catName => ({ name: catName }));
        if (product.images) updateData.images = product.images.map(url => ({ src: url }));
        if (product.stock !== undefined) {
            updateData.stock_quantity = product.stock;
            updateData.manage_stock = true;
        }

        await wooCommerceService.put(`/products/${id}`, updateData);
    },

    // Delete product (Admin)
    async deleteProduct(id: string): Promise<void> {
        await wooCommerceService.delete(`/products/${id}`, {
            params: { force: true }
        });
    }
};
