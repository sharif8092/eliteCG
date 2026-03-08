import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import FileUpload from '../../components/admin/FileUpload';
import { productService } from '../../services/productService';
import { categoryService, Category as WooCommerceCategory } from '../../services/categoryService';
import { Product } from '../../types';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Filter,
    MoreVertical,
    X,
    Loader2,
    Image as ImageIcon,
    Check,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [categories, setCategories] = useState<WooCommerceCategory[]>([]);

    // Form State
    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        categories: [],
        images: [],
        imageAlts: [],
        stock: 0,
        featured: false,
        rating: 5,
        reviewCount: 0
    });

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const [productsData, categoriesData] = await Promise.all([
                    productService.getAllProducts(),
                    categoryService.getAllCategories()
                ]);
                setProducts(productsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error initializing data:', error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                originalPrice: product.originalPrice || 0,
                categories: product.categories,
                images: product.images || [],
                imageAlts: product.imageAlts || [],
                stock: product.stock,
                featured: product.featured || false,
                rating: product.rating,
                reviewCount: product.reviewCount
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: 0,
                originalPrice: 0,
                categories: categories[0] ? [categories[0].name] : [],
                images: [],
                imageAlts: [],
                stock: 0,
                featured: false,
                rating: 5,
                reviewCount: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, formData);
            } else {
                await productService.addProduct(formData);
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        try {
            await productService.deleteProduct(id);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        } finally {
            setIsDeleting(null);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminLayout title="Product Management">
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-sans"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-50 transition-all font-sans">
                            <Filter size={18} />
                            Filter
                        </button>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-900 shadow-lg shadow-stone-900/10 transition-all font-sans"
                        >
                            <Plus size={18} />
                            Add Product
                        </button>
                    </div>
                </div>

                {/* Product Table */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50/50 border-b border-stone-100">
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">Product</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">Category</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">Price</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">Inventory</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {loading && products.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <Loader2 className="animate-spin inline-block text-emerald-600 mb-2" size={24} />
                                            <p className="text-sm text-stone-400 font-medium">Loading inventory...</p>
                                        </td>
                                    </tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-stone-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <AlertCircle size={32} />
                                                <p className="text-sm font-medium">No products found matching your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-stone-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-100">
                                                        {product.images[0] ? (
                                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        ) : (
                                                            <ImageIcon className="w-full h-full p-3 text-stone-300" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-stone-900 line-clamp-1">{product.name}</p>
                                                        <p className="text-[10px] text-stone-400 font-medium uppercase tracking-tight mt-0.5 font-sans">ID: {product.id.slice(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold uppercase rounded-lg font-sans">
                                                    {product.categories.join(', ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-stone-900">₹{product.price.toLocaleString()}</span>
                                                    {product.originalPrice && product.originalPrice > product.price && (
                                                        <span className="text-[10px] text-stone-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                                    <span className="text-sm font-medium text-stone-700">{product.stock} in stock</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(product)}
                                                        className="p-2.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        disabled={isDeleting === product.id}
                                                        className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                                                    >
                                                        {isDeleting === product.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Product Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-stone-100 flex items-center justify-between bg-white">
                                <h3 className="text-xl font-serif italic font-bold text-stone-900">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-stone-50 rounded-full transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col h-[85vh] max-h-[850px]">
                                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Name */}
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Product Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-stone-900 font-sans"
                                                placeholder="e.g. Premium Silk Abaya"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        {/* Category */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Category</label>
                                            <select
                                                className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-stone-900 appearance-none font-sans"
                                                value={formData.categories[0] || ''}
                                                onChange={e => setFormData({ ...formData, categories: [e.target.value] })}
                                            >
                                                <option value="" disabled>Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Stock */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Stock Quantity</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-stone-900 font-sans"
                                                placeholder="0"
                                                value={formData.stock}
                                                onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                                            />
                                        </div>

                                        {/* Prices */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Sale Price (₹)</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-stone-900 font-sans"
                                                placeholder="0"
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Original Price (₹)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-stone-900 font-sans"
                                                placeholder="0"
                                                value={formData.originalPrice}
                                                onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                                            />
                                        </div>

                                        {/* Images Manager */}
                                        <div className="md:col-span-2 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Product Images Manager</label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({
                                                            ...formData,
                                                            images: [...formData.images, ''],
                                                            imageAlts: [...(formData.imageAlts || []), '']
                                                        });
                                                    }}
                                                    className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-100 transition-all font-sans"
                                                >
                                                    + Add Image
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {formData.images.map((img, idx) => (
                                                    <div key={idx} className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100 space-y-4 relative group">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newImages = formData.images.filter((_, i) => i !== idx);
                                                                const newAlts = (formData.imageAlts || []).filter((_, i) => i !== idx);
                                                                setFormData({ ...formData, images: newImages, imageAlts: newAlts });
                                                            }}
                                                            className="absolute -top-3 -right-3 p-2 bg-white text-red-500 shadow-lg rounded-full hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                        <FileUpload
                                                            label={`Product Image #${idx + 1}`}
                                                            path="products"
                                                            initialUrl={img}
                                                            onUploadComplete={(url) => {
                                                                const newImages = [...formData.images];
                                                                newImages[idx] = url;
                                                                setFormData({ ...formData, images: newImages });
                                                            }}
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Alt text for Google (SEO)"
                                                            className="w-full bg-white border-stone-100 rounded-xl px-4 py-3 text-xs outline-none font-sans"
                                                            value={formData.imageAlts?.[idx] || ''}
                                                            onChange={e => {
                                                                const newAlts = [...(formData.imageAlts || [])];
                                                                newAlts[idx] = e.target.value;
                                                                setFormData({ ...formData, imageAlts: newAlts });
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Product Description</label>
                                            <textarea
                                                required
                                                rows={6}
                                                className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-stone-900 resize-none font-sans"
                                                placeholder="Details, materials, sizing..."
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>

                                        {/* Featured */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                                                className={`w-12 h-6 rounded-full transition-all relative ${formData.featured ? 'bg-emerald-600' : 'bg-stone-200'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.featured ? 'left-7' : 'left-1'}`} />
                                            </button>
                                            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider font-sans">Featured in Home</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 border-t border-stone-100 flex items-center gap-4 bg-stone-50/30">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-stone-900 text-white rounded-2xl py-5 font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-stone-900/10 hover:bg-emerald-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-sans"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                        {editingProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-8 py-5 bg-stone-50 text-stone-400 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-stone-100 transition-all font-sans"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default ProductManagement;
