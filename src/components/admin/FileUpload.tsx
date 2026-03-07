import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storageService } from '../../services/storageService';

interface FileUploadProps {
    label: string;
    onUploadComplete: (url: string) => void;
    initialUrl?: string;
    path: 'products' | 'blogs' | 'banners' | 'media';
    accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    label,
    onUploadComplete,
    initialUrl,
    path,
    accept = "image/*"
}) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialUrl);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        setProgress(0);

        try {
            const downloadUrl = await storageService.uploadFile(
                file,
                path,
                (p) => setProgress(Math.round(p))
            );
            setPreviewUrl(downloadUrl);
            onUploadComplete(downloadUrl);
        } catch (err) {
            console.error('Upload Error:', err);
            setError('Failed to upload file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreviewUrl(undefined);
        onUploadComplete('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">{label}</label>

            <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`
                    relative h-40 rounded-[2rem] border-2 border-dashed transition-all duration-500 cursor-pointer overflow-hidden
                    ${previewUrl
                        ? 'border-emerald-100 bg-emerald-50/10'
                        : uploading
                            ? 'border-emerald-200 bg-emerald-50/20'
                            : 'border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-emerald-200'}
                `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept={accept}
                    className="hidden"
                />

                <AnimatePresence mode="wait">
                    {previewUrl ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/20 transition-colors" />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    ) : uploading ? (
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                        >
                            <div className="relative">
                                <Loader2 size={32} className="animate-spin text-emerald-600" />
                                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-emerald-700">
                                    {progress}%
                                </span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 animate-pulse">Uploading...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                        >
                            <div className="p-4 bg-white rounded-2xl shadow-sm text-stone-400 group-hover:text-emerald-600 group-hover:scale-110 transition-all duration-500">
                                <Upload size={24} />
                            </div>
                            <div className="text-center">
                                <p className="text-[11px] font-bold text-stone-800">Choose a file to upload</p>
                                <p className="text-[9px] text-stone-400 font-medium">Or drag and drop here</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <div className="absolute bottom-4 inset-x-4 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold flex items-center gap-2 border border-red-100">
                        <AlertCircle size={14} />
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
