import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { PaymentGateway, ShippingMethod } from '../types';
import { CheckCircle2, Loader2, CreditCard, Truck, Wallet } from 'lucide-react';

const Checkout: React.FC = () => {
  const { items, total: cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchingMethods, setFetchingMethods] = useState(true);
  const [success, setSuccess] = useState(false);

  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null);

  const [formData, setFormData] = useState({
    firstName: profile?.displayName?.split(' ')[0] || '',
    lastName: profile?.displayName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    address: profile?.address || '',
    city: '',
    zipCode: '',
    phone: profile?.phone || '',
    paymentMethod: ''
  });

  // Calculate total
  const shippingCost = selectedShipping ? parseFloat(selectedShipping.settings.cost?.value || '0') : 0;
  const total = cartTotal + shippingCost;

  useEffect(() => {
    const fetchMethods = async () => {
      setFetchingMethods(true);
      console.log('Fetching checkout methods...');

      try {
        // 1. Fetch Payment Gateways
        try {
          const gateways = await orderService.getPaymentGateways();
          console.log('Payment Gateways:', gateways);
          setPaymentGateways(gateways);
          if (gateways.length > 0) {
            setFormData(prev => ({ ...prev, paymentMethod: gateways[0].id }));
          }
        } catch (err) {
          console.error('Error fetching payment gateways:', err);
        }

        // 2. Fetch Shipping Zones and Methods
        try {
          const zones = await orderService.getShippingZones();
          console.log('Shipping Zones:', zones);

          let methods: ShippingMethod[] = [];

          if (zones && zones.length > 0) {
            // Try first user-defined zone
            methods = await orderService.getShippingMethods(zones[0].id);
          } else {
            // Fallback to Default Zone (0)
            console.log('No zones found, checking default zone 0...');
            methods = await orderService.getShippingMethods(0);
          }

          const enabledMethods = methods.filter(m => m.enabled);
          console.log('Enabled Shipping Methods:', enabledMethods);
          setShippingMethods(enabledMethods);
          if (enabledMethods.length > 0) {
            setSelectedShipping(enabledMethods[0]);
          }
        } catch (err) {
          console.error('Error fetching shipping methods:', err);
        }
      } finally {
        setFetchingMethods(false);
      }
    };

    fetchMethods();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth?redirect=checkout');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customer_id: user.uid, // Using UID as fallback ID
        payment_method: formData.paymentMethod,
        payment_method_title: paymentGateways.find(g => g.id === formData.paymentMethod)?.title || 'Payment',
        set_paid: false,
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          city: formData.city,
          postcode: formData.zipCode,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          city: formData.city,
          postcode: formData.zipCode
        },
        line_items: items.map(item => ({
          product_id: parseInt(item.id),
          quantity: item.quantity
        })),
        shipping_lines: selectedShipping ? [
          {
            method_id: selectedShipping.method_id,
            method_title: selectedShipping.method_title,
            total: selectedShipping.settings.cost?.value || '0'
          }
        ] : []
      };

      await orderService.createOrder(orderData);
      setSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
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
          Thank you for choosing Noor. We have received your order and are preparing it with care. You can track your order in your dashboard.
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
        {/* Left Side: Forms */}
        <div className="flex-grow space-y-16">
          {/* Shipping Address */}
          <div className="space-y-10">
            <h2 className="text-2xl font-serif text-stone-900">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">First Name</label>
                <input
                  required
                  type="text"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-all font-light"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">Last Name</label>
                <input
                  required
                  type="text"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-all font-light"
                  placeholder="Last name"
                />
              </div>
              <div className="col-span-2">
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
              <div className="col-span-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-all font-light"
                  placeholder="Phone number"
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
                  placeholder="House number and street name"
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
                  placeholder="Postcode"
                />
              </div>
            </div>
          </div>

          {/* Shipping Methods */}
          <div className="space-y-10">
            <h2 className="text-2xl font-serif text-stone-900">Shipping Method</h2>
            {fetchingMethods ? (
              <div className="flex items-center gap-4 text-stone-400 font-light italic">
                <Loader2 className="animate-spin" size={16} />
                Scanning delivery partners...
              </div>
            ) : shippingMethods.length === 0 ? (
              <div className="p-8 border border-stone-100 rounded-[2rem] text-stone-400 italic">
                No shipping methods available for your location.
              </div>
            ) : (
              <div className="space-y-4">
                {shippingMethods.map(method => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-8 border rounded-[2rem] cursor-pointer transition-all group ${selectedShipping?.id === method.id ? 'border-stone-900 bg-stone-50' : 'border-stone-100 hover:bg-stone-50'}`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        checked={selectedShipping?.id === method.id}
                        onChange={() => setSelectedShipping(method)}
                        className="w-4 h-4 text-stone-900 focus:ring-stone-900 border-stone-300"
                      />
                      <div className="ml-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 group-hover:text-stone-900 transition-colors">
                          <Truck size={18} />
                        </div>
                        <div>
                          <span className="block text-sm font-bold uppercase tracking-widest text-stone-900">{method.method_title}</span>
                          <span className="block text-[10px] text-stone-400 font-light mt-1">Managed by WooCommerce</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-900 font-bold">
                      {parseFloat(method.settings.cost?.value || '0') === 0 ? 'Complimentary' : `₹${method.settings.cost?.value}`}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="space-y-10">
            <h2 className="text-2xl font-serif text-stone-900">Payment Method</h2>
            {fetchingMethods ? (
              <div className="flex items-center gap-4 text-stone-400 font-light italic">
                <Loader2 className="animate-spin" size={16} />
                Securing payment gateways...
              </div>
            ) : paymentGateways.length === 0 ? (
              <div className="p-8 border border-stone-100 rounded-[2rem] text-stone-400 italic">
                No payment methods available.
              </div>
            ) : (
              <div className="space-y-4">
                {paymentGateways.map(gateway => (
                  <label
                    key={gateway.id}
                    className={`flex items-center justify-between p-8 border rounded-[2rem] cursor-pointer transition-all group ${formData.paymentMethod === gateway.id ? 'border-stone-900 bg-stone-50' : 'border-stone-100 hover:bg-stone-50'}`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value={gateway.id}
                        checked={formData.paymentMethod === gateway.id}
                        onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-4 h-4 text-stone-900 focus:ring-stone-900 border-stone-300"
                      />
                      <div className="ml-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 group-hover:text-stone-900 transition-colors">
                          {gateway.id === 'cod' ? <Wallet size={18} /> : <CreditCard size={18} />}
                        </div>
                        <div>
                          <span className="block text-sm font-bold uppercase tracking-widest text-stone-900">{gateway.title}</span>
                          <span className="block text-[10px] text-stone-400 font-light mt-1 line-clamp-1">{gateway.description}</span>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary */}
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
                <span className="text-stone-400 font-light">Shipping ({selectedShipping?.method_title || 'Calculated at next step'})</span>
                <span className="font-serif italic text-stone-900">
                  {shippingCost === 0 ? 'Free' : `₹${shippingCost.toLocaleString()}`}
                </span>
              </div>
            </div>
            <div className="pt-8 border-t border-stone-100 flex justify-between items-baseline">
              <span className="uppercase tracking-widest text-[10px] font-bold text-stone-900">Total</span>
              <span className="text-3xl font-serif italic text-stone-900">₹{total.toLocaleString()}</span>
            </div>
            <button
              disabled={loading || fetchingMethods || !formData.paymentMethod}
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
