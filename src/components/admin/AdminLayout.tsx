import React from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Bell, User } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) return null;

    // Protect the admin area
    if (!user || !isAdmin) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="min-h-screen bg-stone-50 flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Top Header */}
                <header className="bg-white border-b border-stone-200 h-16 sticky top-0 z-10 px-8 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-stone-900">{title}</h1>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-stone-400 hover:text-stone-600 transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="h-6 w-px bg-stone-200" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-semibold text-stone-900">{user.displayName || 'Admin'}</p>
                                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Store Manager</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                                {user.email?.charAt(0).toUpperCase() || <User size={16} />}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Area */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
