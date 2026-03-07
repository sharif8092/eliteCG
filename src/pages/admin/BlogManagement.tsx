import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import FileUpload from '../../components/admin/FileUpload';
import { blogService } from '../../services/blogService';
import { BlogPost } from '../../types';
import {
    FileText,
    Plus,
    Trash2,
    Edit2,
    Loader2,
    X,
    Check,
    User,
    Calendar,
    Image as ImageIcon,
    Layout as LayoutIcon,
    Search as SearchIcon,
    Settings as SettingsIcon,
    Upload as UploadIcon,
    Globe as GlobeIcon,
    Type as TypeIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BlogManagement: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>({
        title: '',
        content: '',
        author: 'Admin',
        date: new Date().toISOString().split('T')[0],
        status: 'Published',
        comments: 0,
        image: '',
        imageAlt: '',
        heroImage: '',
        heroAlt: '',
        additionalImages: [],
        category: 'Lifestyle',
        seoTitle: '',
        seoDescription: '',
        seoKeywords: []
    });

    const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await blogService.getAllPosts();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (post?: BlogPost) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                title: post.title,
                content: post.content,
                author: post.author,
                date: post.date,
                status: post.status,
                comments: post.comments,
                image: post.image || '',
                imageAlt: post.imageAlt || '',
                heroImage: post.heroImage || '',
                heroAlt: post.heroAlt || '',
                additionalImages: post.additionalImages || [],
                category: post.category || 'Lifestyle',
                seoTitle: post.seoTitle || '',
                seoDescription: post.seoDescription || '',
                seoKeywords: post.seoKeywords || []
            });
        } else {
            setEditingPost(null);
            setFormData({
                title: '',
                content: '',
                author: 'Admin',
                date: new Date().toISOString().split('T')[0],
                status: 'Published',
                comments: 0,
                image: '',
                imageAlt: '',
                heroImage: '',
                heroAlt: '',
                additionalImages: [],
                category: 'Lifestyle',
                seoTitle: '',
                seoDescription: '',
                seoKeywords: []
            });
        }
        setActiveTab('content');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingPost) {
                await blogService.updatePost(editingPost.id, formData);
            } else {
                await blogService.addPost(formData);
            }
            setIsModalOpen(false);
            fetchPosts();
        } catch (error) {
            console.error('Error saving post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this article?')) return;
        setIsDeleting(id);
        try {
            await blogService.deletePost(id);
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <AdminLayout title="Blog & Content Management">
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-stone-500">Create and manage articles to engage your community.</p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl text-sm font-bold hover:bg-emerald-900 shadow-xl shadow-stone-900/10 transition-all"
                    >
                        <Plus size={18} />
                        Write New Article
                    </button>
                </div>

                {loading && posts.length === 0 ? (
                    <div className="py-20 text-center">
                        <Loader2 className="animate-spin inline-block text-emerald-600 mb-2" size={32} />
                        <p className="text-sm text-stone-400 font-medium font-serif italic">Loading articles...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-stone-50 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-stone-200">
                        <div className="max-w-xs mx-auto space-y-4">
                            <FileText size={48} className="mx-auto text-stone-300" />
                            <h3 className="text-xl font-bold font-serif italic text-stone-900">Your pen is quiet</h3>
                            <p className="text-sm text-stone-400 font-light leading-relaxed">Starting writing your first blog post to share stories and updates with your customers.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row p-6 gap-8">
                                <div className="w-full md:w-48 h-48 rounded-2xl bg-stone-100 overflow-hidden flex-shrink-0">
                                    {post.image ? (
                                        <img src={post.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-2">
                                    <div>
                                        <div className="flex items-center justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider rounded-lg border ${post.status === 'Published'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    : 'bg-amber-50 text-amber-700 border-amber-100'
                                                    }`}>
                                                    {post.status}
                                                </span>
                                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{post.category}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleOpenModal(post)}
                                                    className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    disabled={isDeleting === post.id}
                                                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    {isDeleting === post.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-serif italic font-bold text-stone-900 mb-4">{post.title}</h3>
                                        <p className="text-stone-500 text-sm font-light line-clamp-2 max-w-2xl">{post.content}</p>
                                    </div>
                                    <div className="flex items-center gap-6 mt-6">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-lg">
                                            <User size={12} className="text-stone-400" />
                                            <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">{post.author}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-lg">
                                            <Calendar size={12} className="text-stone-400" />
                                            <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">{post.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Blog Modal */}
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
                            className="relative w-full max-max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                            style={{ maxWidth: '800px' }}
                        >
                            <div className="px-8 py-6 border-b border-stone-100 flex items-center justify-between bg-white">
                                <h3 className="text-xl font-serif italic font-bold">
                                    {editingPost ? 'Edit Article' : 'Write New Article'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-50 rounded-full transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col h-[85vh] max-h-[900px]">
                                {/* Tabs */}
                                <div className="flex px-8 border-b border-stone-100 bg-stone-50/30">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('content')}
                                        className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'content' ? 'text-emerald-600' : 'text-stone-400 hover:text-stone-600'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <LayoutIcon size={14} />
                                            Article Content
                                        </div>
                                        {activeTab === 'content' && <motion.div layoutId="modal-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('seo')}
                                        className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'seo' ? 'text-emerald-600' : 'text-stone-400 hover:text-stone-600'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <GlobeIcon size={14} />
                                            SEO Tools
                                        </div>
                                        {activeTab === 'seo' && <motion.div layoutId="modal-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />}
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                    {activeTab === 'content' ? (
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Article Title</label>
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                                                    value={formData.title}
                                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Category</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 outline-none"
                                                    value={formData.category}
                                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <FileUpload
                                                        label="Article Thumbnail"
                                                        path="blogs"
                                                        initialUrl={formData.image}
                                                        onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                                                    />
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Thumbnail Alt Text (SEO)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Describe this image"
                                                            className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 text-xs outline-none"
                                                            value={formData.imageAlt}
                                                            onChange={e => setFormData({ ...formData, imageAlt: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <FileUpload
                                                        label="Hero Banner Image"
                                                        path="blogs"
                                                        initialUrl={formData.heroImage}
                                                        onUploadComplete={(url) => setFormData({ ...formData, heroImage: url })}
                                                    />
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Hero Alt Text (SEO)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Describe your banner"
                                                            className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 text-xs outline-none"
                                                            value={formData.heroAlt}
                                                            onChange={e => setFormData({ ...formData, heroAlt: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Article Gallery</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, additionalImages: [...(formData.additionalImages || []), { url: '', alt: '' }] })}
                                                        className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-100 transition-all font-sans"
                                                    >
                                                        + Add Slide
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-6">
                                                    {formData.additionalImages?.map((img, idx) => (
                                                        <div key={idx} className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100 space-y-4 relative group">
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, additionalImages: formData.additionalImages?.filter((_, i) => i !== idx) })}
                                                                className="absolute -top-3 -right-3 p-2 bg-white text-red-500 shadow-lg rounded-full hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                            <FileUpload
                                                                label={`Gallery Image #${idx + 1}`}
                                                                path="blogs"
                                                                initialUrl={img.url}
                                                                onUploadComplete={(url) => {
                                                                    const newImages = [...(formData.additionalImages || [])];
                                                                    newImages[idx] = { ...newImages[idx], url };
                                                                    setFormData({ ...formData, additionalImages: newImages });
                                                                }}
                                                            />
                                                            <input
                                                                type="text"
                                                                className="w-full bg-white border border-stone-100 rounded-xl px-4 py-3 text-xs outline-none"
                                                                placeholder="Alt text for this image..."
                                                                value={img.alt}
                                                                onChange={e => {
                                                                    const newImages = [...(formData.additionalImages || [])];
                                                                    newImages[idx] = { ...newImages[idx], alt: e.target.value };
                                                                    setFormData({ ...formData, additionalImages: newImages });
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Content</label>
                                                <textarea
                                                    required
                                                    rows={10}
                                                    className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none resize-none"
                                                    value={formData.content}
                                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                                ></textarea>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            <div className="bg-emerald-50/30 p-8 rounded-[2rem] border border-emerald-100/50">
                                                <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-800 mb-6">
                                                    <SearchIcon size={14} />
                                                    Google Preview
                                                </h4>
                                                <div className="space-y-2 max-w-xl">
                                                    <p className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer truncate">
                                                        {formData.seoTitle || formData.title || 'Untitled Article'} | Noor Islamic Store
                                                    </p>
                                                    <p className="text-[#006621] text-sm truncate">https://noorislamic.store/blog/{formData.title.toLowerCase().replace(/ /g, '-')}</p>
                                                    <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed">
                                                        {formData.seoDescription || formData.content || 'Start writing to see a description...'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Meta Title</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                                                        placeholder="Maximum 60 characters"
                                                        value={formData.seoTitle}
                                                        onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Meta Description</label>
                                                    <textarea
                                                        rows={4}
                                                        className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none resize-none"
                                                        placeholder="Maximum 160 characters"
                                                        value={formData.seoDescription}
                                                        onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                                                    ></textarea>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Focus Keywords</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-500/5 outline-none"
                                                        placeholder="Separate with commas"
                                                        value={formData.seoKeywords?.join(', ')}
                                                        onChange={e => setFormData({ ...formData, seoKeywords: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '') })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 border-t border-stone-100 flex items-center gap-4 bg-stone-50/30">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-stone-900 text-white rounded-2xl py-5 font-bold text-xs uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all shadow-xl shadow-stone-900/10 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                        {editingPost ? 'Update Article' : 'Publish Article'}
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

export default BlogManagement;
