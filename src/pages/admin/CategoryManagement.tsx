import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types';
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Loader2,
    Check,
    AlertCircle,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAllCategories();
            // Map the service response to our internal Category type if needed
            // But categoryService already returns Category[]
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingCategory) {
                await categoryService.updateCategory(Number(editingCategory.id), formData);
            } else {
                await categoryService.addCategory(formData);
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this category? This might affect products assigned to it.')) return;
        setIsDeleting(id);
        try {
            await categoryService.deleteCategory(Number(id));
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        } finally {
            setIsDeleting(null);
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Category Management">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-sans"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-900 shadow-lg shadow-stone-900/10 transition-all font-sans"
                    >
                        <Plus size={18} />
                        Add Category
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50/50 border-b border-stone-100">
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">Name</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">Slug</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">Product Count</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {loading && categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center">
                                            <Loader2 className="animate-spin inline-block text-emerald-600 mb-2" size={24} />
                                            <p className="text-sm text-stone-400 font-medium">Loading categories...</p>
                                        </td>
                                    </tr>
                                ) : filteredCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-stone-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <AlertCircle size={32} />
                                                <p className="text-sm font-medium">No categories found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCategories.map((category) => (
                                        <tr key={category.id} className="hover:bg-stone-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-stone-900">{category.name}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-stone-500 font-mono">{category.slug}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold uppercase rounded-lg">
                                                    {category.count || 0} Products
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(category)}
                                                        className="p-2.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
                                                        disabled={isDeleting === category.id}
                                                        className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                                                    >
                                                        {isDeleting === category.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
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

            {/* Modal */}
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
                            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-stone-100 flex items-center justify-between bg-white">
                                <h3 className="text-xl font-serif italic font-bold text-stone-900">
                                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-stone-50 rounded-full transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Category Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-stone-900 font-sans"
                                        placeholder="e.g. Abayas"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Description</label>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-stone-900 resize-none font-sans"
                                        placeholder="Category details..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-stone-900 text-white rounded-2xl py-4 font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-stone-900/10 hover:bg-emerald-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-sans"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                        {editingCategory ? 'Update' : 'Add'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-4 bg-stone-50 text-stone-400 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-stone-100 transition-all font-sans"
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

export default CategoryManagement;
