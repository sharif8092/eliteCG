import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, MapPin, Save, Loader2, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

const Profile: React.FC = () => {
  const { profile, updateProfile, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-300 animate-pulse">Authenticating...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-3xl mb-16">
        <span className="text-emerald-800 text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Personal Identity</span>
        <h1 className="text-5xl md:text-7xl font-serif text-stone-900 leading-tight">
          Your <span className="italic">Profile</span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-24">
        <div className="w-full lg:w-1/3">
          <div className="bg-stone-50 rounded-[3rem] p-12 text-center space-y-8">
            <div className="w-32 h-32 bg-stone-200 rounded-full mx-auto flex items-center justify-center overflow-hidden">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-stone-400" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-serif text-stone-900">{profile.displayName || 'Unnamed Guest'}</h2>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-2">{profile.role}</p>
            </div>
            <div className="pt-8 border-t border-stone-100 flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-3 text-stone-400">
                <Mail size={14} />
                <span className="text-xs font-light">{profile.email}</span>
              </div>
            </div>

            {/* Admin Management Section */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-emerald-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-900/20"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                    <ShieldCheck size={28} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif italic">Admin Panel</h3>
                    <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Full Store Control</p>
                  </div>
                </div>
                <p className="text-sm text-emerald-100/70 mb-8 font-light leading-relaxed">
                  Manage products, view analytics, update blog posts, and control active offers.
                </p>
                <Link
                  to="/admin"
                  className="group flex items-center justify-between w-full bg-white text-emerald-900 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all"
                >
                  Manage Store
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex-grow">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-4">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full bg-transparent border-b border-stone-200 pl-8 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-all font-light"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                  <input
                    disabled
                    type="email"
                    value={formData.email}
                    className="w-full bg-transparent border-b border-stone-100 pl-8 py-3 text-stone-300 focus:outline-none font-light cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent border-b border-stone-200 pl-8 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-all font-light"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-4">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">Shipping Address</label>
                <div className="relative">
                  <MapPin className="absolute left-0 top-4 text-stone-300" size={16} />
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-transparent border-b border-stone-200 pl-8 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-all font-light resize-none"
                    placeholder="Your full address for deliveries"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <button
                disabled={loading}
                type="submit"
                className="bg-stone-900 text-white px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-4 hover:bg-emerald-900 transition-all shadow-2xl disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                <span>Save Changes</span>
              </button>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center space-x-2 text-emerald-600"
                  >
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Profile Updated</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
