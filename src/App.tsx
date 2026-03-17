import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import NewArrivals from './pages/NewArrivals';
import BulkOrders from './pages/BulkOrders';
import CustomBranding from './pages/CustomBranding';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OfferManagement from './pages/admin/OfferManagement';
import BlogManagement from './pages/admin/BlogManagement';
import MediaLibrary from './pages/admin/MediaLibrary';
import AdminOrders from './pages/admin/AdminOrders';
import CategoryManagement from './pages/admin/CategoryManagement';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/blog/:id" element={<BlogDetail />} />
                  <Route path="/new-arrivals" element={<NewArrivals />} />
                  <Route path="/bulk-orders" element={<BulkOrders />} />
                  <Route path="/custom-branding" element={<CustomBranding />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<ProductManagement />} />
                  <Route path="/admin/categories" element={<CategoryManagement />} />
                  <Route path="/admin/offers" element={<OfferManagement />} />
                  <Route path="/admin/blogs" element={<BlogManagement />} />
                  <Route path="/admin/media" element={<MediaLibrary />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                </Routes>
              </Layout>
              <ScrollToTop />
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
