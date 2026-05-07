import { useState, useEffect } from 'react';

export const useQuotation = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint is 1024px
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getQuotationLink = (productName?: string, quantity?: number, items?: any[]) => {
    if (isMobile) {
      let message = "";
      if (items && items.length > 0) {
        message = "Hi, I'm interested in the following items from my quotation list:\n\n";
        items.forEach(item => {
          message += `- ${item.name} (Qty: ${item.quantity})\n`;
        });
        message += "\nPlease provide a formal quote.";
      } else if (productName) {
        message = `Hi, I'm interested in ${productName}${quantity ? ` (Quantity: ${quantity})` : ''}. Please provide a quote.`;
      } else {
        message = "Hi, I'm interested in corporate gifting solutions. Please provide a quote.";
      }
      return `https://wa.me/917909096738?text=${encodeURIComponent(message)}`;
    } else {
      // YITH on Desktop
      return 'https://backend.corporategifting.store/request-quote/';
    }
  };

  return { isMobile, getQuotationLink };
};
