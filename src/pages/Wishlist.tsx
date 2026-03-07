import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../components/ProductCard';

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center">
        <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-12">
          <Heart className="text-stone-300" size={32} />
        </div>
        <h2 className="text-4xl font-serif text-stone-900 italic mb-6">Your wishlist is empty</h2>
        <p className="text-stone-400 mb-12 font-light">Save pieces you love to your wishlist for later.</p>
        <Link to="/products" className="text-stone-900 font-bold text-[10px] uppercase tracking-widest border-b border-stone-900 pb-1 inline-block">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 space-y-8 md:space-y-0">
        <div className="max-w-xl">
          <span className="text-emerald-800 text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Personal Edit</span>
          <h1 className="text-5xl md:text-7xl font-serif text-stone-900 leading-tight">
            Your <span className="italic">Wishlist</span>
          </h1>
          <p className="text-stone-400 mt-6 font-light">{wishlist.length} pieces saved for you</p>
        </div>

        <button 
          onClick={clearWishlist}
          className="group flex items-center space-x-3 text-stone-400 hover:text-red-500 transition-all border-b border-stone-100 pb-2"
        >
          <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
          <span className="text-[9px] uppercase tracking-widest font-bold">Clear Wishlist</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20">
        <AnimatePresence mode="popLayout">
          {wishlist.map(product => (
            <motion.div 
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;
