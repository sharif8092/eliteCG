import {
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { BlogPost } from '../types';

const COLLECTION_NAME = 'blogs';

export const blogService = {
    // Get all blog posts
    async getAllPosts(): Promise<BlogPost[]> {
        const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as BlogPost));
    },

    // Get recent blog posts
    async getRecentPosts(limitCount: number = 3): Promise<BlogPost[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            orderBy('date', 'desc'),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as BlogPost));
    },

    // Get single blog post
    async getPostById(id: string): Promise<BlogPost | null> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as BlogPost;
        }
        return null;
    },

    // Add new blog post
    async addPost(post: Omit<BlogPost, 'id'>): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...post,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    },

    // Update blog post
    async updatePost(id: string, post: Partial<BlogPost>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...post,
            updatedAt: new Date().toISOString()
        });
    },

    // Delete blog post
    async deletePost(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
};
