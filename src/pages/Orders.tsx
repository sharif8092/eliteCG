import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { Package, Clock, ChevronRight, Truck, CheckCircle2, MapPin } from 'lucide-react';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const getStatusSteps = (status: Order['status']) => {
    const steps = [
      { id: 'pending', label: 'Order Placed', icon: Clock },
      { id: 'processing', label: 'Processing', icon: Package },
      { id: 'shipped', label: 'In Transit', icon: Truck },
      { id: 'delivered', label: 'Delivered', icon: CheckCircle2 }
    ];
    
    const currentIndex = steps.findIndex(s => s.id === status);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-300 animate-pulse">Retrieving Archives...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center">
        <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-12">
          <Package className="text-stone-300" size={32} />
        </div>
        <h2 className="text-4xl font-serif text-stone-900 italic mb-6">No orders found</h2>
        <p className="text-stone-400 mb-12 font-light">Your order history is currently empty.</p>
        <button 
          onClick={() => window.location.href = '/products'}
          className="text-stone-900 font-bold text-[10px] uppercase tracking-widest border-b border-stone-900 pb-1 inline-block"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-3xl mb-16">
        <span className="text-emerald-800 text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Order History</span>
        <h1 className="text-5xl md:text-7xl font-serif text-stone-900 leading-tight">
          Your <span className="italic">Archives</span>
        </h1>
      </div>

      <div className="space-y-12">
        {orders.map(order => (
          <div key={order.id} className="group bg-white border border-stone-100 rounded-[3rem] overflow-hidden hover:shadow-2xl transition-all">
            <div 
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              className="flex flex-col md:flex-row md:items-center justify-between py-10 px-12 cursor-pointer"
            >
              <div className="flex items-center space-x-10">
                <div className="w-20 h-24 bg-stone-100 rounded-2xl overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-stone-200"></div>
                </div>
                <div>
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-stone-400">Order #{order.id.slice(0, 8)}</span>
                    <span className={`text-[8px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-emerald-50 text-emerald-800' : 
                      order.status === 'cancelled' ? 'bg-red-50 text-red-800' : 
                      'bg-amber-50 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif text-stone-900">
                    {order.items.length} {order.items.length === 1 ? 'Piece' : 'Pieces'}
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 flex items-center justify-between md:justify-end md:space-x-16">
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-stone-400 mb-1">Total Amount</p>
                  <p className="text-2xl font-serif italic text-stone-900">₹{order.total.toLocaleString()}</p>
                </div>
                <div className={`w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center text-stone-400 transition-all ${expandedOrder === order.id ? 'bg-stone-900 text-white border-stone-900 rotate-90' : 'group-hover:border-stone-900'}`}>
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="px-12 pb-12 pt-4 border-t border-stone-50 bg-stone-50/30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  {/* Tracking Timeline */}
                  <div className="space-y-10">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-900">Tracking Journey</h4>
                    <div className="relative flex justify-between">
                      <div className="absolute top-4 left-0 w-full h-[1px] bg-stone-200 -z-10"></div>
                      {getStatusSteps(order.status).map((step, i) => (
                        <div key={i} className="flex flex-col items-center space-y-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step.completed ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-300'}`}>
                            <step.icon size={16} />
                          </div>
                          <span className={`text-[8px] uppercase tracking-widest font-bold text-center ${step.completed ? 'text-stone-900' : 'text-stone-300'}`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    {order.trackingNumber && (
                      <div className="pt-6 flex items-center justify-between border-t border-stone-100">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-stone-400">Tracking ID</span>
                        <span className="text-xs font-mono text-stone-900">{order.trackingNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="space-y-10">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-900">Delivery Details</h4>
                    <div className="flex items-start space-x-4">
                      <MapPin size={16} className="text-stone-400 mt-1" />
                      <div>
                        <p className="text-xs text-stone-600 leading-relaxed font-light">{order.shippingAddress}</p>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-stone-400 mt-2">{order.shippingMethod || 'Standard Delivery'}</p>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-stone-100">
                      <div className="space-y-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="text-stone-400 font-light">{item.name} x{item.quantity}</span>
                            <span className="text-stone-900 font-serif italic">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
