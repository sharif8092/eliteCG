import wooCommerceService from './wooCommerceService';

export interface Category {
    id: number;
    name: string;
    slug: string;
    parent: number;
    description: string;
}

export const categoryService = {
    async getAllCategories(): Promise<Category[]> {
        const response = await wooCommerceService.get('/products/categories', {
            params: {
                per_page: 100
            }
        });
        return response.data as Category[];
    },

    async addCategory(category: Omit<Category, 'id' | 'slug'>): Promise<Category> {
        const response = await wooCommerceService.post('/products/categories', category);
        return response.data as Category;
    },

    async updateCategory(id: number, category: Partial<Category>): Promise<Category> {
        const response = await wooCommerceService.put(`/products/categories/${id}`, category);
        return response.data as Category;
    },

    async deleteCategory(id: number): Promise<void> {
        await wooCommerceService.delete(`/products/categories/${id}`, {
            params: { force: true }
        });
    }
};
