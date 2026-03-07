import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { MOCK_PRODUCTS } from '../../constants';
import { Search, Plus, Edit2, Trash2, Filter, MoreVertical } from 'lucide-react';

const ProductManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
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
                            placeholder="Search products by name or category..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-all">
                            <Filter size={18} />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all">
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
                                <tr className="bg-stone-50 border-b border-stone-200">
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-500">Product</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-500">Category</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-500">Price</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-500">Stock</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-stone-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-stone-900 line-clamp-1">{product.name}</p>
                                                    <p className="text-[10px] text-stone-400 font-medium uppercase tracking-tight">ID: {product.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold uppercase rounded-md">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-stone-900">
                                            ₹{product.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span className="text-sm text-stone-600">32 in stock</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="p-2 text-stone-400 hover:text-stone-900 transition-all">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Placeholder */}
                    <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between">
                        <p className="text-xs text-stone-500 font-medium">Showing {filteredProducts.length} of {MOCK_PRODUCTS.length} products</p>
                        <div className="flex items-center gap-2">
                            <button disabled className="px-3 py-1 border border-stone-200 rounded-lg text-xs font-semibold text-stone-400 cursor-not-allowed">Previous</button>
                            <button className="px-3 py-1 border border-stone-200 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ProductManagement;
