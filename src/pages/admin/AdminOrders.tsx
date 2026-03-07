import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import {
    ShoppingBag,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    Clock,
    Truck,
    AlertCircle,
    Loader2,
    X,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            fetchOrders();
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'processing': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-stone-50 text-stone-700 border-stone-100';
        }
    };

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'delivered': return <CheckCircle2 size={12} />;
            case 'shipped': return <Truck size={12} />;
            case 'processing': return <Clock size={12} />;
            case 'cancelled': return <AlertCircle size={12} />;
            default: return <Clock size={12} />;
        }
    };

    const filteredOrders = orders.filter(o =>
        (o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.userId.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterStatus === 'all' || o.status === filterStatus)
    );

    return (
        <AdminLayout title="Order Fulfillment">
            <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID or customer..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 outline-none font-sans"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                        {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${filterStatus === status ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-400 border border-stone-100 hover:border-stone-300'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50/50 border-b border-stone-100">
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-stone-400">Order Ref</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-stone-400">Date</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-stone-400">Items</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-stone-400">Total</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-stone-400">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-stone-400 text-right">Fulfillment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <Loader2 className="animate-spin inline-block text-emerald-600 mb-2" size={24} />
                                            <p className="text-sm text-stone-400 font-medium">Accessing logs...</p>
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-stone-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <ShoppingBag size={32} />
                                                <p className="text-sm font-medium">No order activity found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-stone-50/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-stone-900">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                    <span className="text-[10px] text-stone-400 font-medium font-sans">User: {order.userId.slice(0, 8)}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm text-stone-600 font-sans">
                                                    {new Date(order.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm font-medium text-stone-700 font-sans">
                                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm font-bold text-stone-900">₹{order.total.toLocaleString()}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="p-2.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                        title="Order Details"
                                                    >
                                                        <ExternalLink size={16} />
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

            {/* Order Detail Side Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-end p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-xl h-full bg-white shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-stone-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-serif italic font-bold text-stone-900">Order Detail</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-1">Ref: #{selectedOrder.id}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-stone-50 rounded-full transition-all text-stone-400 hover:text-red-500">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10">
                                {/* Status Update */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Fulfillment Status</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {(['processing', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map(status => (
                                            <button
                                                key={status}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                                                className={`px-4 py-3 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${selectedOrder.status === status ? getStatusColor(status) : 'bg-stone-50 border-stone-100 text-stone-400 hover:border-stone-300'}`}
                                            >
                                                {getStatusIcon(status)}
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Line Items ({selectedOrder.items.length})</label>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-stone-200 flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-stone-900">{item.name}</p>
                                                    <p className="text-[10px] text-stone-400 font-medium uppercase tracking-tight mt-0.5 font-sans">Qty: {item.quantity} • Size: {item.size || 'N/A'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-stone-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Details (Mock) */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Shipping Information</label>
                                    <div className="p-6 bg-stone-900 text-emerald-50 rounded-[2rem] space-y-3 shadow-xl">
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400/80 mb-4">Customer Details</p>
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                            <div>
                                                <p className="text-[9px] font-bold uppercase text-emerald-400/50 mb-1">Shipping Name</p>
                                                <p className="text-sm font-medium">Customer User #{selectedOrder.userId.slice(0, 4)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold uppercase text-emerald-400/50 mb-1">Contact</p>
                                                <p className="text-sm font-medium">+91 00000 00000</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-[9px] font-bold uppercase text-emerald-400/50 mb-1">Full Address</p>
                                                <p className="text-sm font-light leading-relaxed">Noor Islamic Store Customer Address, Sector 4, Bangalore, KA, 560001</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-stone-50 bg-stone-50/50 flex flex-col gap-4">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Grand Total</span>
                                    <span className="text-2xl font-bold text-stone-900">₹{selectedOrder.total.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-full py-5 bg-stone-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-900 transition-all font-sans"
                                >
                                    Dismiss Details
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminOrders;
