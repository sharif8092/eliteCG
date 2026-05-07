import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Truck, Mail, Package, CreditCard, RotateCcw, Quote, Sparkles, ChevronLeft, ChevronRight, Calendar, User as UserIcon, CheckCircle2, Send, Phone, MessageSquare } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { reviewService } from '../services/reviewService';
import { productService } from '../services/productService';
import { offerService } from '../services/offerService';
import { blogService } from '../services/blogService';
import { categoryService, Category } from '../services/categoryService';
import { Product, Offer, BlogPost, Review } from '../types';
import SEO from '../components/SEO';
import { decodeHtml } from '../utils/formatUtils';
import QuotationForm from '../components/QuotationForm';
import { useCart } from '../context/CartContext';
import wooCommerceService from '../services/wooCommerceService';

const DEFAULT_HERO_SLIDES = [
  {
    image: '/Hero6.jpg', // Corporate Gift Boxes
    subtitle: 'Excellence in Corporate Gifting',
    title: 'Premium Business Gifts',
    desc: 'Thoughtfully curated luxury gift sets for your valued partners and employees.',
    link: '/products',
  },
  {
    image: '/Hero7.jpg', // Wrapped gifts
    subtitle: 'Custom Branding Available',
    title: 'Bespoke Curations',
    desc: 'Personalize every gift with your corporate identity for a lasting impression.',
    link: '/products',
  },
  {
    image: '/Hero8.jpg', // Elegant Desk/Gift
    subtitle: 'Bulk Orders Simplified',
    title: 'Seamless Logistics',
    desc: 'From curation to doorstep delivery, we handle your festive gifting at scale.',
    link: '/products',
  },
];

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    quantity: '',
    requirements: ''
  });
  const { items, subtotal, total } = useCart();

  // Hero carousel state
  const [heroSlide, setHeroSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const offerMessages = [
    { title: 'Corporate Bulk Discounts', sub: 'Premium Quality' },
    { title: 'Exclusive B2B Pricing', sub: 'GST Invoicing' },
    { title: 'On Orders Above 1000 Units', sub: 'PAN India Delivery' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentOfferIndex(prev => (prev + 1) % offerMessages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch products
        const allProducts = await productService.getAllProducts();
        setProducts(allProducts);

        // Fetch active offer for banner
        const activeOffers = await offerService.getActiveOffers();
        const bannerOffer = activeOffers.find(o => o.type === 'banner');
        if (bannerOffer) {
          setActiveOffer(bannerOffer);
        }

        // Fetch latest blog posts
        const recentPosts = await blogService.getRecentPosts(3);
        setLatestPosts(recentPosts);

        // Fetch categories
        const allCategories = await categoryService.getAllCategories();
        setCategories(allCategories);

        // Fetch latest reviews
        const allReviews = await reviewService.getLatestReviews(6);
        setReviews(allReviews);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    if (DEFAULT_HERO_SLIDES.length <= 1) return;
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev === DEFAULT_HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = useMemo(() => products.filter(p => p.featured), [products]);

  const trendingProducts = useMemo(() =>
    [...products]
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      })
      .slice(0, 4)
    , [products]);

  const bestSellers = useMemo(() =>
    [...products]
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 4)
    , [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter(p =>
      p.categories.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase())
    );
  }, [products, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setLoading(true);
    setSelectedCategory(category);
    setTimeout(() => setLoading(false), 300);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Reusing the same backend logic
      await wooCommerceService.post('/inquiry', inquiryData);
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      console.error('Inquiry submission failed:', error);
      alert('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hero carousel state

  return (
    <div className="pb-24">
      <SEO
        title="Premium Corporate Gifting Solutions in India"
        description="Urban Shark is India's premium corporate gifting partner. We specialize in bespoke business gifts, custom branded merchandise, and bulk gifting solutions for events and employees. Pan-India delivery with GST compliance."
        keywords="Corporate Gifting India, Bulk Business Gifts, Professional Gifting Solutions, Custom Branded Gifts, Employee Welcome Kits, Executive Gifts, B2B Gifting"
        ogType="website"
      />
      {/* ═══ PROMOTIONAL BANNER STRIP ═══ */}
      <section className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="max-w-7xl mx-auto px-4 h-12 md:h-14 flex items-center justify-center relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentOfferIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 w-full"
            >
              <h3 className="text-white font-extrabold text-sm sm:text-xl md:text-2xl uppercase tracking-wider text-center" style={{ fontStyle: 'italic' }}>
                {offerMessages[currentOfferIndex].title}
              </h3>
              <div className="flex items-center gap-3 sm:gap-5">
                <span className="bg-amber-400 text-emerald-900 text-[8px] sm:text-[9px] uppercase tracking-widest font-extrabold px-3 py-0.5 rounded-full whitespace-nowrap">
                  {offerMessages[currentOfferIndex].sub}
                </span>
                <span className="hidden sm:block text-white/40 font-light">|</span>
                <Link to="/products" className="text-white/80 hover:text-white text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold transition-colors">
                  Shop Collection →
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ HERO IMAGE CAROUSEL ═══ */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden bg-stone-900">
        {/* Slides */}
        {DEFAULT_HERO_SLIDES.map((slide, i) => (
          <motion.div
            key={`hero-slide-${i}`}
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
              fetchPriority={i === 0 ? "high" : "auto"}
              loading={i === 0 ? "eager" : "lazy"}
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
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white uppercase leading-[0.95] tracking-tight mb-4">
                  {slide.title}
                </h1>
                <p className="text-white/60 text-sm sm:text-base font-light mb-8">
                  {slide.desc}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                   <div className="flex items-center gap-2 text-white/40 text-[8px] uppercase tracking-widest font-bold border border-white/10 px-3 py-1.5 rounded-full">
                     <CheckCircle2 size={10} className="text-emerald-500" /> GST Billing
                   </div>
                   <div className="flex items-center gap-2 text-white/40 text-[8px] uppercase tracking-widest font-bold border border-white/10 px-3 py-1.5 rounded-full">
                     <CheckCircle2 size={10} className="text-emerald-500" /> PAN India Delivery
                   </div>
                   <div className="flex items-center gap-2 text-white/40 text-[8px] uppercase tracking-widest font-bold border border-white/10 px-3 py-1.5 rounded-full">
                     <CheckCircle2 size={10} className="text-emerald-500" /> Custom Branding
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setIsQuotationModalOpen(true)}
                    className="inline-flex items-center justify-center gap-3 bg-white text-stone-900 px-8 py-4 rounded-lg font-extrabold text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg"
                  >
                    <Send size={14} />
                    Get Bulk Quote
                  </button>
                  <a
                    href="https://wa.me/917909096738?text=Hi, I need a catalog and bulk quote for corporate gifting."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-stone-900/40 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-lg font-extrabold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    <MessageSquare size={14} />
                    WhatsApp Inquiry
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}

        {/* Navigation Arrows */}
        {DEFAULT_HERO_SLIDES.length > 1 && (
          <>
            <button
              onClick={() => setHeroSlide(prev => (prev === 0 ? DEFAULT_HERO_SLIDES.length - 1 : prev - 1))}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-20"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setHeroSlide(prev => (prev === DEFAULT_HERO_SLIDES.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-20"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {DEFAULT_HERO_SLIDES.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {DEFAULT_HERO_SLIDES.map((_, i) => (
              <button
                key={`hero-dot-${i}`}
                onClick={() => setHeroSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${heroSlide === i ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ═══ TRUST / USP STRIP ═══ */}
      <section className="bg-stone-50 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-stone-200">
            {[
              { icon: Truck, title: 'Bulk Logistics', desc: 'Pan-India doorstep delivery' },
              { icon: Package, title: 'Custom Branding', desc: 'Logo & message integration' },
              { icon: ShieldCheck, title: 'Premium Quality', desc: 'Quality checked assurance' },
              { icon: CreditCard, title: 'Tax Benefits', desc: 'GST invoicing & compliance' },
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
        <div className="flex items-center justify-between border-b border-stone-100 pb-8 mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 uppercase tracking-tight">Shop By Category</h2>
          <Link to="/products" className="group flex items-center gap-2 text-stone-400 hover:text-stone-900 text-[10px] uppercase tracking-[0.2em] font-black transition-all">
            View All
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>

        {/* Category Pills - Scrollable on mobile, wrap on desktop */}
        <div className="relative mb-12">
          <div className="flex overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap gap-3 sm:gap-4 scroll-smooth">
            <button
              onClick={() => handleCategoryChange('All')}
              className={`px-6 py-2.5 rounded-lg text-[10px] sm:text-[11px] font-black uppercase whitespace-nowrap transition-all duration-300 shadow-sm border ${selectedCategory === 'All'
                ? 'bg-stone-900 text-white border-stone-900 shadow-stone-200 ring-2 ring-stone-900/10'
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-900 hover:shadow-md'
                }`}
            >
              All
            </button>
            {categories
              .filter(cat => cat.name.toLowerCase() !== 'uncategorized' && cat.count > 0)
              .map((cat) => {
                const decodedName = decodeHtml(cat.name);
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(decodedName)}
                    className={`px-6 py-2.5 rounded-lg text-[10px] sm:text-[11px] font-black uppercase whitespace-nowrap transition-all duration-300 shadow-sm border ${selectedCategory === decodedName
                      ? 'bg-stone-900 text-white border-stone-900 shadow-stone-200 ring-2 ring-stone-900/10'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-900 hover:shadow-md'
                      }`}
                  >
                    {decodedName}
                  </button>
                );
              })}
          </div>
          {/* Subtle fade indicator for mobile scroll */}
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden" />
        </div>

        {/* Filtered Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-16 min-h-[400px]">
          {loading ? (
            // Skeleton Loader
            Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-stone-100 rounded-2xl mb-4" />
                  <div className="h-4 bg-stone-100 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-stone-100 rounded w-1/3" />
                </div>
              ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-stone-400 font-medium">No products found in this category.</p>
            </div>
          )}
        </div>

      </section>

      {/* ═══ SHOP BY BUDGET ═══ */}
      <section className="bg-stone-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-800 text-[10px] uppercase tracking-[0.5em] font-bold mb-3 block">Gift by Value</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900">Shop by <span className="italic">Budget</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Under ₹500', min: 0, max: 500, image: '/budget1.png' },
              { label: '₹500 - ₹1000', min: 500, max: 1000, image: '/budget2.png' },
              { label: '₹1000 - ₹2000', min: 1000, max: 2000, image: '/budget3.png' },
              { label: 'Premium Gifts', min: 2000, max: 50000, image: '/budget4.png' },
            ].map((budget, i) => (
              <Link
                key={`budget-${budget.label}`}
                to={`/products?min_price=${budget.min}&max_price=${budget.max}`}
                className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <img
                  src={budget.image}
                  alt={budget.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-white text-xl font-serif italic mb-1">{budget.label}</h3>
                  <span className="text-[9px] text-white/60 uppercase tracking-widest font-bold border-b border-white/20 pb-1 group-hover:border-white transition-colors">Explore Collection</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CORPORATE & CUSTOMIZATION SERVICES ═══ */}
      <section id="corporate-services" className="bg-stone-900 py-24 md:py-32 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-emerald-400 text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">B2B Solutions</span>
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">
                Corporate <span className="italic text-emerald-400">Gifting</span> Redefined
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'Custom Branding', desc: 'Logo printing, precision engraving, or metal branding options for every item.' },
                  { title: 'Bulk Logistics', desc: 'Direct shipping to multiple addresses across the country with real-time tracking.' },
                  { title: 'Bespoke Packaging', desc: 'Choose from our existing premium sets or work with us for unique, company-branded wraps.' },
                  { title: 'Tax Benefits', desc: 'Full GST invoicing for all corporate orders to help with your business accounting.' },
                ].map((service, i) => (
                  <div key={`service-${service.title}`} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-1">{service.title}</h4>
                      <p className="text-stone-400 text-sm font-light">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden"
            >
              <img
                src="/Hero1.jpg"
                alt="Corporate Gifting"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-white italic font-light mb-4">"The quality and presentation of the gift sets exceeded our expectations. Our partners were truly impressed."</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">HR</div>
                  <p className="text-white text-xs font-bold uppercase tracking-widest">Global Tech Solutions</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TRUSTED BY CORPORATE GIANTS ═══ */}
      <section className="py-16 bg-white border-b border-stone-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-stone-400 text-[10px] uppercase tracking-[0.5em] font-bold mb-12">Trusted by 500+ Global Brands</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <span className="text-2xl font-black tracking-tighter">ACCENTURE</span>
             <span className="text-2xl font-black tracking-tighter">GOOGLE</span>
             <span className="text-2xl font-black tracking-tighter">DELOITTE</span>
             <span className="text-2xl font-black tracking-tighter">MICROSOFT</span>
             <span className="text-2xl font-black tracking-tighter">AMAZON</span>
          </div>
        </div>
      </section>

      {/* ═══ THE CORPORATE GIFTING PROCESS ═══ */}
      <section className="py-24 md:py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-emerald-800 text-[10px] uppercase tracking-[0.5em] font-bold mb-3 block">How it Works</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900">Our <span className="italic">Seamless</span> Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-[1px] bg-stone-200 -z-10" />
            
            {[
              { step: '01', title: 'Curate & Consult', desc: 'Choose from our collections or work with our specialists to create a bespoke gifting suite.' },
              { step: '02', title: 'Brand & Personalize', desc: 'Our in-house studio applies your logo with precision using laser, UV, or traditional techniques.' },
              { step: '03', title: 'Global Logistics', desc: 'We handle individual doorstep delivery across the country with real-time tracking.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-white border border-stone-100 flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:bg-stone-900 group-hover:text-white transition-all duration-500">
                  <span className="text-xl font-serif italic">{item.step}</span>
                </div>
                <h3 className="text-stone-900 font-bold text-sm uppercase tracking-wider mb-4">{item.title}</h3>
                <p className="text-stone-500 text-sm font-light leading-relaxed px-4">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CORPORATE FAQ ═══ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-stone-400 text-[10px] uppercase tracking-[0.5em] font-bold mb-3 block">Support</span>
            <h2 className="text-4xl font-serif text-stone-900 italic">Frequently Asked <span className="not-italic">Questions</span></h2>
          </div>

          <div className="space-y-8">
            {[
              { q: 'What is the Minimum Order Quantity (MOQ)?', a: 'Our standard MOQ is 25 units for most items. However, for fully customized hampers, we recommend at least 50 units for the best pricing.' },
              { q: 'Do you offer GST Invoicing?', a: 'Yes, we provide full GST-compliant B2B invoices for all corporate orders to ensure you can claim tax credits.' },
              { q: 'How long does custom branding take?', a: 'Typically, branding adds 3-5 business days to your order timeline, depending on the complexity and volume.' },
              { q: 'Can you ship directly to my employees?', a: 'Absolutely. We specialize in individual doorstep delivery (PAN India) for remote teams and event attendees.' },
            ].map((item, i) => (
              <div key={i} className="pb-8 border-b border-stone-100">
                <h4 className="text-stone-900 font-bold text-sm mb-3">{item.q}</h4>
                <p className="text-stone-500 text-sm font-light leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-stone-400 text-xs mb-6">Have more questions?</p>
            <a href="https://wa.me/917909096738" className="inline-flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest border-b border-emerald-100 pb-1 hover:border-emerald-600 transition-all">
              Chat with a Specialist
            </a>
          </div>
        </div>
      </section>

      {/* ═══ RAMADAN SPECIAL BANNER (Updated for Corporate Focus) ═══ */}
      <section className="relative overflow-hidden">
        <div className="bg-white py-16 md:py-20 border-y border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center md:text-left"
              >
                <span className="text-stone-400 text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block">Volume Orders</span>
                <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-3">
                  Bulk <span className="italic text-emerald-800">Inquiry</span>
                </h2>
                <p className="text-stone-500 font-light max-w-md">
                  Planning for a large event or festive season? Get a custom quote for bulk requirements.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <a
                  href="#inquiry"
                  className="group inline-flex items-center gap-3 bg-stone-900 text-white px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-900 transition-all duration-300 shadow-xl hover:-translate-y-0.5"
                >
                  <span>Request Quote</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
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

      {/* ═══ EDITORIAL STORY (DYNAMIC) ═══ */}
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
                  src={latestPosts[0]?.image || "/Hero14.jpg"}
                  alt={latestPosts[0]?.imageAlt || "Editorial Story"}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-900/50 rounded-full blur-[100px] -z-10" />
            </div>

            <div className="space-y-10">
              <span className="text-emerald-400 text-[10px] uppercase tracking-[0.5em] font-bold block">Our Philosophy</span>
              <h2 className="text-5xl md:text-7xl font-serif leading-[1.1] tracking-tight">
                {latestPosts[0] ? (
                  latestPosts[0].title.split(' ').map((word, i) => (
                    <React.Fragment key={`title-word-${i}`}>
                      {i === 1 ? <span className="italic text-emerald-400">{word} </span> : word + ' '}
                      {i === 1 && <br />}
                    </React.Fragment>
                  ))
                ) : (
                  <>
                    Crafting <br />
                    <span className="italic text-emerald-400">Timeless</span> <br />
                    Narratives.
                  </>
                )}
              </h2>
              <div
                className="text-stone-400 text-lg leading-relaxed font-light max-w-md line-clamp-4"
                dangerouslySetInnerHTML={{ __html: latestPosts[0]?.excerpt || latestPosts[0]?.content || "Urban Shark is more than a store. It is a sanctuary for those who seek beauty in the professional journey, and meaning in the curation. Every piece is selected for its excellence." }}
              />
              <div className="pt-6">
                <Link to={`/blog/${latestPosts[0]?.id}`} className="group flex items-center space-x-4 text-white hover:text-emerald-400 transition-colors">
                  <span className="text-xs uppercase tracking-widest font-bold">Read Our Story</span>
                  <div className="w-12 h-[1px] bg-white/30 group-hover:w-20 group-hover:bg-emerald-400 transition-all duration-500" />
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
      <section className="bg-stone-50 py-24 md:py-40 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-emerald-800 text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Testimonials</span>
              <h2 className="text-5xl md:text-8xl font-serif text-stone-900 leading-none">
                What Our <span className="italic text-emerald-700">Partners</span> <br />Are Saying.
              </h2>
            </div>
            <p className="text-stone-500 max-w-sm font-light leading-relaxed pb-2 border-l border-stone-200 pl-8">
              Join 500+ global brands who trust Urban Shark for their executive gifting and employee milestone celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {(reviews.length > 0 ? reviews : [
              {
                id: '1',
                reviewer: 'Ananya Sharma',
                review: 'The executive edit bags are a league apart. The quality of leather and the precision of our logo branding was flawless. Our leadership team was truly impressed.',
                rating: 5,
                dateCreated: '',
                productId: '',
                verified: true,
                role: 'Procurement Head, Tech Global'
              },
              {
                id: '2',
                reviewer: 'Vikram Malhotra',
                review: 'Urban Shark has simplified our festive gifting at scale. From individual doorstep delivery to custom packaging, their team handled everything with white-glove service.',
                rating: 5,
                dateCreated: '',
                productId: '',
                verified: true,
                role: 'VP Operations, FinCorp'
              },
              {
                id: '3',
                reviewer: 'Priya Iyer',
                review: 'The tech hampers we ordered for our new joiners were stunning. Sleek, functional, and perfectly branded. It has significantly elevated our onboarding experience.',
                rating: 5,
                dateCreated: '',
                productId: '',
                verified: true,
                role: 'Culture Lead, Creative Studio'
              },
            ]).slice(0, 3).map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="group relative"
              >
                <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-stone-200/50 hover:shadow-emerald-900/5 transition-all duration-700 border border-stone-100 flex flex-col h-full">
                  <div className="flex gap-1 mb-8">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  
                  <Quote size={64} className="text-emerald-50 absolute top-12 right-12 -z-10 group-hover:text-emerald-100 transition-colors duration-700" />
                  
                  <p className="text-stone-600 text-lg leading-relaxed mb-12 font-light flex-grow">
                    "{review.review}"
                  </p>
                  
                  <div className="flex items-center gap-4 pt-8 border-t border-stone-50">
                    <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center text-white font-serif italic text-lg shadow-xl shadow-stone-900/20">
                      {review.reviewer.charAt(0)}
                    </div>
                    <div>
                      <div className="text-stone-900 font-bold text-sm tracking-tight">{review.reviewer}</div>
                      <div className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">{(review as any).role || 'Corporate Partner'}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PERSONALIZATION & BRANDING (CINEMATIC) ═══ */}
      <section className="py-24 md:py-40 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-7 relative">
              <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
              
              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="space-y-6 pt-16">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]"
                  >
                    <img src="/Hero6.jpg" alt="Branding Precision" className="w-full h-full object-cover" />
                  </motion.div>
                  <div className="aspect-square rounded-[3rem] bg-stone-950 flex flex-col items-center justify-center p-10 text-center">
                    <Sparkles className="text-emerald-400 mb-6" size={40} />
                    <p className="text-white text-[10px] uppercase tracking-[0.4em] font-bold">Premium <br />Finishing</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="aspect-square rounded-[3rem] bg-stone-50 border border-stone-100 flex items-center justify-center p-12">
                    <img src="/logo.png" alt="Branding" className="w-full h-auto opacity-20 grayscale" />
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]"
                  >
                    <img src="/Hero1.jpg" alt="Branding Excellence" className="w-full h-full object-cover" />
                  </motion.div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5">
              <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-8 block">Bespoke Identity</span>
              <h2 className="text-5xl md:text-8xl font-serif text-stone-900 mb-10 leading-[0.9] tracking-tighter">
                Your Brand, <br />
                <span className="italic text-stone-400">Our Canvas.</span>
              </h2>
              <p className="text-stone-500 text-xl font-light mb-16 leading-relaxed">
                We elevate corporate gifting from a gesture to an experience. Our in-house branding studio utilizes state-of-the-art technology to ensure your identity is flawlessly integrated into every piece.
              </p>
              
              <div className="grid gap-10">
                {[
                  { title: 'Laser Precision', desc: 'Sleek, permanent logo engraving for tech and hardware products.' },
                  { title: 'Bespoke Packaging', desc: 'Custom sleeves, branded ribbons, and personalized cards for every hamper.' },
                  { title: 'PAN India Logistics', desc: 'White-glove doorstep delivery directly to your employees or partners.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center flex-shrink-0 group-hover:bg-stone-900 group-hover:text-white transition-all duration-500">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-stone-900 font-bold text-sm uppercase tracking-[0.2em] mb-2">{item.title}</h4>
                      <p className="text-stone-400 text-sm font-light leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ UNRIVALED CORPORATE SOLUTIONS (FULL IMMERSIVE) ═══ */}
      <section className="py-24 md:py-48 bg-stone-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-600/5 rounded-full blur-[180px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-32">
            <span className="text-emerald-500 text-[10px] uppercase tracking-[0.6em] font-bold mb-8 block">The Urban Shark Standard</span>
            <h2 className="text-6xl md:text-[10rem] font-serif text-white mb-10 tracking-tighter leading-none">
              Unrivaled <span className="italic text-stone-500">Excellence.</span>
            </h2>
            <div className="h-px w-24 bg-emerald-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { num: '01', title: 'Strategic Curation', desc: 'We help you plan your annual gifting calendar to maximize impact and ROI.' },
              { num: '02', title: 'Global Sourcing', desc: 'Access to exclusive premium products sourced directly from global luxury manufacturers.' },
              { num: '03', title: 'Seamless Fulfillment', desc: 'Real-time tracking and automated reporting for large-scale corporate distributions.' }
            ].map((item, i) => (
              <div key={i} className="group cursor-default">
                <div className="text-emerald-500 font-serif italic text-4xl mb-8 group-hover:translate-x-2 transition-transform duration-500">{item.num}</div>
                <h4 className="text-white text-2xl font-serif mb-6">{item.title}</h4>
                <p className="text-stone-500 font-light leading-relaxed mb-10 group-hover:text-stone-300 transition-colors">{item.desc}</p>
                <div className="w-full h-px bg-white/10 group-hover:bg-emerald-500/50 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DEDICATED QUICK INQUIRY (GLASSMORPHISM) ═══ */}
      <section id="inquiry" className="py-24 md:py-40 bg-stone-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[4rem] p-10 md:p-24 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.1)] border border-stone-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] -mr-96 -mt-96" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start relative z-10">
              <div className="lg:col-span-5">
                <span className="text-emerald-700 text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">Ready to Begin?</span>
                <h2 className="text-5xl md:text-7xl font-serif text-stone-900 mb-10 leading-none">
                  Start Your <br /><span className="italic text-emerald-700">Journey.</span>
                </h2>
                <p className="text-stone-500 text-lg font-light mb-16 leading-relaxed">
                  Our specialists are ready to curate the perfect gifting suite for your brand. Submit an inquiry and receive a custom proposal within 2 business hours.
                </p>
                
                <div className="space-y-10">
                  <a href="tel:+917909096738" className="flex items-center gap-6 group">
                    <div className="w-16 h-16 rounded-[2rem] bg-stone-50 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all duration-500 shadow-sm">
                      <Phone size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">Direct Line</div>
                      <div className="text-stone-900 font-bold text-lg">+91 79090 96738</div>
                    </div>
                  </a>
                  <a href="mailto:support@corporategifting.store" className="flex items-center gap-6 group">
                    <div className="w-16 h-16 rounded-[2rem] bg-stone-50 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all duration-500 shadow-sm">
                      <Mail size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">Expert Support</div>
                      <div className="text-stone-900 font-bold text-lg">support@corporategifting.store</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-stone-50/50 backdrop-blur-sm rounded-[3rem] p-10 md:p-16 border border-white">
                  <AnimatePresence mode="wait">
                    {formSubmitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-12 text-center"
                      >
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-700">
                          <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-4xl font-serif text-stone-900 mb-4">Request Sent.</h3>
                        <p className="text-stone-500 font-light text-lg">An expert will contact you shortly to begin your curation.</p>
                        <button 
                          onClick={() => setFormSubmitted(false)} 
                          className="mt-12 text-emerald-700 font-bold text-[10px] uppercase tracking-[0.3em] border-b border-emerald-200 pb-1 hover:border-emerald-700 transition-all"
                        >
                          Submit Another Inquiry
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form 
                        onSubmit={handleInquirySubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                      >
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-2">Full Name</label>
                          <input
                            required
                            type="text"
                            value={inquiryData.fullName}
                            onChange={e => setInquiryData({...inquiryData, fullName: e.target.value})}
                            placeholder="Alex Morgan"
                            className="w-full bg-white border-none rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-emerald-500/20 shadow-sm placeholder:text-stone-300 font-light"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-2">Work Email</label>
                          <input
                            required
                            type="email"
                            value={inquiryData.email}
                            onChange={e => setInquiryData({...inquiryData, email: e.target.value})}
                            placeholder="alex@company.com"
                            className="w-full bg-white border-none rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-emerald-500/20 shadow-sm placeholder:text-stone-300 font-light"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-2">Organization</label>
                          <input
                            required
                            type="text"
                            value={inquiryData.companyName}
                            onChange={e => setInquiryData({...inquiryData, companyName: e.target.value})}
                            placeholder="Global Innovations Inc."
                            className="w-full bg-white border-none rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-emerald-500/20 shadow-sm placeholder:text-stone-300 font-light"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-2">Volume Requirement</label>
                          <select
                            required
                            value={inquiryData.quantity}
                            onChange={e => setInquiryData({...inquiryData, quantity: e.target.value})}
                            className="w-full bg-white border-none rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-emerald-500/20 shadow-sm appearance-none font-light"
                          >
                            <option value="">Select Scale</option>
                            <option value="25-100">25 - 100 Units</option>
                            <option value="100-500">100 - 500 Units</option>
                            <option value="500-1000">500 - 1000 Units</option>
                            <option value="1000+">1000+ Units</option>
                          </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-2">Your Vision</label>
                          <textarea
                            rows={4}
                            value={inquiryData.requirements}
                            onChange={e => setInquiryData({...inquiryData, requirements: e.target.value})}
                            placeholder="Tell us about the occasion or specific requirements..."
                            className="w-full bg-white border-none rounded-2xl px-8 py-5 text-sm focus:ring-2 focus:ring-emerald-500/20 shadow-sm resize-none placeholder:text-stone-300 font-light"
                          />
                        </div>
                        <div className="md:col-span-2 pt-6">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-20 bg-stone-900 text-white rounded-[2rem] font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-emerald-900 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-4 group"
                          >
                            {isSubmitting ? (
                              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Initialize Proposal
                              </>
                            )}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Quotation Modal */}
      <QuotationForm
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
        items={items}
        onSuccess={() => {}}
      />

    </div>
  );
};

export default Home;
