import wooCommerceService from './wooCommerceService';
import { Offer } from '../types';

const mapWooCouponToInternal = (coupon: any): Offer => {
    const meta = (key: string) => coupon.meta_data?.find((m: any) => m.key === key)?.value;

    return {
        id: coupon.id.toString(),
        title: coupon.code,
        description: coupon.description || '',
        status: coupon.date_expires && new Date(coupon.date_expires) < new Date() ? 'expired' : 'active',
        clicks: parseInt(meta('clicks') || '0'),
        expiry: coupon.date_expires ? coupon.date_expires.split('T')[0] : '',
        image: meta('image') || '',
        link: meta('link') || '',
        type: (meta('type') as any) || 'deal'
    };
};

export const offerService = {
    // Get all offers (Coupons)
    async getAllOffers(): Promise<Offer[]> {
        const response = await wooCommerceService.get('/coupons');
        if (!Array.isArray(response.data)) {
            console.error('Invalid coupons response format:', response.data);
            return [];
        }
        return response.data.map(mapWooCouponToInternal);
    },

    // Get active offers
    async getActiveOffers(): Promise<Offer[]> {
        const offers = await this.getAllOffers();
        return offers.filter(o => o.status === 'active');
    },

    // Add new offer
    async addOffer(offer: Omit<Offer, 'id'>): Promise<string> {
        const response = await wooCommerceService.post('/coupons', {
            code: offer.title,
            description: offer.description,
            date_expires: offer.expiry ? `${offer.expiry}T23:59:59` : null,
            meta_data: [
                { key: 'image', value: offer.image },
                { key: 'type', value: offer.type },
                { key: 'link', value: offer.link || '' },
                { key: 'clicks', value: '0' }
            ]
        });
        return (response.data as any).id.toString();
    },

    // Update offer
    async updateOffer(id: string, offer: Partial<Offer>): Promise<void> {
        const metaData = [];
        if (offer.image) metaData.push({ key: 'image', value: offer.image });
        if (offer.type) metaData.push({ key: 'type', value: offer.type });
        if (offer.link !== undefined) metaData.push({ key: 'link', value: offer.link });
        if (offer.clicks !== undefined) metaData.push({ key: 'clicks', value: offer.clicks.toString() });

        await wooCommerceService.put(`/coupons/${id}`, {
            code: offer.title,
            description: offer.description,
            date_expires: offer.expiry ? `${offer.expiry}T23:59:59` : null,
            meta_data: metaData
        });
    },

    // Delete offer
    async deleteOffer(id: string): Promise<void> {
        await wooCommerceService.delete(`/coupons/${id}`, {
            params: { force: true }
        });
    },

    // Track click
    async trackClick(id: string): Promise<void> {
        const response = await wooCommerceService.get(`/coupons/${id}`);
        const data = response.data as any;
        const currentClicks = parseInt(data.meta_data?.find((m: any) => m.key === 'clicks')?.value || '0');

        await wooCommerceService.put(`/coupons/${id}`, {
            meta_data: [
                { key: 'clicks', value: (currentClicks + 1).toString() }
            ]
        });
    }
};
