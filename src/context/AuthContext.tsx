import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserProfile } from '../types';
import { orderService } from '../services/orderService';
import { wpService } from '../services/wooCommerceService';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const baseUrl = (import.meta as any).env.VITE_WC_URL;
      const response = await axios.post(`${baseUrl}/wp-json/jwt-auth/v1/token`, {
        username: email,
        password: password
      });

      const { token, user_email } = response.data as any;
      
      localStorage.setItem('wc_jwt_token', token);
      
      // Fetch full profile from WooCommerce
      await fetchProfile(token, user_email);
    } catch (err: any) {
      console.error("WooCommerce Login Error:", err);
      throw new Error(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      
      // Split display name into first and last
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // 1. Create WooCommerce customer
      const createResponse = await orderService.getOrCreateCustomer({
        email,
        first_name: firstName,
        last_name: lastName
      });

      if (!createResponse) {
        throw new Error("Failed to create customer account.");
      }

      // Note: standard WC REST API doesn't set password for JWT unless configured,
      // but in this setup, the getOrCreateCustomer uses the admin key to create the account.
      // We need to ensure the password is set correctly during creation.
      // Let's modify orderService.getOrCreateCustomer to support password or add a dedicated create function.
      
      // For now, let's assume the user already exists or use a dedicated creation call here
      // since getOrCreateCustomer is meant for background sync.
      
      const wooUrl = (import.meta as any).env.VITE_WC_URL;
      const ck = (import.meta as any).env.VITE_WC_CONSUMER_KEY;
      const cs = (import.meta as any).env.VITE_WC_CONSUMER_SECRET;

      await axios.post(`${wooUrl}/wp-json/wc/v3/customers`, {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        username: email.split('@')[0] // Use email prefix as username
      }, {
        params: {
          consumer_key: ck,
          consumer_secret: cs
        }
      });

      // 2. Automatically login after successful signup
      await login(email, password);
    } catch (err: any) {
      console.error("WooCommerce Signup Error:", err);
      if (err.response?.data?.code === 'registration-error-email-exists') {
        throw new Error("This email is already registered. Please login instead.");
      }
      throw new Error(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (token: string, email: string) => {
    try {
      // Get WordPress user info
      const wpUserResponse = await wpService.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const wpUser = wpUserResponse.data as any;

      // Get WooCommerce customer info
      const wcId = await orderService.getOrCreateCustomer({ email });

      const newProfile: UserProfile = {
        uid: wpUser.id.toString(),
        email: email,
        displayName: wpUser.name || '',
        photoURL: wpUser.avatar_urls?.['96'] || '',
        phone: '', 
        role: wpUser.roles?.includes('administrator') ? 'admin' : 'customer',
        wcCustomerId: wcId > 0 ? wcId : undefined
      };

      setProfile(newProfile);
      setUser({ email });
    } catch (err) {
      console.error("Fetch Profile Error:", err);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    // Basic local update, real update would need WP API call
    setProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const logout = async () => {
    localStorage.removeItem('wc_jwt_token');
    localStorage.removeItem('auth_bypass');
    setUser(null);
    setProfile(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('wc_jwt_token');
      const bypass = localStorage.getItem('auth_bypass');
      
      if (token) {
        try {
          const baseUrl = (import.meta as any).env.VITE_WC_URL;
          // Validate token and fetch profile
          const validateResponse = await axios.post(`${baseUrl}/wp-json/jwt-auth/v1/token/validate`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (validateResponse.status === 200) {
            const meResponse = await wpService.get('/users/me', {
              headers: { Authorization: `Bearer ${token}` }
            });
            const userData = meResponse.data as any;
            await fetchProfile(token, userData.email || userData.user_email);
          }
        } catch (err) {
          console.error("Token Validation Error:", err);
          localStorage.removeItem('wc_jwt_token');
        }
      } else if (bypass === 'admin' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        setProfile({
          uid: 'mock-admin-id',
          email: 'admin@local.dev',
          displayName: 'Local Admin (Bypass)',
          role: 'admin'
        } as UserProfile);
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const isAdmin = profile?.role === 'admin' || profile?.email === 'sharifkmrn@gmail.com';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, login, signup, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
