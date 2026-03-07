import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Tag, Plus, Trash2, Calendar, Eye, EyeOff } from 'lucide-react';

const OfferManagement: React.FC = () => {
    const activeOffers = [
        {
            id: 1,
            title: 'Free Prayer Mat',
            description: 'Free high-quality Janamaz on orders above ₹2,999',
            status: 'active',
            clicks: 1240,
            expiry: '2026-04-01'
        },
        {
            id: 2,
            title: 'Eid Special 15%',
            description: '15% discount on all Abayas and Hijabs',
            status: 'scheduled',
            clicks: 0,
            expiry: '2026-03-31'
        },
    ];

    return (
        <AdminLayout title="Offer & Promotional Management">
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-stone-500">Manage your store's banners, popups, and special deal rules.</p>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-sm transition-all">
                        <Plus size={18} />
                        Create New Offer
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {activeOffers.map((offer) => (
                        <div key={offer.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                            <Tag size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-stone-900">{offer.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full border ${offer.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        : 'bg-stone-50 text-stone-500 border-stone-200'
                                                    }`}>
                                                    {offer.status}
                                                </span>
                                                <span className="text-[10px] text-stone-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {offer.expiry}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                                            {offer.status === 'active' ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                        <button className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-stone-600 mb-6">{offer.description}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-[10px] text-stone-400 font-bold uppercase">Total Clicks</p>
                                            <p className="text-lg font-bold text-stone-900">{offer.clicks.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Edit Settings</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

// Simple Clock component for the icon
const Clock = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

export default OfferManagement;
