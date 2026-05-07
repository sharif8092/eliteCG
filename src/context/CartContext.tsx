import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '../types';
import { useAuth } from './AuthContext';
import wooCommerceService from '../services/wooCommerceService';

const GST_RATES: Record<string, number> = {
  'Abaya': 0.12,
  'Kurta': 0.12,
  'Cap': 0.12,
  'Janamaz': 0.12,
  'Itter': 0.18,
  'Home Decor': 0.18,
  'Tasbih': 0.18,
  'Miswaq': 0.05,
  'Other': 0.18
};

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, branding?: string, isSample?: boolean, customPrice?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  subtotal: number;
  gstTotal: number;
  total: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const cartIdRef = useRef<string | null>(localStorage.getItem('cartId'));

  // Initialize Cart ID
  useEffect(() => {
    if (!cartIdRef.current) {
        cartIdRef.current = crypto.randomUUID();
        localStorage.setItem('cartId', cartIdRef.current);
    }
  }, []);

  const fetchCart = async () => {
    try {
        setIsLoading(true);
        const response = await wooCommerceService.get('/cart', {
            headers: { 'x-cart-id': cartIdRef.current },
            params: { userId: user?.uid }
        });
        
        // Map backend items to frontend CartItem type if necessary
        const backendItems = response.data.items || [];
        // We'll trust the backend response which should include product details if we've synced them
        // For now, let's assume the backend returns what we need or we fetch details
        setItems(backendItems);
    } catch (error) {
        console.error('Failed to fetch cart:', error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const getTieredPrice = (price: number, qty: number) => {
    if (qty >= 1000) return price * 0.7;
    if (qty >= 500) return price * 0.8;
    if (qty >= 200) return price * 0.9;
    return price;
  };

  const addToCart = async (product: Product, quantity: number = 1, branding: string = 'None', isSample: boolean = false, customPrice?: number) => {
    try {
        const itemPrice = isSample ? (customPrice || product.price * 3) : getTieredPrice(product.price, quantity);
        
        const response = await wooCommerceService.post('/cart', {
            productId: product.id,
            quantity,
            branding,
            isSample,
            price: itemPrice,
            userId: user?.uid
        }, {
            headers: { 'x-cart-id': cartIdRef.current }
        });

        if (response.data.success) {
            setItems(response.data.cart.items);
        }
    } catch (error) {
        console.error('Add to cart failed:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
        const response = await wooCommerceService.post('/cart', {
            productId,
            quantity: 0, // Backend deletes if quantity <= 0
            userId: user?.uid
        }, {
            headers: { 'x-cart-id': cartIdRef.current }
        });
        setItems(response.data.cart.items);
    } catch (error) {
        console.error('Remove from cart failed:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
        const item = items.find(i => i.id === productId);
        if (!item) return;

        const newPrice = getTieredPrice(item.originalPrice || item.price, quantity);

        const response = await wooCommerceService.post('/cart', {
            productId,
            quantity,
            price: newPrice,
            userId: user?.uid
        }, {
            headers: { 'x-cart-id': cartIdRef.current }
        });
        setItems(response.data.cart.items);
    } catch (error) {
        console.error('Update quantity failed:', error);
    }
  };

  const clearCart = () => {
    setItems([]);
    // Optionally call backend to clear
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const gstTotal = items.reduce((sum, item) => {
    const category = item.category || (item.categories && item.categories[0]) || 'Other';
    const rate = GST_RATES[category] || 0.18;
    return sum + (item.price * item.quantity * rate);
  }, 0);

  const estimateTotal = subtotal + gstTotal;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      subtotal,
      gstTotal,
      total: estimateTotal,
      itemCount,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

