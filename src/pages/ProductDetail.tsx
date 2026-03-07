import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Star, X, ZoomIn, Check } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import { Product } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Try Firestore first
        const found = await productService.getProductById(id);
        if (found) {
          setProduct(found);
          // Fetch related
          const related = await productService.getProductsByCategory(found.category);
          setRelatedProducts(related.filter(p => p.id !== found.id).slice(0, 4));
        } else {
          // Fallback to Mock
          const mockFound = MOCK_PRODUCTS.find(p => p.id === id);
          if (mockFound) {
            setProduct(mockFound);
            const mockRelated = MOCK_PRODUCTS.filter(p => p.category === mockFound.category && p.id !== mockFound.id).slice(0, 4);
            setRelatedProducts(mockRelated);
          }
        }
      } catch (error) {
        console.error('Error fetching product detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col lg:flex-row gap-24">
          <div className="w-full lg:w-1/2 space-y-8">
            <Skeleton className="aspect-[3/4] rounded-[3rem]" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-10">
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-1/3" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-16 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-serif text-stone-900 italic">Piece not found</h2>
        <Link to="/products" className="mt-8 text-stone-900 font-bold text-[10px] uppercase tracking-widest border-b border-stone-900 pb-1 inline-block">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex flex-col lg:flex-row gap-24">
        {/* Image Gallery */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="relative group">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-stone-100 cursor-zoom-in"
              onClick={() => setIsZoomed(true)}
            >
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute top-8 right-8 flex flex-col gap-4">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md p-3 rounded-full text-stone-900 shadow-xl">
                  <ZoomIn size={20} />
                </div>
              </div>
              {discount > 0 && (
                <div className="bg-red-500 px-4 py-2 rounded-full shadow-xl">
                  <span className="text-xs uppercase tracking-widest font-bold text-white">-{discount}% Off</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {product.images.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`aspect-square rounded-2xl overflow-hidden bg-stone-100 cursor-pointer border-2 transition-all ${selectedImage === i ? 'border-stone-900' : 'border-transparent hover:border-stone-300'}`}
              >
                <img src={img} alt={`${product.name} view ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 space-y-12">
          <div className="space-y-6">
            <nav className="flex text-[9px] uppercase tracking-[0.3em] font-bold text-stone-400">
              <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
              <span className="mx-3">/</span>
              <Link to="/products" className="hover:text-stone-900 transition-colors">Shop</Link>
              <span className="mx-3">/</span>
              <span className="text-stone-900">{product.category}</span>
            </nav>
            <h1 className="text-5xl md:text-7xl font-serif text-stone-900 leading-tight">
              {product.name.split(' ').map((word, i) => (
                i === 1 ? <span key={i} className="italic font-light block">{word}</span> : <span key={i}>{word} </span>
              ))}
            </h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-4">
                {product.originalPrice && (
                  <p className="text-2xl font-serif text-stone-300 line-through">₹{product.originalPrice.toLocaleString()}</p>
                )}
                <p className="text-4xl font-serif italic text-stone-900">₹{product.price.toLocaleString()}</p>
              </div>
              <div className="h-8 w-[1px] bg-stone-200"></div>
              <div className="flex items-center space-x-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                      className={i < Math.floor(product.rating) ? "" : "text-stone-200"}
                    />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">{product.rating} / 5.0 ({product.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-stone-500 text-lg leading-relaxed font-light max-w-lg">
            {product.description}
          </p>

          <div className="space-y-8 pt-8 border-t border-stone-100">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
              <div className="flex items-center justify-between border border-stone-200 rounded-full px-8 py-4 min-w-[160px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-stone-400 hover:text-stone-900 transition-colors"
                >
                  -
                </button>
                <span className="font-bold text-sm text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-stone-400 hover:text-stone-900 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-grow py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 ${isAdded ? 'bg-emerald-600 text-white' : 'bg-stone-900 text-white hover:bg-emerald-900'}`}
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
                      <Check size={16} />
                      Added to Bag
                    </motion.div>
                  ) : (
                    <motion.div
                      key="cart"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      Add to Bag
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-5 border rounded-full transition-all ${isInWishlist(product.id) ? 'text-red-500 border-red-500 bg-red-50' : 'text-stone-400 border-stone-200 hover:text-red-500 hover:border-red-500'}`}
              >
                <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-12 border-t border-stone-100">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center flex-shrink-0">
                <Truck className="text-stone-900" size={16} />
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-900 mb-1">Complimentary Delivery</h4>
                <p className="text-xs text-stone-400 font-light">On all orders above ₹5,000</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="text-stone-900" size={16} />
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-900 mb-1">Secure Transaction</h4>
                <p className="text-xs text-stone-400 font-light">Encrypted payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-40">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
            <div>
              <span className="text-emerald-800 text-[10px] uppercase tracking-[0.3em] font-bold mb-2 block">Curated Selection</span>
              <h2 className="text-4xl md:text-5xl font-serif text-stone-900">Related <span className="italic">Pieces</span></h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomed(false)}
              className="absolute inset-0 bg-stone-900/95 backdrop-blur-xl cursor-zoom-out"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center pointer-events-none"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-0 right-0 mt-[-40px] text-white/60 hover:text-white transition-colors pointer-events-auto"
              >
                <X size={32} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
