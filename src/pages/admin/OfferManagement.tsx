import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import FileUpload from '../../components/admin/FileUpload';
import { offerService } from '../../services/offerService';
import { Offer } from '../../types';
import {
    Tag,
    Plus,
    Trash2,
    Calendar,
    Eye,
    EyeOff,
    Loader2,
    X,
    Check,
    AlertCircle,
    TrendingUp,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const OfferManagement: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Omit<Offer, 'id'>>({
        title: '',
        description: '',
        status: 'active',
        clicks: 0,
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'banner',
        image: ''
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const data = await offerService.getAllOffers();
            setOffers(data);
        } catch (error) {
            console.error('Error fetching offers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (offer?: Offer) => {
        if (offer) {
            setEditingOffer(offer);
            setFormData({
                title: offer.title,
                description: offer.description,
                status: offer.status,
                clicks: offer.clicks,
                expiry: offer.expiry,
                type: offer.type || 'banner',
                image: offer.image || ''
            });
        } else {
            setEditingOffer(null);
            setFormData({
                title: '',
                description: '',
                status: 'active',
                clicks: 0,
                expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                type: 'banner',
                image: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingOffer) {
                await offerService.updateOffer(editingOffer.id, formData);
            } else {
                await offerService.addOffer(formData);
            }
            setIsModalOpen(false);
            fetchOffers();
        } catch (error) {
            console.error('Error saving offer:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this offer?')) return;
        setIsDeleting(id);
        try {
            await offerService.deleteOffer(id);
            fetchOffers();
        } catch (error) {
            console.error('Error deleting offer:', error);
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <AdminLayout title="Offer & Promotional Management">
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-serif text-stone-900">Active Campaigns</h2>
                        <p className="text-sm text-stone-500 mt-1">Manage banners, popups, and deal logic for your store.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all"
                    >
                        <Plus size={18} />
                        New Campaign
                    </button>
                </div>

                {loading && offers.length === 0 ? (
                    <div className="py-20 text-center">
                        <Loader2 className="animate-spin inline-block text-emerald-600 mb-2" size={32} />
                        <p className="text-sm text-stone-400 font-medium">Loading campaigns...</p>
                    </div>
                ) : offers.length === 0 ? (
                    <div className="bg-stone-50 rounded-3xl p-20 text-center border-2 border-dashed border-stone-200">
                        <div className="max-w-xs mx-auto space-y-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-stone-300">
                                <Tag size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-stone-900">No Active Offers</h3>
                            <p className="text-sm text-stone-400 font-light">Create your first promotional campaign to boost your store's performance.</p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest border-b border-emerald-600 pb-1"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {offers.map((offer) => (
                            <div key={offer.id} className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 group">
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
                                                <Tag size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">{offer.title}</h3>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className={`px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider rounded-full border ${offer.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        : offer.status === 'scheduled'
                                                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                            : 'bg-stone-50 text-stone-500 border-stone-100'
                                                        }`}>
                                                        {offer.status}
                                                    </span>
                                                    <span className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                                                        <Clock size={12} />
                                                        Exp: {offer.expiry}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpenModal(offer)}
                                                className="p-2.5 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-all"
                                            >
                                                <Calendar size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(offer.id)}
                                                disabled={isDeleting === offer.id}
                                                className="p-2.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                                            >
                                                {isDeleting === offer.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-stone-500 text-sm leading-relaxed font-light mb-8 line-clamp-2">{offer.description}</p>

                                    <div className="flex items-center justify-between pt-8 border-t border-stone-50">
                                        <div className="flex items-center gap-5">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <TrendingUp size={14} className="text-emerald-600" />
                                                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Performance</p>
                                                </div>
                                                <p className="text-xl font-bold text-stone-900">{offer.clicks.toLocaleString()} <span className="text-[10px] text-stone-400 font-medium">clicks</span></p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleOpenModal(offer)}
                                            className="text-[10px] font-bold text-stone-900 uppercase tracking-widest border-b border-stone-900 pb-0.5 hover:text-emerald-600 hover:border-emerald-600 transition-all"
                                        >
                                            Manage Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Offer Modal */}
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
                            className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-stone-100 flex items-center justify-between">
                                <h3 className="text-xl font-serif italic font-bold">
                                    {editingOffer ? 'Edit Campaign' : 'Launch New Campaign'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-50 rounded-full transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Campaign Title</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                                        placeholder="e.g. Ramadan Special 20%"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Campaign Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none resize-none"
                                        placeholder="Describe the offer details..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Type</label>
                                        <select
                                            className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 outline-none appearance-none"
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                        >
                                            <option value="banner">Banner Stripe</option>
                                            <option value="popup">Popup Modal</option>
                                            <option value="deal">Product Deal</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Expiry Date</label>
                                        <input
                                            required
                                            type="date"
                                            className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                                            value={formData.expiry}
                                            onChange={e => setFormData({ ...formData, expiry: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</label>
                                    <div className="flex gap-3">
                                        {['active', 'scheduled', 'expired'].map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, status: status as any })}
                                                className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${formData.status === status
                                                    ? 'bg-emerald-900 text-white border-emerald-900'
                                                    : 'bg-white text-stone-400 border-stone-100 hover:border-stone-300'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-stone-100">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Campaign Visual (Banner/Poster)</label>
                                    <FileUpload
                                        label="Upload Promotional Image"
                                        path="offers"
                                        initialUrl={formData.image}
                                        onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                                    />
                                </div>

                                <div className="pt-6 border-t border-stone-50 flex items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-stone-900 text-white rounded-2xl py-5 font-bold text-xs uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all shadow-xl shadow-stone-900/10 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                        {editingOffer ? 'Update Campaign' : 'Launch Campaign'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-8 py-5 bg-stone-50 text-stone-400 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-stone-100 transition-all"
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

export default OfferManagement;
