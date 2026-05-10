<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
=======
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  "The world is a book and those who do not travel read only one page.",
  "Not all those who wander are lost.",
  "Life is either a daring adventure or nothing at all."
];
>>>>>>> 093d26ac37a8a17e626dd7426b808f36fec1f45d

const quotes = [
  { text: 'The world is a book and those who do not travel read only one page.', author: 'Saint Augustine' },
  { text: 'Travel is the only thing you buy that makes you richer.', author: 'Unknown' },
  { text: 'To travel is to live.', author: 'Hans Christian Andersen' },
  { text: 'Adventure awaits those who seek it.', author: 'Unknown' },
  { text: 'Travel makes you realize how much you don\'t know.', author: 'Unknown' },
];

export default function Login() {
<<<<<<< HEAD
  const { loginRequest, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
=======
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [isLogin, setIsLogin] = useState(true);
>>>>>>> 093d26ac37a8a17e626dd7426b808f36fec1f45d

  // Rotate quote every 5s
  useEffect(() => {
<<<<<<< HEAD
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function validate() {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await loginRequest({ email: email.trim(), password });
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }
=======
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
>>>>>>> 093d26ac37a8a17e626dd7426b808f36fec1f45d

  const quote = quotes[quoteIndex];

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen bg-slate-900">
      {/* Left side: Cinemagraph + Quotes */}
      <div className="hidden w-1/2 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-800 lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-teal-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber-600/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md">
              <span className="text-4xl font-black text-white">✈️</span>
            </div>
          </motion.div>

          <h1 className="mb-4 text-5xl font-black text-white">Traveloop</h1>
          <p className="mb-16 text-lg text-slate-300">Plan your perfect adventure</p>

          {/* Rotating quotes */}
          <div className="h-32 w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <p className="text-xl font-semibold text-white italic">"{quote.text}"</p>
                <p className="text-sm text-slate-400">— {quote.author}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quote indicators */}
          <div className="mt-12 flex gap-2">
            {quotes.map((_, idx) => (
              <motion.div
                key={idx}
                className={`h-2 rounded-full transition-all ${idx === quoteIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                animate={{ scale: idx === quoteIndex ? 1 : 0.8 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Glassmorphic Form */}
      <div className="flex w-full items-center justify-center px-4 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          <div className="space-y-8">
            <div className="space-y-2 lg:hidden">
              <h1 className="text-3xl font-black text-white">Traveloop</h1>
              <p className="text-slate-400">Sign in to plan your next adventure</p>
            </div>

            {/* Glassmorphic Card */}
            <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
              <div>
                <h2 className="text-2xl font-bold text-white">Sign in</h2>
                <p className="mt-1 text-sm text-slate-400">Enter your email and password</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 backdrop-blur-sm outline-none transition focus:border-teal-400/50 focus:ring-2 focus:ring-teal-500/20"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 backdrop-blur-sm outline-none transition focus:border-teal-400/50 focus:ring-2 focus:ring-teal-500/20"
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password}</p>}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:shadow-teal-500/50 disabled:opacity-60"
                >
                  {loading ? <Spinner className="py-0" /> : 'Sign in'}
                </motion.button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-sm transition hover:bg-white/10"
                >
                  Google
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-sm transition hover:bg-white/10"
                >
                  GitHub
                </button>
              </div>
            </div>

            <div className="text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-teal-400 hover:text-teal-300">
                Create one
              </Link>
            </div>
=======
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
>>>>>>> 093d26ac37a8a17e626dd7426b808f36fec1f45d
          </div>
        </motion.div>
      </div>
    </div>
  );
}
