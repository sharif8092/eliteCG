import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { useAuth } from './AuthContext';

// ── Free Gift Offer Config ──
const FREE_GIFT_THRESHOLD = 2999; // Cart total above this gets a free gift
const FREE_GIFT_PRODUCT_ID = '4';   // Velvet Janamaz
const FREE_GIFT_ID = 'free-gift-janamaz'; // Unique ID so it doesn't clash

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const isAutoUpdating = useRef(false);
  const isInitialLoad = useRef(true);

  // Load cart when user changes
  useEffect(() => {
    const cartKey = user ? `cart_${user.uid}` : 'cart_guest';
    const saved = localStorage.getItem(cartKey);
    const loadedItems = saved ? JSON.parse(saved) : [];
    
    // If we were a guest and just logged in, we might want to "adopt" the guest cart
    // But the user specifically said "login hone k baad iss k according" 
    // implying they want the account's cart. 
    // To be safe and helpful, if the account cart is empty, we use guest cart.
    if (user && loadedItems.length === 0) {
      const guestSaved = localStorage.getItem('cart_guest');
      if (guestSaved) {
        setItems(JSON.parse(guestSaved));
        return;
      }
    }

    setItems(loadedItems);
    isInitialLoad.current = false;
  }, [user]);

  // Save cart whenever items change (and after initial load)
  useEffect(() => {
    if (isInitialLoad.current) return;
    const cartKey = user ? `cart_${user.uid}` : 'cart_guest';
    localStorage.setItem(cartKey, JSON.stringify(items));
    
    // Legacy support for other parts of the app that might still look at 'cart'
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items, user]);

  const getTieredPrice = (price: number, qty: number) => {
    if (qty >= 1000) return price * 0.7;
    if (qty >= 500) return price * 0.8;
    if (qty >= 200) return price * 0.9;
    return price;
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQuantity = existing.quantity + quantity;
        const newPrice = getTieredPrice(product.price, newQuantity);
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity, price: newPrice } : item
        );
      }
      const initialPrice = getTieredPrice(product.price, quantity);
      return [...prev, { ...product, quantity, price: initialPrice }];
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
      prev.map(item => {
        if (item.id === productId) {
          const newPrice = getTieredPrice(item.originalPrice || item.price, quantity);
          return { ...item, quantity, price: newPrice };
        }
        return item;
      })
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
