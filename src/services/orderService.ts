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
    },

    /**
     * Get or create a WooCommerce customer by email
     */
    async getOrCreateCustomer(data: { email: string; first_name?: string; last_name?: string; phone?: string }): Promise<number> {
        try {
            // 1. Try to find existing customer by email
            const searchResponse = await wooCommerceService.get('/customers', {
                params: { email: data.email }
            });

            if (searchResponse.data && (searchResponse.data as any[]).length > 0) {
                return (searchResponse.data as any[])[0].id;
            }

            // 2. Create new customer if not found
            try {
                const createResponse = await wooCommerceService.post('/customers', {
                    email: data.email,
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    billing: {
                        email: data.email,
                        phone: data.phone || ''
                    }
                });
                return (createResponse.data as any).id;
            } catch (createErr: any) {
                // Handle case where email exists but search failed (e.g., timing or WC search behavior)
                const errorData = createErr.response?.data;
                if (errorData?.code === 'registration-error-email-exists') {
                    console.log('Customer already exists in WC. Fetching again...');
                    const secondSearch = await wooCommerceService.get('/customers', {
                        params: { email: data.email, per_page: 1 }
                    });
                    if (secondSearch.data && (secondSearch.data as any[]).length > 0) {
                        return (secondSearch.data as any[])[0].id;
                    }
                }
                throw createErr;
            }
        } catch (err: any) {
            console.error('Error in getOrCreateCustomer details:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
            return 0; // Fallback to guest
        }
    },

    /**
     * Request an action for an order (Cancel or Return)
     */
    async requestOrderAction(orderId: string, action: 'cancel' | 'return'): Promise<void> {
        const newStatus = action === 'cancel' ? 'cancelled' : 'on-hold'; // 'on-hold' can signify return request
        await wooCommerceService.put(`/orders/${orderId}`, {
            status: newStatus,
            customer_note: action === 'return' ? 'User requested a return.' : 'User cancelled the order.'
        });
    },

    /**
     * Get orders for a specific user by email or customer ID
     */
    async getUserOrders(email: string, customerId?: number): Promise<Order[]> {
        let actualCustomerId = customerId;

        // If we don't have a customer ID, try to get it first
        if (!actualCustomerId || actualCustomerId <= 0) {
            actualCustomerId = await this.getOrCreateCustomer({ email });
        }

        // If we still don't have an ID (fallback failed), we return empty to avoid showing all store orders
        if (!actualCustomerId || actualCustomerId <= 0) {
            console.warn(`Could not determine customer ID for ${email}. Returning empty order list.`);
            return [];
        }

        const response = await wooCommerceService.get('/orders', {
            params: { 
                customer: actualCustomerId,
                per_page: 50 
            }
        });

        return (response.data as any[]).map(mapWooOrderToInternal);
    }
};
