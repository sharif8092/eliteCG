import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Loader2 } from 'lucide-react';

const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard Delivery', cost: 0, time: '5-7 Business Days' },
  { id: 'express', name: 'Express Delivery', cost: 500, time: '2-3 Business Days' },
  { id: 'priority', name: 'Priority Shipping', cost: 1200, time: 'Next Day' }
];

const Checkout: React.FC = () => {
  const { items, total: cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[0]);
  const [formData, setFormData] = useState({
    fullName: profile?.displayName || '',
    email: user?.email || '',
    address: profile?.address || '',
    city: '',
    zipCode: '',
    phone: profile?.phone || '',
    paymentMethod: 'cod'
  });

  const total = cartTotal + selectedShipping.cost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth?redirect=checkout');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: user.uid,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        paymentMethod: formData.paymentMethod,
        shippingMethod: selectedShipping.name,
        shippingCost: selectedShipping.cost,
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone
        }
      };

      await addDoc(collection(db, 'orders'), orderData);
      setSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-12">
          <CheckCircle2 className="text-emerald-600" size={32} />
        </div>
        <h2 className="text-4xl font-serif text-stone-900 italic mb-6">Order Received</h2>
        <p className="text-stone-400 mb-12 font-light max-w-md mx-auto">
          Thank you for choosing Ababil. We have received your order and are preparing it with care. You will receive a confirmation shortly.
        </p>
        <button
          onClick={() => navigate('/')}
          className="text-stone-900 font-bold text-[10px] uppercase tracking-widest border-b border-stone-900 pb-1 inline-block"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-3xl mb-16">
        <span className="text-emerald-800 text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Final Steps</span>
        <h1 className="text-5xl md:text-7xl font-serif text-stone-900 leading-tight">
          Secure <span className="italic">Checkout</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-24">
        <div className="flex-grow space-y-16">
          <div className="space-y-10">
            <h2 className="text-2xl font-serif text-stone-900">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="col-span-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-all font-light"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-all font-light"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-all font-light"
                  placeholder="+91 00000 00000"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">Street Address</label>
                <input
                  required
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-all font-light"
                  placeholder="Apartment, suite, unit, etc."
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">City</label>
                <input
                  required
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-all font-light"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">ZIP Code</label>
                <input
                  required
                  type="text"
                  value={formData.zipCode}
                  onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-all font-light"
                  placeholder="000000"
                />
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <h2 className="text-2xl font-serif text-stone-900">Shipping Method</h2>
            <div className="space-y-4">
              {SHIPPING_METHODS.map(method => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between p-8 border rounded-[2rem] cursor-pointer transition-all group ${selectedShipping.id === method.id ? 'border-stone-900 bg-stone-50' : 'border-stone-100 hover:bg-stone-50'}`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={selectedShipping.id === method.id}
                      onChange={() => setSelectedShipping(method)}
                      className="w-4 h-4 text-stone-900 focus:ring-stone-900 border-stone-300"
                    />
                    <div className="ml-6">
                      <span className="block text-sm font-bold uppercase tracking-widest text-stone-900">{method.name}</span>
                      <span className="block text-[10px] text-stone-400 font-light mt-1">{method.time}</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-stone-900 font-bold">
                    {method.cost === 0 ? 'Complimentary' : `₹${method.cost.toLocaleString()}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <h2 className="text-2xl font-serif text-stone-900">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-8 border border-stone-100 rounded-[2rem] cursor-pointer hover:bg-stone-50 transition-all group">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-4 h-4 text-stone-900 focus:ring-stone-900 border-stone-300"
                  />
                  <span className="ml-6 text-sm font-bold uppercase tracking-widest text-stone-900">Cash on Delivery</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Standard</span>
              </label>
              <label className="flex items-center justify-between p-8 border border-stone-100 rounded-[2rem] opacity-40 cursor-not-allowed">
                <div className="flex items-center">
                  <div className="w-4 h-4 border border-stone-200 rounded-full"></div>
                  <span className="ml-6 text-sm font-bold uppercase tracking-widest text-stone-900">Digital Payment</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold italic">Coming Soon</span>
              </label>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="bg-white p-12 rounded-[3rem] border border-stone-100 shadow-2xl sticky top-32">
            <h2 className="text-2xl font-serif text-stone-900 mb-10">Order Summary</h2>
            <div className="space-y-6 mb-10">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-baseline text-sm">
                  <span className="text-stone-400 font-light">{item.name} <span className="text-[10px] ml-2">x {item.quantity}</span></span>
                  <span className="font-serif italic text-stone-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between items-baseline text-sm pt-4 border-t border-stone-50">
                <span className="text-stone-400 font-light">Shipping ({selectedShipping.name})</span>
                <span className="font-serif italic text-stone-900">
                  {selectedShipping.cost === 0 ? 'Free' : `₹${selectedShipping.cost.toLocaleString()}`}
                </span>
              </div>
            </div>
            <div className="pt-8 border-t border-stone-100 flex justify-between items-baseline">
              <span className="uppercase tracking-widest text-[10px] font-bold text-stone-900">Total</span>
              <span className="text-3xl font-serif italic text-stone-900">₹{total.toLocaleString()}</span>
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full mt-12 bg-stone-900 text-white py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-4 hover:bg-emerald-900 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Complete Order</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
