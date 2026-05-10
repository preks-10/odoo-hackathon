import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import SmartSearch from './SmartSearch.jsx';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-teal-600 dark:text-teal-400">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white text-sm font-black">
              T
            </span>
            Traveloop
          </Link>
          
          <div className="hidden flex-1 max-w-md lg:block">
            <SmartSearch />
          </div>

          <nav className="flex flex-wrap items-center gap-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                }`
              }
            >
              My Trips
            </NavLink>
            <NavLink
              to="/plan-ai"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                }`
              }
            >
              Plan with AI
            </NavLink>
            <NavLink
              to="/explore/events"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                }`
              }
            >
              Events
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg border border-slate-200 px-3 py-2 text-lg transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            <Link
              to="/profile"
              className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 sm:inline-flex"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                  {user?.name?.charAt(0)?.toUpperCase() || 'P'}
                </span>
              )}
              {user?.name?.split(' ')[0] || 'Profile'}
            </Link>
            
            <button
              type="button"
              onClick={() => { logout(); navigate('/login'); }}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
        Traveloop — Built for Odoo Hackathon 🌍 | {new Date().getFullYear()}
      </footer>
    </div>
  );
}
