import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Phone, Mail, X, MessageSquare } from 'lucide-react';

const CONTACT_INFO = {
  whatsapp: '917909096738',
  phone: '+917909096738',
  email: 'support@corporategifting.store'
};

const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      href: `https://wa.me/${CONTACT_INFO.whatsapp}`,
      color: 'bg-green-500',
    },
    {
      icon: Phone,
      label: 'Call Us',
      href: `tel:${CONTACT_INFO.phone}`,
      color: 'bg-blue-500',
    },
    {
      icon: Mail,
      label: 'Email',
      href: `mailto:${CONTACT_INFO.email}`,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[60] lg:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="flex flex-col-reverse items-end gap-3 mb-4"
          >
            {actions.map((action, i) => (
              <motion.a
                key={action.label}
                href={action.href}
                target={action.label === 'WhatsApp' ? '_blank' : undefined}
                rel={action.label === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 group"
              >
                <span className="bg-white px-3 py-1.5 rounded-lg shadow-md text-[10px] uppercase tracking-widest font-bold text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {action.label}
                </span>
                <div className={`w-12 h-12 ${action.color} text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 hover:scale-110`}>
                  <action.icon size={20} />
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 ${isOpen ? 'bg-stone-800' : 'bg-emerald-600'} text-white rounded-full flex items-center justify-center shadow-2xl z-20 relative`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default FloatingContact;
