import wooCommerceService from './wooCommerceService';
import { Review } from '../types';

const mapWooReviewToInternal = (wooReview: any): Review => {
    return {
        id: wooReview.id.toString(),
        productId: wooReview.product_id.toString(),
        reviewer: wooReview.reviewer,
        reviewerEmail: wooReview.reviewer_email,
        review: wooReview.review.replace(/<[^>]*>?/gm, ''), // Stripping HTML
        rating: wooReview.rating,
        dateCreated: wooReview.date_created,
        verified: wooReview.verified
    };
};

export const reviewService = {
    // Get reviews for a product
    async getReviewsByProductId(productId: string): Promise<Review[]> {
        const response = await wooCommerceService.get('/products/reviews', {
            params: {
                product: productId,
                per_page: 50
            }
        });
        return (response.data as any[]).map(mapWooReviewToInternal);
    },

    // Submit a review
    async submitReview(productId: string, data: { reviewer: string, reviewer_email: string, review: string, rating: number }): Promise<Review> {
        const response = await wooCommerceService.post('/products/reviews', {
            product_id: parseInt(productId),
            ...data
        });
        return mapWooReviewToInternal(response.data);
    }
};
