import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

const quotes = [
  { text: 'The world is a book and those who do not travel read only one page.', author: 'Saint Augustine' },
  { text: 'Travel is the only thing you buy that makes you richer.', author: 'Unknown' },
  { text: 'To travel is to live.', author: 'Hans Christian Andersen' },
  { text: 'Adventure awaits those who seek it.', author: 'Unknown' },
  { text: 'Travel makes you realize how much you don\'t know.', author: 'Unknown' },
];

export default function Login() {
  const { loginRequest, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
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

  const quote = quotes[quoteIndex];

  return (
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
