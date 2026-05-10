import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  { text: 'The world is a book and those who do not travel read only one page.', author: 'Saint Augustine' },
  { text: 'Travel is the only thing you buy that makes you richer.', author: 'Unknown' },
  { text: 'To travel is to live.', author: 'Hans Christian Andersen' },
  { text: 'Adventure awaits those who seek it.', author: 'Unknown' },
  { text: 'Travel makes you realize how much you don’t know.', author: 'Unknown' },
];

export default function Login() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [isLogin, setIsLogin] = useState(true);

  // rotate quotes
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const quote = quotes[quoteIdx];

  return (
    <div className="flex h-screen w-full bg-neutral-900 text-white font-sans">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
          alt="Travel"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative z-10 flex flex-col justify-end h-full p-16">
          <h1 className="text-4xl font-bold mb-4">Traveloop</h1>

          <div className="h-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-2xl italic text-neutral-200">
                  "{quote.text}"
                </p>
                <p className="text-sm text-neutral-400 mt-2">
                  — {quote.author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-24 relative">

        {/* glow background */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-20" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 p-10 rounded-3xl"
        >

          <h2 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome back' : 'Start your journey'}
          </h2>

          <p className="text-neutral-400 mb-8">
            {isLogin
              ? 'Sign in to continue planning your trips.'
              : 'Create an account to get started.'}
          </p>

          <form className="space-y-5">

            {!isLogin && (
              <div>
                <label className="text-sm text-neutral-300">Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full mt-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3"
                />
              </div>
            )}

            <div>
              <label className="text-sm text-neutral-300">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full mt-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-300">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3"
              />
            </div>

            <button
              type="button"
              className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-neutral-200 transition"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-6 text-sm text-neutral-400 hover:text-white w-full text-center"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>

        </motion.div>
      </div>
    </div>
  );
}