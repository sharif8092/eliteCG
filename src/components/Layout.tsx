import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import FloatingContact from './FloatingContact';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      
      <FloatingContact />

      <footer className="bg-stone-900 text-stone-500 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-4">
              <Link to="/" className="inline-block group flex items-center gap-3">
                <img src="/logo.png" alt="Urban Shark Logo" className="h-10 w-auto object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-all" />
                <span className="text-3xl font-serif italic text-white group-hover:text-emerald-400 transition-colors duration-300">Urban Shark</span>
              </Link>
              <p className="mt-8 max-w-xs text-[11px] uppercase tracking-widest leading-loose font-bold">
                Excellence in Corporate Gifting. Curating high-quality pieces that reflect timeless values and traditions.
              </p>
              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center group-hover:bg-emerald-800 transition-colors">
                    <Phone size={14} className="text-stone-400 group-hover:text-white" />
                  </div>
                  <a href="tel:+917909096738" className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-white transition-colors">+91 79090 96738</a>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center group-hover:bg-green-800 transition-colors">
                    <MessageCircle size={14} className="text-stone-400 group-hover:text-white" />
                  </div>
                  <a href="https://wa.me/917909096738" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-white transition-colors">+91 79090 96738 (WhatsApp)</a>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center group-hover:bg-amber-800 transition-colors">
                    <Mail size={14} className="text-stone-400 group-hover:text-white" />
                  </div>
                  <a href="mailto:support@corporategifting.store" className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-white transition-colors whitespace-nowrap">support@corporategifting.store</a>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-white text-[10px] uppercase tracking-[0.3em] font-bold mb-8">The Shop</h3>
              <ul className="space-y-4 text-[10px] uppercase tracking-widest font-bold">
                <li><a href="/products" className="hover:text-white transition-colors">All Gifts</a></li>
                <li><a href="/products?category=Tech" className="hover:text-white transition-colors">Tech Gifts</a></li>
                <li><a href="/products?category=Bags" className="hover:text-white transition-colors">Corporate Bags</a></li>
                <li><a href="/products?category=Drinkware" className="hover:text-white transition-colors">Drinkware</a></li>
                <li><a href="/products?category=Hampers" className="hover:text-white transition-colors">Gift Hampers</a></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-white text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Support</h3>
              <ul className="space-y-4 text-[10px] uppercase tracking-widest font-bold">
                <li><a href="/#corporate-services" className="hover:text-white transition-colors">Industry Solutions</a></li>
                <li><a href="/bulk-orders" className="hover:text-white transition-colors">Bulk Orders</a></li>
                <li><a href="/custom-branding" className="hover:text-white transition-colors">Custom Branding</a></li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <h3 className="text-white text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Newsletter</h3>
              <p className="text-[10px] uppercase tracking-widest font-bold mb-6">Join our inner circle for exclusive previews.</p>
              <div className="flex border-b border-stone-700 pb-2">
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="bg-transparent border-none text-[10px] uppercase tracking-widest font-bold w-full focus:outline-none focus:ring-0 placeholder:text-stone-700"
                />
                <button className="text-white text-[10px] uppercase tracking-widest font-bold ml-4">Join</button>
              </div>
            </div>
          </div>
          <div className="mt-24 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.3em] font-bold">
            <p>&copy; {new Date().getFullYear()} Urban Shark Corporate. All rights reserved.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
