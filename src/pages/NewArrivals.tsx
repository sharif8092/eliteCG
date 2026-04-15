import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShoppingBag, Clock } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';

const NewArrivals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const allProducts = await productService.getAllProducts();
        // Sort by date created (newest first)
        const sorted = [...allProducts].sort((a, b) => 
          new Date(b.date_created || '').getTime() - new Date(a.date_created || '').getTime()
        ).slice(0, 8);
        setProducts(sorted);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  return (
    <div className="bg-stone-50 min-h-screen">
      <SEO 
        title="The New Edit | Latest Corporate Gift Collection"
        description="Discover our latest curation of premium corporate gifts. Freshly landed items designed for modern professional excellence and brand elevation."
        keywords="New Corporate Gifts, Latest Gifting Trends, Modern Business Gifts, Fresh Arrival Gifts"
      />
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900 z-10" />
          <img 
            src="/Hero13.jpg" 
            alt="New Arrivals" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Sparkles className="text-emerald-400" size={20} />
            <span className="text-emerald-400 text-[10px] uppercase tracking-[0.4em] font-extrabold">Just Published</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-white italic leading-tight mb-8"
          >
            The New <span className="not-italic">Edit</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-stone-300 text-xs md:text-sm uppercase tracking-[0.2em] font-light max-w-xl mx-auto leading-relaxed"
          >
            Discover our latest curation of premium corporate gifts, designed for modern professional excellence.
          </motion.p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-3xl font-serif text-stone-900 mb-4">Latest Additions</h2>
            <p className="text-stone-500 text-sm font-light">Fresh arrivals to elevate your brand presence.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-stone-100 shadow-sm">
              <Clock size={14} className="text-emerald-600" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400 font-mono">Updated Weekly</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] rounded-[2rem]" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
            <ShoppingBag size={48} className="mx-auto text-stone-200 mb-6" />
            <h3 className="text-2xl font-serif text-stone-900 mb-2">Check back soon</h3>
            <p className="text-stone-400 font-light">Our latest collection is currently being curated.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-white py-24 border-t border-stone-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif text-stone-900 mb-8 leading-tight">Can't find what you're <span className="italic underline decoration-emerald-500/30">looking for?</span></h2>
          <p className="text-stone-500 text-sm md:text-base font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Our gifting experts specialize in bespoke sourcing. If you have a specific requirement or vision, let us bring it to life with our global artisan network.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="https://wa.me/917909096738?text=I'm looking for a bespoke gifting solution."
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-stone-900 text-white rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all shadow-xl"
            >
              Consult an Expert
            </a>
            <a 
              href="/products"
              className="flex items-center gap-3 text-stone-900 font-bold text-[10px] uppercase tracking-[0.2em] group"
            >
              View Full Collection
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewArrivals;
