import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { storage } from '../firebase';

export const storageService = {
    /**
     * Upload a file to Firebase Storage
     * @param file The file object from input
     * @param path The folder path in storage (e.g., 'products', 'blogs')
     * @param onProgress Callback for upload progress
     */
    async uploadFile(
        file: File,
        path: string,
        onProgress?: (progress: number) => void
    ): Promise<string> {
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const storagePath = `${path}/${timestamp}_${safeName}`;
        const storageRef = ref(storage, storagePath);

        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (onProgress) onProgress(progress);
                },
                (error) => {
                    console.error('Upload failed:', error);
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    },

    /**
     * Delete a file from Firebase Storage by its URL
     * @param url The full download URL of the file
     */
    async deleteFile(url: string): Promise<void> {
        try {
            // Extract the path from the Firebase Storage URL if possible, 
            // or just use the reference if we have it.
            // For simplicity in this project, we'll try to get a reference from the URL
            const fileRef = ref(storage, url);
            await deleteObject(fileRef);
        } catch (error) {
            console.error('Delete failed:', error);
            // Don't throw if delete fails (might be a mock URL)
        }
    }
};
