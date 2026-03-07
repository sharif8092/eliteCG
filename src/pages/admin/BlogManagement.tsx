import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FileText, Plus, Search, Edit2, Archive, MessageSquare } from 'lucide-react';

const BlogManagement: React.FC = () => {
    const posts = [
        { title: 'Choosing the Right Abaya for Summer', author: 'Admin', date: '2026-03-01', status: 'Published', comments: 12 },
        { title: 'The Spiritual Importance of Tasbih', author: 'Admin', date: '2026-02-28', status: 'Published', comments: 8 },
        { title: 'Modern Islamic Home Decor Trends', author: 'Admin', date: '2026-02-25', status: 'Draft', comments: 0 },
    ];

    return (
        <AdminLayout title="Blog & Content Management">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 shadow-sm transition-all">
                        <Plus size={18} />
                        Write New Post
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm transition-all divide-y divide-stone-100">
                    {posts.map((post, idx) => (
                        <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-stone-100 text-stone-500 rounded-xl hidden sm:block">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-stone-900 hover:text-emerald-700 transition-colors cursor-pointer">{post.title}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-xs text-stone-500">By {post.author}</span>
                                        <div className="w-1 h-1 rounded-full bg-stone-300" />
                                        <span className="text-xs text-stone-500">{post.date}</span>
                                        <div className="w-1 h-1 rounded-full bg-stone-300" />
                                        <span className={`text-[10px] font-bold uppercase ${post.status === 'Published' ? 'text-emerald-600' : 'text-stone-400'}`}>
                                            {post.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1.5 text-stone-400">
                                    <MessageSquare size={16} />
                                    <span className="text-xs font-bold">{post.comments}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-all">
                                        <Archive size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default BlogManagement;
