export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  imageAlts?: string[];
  stock: number;
  featured?: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem extends Product {
  quantity: number;
  isFreeGift?: boolean;
}
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'scheduled' | 'expired';
  clicks: number;
  expiry: string;
  image?: string;
  type: 'banner' | 'popup' | 'deal';
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  status: 'Published' | 'Draft';
  comments: number;
  image?: string; // Main thumbnail
  imageAlt?: string; // SEO alt text for thumbnail
  heroImage?: string; // Larger banner image
  heroAlt?: string; // SEO alt text for hero
  additionalImages?: { url: string; alt?: string }[]; // Gallery with SEO
  category?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface MediaFile {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video' | 'pdf';
  category: 'products' | 'blogs' | 'banners' | 'other';
  size: number;
  uploadedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  address?: string;
  phone?: string;
  role: 'customer' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
  paymentMethod: string;
  shippingMethod?: string;
  shippingCost?: number;
  trackingNumber?: string;
}
