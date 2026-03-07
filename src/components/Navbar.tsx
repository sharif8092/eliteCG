import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut, ShoppingBag, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';

const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50">
        {/* Main Header: Logo | Nav Links | Icons */}
        <div className="bg-white border-b border-stone-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-[72px]">

              {/* Left: Logo */}
              <div className="flex-1 flex items-center">
                <Link to="/" className="flex-shrink-0 group">
                  <span className="text-2xl lg:text-[28px] font-serif italic text-stone-900 tracking-tight group-hover:text-emerald-800 transition-colors duration-300">Ababil</span>
                </Link>
              </div>

              {/* Center: Nav Links — Desktop */}
              <div className="hidden lg:flex items-center justify-center gap-1">
                {[
                  { label: 'The Shop', to: '/products' },
                  { label: 'Abayas & Hijabs', to: '/products?category=Abaya' },
                  { label: 'Kurtas', to: '/products?category=Kurta' },
                  { label: 'Fragrances', to: '/products?category=Itter' },
                  { label: 'Prayer Essentials', to: '/products?category=Janamaz' },
                  { label: 'Tasbih & Gifts', to: '/products?category=Tasbih' },
                ].map(item => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="relative px-3 py-2 text-[11px] uppercase tracking-[0.12em] font-semibold text-stone-500 hover:text-stone-900 transition-colors duration-200 whitespace-nowrap group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                ))}
                <Link
                  to="/products"
                  className="px-3 py-1.5 ml-2 text-[11px] uppercase tracking-[0.12em] font-bold text-emerald-700 hover:text-emerald-900 transition-colors duration-200 whitespace-nowrap border border-emerald-100 rounded-full bg-emerald-50/50"
                >
                  New Arrivals
                </Link>
              </div>

              {/* Right: Icons */}
              <div className="flex-1 flex items-center justify-end gap-1.5">
                {/* Search */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-stone-500 hover:text-stone-900 transition-colors duration-200"
                  aria-label="Search"
                >
                  <Search size={19} strokeWidth={1.5} />
                </button>

                {/* Admin Link */}
                {isAdmin && (
                  <Link to="/admin" className="p-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-200">
                    <ShieldCheck size={19} strokeWidth={2} />
                  </Link>
                )}

                {/* Account */}
                <Link to={user ? "/profile" : "/auth"} className="p-2 text-stone-500 hover:text-stone-900 transition-colors duration-200">
                  <User size={19} strokeWidth={1.5} />
                </Link>

                {/* Cart/Bag */}
                <Link to="/cart" className="p-2 text-stone-500 hover:text-stone-900 transition-colors duration-200 relative">
                  <ShoppingBag size={19} strokeWidth={1.5} />
                  {itemCount > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-600 text-white text-[7px] font-bold rounded-full flex items-center justify-center">{itemCount}</span>
                  )}
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="lg:hidden p-2 ml-1 text-stone-700 hover:text-stone-900 transition-colors"
                  aria-label="Menu"
                >
                  {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden bg-white border-b border-stone-200 overflow-hidden"
            >
              <div className="px-6 py-4 space-y-0">
                {[
                  { label: 'The Shop', to: '/products' },
                  { label: 'Abayas & Hijabs', to: '/products?category=Abaya' },
                  { label: 'Kurtas', to: '/products?category=Kurta' },
                  { label: 'Fragrances & Oudh', to: '/products?category=Itter' },
                  { label: 'Prayer Essentials', to: '/products?category=Janamaz' },
                  { label: 'Tasbih & Gifts', to: '/products?category=Tasbih' },
                ].map(item => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="block py-3 text-[11px] uppercase tracking-[0.15em] font-semibold text-stone-600 hover:text-emerald-800 border-b border-stone-50 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/products"
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-[11px] uppercase tracking-[0.15em] font-bold text-emerald-700"
                >
                  New Arrivals
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-md"
            />
            <div className="relative flex flex-col items-center pt-20 sm:pt-28 px-4">
              <motion.div
                initial={{ opacity: 0, y: -30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-xl"
              >
                {/* Search Input Card */}
                <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
                  <div className="flex items-center px-6 py-5 gap-4">
                    <Search className="text-emerald-600 flex-shrink-0" size={22} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What are you looking for?"
                      className="flex-grow bg-transparent text-lg text-stone-900 placeholder:text-stone-300 focus:outline-none font-light"
                    />
                    {searchQuery && (
                      <button type="button" onClick={() => setSearchQuery('')} className="p-1 text-stone-300 hover:text-stone-500 transition-colors">
                        <X size={16} />
                      </button>
                    )}
                    <button type="button" onClick={() => setIsSearchOpen(false)} className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-all">
                      <span className="text-[10px] font-mono font-bold">ESC</span>
                    </button>
                  </div>

                  {/* Quick Tags */}
                  {searchQuery.trim().length === 0 && (
                    <div className="px-6 pb-5 border-t border-stone-50 pt-4">
                      <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-3">Popular Searches</p>
                      <div className="flex flex-wrap gap-2">
                        {['Abaya', 'Kurta', 'Prayer Mat', 'Attar', 'Tasbih', 'Hijab'].map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setSearchQuery(tag)}
                            className="px-3 py-1.5 bg-stone-50 hover:bg-emerald-50 text-stone-500 hover:text-emerald-700 text-[11px] font-semibold rounded-lg border border-stone-100 hover:border-emerald-200 transition-all duration-200"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="border-t border-stone-100 max-h-[50vh] overflow-y-auto">
                      <p className="px-6 pt-4 pb-2 text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400">Products</p>
                      {suggestions.map(product => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                          className="flex items-center gap-4 px-6 py-3 hover:bg-stone-50 transition-colors group"
                        >
                          <div className="w-11 h-14 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium text-stone-900 group-hover:text-emerald-800 transition-colors truncate">{product.name}</p>
                            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{product.category} · ₹{product.price.toLocaleString()}</p>
                          </div>
                          <ArrowRight size={14} className="text-stone-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {searchQuery.trim().length > 1 && suggestions.length === 0 && (
                    <div className="border-t border-stone-100 px-6 py-10 text-center">
                      <p className="text-stone-400 text-sm">No products found for "<span className="font-semibold text-stone-600">{searchQuery}</span>"</p>
                      <p className="text-stone-300 text-xs mt-1">Try a different search term</p>
                    </div>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
