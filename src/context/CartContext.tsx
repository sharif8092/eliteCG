import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '../types';
import { MOCK_PRODUCTS } from '../constants';

// ── Free Gift Offer Config ──
const FREE_GIFT_THRESHOLD = 2999; // Cart total above this gets a free gift
const FREE_GIFT_PRODUCT_ID = '4';   // Velvet Janamaz
const FREE_GIFT_ID = 'free-gift-janamaz'; // Unique ID so it doesn't clash

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const isAutoUpdating = useRef(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  // ── Auto-add/remove free gift based on cart threshold ──
  useEffect(() => {
    if (isAutoUpdating.current) return;

    // Calculate total EXCLUDING free gifts
    const paidTotal = items
      .filter(item => !item.isFreeGift)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);

    const hasFreeGift = items.some(item => item.id === FREE_GIFT_ID);

    if (paidTotal >= FREE_GIFT_THRESHOLD && !hasFreeGift) {
      // Add the free gift
      const giftProduct = MOCK_PRODUCTS.find(p => p.id === FREE_GIFT_PRODUCT_ID);
      if (giftProduct) {
        isAutoUpdating.current = true;
        setItems(prev => [...prev, { ...giftProduct, id: FREE_GIFT_ID, price: 0, quantity: 1, isFreeGift: true }]);
        setTimeout(() => { isAutoUpdating.current = false; }, 0);
      }
    } else if (paidTotal < FREE_GIFT_THRESHOLD && hasFreeGift) {
      // Remove the free gift
      isAutoUpdating.current = true;
      setItems(prev => prev.filter(item => item.id !== FREE_GIFT_ID));
      setTimeout(() => { isAutoUpdating.current = false; }, 0);
    }
  }, [items]);

  // Total excludes free gifts (they're ₹0 anyway, but for clarity)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
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
