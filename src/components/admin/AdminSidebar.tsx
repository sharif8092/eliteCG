import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Tag,
    FileText,
    Settings,
    LogOut,
    ChevronRight,
    ShoppingBag,
    Image as ImageIcon
} from 'lucide-react';
import { motion } from 'motion/react';

import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const AdminSidebar: React.FC = () => {
    const location = useLocation();

    const handleLogout = async () => {
        localStorage.removeItem('auth_bypass');
        await signOut(auth);
        window.location.href = '/';
    };

    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { label: 'Products', icon: Package, path: '/admin/products' },
        { label: 'Categories', icon: Tag, path: '/admin/categories' },
        { label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
        { label: 'Offers & Banners', icon: Tag, path: '/admin/offers' },
        { label: 'Blog Posts', icon: FileText, path: '/admin/blogs' },
        { label: 'Media Library', icon: ImageIcon, path: '/admin/media' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-stone-200 h-screen sticky top-0 flex flex-col pt-6 pb-4">
            <div className="px-6 mb-8 flex items-center gap-2">
                <ShoppingBag className="text-emerald-600" size={24} />
                <span className="text-xl font-serif italic font-bold text-stone-900">Ababil Admin</span>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group
                ${isActive
                                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'}
              `}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} className={isActive ? 'text-emerald-600' : 'text-stone-400 group-hover:text-stone-600'} />
                                {item.label}
                            </div>
                            {isActive && (
                                <motion.div layoutId="active" className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-3 pt-4 border-t border-stone-100">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-all"
                >
                    <ChevronRight size={18} />
                    Go to Storefront
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
