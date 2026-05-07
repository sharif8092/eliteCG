import React from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  Printer, 
  Percent, 
  Truck, 
  ArrowRight, 
  MessageCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useQuotation } from '../hooks/useQuotation';
import { useCart } from '../context/CartContext';
import QuotationForm from '../components/QuotationForm';
import { useState } from 'react';
import SEO from '../components/SEO';

const BulkOrders: React.FC = () => {
  const { getQuotationLink, isMobile } = useQuotation();
  const { items } = useCart();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const sections = [
    {
      title: "Minimum Order Quantity",
      description: "Our standard MOQ starts at 50 units for most collections, ensuring we can maintain premium branding quality and bulk logistics efficiency.",
      icon: <Package size={32} className="text-emerald-600" />,
      features: ["Starts from 50 Units", "Sample Approval", "Mix & Match Options"]
    },
    {
      title: "Logo Printing & Branding",
      description: "State-of-the-art branding facilities specializing in high-precision screen printing, digital printing, and luxury metal plating.",
      icon: <Printer size={32} className="text-stone-900" />,
      features: ["PMS Color Matching", "Vector Art Support", "Proofing Service"]
    },
    {
      title: "Bulk Discounts",
      description: "Dynamic tiered pricing models designed for massive scale. The larger your order, the more significant the cost optimization.",
      icon: <Percent size={32} className="text-emerald-700" />,
      features: ["50-200: Standard", "200-500: Premium", "1000+: Institutional"]
    },
    {
      title: "Delivery Timeline",
      description: "Expedited production cycles with transparent tracking. Standard bulk delivery ranges from 10-15 business days locally.",
      icon: <Truck size={32} className="text-stone-900" />,
      features: ["10-15 Day Cycles", "Express Air Freight", "Global Logistics"]
    }
  ];

  return (
    <div className="bg-stone-50 min-h-screen">
      <SEO 
        title="Enterprise Gifting Solutions | Bulk Orders Simplified"
        description="Professional bulk gifting solutions for enterprises. Tiered pricing, custom branding, and Pan-India logistics for large-scale corporate requirements."
        keywords="Bulk Corporate Gifting, Enterprise Gifting Solutions, Wholesale Business Gifts, Corporate Gifting Logistics"
      />
      {/* Header */}
      <section className="bg-white py-24 border-b border-stone-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-6"
            >
              <Zap className="text-emerald-600 fill-emerald-600" size={16} />
              <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-stone-900">Enterprise Solutions</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif text-stone-900 leading-tight mb-8"
            >
              Bulk Orders <span className="italic block text-emerald-900">Simplified.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-stone-500 text-lg font-light leading-relaxed max-w-2xl"
            >
              From corporate events to employee recognition programs, we provide seamless bulk fulfillment with unmatched attention to detail.
            </motion.p>
          </div>
        </div>
        
        {/* Animated Background SVG */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <motion.circle 
              cx="200" cy="200" r="150" 
              stroke="currentColor" strokeWidth="1" fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.rect 
              x="50" y="50" width="300" height="300"
              stroke="currentColor" strokeWidth="0.5" fill="none"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>
      </section>

      {/* Workflow Sections */}
      <section className="py-32 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-stone-200">
          {sections.map((section, idx) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white p-12 md:p-20 group hover:bg-stone-50/50 transition-all duration-700"
            >
              <div className="mb-10 w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-500 shadow-sm">
                {section.icon}
              </div>
              <h3 className="text-3xl font-serif text-stone-900 mb-6">{section.title}</h3>
              <p className="text-stone-500 font-light leading-relaxed mb-10 max-w-md">
                {section.description}
              </p>
              <ul className="space-y-4">
                {section.features.map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-stone-400 group-hover:text-stone-900 transition-colors">
                    <ShieldCheck size={14} className="text-emerald-500 opacity-60" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote CTA */}
      <section className="bg-stone-950 py-32 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-serif text-white mb-12"
          >
            Ready to <span className="italic text-emerald-400">Transform</span> Your Corporate Gifting?
          </motion.h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button 
              onClick={() => setIsFormOpen(true)}
              className="px-12 py-6 bg-emerald-600 text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-900/40"
            >
              Request Bulk Quote
            </button>
            <a 
              href="https://wa.me/917909096738"
              className="flex items-center gap-3 text-white font-bold text-xs uppercase tracking-[0.2em] group"
            >
              <MessageCircle size={20} className="text-emerald-400" />
              Speak to Consultant
              <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
        
        {/* Background Visual */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 L100 0 L100 100 Z" fill="rgba(16, 185, 129, 0.2)" />
          </svg>
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

export default BulkOrders;
