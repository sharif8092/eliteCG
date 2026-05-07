import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { categoryService, Category } from '../services/categoryService';
import Skeleton from '../components/Skeleton';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import SEO from '../components/SEO';

const ITEMS_PER_PAGE = 12;

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const searchQueryParam = searchParams.get('search');
  const filterParam = searchParams.get('filter');
  const minPriceParam = searchParams.get('min_price');
  const maxPriceParam = searchParams.get('max_price');
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryFilter ? [categoryFilter] : []);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'newest' | 'name-az' | 'name-za'>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync filters from URL params
  useEffect(() => {
    if (categoryFilter) {
      setSelectedCategories([categoryFilter]);
    } else if (categoryFilter === null) {
      setSelectedCategories([]);
    }

    if (minPriceParam || maxPriceParam) {
      setPriceRange([
        minPriceParam ? parseInt(minPriceParam) : 0,
        maxPriceParam ? parseInt(maxPriceParam) : 10000
      ]);
    }
  }, [categoryFilter, minPriceParam, maxPriceParam]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, sortBy, priceRange, onlyInStock, searchQueryParam]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search Filter
    if (searchQueryParam) {
      const query = searchQueryParam.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.categories.some(cat => cat.toLowerCase().includes(query))
      );
    }

    // Category Filter
    if (selectedCategories.length > 0) {
      const normalizedSelected = selectedCategories.map(c => c.toLowerCase());
      result = result.filter(p =>
        p.categories.some(cat => normalizedSelected.includes(cat.toLowerCase()))
      );
    }

    // Price Filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating Filter
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // Availability Filter
    if (onlyInStock) {
      result = result.filter(p => p.stock > 0);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-za') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'newest') {
      // Use numeric ID as a proxy for date since WooCommerce usually increments IDs
      result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }

    // New Arrivals Filter - Show only last 20
    if (filterParam === 'new-arrivals') {
      result = result.slice(0, 20);
    }

    return result;
  }, [products, selectedCategories, sortBy, priceRange, minRating, onlyInStock, searchQueryParam, filterParam]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const seoData = useMemo(() => {
    if (searchQueryParam) {
      return {
        title: `Search results for "${searchQueryParam}"`,
        description: `Explore corporate gifting options matching "${searchQueryParam}". Find the perfect bespoke gifts for your business needs.`
      };
    }
    if (categoryFilter) {
      return {
        title: `Premium ${categoryFilter} Collection`,
        description: `Browse our curated selection of premium ${categoryFilter.toLowerCase()}. Perfect for corporate gifting, employee appreciation, and professional events.`
      };
    }
    if (filterParam === 'new-arrivals') {
      return {
        title: "New Arrivals - Latest Corporate Gifts",
        description: "Discover our newest corporate gift collections. Freshly landed items for your next business event or employee welcome kit."
      };
    }
    return {
      title: "Browse Corporate Gift Collection",
      description: "Explore Urban Shark's complete range of premium corporate gifts. From tech kits to executive hampers, find the ideal gifts for your professional network."
    };
  }, [categoryFilter, searchQueryParam, filterParam]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <SEO 
        title={seoData.title}
        description={seoData.description}
        ogType="website"
      />
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 space-y-8 md:space-y-0">
        <div className="max-w-xl">
          <span className="text-emerald-800 text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">
            {searchQueryParam ? 'Search Results' : filterParam === 'new-arrivals' ? 'Just Landed' : 'The Collection'}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-stone-900 leading-tight">
            {searchQueryParam ? (
              <>Results for "<span className="italic">{searchQueryParam}</span>"</>
            ) : filterParam === 'new-arrivals' ? (
              <>New <span className="italic">Arrivals</span></>
            ) : (
              <>All <span className="italic">Objects</span></>
            )}
          </h1>
          <p className="text-stone-500 mt-6 font-light">
            {filterParam === 'new-arrivals'
              ? `Our latest ${filteredProducts.length} pieces, freshly arrived.`
              : `${filteredProducts.length} items ${searchQueryParam ? 'found' : 'curated for you'}`}
          </p>
        </div>

        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3 border-b border-stone-200 pb-2">
            <SlidersHorizontal size={14} className="text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-[10px] uppercase tracking-widest font-bold text-stone-900 focus:outline-none bg-transparent cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
              <option value="name-za">Name: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-20">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-16">
          {/* Categories */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-900 mb-8">
              Categories
            </h3>
            <div className="space-y-4">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center group cursor-pointer">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                      className="sr-only"
                    />
                    <motion.div
                      animate={{
                        backgroundColor: selectedCategories.includes(cat.name) ? '#1c1917' : '#ffffff',
                        borderColor: selectedCategories.includes(cat.name) ? '#1c1917' : '#e7e5e4'
                      }}
                      className="w-4 h-4 border transition-all rounded-sm flex items-center justify-center"
                    >
                      <AnimatePresence>
                        {selectedCategories.includes(cat.name) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="w-1.5 h-1.5 bg-white rounded-full"
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                  <span className={`ml-4 text-[11px] uppercase tracking-widest transition-all ${selectedCategories.includes(cat.name) ? 'text-stone-900 font-bold' : 'text-stone-400 group-hover:text-stone-600'}`}>
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-900 mb-8">
              Price Range
            </h3>
            <div className="space-y-6">
              <motion.input
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="range"
                min="0"
                max="10000"
                step="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-900"
              />
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-stone-400">
                <span>₹{priceRange[0]}</span>
                <span>Up to ₹{priceRange[1]}</span>
              </div>
              
              {/* Quick Budget Filters */}
              <div className="pt-4 grid grid-cols-1 gap-2">
                {[
                  { label: 'Under ₹500', min: 0, max: 500 },
                  { label: '₹500 - ₹1000', min: 500, max: 1000 },
                  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
                  { label: '₹2000+', min: 2000, max: 10000 },
                ].map((b, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPriceRange([b.min, b.max])}
                    className={`text-left text-[9px] uppercase tracking-widest py-2 px-3 rounded-lg border transition-all ${
                      priceRange[0] === b.min && priceRange[1] === b.max
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'text-stone-400 border-stone-100 hover:border-stone-200'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-900 mb-8">
              Minimum Rating
            </h3>
            <div className="space-y-4">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center group cursor-pointer">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="sr-only"
                    />
                    <motion.div
                      animate={{
                        backgroundColor: minRating === rating ? '#1c1917' : '#ffffff',
                        borderColor: minRating === rating ? '#1c1917' : '#e7e5e4'
                      }}
                      className="w-4 h-4 border transition-all rounded-full flex items-center justify-center"
                    >
                      <AnimatePresence>
                        {minRating === rating && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="w-1.5 h-1.5 bg-white rounded-full"
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                  <div className="ml-4 flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill={i < rating ? "currentColor" : "none"} className={i < rating ? "" : "text-stone-200"} />
                      ))}
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest transition-all ${minRating === rating ? 'text-stone-900 font-bold' : 'text-stone-400 group-hover:text-stone-600'}`}>
                      & Up
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-900 mb-8">
              Availability
            </h3>
            <label className="flex items-center group cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={() => setOnlyInStock(!onlyInStock)}
                  className="sr-only"
                />
                <motion.div
                  animate={{
                    backgroundColor: onlyInStock ? '#1c1917' : '#ffffff',
                    borderColor: onlyInStock ? '#1c1917' : '#e7e5e4'
                  }}
                  className="w-4 h-4 border transition-all rounded-sm flex items-center justify-center"
                >
                  <AnimatePresence>
                    {onlyInStock && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              <span className={`ml-4 text-[11px] uppercase tracking-widest transition-all ${onlyInStock ? 'text-stone-900 font-bold' : 'text-stone-400 group-hover:text-stone-600'}`}>
                In Stock Only
              </span>
            </label>
          </div>

          <button
            onClick={() => {
              setSelectedCategories([]);
              setPriceRange([0, 10000]);
              setMinRating(0);
              setOnlyInStock(false);
              setSortBy('newest');
            }}
            className="text-[9px] uppercase tracking-widest font-bold text-emerald-800 border-b border-emerald-800/30 pb-1 hover:border-emerald-800 transition-all"
          >
            Reset All Filters
          </button>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-6">
                  <Skeleton className="aspect-[3/4] rounded-[3rem]" />
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                {paginatedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-32">
                  <p className="text-stone-400 font-serif italic text-2xl">No pieces found in this edit.</p>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-24 flex items-center justify-center space-x-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center space-x-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-12 h-12 rounded-full text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-900'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-8 right-8 z-10 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 aspect-[4/5] bg-stone-100">
                <img
                  src={quickViewProduct.images[0]}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="w-full md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
                <div className="space-y-8">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400 mb-4 block">
                      {quickViewProduct.categories.join(' · ')}
                    </span>
                    <h2 className="text-4xl font-serif text-stone-900 leading-tight mb-4">
                      {quickViewProduct.name}
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < Math.floor(quickViewProduct.rating) ? "currentColor" : "none"}
                            className={i < Math.floor(quickViewProduct.rating) ? "" : "text-stone-200"}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                        {quickViewProduct.rating} / 5.0 ({quickViewProduct.reviewCount})
                      </span>
                    </div>
                  </div>

                  <p className="text-3xl font-serif italic text-stone-900">
                    ₹{quickViewProduct.price.toLocaleString()}
                  </p>

                  <div
                    className="text-stone-500 font-light leading-relaxed product-description"
                    dangerouslySetInnerHTML={{ __html: quickViewProduct.description }}
                  />

                  <div className="pt-8 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        addToCart(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className="flex-grow bg-stone-900 text-white py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all shadow-2xl flex items-center justify-center gap-3"
                    >
                      <ShoppingBag size={16} />
                      Add to Bag
                    </button>
                    <Link
                      to={`/product/${quickViewProduct.id}`}
                      className="px-8 py-5 border border-stone-100 rounded-full font-bold text-[10px] uppercase tracking-widest text-stone-900 hover:bg-stone-50 transition-all text-center"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
