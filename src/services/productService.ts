import {
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';

const COLLECTION_NAME = 'products';

export const productService = {
    // Get all products
    async getAllProducts(): Promise<Product[]> {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Product));
    },

    // Get featured products
    async getFeaturedProducts(limitCount: number = 4): Promise<Product[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('featured', '==', true),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Product));
    },

    // Get products by category
    async getProductsByCategory(category: string): Promise<Product[]> {
        const q = query(collection(db, COLLECTION_NAME), where('category', '==', category));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Product));
    },

    // Get single product
    async getProductById(id: string): Promise<Product | null> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Product;
        }
        return null;
    },

    // Add new product
    async addProduct(product: Omit<Product, 'id'>): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...product,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    },

    // Update product
    async updateProduct(id: string, product: Partial<Product>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...product,
            updatedAt: new Date().toISOString()
        });
    },

    // Delete product
    async deleteProduct(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
};
