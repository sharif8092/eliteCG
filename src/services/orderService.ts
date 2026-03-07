import {
    collection,
    getDocs,
    updateDoc,
    doc,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';

const COLLECTION_NAME = 'orders';

export const orderService = {
    /**
     * Get all orders for admin
     */
    async getAllOrders(): Promise<Order[]> {
        const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Order));
    },

    /**
     * Get recent activity (last 5 orders)
     */
    async getRecentActivity(): Promise<Order[]> {
        const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Order));
    },

    /**
     * Update order status
     */
    async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, orderId);
        await updateDoc(docRef, { status });
    }
};
