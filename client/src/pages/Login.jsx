import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  "The world is a book and those who do not travel read only one page.",
  "Not all those who wander are lost.",
  "Life is either a daring adventure or nothing at all."
];

export default function Login() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [isLogin, setIsLogin] = useState(true);

  // Rotate quote every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen w-full bg-neutral-900 text-white font-sans">
      {/* Left side: Cinemagraph/Image & Quotes */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
          alt="Travel Landscape" 
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end h-full p-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">Traveloop</h1>
          <div className="h-24">
            <AnimatePresence mode="wait">
              <motion.p 
                key={quoteIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="text-2xl font-light italic text-neutral-200"
              >
                "{quotes[quoteIdx]}"
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right side: Glassmorphic Auth Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-24 bg-neutral-900 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 p-10 rounded-3xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-2 text-white">
            {isLogin ? 'Welcome back' : 'Start your journey'}
          </h2>
          <p className="text-neutral-400 mb-8">
            {isLogin ? 'Enter your details to access your trips.' : 'Create an account to build your itinerary.'}
          </p>

          <form className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                  <input type="text" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-neutral-500" placeholder="John Doe" />
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
              <input type="email" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-neutral-500" placeholder="hello@traveloop.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Password</label>
              <input type="password" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-neutral-500" placeholder="••••••••" />
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button" 
              className="w-full bg-white text-black font-semibold rounded-xl px-4 py-3 hover:bg-neutral-200 transition-colors"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-neutral-400 hover:text-white transition-colors">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
