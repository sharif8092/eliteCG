import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Truck, Mail, Package, CreditCard, RotateCcw, Quote, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { offerService } from '../services/offerService';
import { Product, Offer } from '../types';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);

  // Hero carousel state
  const [heroSlide, setHeroSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch products
        const allProducts = await productService.getAllProducts();
        if (allProducts.length > 0) {
          setProducts(allProducts);
        } else {
          setProducts(MOCK_PRODUCTS);
        }

        // Fetch active offer for banner
        const activeOffers = await offerService.getActiveOffers();
        const bannerOffer = activeOffers.find(o => o.type === 'banner');
        if (bannerOffer) {
          setActiveOffer(bannerOffer);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev === 2 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter(p => p.featured);
  const trendingProducts = products.slice(0, 4);
  const bestSellers = [...products].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 4);

  // Hero carousel state

  return (
    <div className="pb-24">
      {/* ═══ PROMOTIONAL BANNER STRIP ═══ */}
      <section className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 relative z-10">
          <h3 className="text-white font-extrabold text-lg sm:text-2xl md:text-3xl uppercase tracking-wide" style={{ fontStyle: 'italic' }}>
            {activeOffer ? activeOffer.title : 'Free Prayer Mat'}
          </h3>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="bg-amber-400 text-emerald-900 text-[8px] sm:text-[9px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full">
              {activeOffer ? 'Limited Offer' : 'Limited Time Offer'}
            </span>
            <h3 className="text-white font-extrabold text-lg sm:text-2xl md:text-3xl uppercase tracking-wide" style={{ fontStyle: 'italic' }}>
              {activeOffer ? activeOffer.description : 'On Orders Above ₹2999'}
            </h3>
          </div>
        </div>
      </section>

      {/* ═══ HERO IMAGE CAROUSEL ═══ */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden bg-stone-900">
        {/* Slides */}
        {[
          {
            image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1964&auto=format&fit=crop',
            subtitle: 'The Ramadan Collection 2026',
            title: 'Premium Abayas',
            desc: 'Elegant designs for every occasion',
            link: '/products?category=Abaya',
          },
          {
            image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1920&auto=format&fit=crop',
            subtitle: 'Artisanal Fragrances',
            title: 'Oudh & Itter Collection',
            desc: 'Long-lasting traditional Arabian scents',
            link: '/products?category=Itter',
          },
          {
            image: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=1920&auto=format&fit=crop',
            subtitle: 'Handcrafted with Love',
            title: 'Prayer Essentials',
            desc: 'Premium janamaz, tasbih & more',
            link: '/products?category=Janamaz',
          },
        ].map((slide, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: heroSlide === i ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
            style={{ pointerEvents: heroSlide === i ? 'auto' : 'none' }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Bottom-left text overlay */}
            <div className="absolute bottom-10 sm:bottom-16 md:bottom-20 left-4 sm:left-8 md:left-16 max-w-lg z-10">
              <motion.div
                key={`text-${heroSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="text-emerald-300 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-bold mb-2 block">
                  {slide.subtitle}
                </span>
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white uppercase leading-[0.95] tracking-tight mb-2">
                  {slide.title}
                </h1>
                <p className="text-white/60 text-sm sm:text-base font-light mb-6">
                  {slide.desc}
                </p>
                <Link
                  to={slide.link}
                  className="inline-block bg-white text-stone-900 px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-extrabold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg"
                >
                  Shop Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={() => setHeroSlide(prev => (prev === 0 ? 2 : prev - 1))}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-20"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setHeroSlide(prev => (prev === 2 ? 0 : prev + 1))}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-20"
        >
          <ChevronRight size={20} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {[0, 1, 2].map(i => (
            <button
              key={i}
              onClick={() => setHeroSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${heroSlide === i ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </section>

      {/* ═══ TRUST / USP STRIP ═══ */}
      <section className="bg-stone-50 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-stone-200">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
              { icon: ShieldCheck, title: '100% Authentic', desc: 'Verified products only' },
              { icon: CreditCard, title: 'Secure Payment', desc: 'SSL encrypted checkout' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy' },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center py-8 px-4 gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <item.icon size={18} className="text-emerald-700" />
                </div>
                <div>
                  <div className="text-stone-900 font-bold text-xs uppercase tracking-wider">{item.title}</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SHOP BY CATEGORY ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 uppercase tracking-tight">Shop by Category</h2>
          <Link to="/products" className="text-stone-500 hover:text-stone-900 text-xs uppercase tracking-widest font-bold transition-colors">
            View All →
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-10">
          {['All', 'Abaya', 'Kurta', 'Itter', 'Tasbih', 'Cap', 'Janamaz', 'Home Decor', 'Miswaq'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-md text-[11px] sm:text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${selectedCategory === cat
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-900 hover:text-stone-900'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtered Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-16">
          {MOCK_PRODUCTS
            .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
            .slice(0, 4)
            .map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          }
        </div>

        {/* If fewer than expected products */}
        {MOCK_PRODUCTS.filter(p => selectedCategory === 'All' || p.category === selectedCategory).length === 0 && (
          <div className="text-center py-16">
            <p className="text-stone-400 font-light italic">No products found in this category yet.</p>
          </div>
        )}
      </section>

      {/* ═══ RAMADAN SPECIAL BANNER ═══ */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 py-16 md:py-20">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center md:text-left"
              >
                <span className="text-emerald-300/80 text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block">Limited Time</span>
                <h2 className="text-3xl md:text-5xl font-serif text-white mb-3">
                  Ramadan <span className="italic text-emerald-300">Special</span>
                </h2>
                <p className="text-emerald-100/60 font-light max-w-md">
                  Up to 30% off on selected items. Celebrate the holy month with our exclusive collection.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-3 bg-white text-emerald-900 px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all duration-300 shadow-xl hover:-translate-y-0.5"
                >
                  <span>Shop the Sale</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRENDING / BESTSELLERS ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
          <div>
            <span className="text-emerald-800 text-[10px] uppercase tracking-[0.3em] font-bold mb-2 block">Trending Now</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900">Most <span className="italic">Coveted</span> Pieces</h2>
          </div>
          <Link to="/products" className="text-stone-400 hover:text-stone-900 text-xs uppercase tracking-widest font-bold border-b border-stone-200 pb-1 transition-all">
            Explore All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ═══ EDITORIAL STORY ═══ */}
      <section className="bg-[#1A1A1A] text-white py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="aspect-[4/5] rounded-[3rem] overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"
                  alt="Editorial Story"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-900/50 rounded-full blur-[100px] -z-10" />
            </div>

            <div className="space-y-10">
              <span className="text-emerald-400 text-[10px] uppercase tracking-[0.5em] font-bold block">Our Philosophy</span>
              <h2 className="text-5xl md:text-7xl font-serif leading-[1.1] tracking-tight">
                Crafting <br />
                <span className="italic text-emerald-400">Timeless</span> <br />
                Narratives.
              </h2>
              <p className="text-stone-400 text-lg leading-relaxed font-light max-w-md">
                Ababil is more than a store. It is a sanctuary for those who seek beauty in the sacred, and meaning in the mundane. Every piece is selected for its soul.
              </p>
              <div className="pt-6">
                <Link to="/about" className="group flex items-center space-x-4 text-white">
                  <span className="text-xs uppercase tracking-widest font-bold">Read Our Story</span>
                  <div className="w-12 h-[1px] bg-white/30 group-hover:w-20 transition-all duration-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BESTSELLERS ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
          <div>
            <span className="text-emerald-800 text-[10px] uppercase tracking-[0.3em] font-bold mb-2 block">Customer Favourites</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900">Best <span className="italic">Sellers</span></h2>
          </div>
          <Link to="/products" className="text-stone-400 hover:text-stone-900 text-xs uppercase tracking-widest font-bold border-b border-stone-200 pb-1 transition-all">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ═══ CUSTOMER TESTIMONIALS ═══ */}
      <section className="bg-stone-50 py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-800 text-[10px] uppercase tracking-[0.5em] font-bold mb-3 block">Testimonials</span>
            <h2 className="text-4xl md:text-6xl font-serif text-stone-900">What Our <span className="italic">Customers</span> Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Aisha Khan',
                location: 'Mumbai',
                rating: 5,
                text: 'The quality of the abayas is exceptional. I\'ve ordered multiple times and each piece feels luxurious. The packaging is beautiful too!',
                avatar: 'A',
              },
              {
                name: 'Mohammed Ali',
                location: 'Delhi',
                rating: 5,
                text: 'Found the perfect itter collection here. The fragrances are long-lasting and authentic. Highly recommend their Oudh Al Arab!',
                avatar: 'M',
              },
              {
                name: 'Fatima Shaikh',
                location: 'Hyderabad',
                rating: 5,
                text: 'Their janamaz collection is stunning. The velvet prayer mat I ordered is so soft and the patterns are gorgeous. Great customer service!',
                avatar: 'F',
              },
            ].map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-500 relative"
              >
                <Quote size={32} className="text-emerald-100 absolute top-6 right-6" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-stone-600 leading-relaxed mb-6 font-light">{review.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="text-stone-900 font-bold text-sm">{review.name}</div>
                    <div className="text-stone-400 text-xs">{review.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CURATED COLLECTIONS ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-serif text-stone-900 mb-6">Shop by <span className="italic">Collection</span></h2>
          <p className="text-stone-500 max-w-lg mx-auto font-light">Explore our thoughtfully assembled edits, designed for every moment of your spiritual journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <Link to="/products?category=Abaya" className="group relative aspect-[16/10] overflow-hidden rounded-[2rem] md:rounded-[3rem]">
            <img
              src="https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=80&w=1920&auto=format&fit=crop"
              alt="Abayas"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
              <h3 className="text-4xl md:text-5xl font-serif text-white mb-4">The Abaya Edit</h3>
              <span className="text-white/80 text-[10px] uppercase tracking-[0.3em] font-bold border-b border-white/40 pb-1">Shop Now</span>
            </div>
          </Link>

          <Link to="/products?category=Itter" className="group relative aspect-[16/10] overflow-hidden rounded-[2rem] md:rounded-[3rem]">
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1920&auto=format&fit=crop"
              alt="Itter"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
              <h3 className="text-4xl md:text-5xl font-serif text-white mb-4">Artisanal Itter</h3>
              <span className="text-white/80 text-[10px] uppercase tracking-[0.3em] font-bold border-b border-white/40 pb-1">Shop Now</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center space-y-12">
          <div className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-8">
            <Mail className="text-white" size={24} />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-stone-900 leading-tight">
            Stay <span className="italic">Connected</span>
          </h2>
          <p className="text-stone-500 text-lg max-w-md mx-auto font-light">
            Join our inner circle for exclusive previews, artisanal stories, and quiet moments of inspiration.
          </p>
          <form className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-grow bg-transparent border-b border-stone-200 px-4 py-4 text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-900 transition-all"
              />
              <button className="text-stone-900 font-bold text-xs uppercase tracking-widest hover:text-emerald-800 transition-colors">
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
