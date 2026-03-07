import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { MediaFile } from '../types';

const COLLECTION_NAME = 'media';

export const mediaService = {
    /**
     * Get all media files from Firestore
     */
    async getAllMedia(): Promise<MediaFile[]> {
        const q = query(collection(db, COLLECTION_NAME), orderBy('uploadedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as MediaFile));
    },

    /**
     * Get media files by category
     * @param category The category to filter by
     */
    async getMediaByCategory(category: MediaFile['category']): Promise<MediaFile[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('category', '==', category),
            orderBy('uploadedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as MediaFile));
    },

    /**
     * Add a record of a new media file to Firestore
     * @param file The media file metadata
     */
    async addMedia(file: Omit<MediaFile, 'id'>): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...file,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    },

    /**
     * Delete a media record by its Firestore ID
     * @param id The document ID
     */
    async deleteMedia(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
};
