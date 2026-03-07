import React from 'react';
import Navbar from './Navbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-stone-900 text-stone-500 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-4">
              <span className="text-3xl font-serif italic text-white">Ababil</span>
              <p className="mt-8 max-w-xs text-[11px] uppercase tracking-widest leading-loose font-bold">
                Curating high-quality pieces that reflect timeless values and traditions.
              </p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-white text-[10px] uppercase tracking-[0.3em] font-bold mb-8">The Shop</h3>
              <ul className="space-y-4 text-[10px] uppercase tracking-widest font-bold">
                <li><a href="/products" className="hover:text-white transition-colors">All Products</a></li>
                <li><a href="/products?category=Abaya" className="hover:text-white transition-colors">Abayas</a></li>
                <li><a href="/products?category=Kurta" className="hover:text-white transition-colors">Kurtas</a></li>
                <li><a href="/products?category=Itter" className="hover:text-white transition-colors">Fragrances</a></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-white text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Company</h3>
              <ul className="space-y-4 text-[10px] uppercase tracking-widest font-bold">
                <li><a href="/products?category=Janamaz" className="hover:text-white transition-colors">Prayer Mats</a></li>
                <li><a href="/products?category=Tasbih" className="hover:text-white transition-colors">Tasbih</a></li>
                <li><a href="/products?category=Home+Decor" className="hover:text-white transition-colors">Home Decor</a></li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <h3 className="text-white text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Newsletter</h3>
              <p className="text-[10px] uppercase tracking-widest font-bold mb-6">Join our curated mailing list.</p>
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
            <p>&copy; {new Date().getFullYear()} Ababil. All rights reserved.</p>
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
