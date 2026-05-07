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
<<<<<<< HEAD
    // Get all latest reviews
    async getLatestReviews(limit: number = 3): Promise<Review[]> {
        const response = await wooCommerceService.get('/products/reviews', {
            params: {
                per_page: limit,
                status: 'approved',
                orderby: 'date',
                order: 'desc'
=======
    // Get reviews for a product
    async getReviewsByProductId(productId: string): Promise<Review[]> {
        const response = await wooCommerceService.get('/products/reviews', {
            params: {
                product: productId,
                per_page: 50
>>>>>>> 963c70e67cdae6ca863ee837257e235eeccbd2d1
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
