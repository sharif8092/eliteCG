import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { motion } from 'motion/react';
import { LogIn, Mail } from 'lucide-react';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate(redirect);
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('Localhost not authorized. Add it to Firebase Console.');
      } else {
        setError(err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMockAdminSignIn = () => {
    localStorage.setItem('auth_bypass', 'admin');
    window.location.href = redirect;
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-24 bg-[#FCFAF7]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-16">
          <span className="text-emerald-800 text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">The House of Ababil</span>
          <h1 className="text-6xl font-serif text-stone-900 mb-6 italic">Welcome</h1>
          <p className="text-stone-400 font-light leading-relaxed">
            Sign in to access your curated selection and manage your orders with ease.
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-bold animate-shake">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-4 bg-white border border-stone-100 text-stone-900 py-5 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-all shadow-xl shadow-stone-200/20 disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
            <span>Continue with Google</span>
          </button>

          {/* Local Dev Bypass */}
          {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
            <button
              onClick={handleMockAdminSignIn}
              className="w-full flex items-center justify-center space-x-4 bg-emerald-50 border border-emerald-100 text-emerald-800 py-5 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-100 transition-all"
            >
              <LogIn size={16} />
              <span>Sign in as Admin (Local Dev)</span>
            </button>
          )}

          <div className="relative py-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-100"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-bold">
              <span className="bg-[#FCFAF7] px-6 text-stone-300">Authentication</span>
            </div>
          </div>

          <button
            disabled
            className="w-full flex items-center justify-center space-x-4 bg-stone-50 text-stone-300 py-5 rounded-full font-bold text-[10px] uppercase tracking-widest cursor-not-allowed border border-stone-100"
          >
            <Mail size={16} />
            <span>Email Access (Soon)</span>
          </button>
        </div>

        <p className="mt-16 text-[9px] uppercase tracking-widest text-stone-300 font-bold leading-relaxed">
          By continuing, you agree to our <br />
          <a href="/terms" className="text-stone-400 hover:text-stone-900 transition-colors">Terms of Service</a> & <a href="/privacy" className="text-stone-400 hover:text-stone-900 transition-colors">Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
