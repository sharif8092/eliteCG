import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { blogService } from '../../services/blogService';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { MOCK_PRODUCTS, MOCK_BLOGS } from '../../constants';
import {
    Users,
    ShoppingBag,
    TrendingUp,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Database,
    Loader2,
    CheckCircle2,
    AlertCircle,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminDashboard: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [productCount, setProductCount] = useState(0);
    const [blogCount, setBlogCount] = useState(0);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        const getCounts = async () => {
            const [products, blogs, allOrders, recent] = await Promise.all([
                productService.getAllProducts(),
                blogService.getAllPosts(),
                orderService.getAllOrders(),
                orderService.getRecentActivity()
            ]);
            setProductCount(products.length);
            setBlogCount(blogs.length);
            setTotalOrders(allOrders.length);
            setRecentOrders(recent);
        };
        getCounts();
    }, []);

    const handleRefreshData = async () => {
        setSyncStatus('idle');
        setLoading(true);
        try {
            const [products, blogs, allOrders, recent] = await Promise.all([
                productService.getAllProducts(),
                blogService.getAllPosts(),
                orderService.getAllOrders(),
                orderService.getRecentActivity()
            ]);
            setProductCount(products.length);
            setBlogCount(blogs.length);
            setTotalOrders(allOrders.length);
            setRecentOrders(recent);
            setSyncStatus('success');
            setTimeout(() => setSyncStatus('idle'), 3000);
        } catch (error) {
            console.error('Refresh error:', error);
            setSyncStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Total Sales', value: '₹124,500', icon: TrendingUp, change: '+12.5%', isPositive: true },
        { label: 'Active Orders', value: totalOrders > 0 ? totalOrders.toString() : '0', icon: ShoppingBag, change: '+5.2%', isPositive: true },
        { label: 'Live Products', value: productCount.toString(), icon: Database, change: '+5', isPositive: true },
        { label: 'News & Articles', value: blogCount.toString(), icon: FileText, change: '+3', isPositive: true },
    ];

    return (
        <AdminLayout title="Dashboard Overview">
            <div className="space-y-8">
                {/* Developer Tools / Sync Card */}
                <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-colors" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-serif italic mb-4">WooCommerce Connected</h2>
                            <p className="text-emerald-100/70 text-sm leading-relaxed font-light font-sans">
                                Your storefront is successfully connected to WooCommerce. All products, orders, and categories are synced in real-time. Use the button to refresh dashboard metrics.
                            </p>
                        </div>
                        <button
                            onClick={handleRefreshData}
                            disabled={loading}
                            className={`
                                flex items-center gap-3 px-8 py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all font-sans
                                ${syncStatus === 'success'
                                    ? 'bg-emerald-400 text-emerald-950'
                                    : syncStatus === 'error'
                                        ? 'bg-red-400 text-red-950'
                                        : 'bg-white text-emerald-950 hover:bg-emerald-50'}
                                shadow-xl disabled:opacity-50
                            `}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : syncStatus === 'success' ? (
                                <CheckCircle2 size={18} />
                            ) : syncStatus === 'error' ? (
                                <AlertCircle size={18} />
                            ) : (
                                <Database size={18} />
                            )}
                            {loading ? 'Refreshing...' : syncStatus === 'success' ? 'Data Refreshed' : 'Refresh Metrics'}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-7 rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-stone-50 text-stone-900 rounded-2xl">
                                    <stat.icon size={22} />
                                </div>
                                <div className={`flex items-center text-xs font-bold ${stat.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {stat.change}
                                    {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 font-sans">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-stone-900 mt-1">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders Placeholder */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-stone-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-stone-50 flex items-center justify-between">
                            <h3 className="font-bold text-stone-900 font-serif">Store Activity</h3>
                            <Link to="/admin/orders" className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700 font-sans">View History</Link>
                        </div>
                        <div className="p-8">
                            <div className="space-y-8">
                                {recentOrders.length === 0 ? (
                                    <div className="py-10 text-center text-stone-400 italic text-sm">No recent activity found.</div>
                                ) : (
                                    recentOrders.map((order) => (
                                        <Link to="/admin/orders" key={order.id} className="flex items-center justify-between group cursor-pointer">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                                    <ShoppingBag size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-stone-900 group-hover:text-emerald-600 transition-colors tracking-tight">Order #{order.id.toUpperCase()}</p>
                                                    <p className="text-xs text-stone-400 font-medium font-sans capitalize">{order.status} • {new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-stone-900">₹{order.total.toLocaleString()}</p>
                                                <p className="text-[10px] text-stone-400 font-bold uppercase font-sans">{order.items.length} items</p>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm p-8">
                        <h3 className="font-bold text-stone-900 mb-8 font-serif">Quick Controls</h3>
                        <div className="space-y-4">
                            <Link to="/admin/products" className="block w-full text-center py-4 bg-stone-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl shadow-stone-900/10">
                                Create New Product
                            </Link>
                            <Link to="/admin/offers" className="block w-full text-center py-4 bg-white text-stone-900 border border-stone-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 transition-all">
                                Launch Promotion
                            </Link>
                            <Link to="/admin/blogs" className="block w-full text-center py-4 bg-white text-emerald-800 border border-emerald-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all">
                                Write Blog Post
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
