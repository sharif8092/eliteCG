import wooCommerceService from './wooCommerceService';

export interface QuotationData {
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company: string;
    address_1?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  line_items: Array<{
    product_id: number;
    quantity: number;
  }>;
  customer_note?: string;
}

export const quotationService = {
  /**
   * Submits a quotation request by creating a WooCommerce order with 'pending' status.
   * This integrates with the YITH backend as it manages these requests as orders.
   */
  submitQuotation: async (data: QuotationData) => {
    try {
      const response = await wooCommerceService.post('/orders', {
        billing: data.billing,
        shipping: data.billing,
        line_items: data.line_items,
        customer_note: data.customer_note,
        status: 'pending',
        payment_method: 'other',
        payment_method_title: 'Frontend Quotation Request',
        set_paid: false,
        meta_data: [
          {
            key: '_is_quotation',
            value: 'yes'
          },
          {
            key: '_quotation_source',
            value: 'React Frontend'
          }
        ]
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit quotation request:', error);
      throw error;
    }
  }
};
