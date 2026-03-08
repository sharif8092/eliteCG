import wooCommerceService from './wooCommerceService';
import { Order, PaymentGateway, ShippingZone, ShippingMethod } from '../types';

const mapWooOrderToInternal = (wooOrder: any): Order => {
    return {
        id: wooOrder.id.toString(),
        userId: wooOrder.customer_id.toString(),
        items: wooOrder.line_items.map((item: any) => ({
            id: item.product_id.toString(),
            name: item.name,
            price: parseFloat(item.price),
            quantity: item.quantity
        })),
        total: parseFloat(wooOrder.total),
        status: mapWooStatusToInternal(wooOrder.status),
        createdAt: wooOrder.date_created,
        shippingAddress: `${wooOrder.shipping.first_name} ${wooOrder.shipping.last_name}, ${wooOrder.shipping.address_1}, ${wooOrder.shipping.city}`,
        paymentMethod: wooOrder.payment_method_title,
        billing: wooOrder.billing
    };
};

const mapWooStatusToInternal = (status: string): Order['status'] => {
    switch (status) {
        case 'pending': return 'pending';
        case 'processing': return 'processing';
        case 'on-hold': return 'pending';
        case 'completed': return 'delivered';
        case 'cancelled': return 'cancelled';
        case 'refunded': return 'cancelled';
        case 'failed': return 'cancelled';
        default: return 'pending';
    }
};

export const orderService = {
    /**
     * Get all orders for admin
     */
    async getAllOrders(): Promise<Order[]> {
        const response = await wooCommerceService.get('/orders');
        return (response.data as any[]).map(mapWooOrderToInternal);
    },

    /**
     * Get recent activity (last 5 orders)
     */
    async getRecentActivity(): Promise<Order[]> {
        const response = await wooCommerceService.get('/orders', {
            params: { per_page: 5 }
        });
        return (response.data as any[]).map(mapWooOrderToInternal);
    },

    /**
     * Update order status
     */
    async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
        let wooStatus = 'pending';
        if (status === 'delivered') wooStatus = 'completed';
        else if (status === 'cancelled') wooStatus = 'cancelled';
        else if (status === 'processing') wooStatus = 'processing';

        await wooCommerceService.put(`/orders/${orderId}`, {
            status: wooStatus
        });
    },

    /**
     * Create a new order
     */
    async createOrder(orderData: any): Promise<Order> {
        const response = await wooCommerceService.post('/orders', orderData);
        return mapWooOrderToInternal(response.data);
    },

    /**
     * Get enabled payment gateways
     */
    async getPaymentGateways(): Promise<PaymentGateway[]> {
        const response = await wooCommerceService.get('/payment_gateways');
        return (response.data as any[]).filter((g: any) => g.enabled).map((g: any) => ({
            id: g.id,
            title: g.title,
            description: g.description,
            enabled: g.enabled
        }));
    },

    /**
     * Get shipping zones
     */
    async getShippingZones(): Promise<ShippingZone[]> {
        const response = await wooCommerceService.get('/shipping/zones');
        return response.data as ShippingZone[];
    },

    /**
     * Get shipping methods for a zone
     */
    async getShippingMethods(zoneId: number): Promise<ShippingMethod[]> {
        const response = await wooCommerceService.get(`/shipping/zones/${zoneId}/methods`);
        return (response.data as any[]).map((m: any) => ({
            id: m.id,
            instance_id: m.instance_id,
            title: m.title,
            method_id: m.method_id,
            method_title: m.method_title,
            enabled: m.enabled,
            settings: m.settings
        }));
    }
};
