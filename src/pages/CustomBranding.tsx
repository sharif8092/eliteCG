import React from 'react';
import { motion } from 'motion/react';
import { 
  Palette, 
  Scissors, 
  Maximize, 
  Droplets,
  ArrowRight,
  Shield,
  CheckCircle2,
  Sparkle
} from 'lucide-react';
import { useQuotation } from '../hooks/useQuotation';
import { useCart } from '../context/CartContext';
import QuotationForm from '../components/QuotationForm';
import { useState } from 'react';

const CustomBranding: React.FC = () => {
  const { getQuotationLink, isMobile } = useQuotation();
  const { items } = useCart();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const techniques = [
    {
      title: "Screen Printing",
      description: "The gold standard for vibrant, long-lasting colors on apparel and fabric. Ideal for bold logos and large-scale bulk orders.",
      icon: <Palette size={32} className="text-emerald-600" />,
      features: ["PMS Color Matching", "Durable Finish", "Great for Cotton"],
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Premium Embroidery",
      description: "Adds a textured, three-dimensional look to caps, polo shirts, and bags. Perfect for a high-end, classic professional feel.",
      icon: <Scissors size={32} className="text-stone-900" />,
      features: ["Precision Threading", "3D Puff Options", "Fade Resistant"],
      image: "https://images.unsplash.com/photo-1574182215816-ae560dd4594e?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Laser Engraving",
      description: "A permanent, precise etching technique for metal, wood, and leather. Delivers a sophisticated, understated luxury aesthetic.",
      icon: <Maximize size={32} className="text-emerald-700" />,
      features: ["Permanent Etching", "Micro-Detailing", "Metallic Finishes"],
      image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "UV Digital Printing",
      description: "High-resolution full-color printing using UV-cured inks. Perfect for tech gifts, power banks, and flat hard surfaces.",
      icon: <Droplets size={32} className="text-stone-900" />,
      features: ["Full Color Gradient", "Quick Turnaround", "High Resolution"],
      image: "https://images.unsplash.com/photo-1562648111-2eb2617f698b?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="pt-32 pb-24 px-4 bg-stone-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-8"
          >
            <Sparkle size={14} className="text-emerald-600" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-800">Master Craftsmanship</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-serif text-stone-900 leading-[1.1] mb-10"
          >
            Expert <span className="italic block text-stone-400">Custom Branding</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-stone-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
          >
            We transform products into brand ambassadors through precision techniques and meticulous quality control.
          </motion.p>
        </div>
      </section>

      {/* Techniques Display */}
      <section className="py-32 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="space-y-40">
          {techniques.map((tech, idx) => (
            <div key={tech.title} className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-20`}>
              {/* Content */}
              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 1 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1 space-y-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center shadow-sm">
                  {tech.icon}
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-stone-900">{tech.title}</h2>
                <p className="text-stone-500 text-lg font-light leading-relaxed">
                  {tech.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {tech.features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-[11px] uppercase tracking-widest font-bold text-stone-400">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Image Box */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex-1 relative aspect-[4/3] w-full"
              >
                <div className="absolute inset-0 bg-stone-100 rounded-[3rem] overflow-hidden">
                  <img 
                    src={tech.image} 
                    alt={tech.title} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
                {/* Decorative Elements */}
                <div className={`absolute -bottom-10 ${idx % 2 === 1 ? '-left-10' : '-right-10'} w-40 h-40 bg-stone-50 rounded-full flex items-center justify-center shadow-xl border border-stone-100`}>
                   <Shield className="text-emerald-600/20" size={60} />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-24 bg-stone-900 text-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="max-w-xl">
              <h3 className="text-3xl font-serif mb-6 italic">Brand Consistency Guaranteed</h3>
              <p className="text-stone-400 font-light text-sm uppercase tracking-widest leading-loose">
                We strictly adhere to your brand guidelines. Our internal quality audit ensures that every piece leaving our facility meets international standards of excellence.
              </p>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => setIsFormOpen(true)}
                className="px-10 py-5 bg-white text-stone-900 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all shadow-xl text-center"
              >
                Get Branding Quote
              </button>
              <button className="px-10 py-5 border border-stone-700 text-white rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-stone-800 transition-all">
                Download Catalog
              </button>
           </div>
        </div>
      </section>

      <QuotationForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        items={items}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default CustomBranding;
