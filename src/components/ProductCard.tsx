import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-stone-100 mb-6">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.thumbnails?.[0] || product.images?.[0] || ''}
            alt={product.imageAlts?.[0] || product.name || 'Product'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </Link>

        {/* Elegant Quick Add Overlay */}
        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-700 pointer-events-none"></div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out flex flex-col gap-2">
          <button
            onClick={handleAddToCart}
            className={`w-full py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 flex items-center justify-center gap-2 ${isAdded ? 'bg-emerald-600 text-white' : 'bg-white text-stone-900 hover:bg-stone-900 hover:text-white'}`}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check size={12} />
                  Added
                </motion.div>
              ) : (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Add to Bag
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="w-full bg-stone-900/80 backdrop-blur-md text-white py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-stone-900 transition-all duration-500 flex items-center justify-center gap-2"
            >
              <Eye size={12} />
              Quick View
            </button>
          )}
        </div>

        {/* Subtle Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          {product.featured && (
            <div className="bg-stone-900 px-3 py-1 rounded-full w-fit">
              <span className="text-[8px] uppercase tracking-widest font-bold text-white">Corporate Pick</span>
            </div>
          )}
          {product.reviewCount > 20 && (
            <div className="bg-emerald-800 px-3 py-1 rounded-full w-fit">
              <span className="text-[8px] uppercase tracking-widest font-bold text-white">Best Seller</span>
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full w-fit border border-stone-100">
            <span className="text-[8px] uppercase tracking-widest font-bold text-stone-900 italic">MOQ: 25 Units</span>
          </div>
        </div>

        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 duration-500 ${isInWishlist(product.id) ? 'text-red-500' : 'text-stone-400 hover:text-red-500'}`}
        >
          <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="px-4 text-center">
        <Link to={`/product/${product.id}`} className="block space-y-2">
          <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold block">
            {product.categories.join(' · ')}
          </span>
          <h3 className="text-stone-900 font-serif text-xl leading-tight group-hover:text-emerald-800 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-center gap-1">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                const isFull = ratingValue <= Math.floor(product.rating);
                const isHalf = !isFull && ratingValue <= Math.ceil(product.rating) && product.rating % 1 !== 0;

                return (
                  <div key={i} className="relative">
                    <Star
                      size={10}
                      fill={isFull ? "currentColor" : "none"}
                      className={isFull ? "" : "text-stone-200"}
                    />
                    {isHalf && (
                      <div className="absolute inset-0 overflow-hidden w-1/2">
                        <Star size={10} fill="currentColor" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <span className="text-[8px] text-stone-400 font-bold tracking-widest uppercase">({product.reviewCount})</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <p className="text-stone-900 font-serif text-sm">
              <span className="text-stone-400 text-[10px] uppercase tracking-widest font-sans not-italic mr-1">Starts at</span>
              ₹{product.price.toLocaleString()} 
              <span className="text-stone-400 text-[10px] ml-1 not-italic font-sans">/ unit</span>
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 py-1">
            <span className="text-[8px] uppercase tracking-widest text-stone-400 flex items-center gap-1">
              <Check size={8} className="text-emerald-500" /> GST Invoice
            </span>
            <span className="text-[8px] uppercase tracking-widest text-stone-400 flex items-center gap-1">
              <Check size={8} className="text-emerald-500" /> Branding
            </span>
          </div>
        </Link>

        {/* WhatsApp Inquiry Button for Product */}
        <div className="mt-4">
          <a
            href={`https://wa.me/917909096738?text=${encodeURIComponent(`Hi, I'm interested in bulk quantities of ${product.name}. Please share a quote.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-stone-500 hover:text-emerald-600 transition-colors py-2 border-t border-stone-50"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.891-11.891 3.181 0 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.481 8.403 0 6.556-5.332 11.891-11.891 11.891-2.01 0-3.991-.51-5.751-1.474l-6.243 1.694zm6.103-2.723c1.486.883 2.49 1.096 4.399 1.096 5.45 0 9.886-4.437 9.886-9.886 0-5.45-4.436-9.886-9.886-9.886-5.451 0-9.886 4.436-9.886 9.886 0 2.019.549 3.395 1.541 4.98l-1.011 3.705 3.957-1.075zm12.466-6.411c-.329-.165-1.948-.962-2.248-1.071-.3-.109-.519-.165-.736.165-.218.329-.838 1.071-1.026 1.288-.188.218-.376.247-.706.082-.329-.165-1.391-.512-2.651-1.635-1.02-.91-1.708-2.033-1.908-2.378-.2-.345-.021-.531.144-.694.148-.145.329-.384.493-.576.165-.192.219-.329.329-.548.11-.219.055-.411-.027-.576-.082-.165-.736-1.774-1.008-2.426-.266-.633-.535-.547-.736-.557-.188-.009-.404-.011-.619-.011s-.563.081-.856.402c-.292.321-1.114 1.092-1.114 2.663s1.146 3.09 1.306 3.31c.159.22 2.257 3.447 5.467 4.834.763.329 1.358.525 1.821.672.766.244 1.464.21 2.014.128.614-.092 1.948-.796 2.222-1.564.274-.768.274-1.427.192-1.564-.082-.138-.301-.22-.631-.385z"/></svg>
            <span className="text-[10px] uppercase tracking-widest font-bold">Bulk Quote</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
