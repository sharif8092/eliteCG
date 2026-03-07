import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center">
        <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-12">
          <ShoppingBag className="text-stone-300" size={32} />
        </div>
        <h2 className="text-4xl font-serif text-stone-900 italic mb-6">Your bag is empty</h2>
        <p className="text-stone-400 mb-12 font-light">Explore our curated collection to find your next piece.</p>
        <Link to="/products" className="text-stone-900 font-bold text-[10px] uppercase tracking-widest border-b border-stone-900 pb-1 inline-block">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-3xl mb-16">
        <span className="text-emerald-800 text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Your Selection</span>
        <h1 className="text-5xl md:text-7xl font-serif text-stone-900 leading-tight">
          Shopping <span className="italic">Bag</span>
        </h1>
        <p className="text-stone-400 mt-6 font-light">{itemCount} pieces curated</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-24">
        {/* Cart Items */}
        <div className="flex-grow space-y-12">
          {items.map(item => (
            <div key={item.id} className={`flex items-center space-x-10 group ${item.isFreeGift ? 'bg-emerald-50/50 -mx-4 px-4 py-6 rounded-2xl border border-emerald-100' : ''}`}>
              <div className="w-32 h-40 flex-shrink-0 rounded-[2rem] overflow-hidden bg-stone-50 relative">
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                {item.isFreeGift && (
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[8px] uppercase tracking-wider font-extrabold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Gift size={10} /> Free
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-2 block">{item.category}</span>
                    <h3 className="text-2xl font-serif text-stone-900 group-hover:text-emerald-800 transition-colors">{item.name}</h3>
                    {item.isFreeGift && (
                      <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                        <Gift size={12} /> Free Gift — Orders Above ₹2,999
                      </span>
                    )}
                  </div>
                  {!item.isFreeGift && (
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <div className="mt-8 flex justify-between items-center">
                  {!item.isFreeGift ? (
                    <div className="flex items-center border border-stone-100 rounded-full px-6 py-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-stone-400 hover:text-stone-900 transition-colors"><Minus size={12} /></button>
                      <span className="mx-6 font-bold text-xs text-stone-900 w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-stone-400 hover:text-stone-900 transition-colors"><Plus size={12} /></button>
                    </div>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600">Qty: 1</span>
                  )}
                  <p className={`text-xl font-serif italic ${item.isFreeGift ? 'text-emerald-700' : 'text-stone-900'}`}>
                    {item.isFreeGift ? '₹0 FREE' : `₹${(item.price * item.quantity).toLocaleString()}`}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-12 border-t border-stone-100 flex justify-start">
            <button
              onClick={clearCart}
              className="group flex items-center space-x-3 text-stone-400 hover:text-red-500 transition-all"
            >
              <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
              <span className="text-[9px] uppercase tracking-widest font-bold">Empty Shopping Bag</span>
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white p-12 rounded-[3rem] border border-stone-100 shadow-2xl sticky top-32">
            <h2 className="text-2xl font-serif text-stone-900 mb-10">Order Summary</h2>
            <div className="space-y-6 text-sm">
              <div className="flex justify-between text-stone-400 font-light">
                <span className="uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                <span className="font-serif italic text-lg text-stone-900">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-400 font-light">
                <span className="uppercase tracking-widest text-[10px] font-bold">Shipping</span>
                <span className="text-emerald-800 font-bold text-[10px] uppercase tracking-widest">Complimentary</span>
              </div>
              <div className="pt-8 border-t border-stone-100 flex justify-between items-baseline">
                <span className="uppercase tracking-widest text-[10px] font-bold text-stone-900">Total</span>
                <span className="text-3xl font-serif italic text-stone-900">₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-12 bg-stone-900 text-white py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-4 hover:bg-emerald-900 transition-all shadow-2xl"
            >
              <span>Secure Checkout</span>
              <ArrowRight size={16} />
            </button>
            <p className="mt-6 text-center text-[9px] uppercase tracking-widest text-stone-300 font-bold">
              Taxes calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
