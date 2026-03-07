import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import FileUpload from '../../components/admin/FileUpload';
import { mediaService } from '../../services/mediaService';
import { storageService } from '../../services/storageService';
import {
    Image as ImageIcon,
    Search,
    Plus,
    Trash2,
    Copy,
    Filter,
    ExternalLink,
    Check,
    FileText,
    Video,
    Loader2,
    X,
    FilterX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaFile } from '../../types';

const MediaLibrary: React.FC = () => {
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadCategory, setUploadCategory] = useState<MediaFile['category']>('products');

    const CATEGORIES: { id: string; label: string }[] = [
        { id: 'all', label: 'All Assets' },
        { id: 'products', label: 'Products' },
        { id: 'blogs', label: 'Blogs' },
        { id: 'banners', label: 'Banners' },
        { id: 'other', label: 'Other' },
    ];

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const data = await mediaService.getAllMedia();
            setMediaFiles(data);
        } catch (error) {
            console.error('Error fetching media:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyUrl = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (id: string, url: string) => {
        if (window.confirm('Are you sure you want to permanently delete this file and its database record?')) {
            try {
                // Delete from storage first
                await storageService.deleteFile(url);
                // Then delete from Firestore
                await mediaService.deleteMedia(id);
                // Optimistic UI update
                setMediaFiles(prev => prev.filter(f => f.id !== id));
            } catch (error) {
                console.error('Error deleting media:', error);
                alert('Failed to delete media. Please try again.');
            }
        }
    };

    const handleUploadComplete = async (url: string) => {
        try {
            // Extract filename from URL (Firebase Storage format usually has it)
            const name = url.split('/').pop()?.split('?')[0] || 'uploaded_file';

            const newMedia: Omit<MediaFile, 'id'> = {
                url,
                name: decodeURIComponent(name.split('_').slice(1).join('_') || name),
                type: 'image', // FileUpload currently only does images
                category: uploadCategory,
                size: 0, // In a real app, FileUpload would return size
                uploadedAt: new Date().toISOString()
            };

            await mediaService.addMedia(newMedia);
            setIsUploadModalOpen(false);
            fetchMedia(); // Refresh list
        } catch (error) {
            console.error('Error saving media record:', error);
        }
    };

    const filteredMedia = mediaFiles.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const formatSize = (bytes: number) => {
        if (!bytes || bytes === 0) return 'Unknown Size';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <AdminLayout title="Media Library">
            <div className="space-y-8">
                {/* Header Actions */}
                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
                        <div className="relative flex-grow max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search assets..."
                                className="w-full bg-white border border-stone-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-4 focus:ring-emerald-500/5 outline-none font-sans"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                        <div className="flex p-1 bg-stone-100 rounded-2xl overflow-x-auto">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] whitespace-nowrap font-bold uppercase tracking-widest transition-all ${selectedCategory === cat.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3.5 bg-stone-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900 shadow-xl shadow-stone-900/10 transition-all font-sans"
                        >
                            <Plus size={16} />
                            Upload Asset
                        </button>
                    </div>
                </div>

                {/* Media Grid */}
                {loading ? (
                    <div className="py-32 text-center">
                        <Loader2 className="animate-spin inline-block text-emerald-600 mb-4" size={32} />
                        <p className="text-sm text-stone-400 font-medium uppercase tracking-widest">Accessing records...</p>
                    </div>
                ) : filteredMedia.length === 0 ? (
                    <div className="py-32 text-center bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200">
                        <div className="max-w-xs mx-auto space-y-4">
                            <FilterX size={48} className="mx-auto text-stone-300" />
                            <h3 className="text-lg font-bold text-stone-900 font-serif italic">Empty Gallery</h3>
                            <p className="text-sm text-stone-400 font-light">No assets found in <span className="text-emerald-600 font-bold uppercase">{selectedCategory}</span> section.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                        {filteredMedia.map((file) => (
                            <motion.div
                                layout
                                key={file.id}
                                className="group bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500"
                            >
                                <div className="aspect-square relative overflow-hidden bg-stone-50">
                                    {file.type === 'image' ? (
                                        <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
                                            <FileText size={40} />
                                        </div>
                                    )}

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleCopyUrl(file.url, file.id)}
                                                className="p-3 bg-white text-stone-900 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-lg"
                                                title="Copy Link"
                                            >
                                                {copiedId === file.id ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-3 bg-white text-stone-900 rounded-2xl hover:bg-stone-50 transition-all shadow-lg"
                                                title="View Original"
                                            >
                                                <ExternalLink size={18} />
                                            </a>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(file.id, file.url)}
                                            className="w-full py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            <Trash2 size={14} />
                                            Delete Asset
                                        </button>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[8px] font-bold uppercase tracking-widest text-stone-600 shadow-sm">
                                        {file.category}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-[10px] font-bold text-stone-900 truncate mb-1 font-sans" title={file.name}>{file.name}</p>
                                    <div className="flex items-center justify-between text-[8px] text-stone-400 font-bold uppercase tracking-widest font-sans">
                                        <span>{new Date(file.uploadedAt || (file as any).createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsUploadModalOpen(false)}
                            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 space-y-8"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-serif italic font-bold">Upload to Library</h3>
                                <button onClick={() => setIsUploadModalOpen(false)} className="p-2 hover:bg-stone-50 rounded-full transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Select Section</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setUploadCategory(cat.id as any)}
                                            className={`px-4 py-3 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all ${uploadCategory === cat.id ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-inner' : 'bg-stone-50 border-stone-100 text-stone-400 hover:bg-white hover:border-stone-200'}`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <FileUpload
                                label="Choose Media File"
                                path={`library/${uploadCategory}`}
                                onUploadComplete={handleUploadComplete}
                            />

                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="w-full py-5 bg-stone-50 text-stone-400 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-stone-100 transition-all font-sans"
                            >
                                Cancel Upload
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default MediaLibrary;
