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
import { Offer } from '../types';

const COLLECTION_NAME = 'offers';

export const offerService = {
    // Get all offers
    async getAllOffers(): Promise<Offer[]> {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Offer));
    },

    // Get active offers
    async getActiveOffers(): Promise<Offer[]> {
        const q = query(collection(db, COLLECTION_NAME), where('status', '==', 'active'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Offer));
    },

    // Add new offer
    async addOffer(offer: Omit<Offer, 'id'>): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...offer,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    },

    // Update offer
    async updateOffer(id: string, offer: Partial<Offer>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...offer,
            updatedAt: new Date().toISOString()
        });
    },

    // Delete offer
    async deleteOffer(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    },

    // Track click
    async trackClick(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const currentClicks = docSnap.data().clicks || 0;
            await updateDoc(docRef, { clicks: currentClicks + 1 });
        }
    }
};
