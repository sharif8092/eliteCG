import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
    Users,
    ShoppingBag,
    TrendingUp,
    Clock,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const stats = [
        { label: 'Total Sales', value: '₹124,500', icon: TrendingUp, change: '+12.5%', isPositive: true },
        { label: 'Active Orders', value: '48', icon: ShoppingBag, change: '+5.2%', isPositive: true },
        { label: 'Total Customers', value: '1,240', icon: Users, change: '-2.4%', isPositive: false },
        { label: 'Avg. Order Value', value: '₹2,590', icon: Clock, change: '+8.1%', isPositive: true },
    ];

    return (
        <AdminLayout title="Dashboard Overview">
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <stat.icon size={22} />
                                </div>
                                <div className={`flex items-center text-xs font-bold ${stat.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {stat.change}
                                    {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-stone-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-stone-900 mt-1">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders Placeholder */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                            <h3 className="font-bold text-stone-900">Recent Activity</h3>
                            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">View All</button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                                                <ShoppingBag size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-stone-900 group-hover:text-emerald-600 transition-colors">New Order #ORD-24{item}</p>
                                                <p className="text-xs text-stone-500">2 items worth ₹4,500 • 5 mins ago</p>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase rounded-full border border-yellow-100">Pending</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                        <h3 className="font-bold text-stone-900 mb-6">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full py-3 bg-stone-900 text-white rounded-xl text-sm font-bold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                                Add New Product
                            </button>
                            <button className="w-full py-3 bg-white text-stone-900 border border-stone-200 rounded-xl text-sm font-bold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
                                Create Offer
                            </button>
                            <button className="w-full py-3 bg-white text-emerald-700 border border-emerald-100 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
                                Post to Blog
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
