import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Profile form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [savingPw, setSavingPw] = useState(false);

  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api('/api/profile');
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        toast.error(err.message || 'Could not load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) { toast.error('Name and email are required'); return; }
    setSavingProfile(true);
    try {
      const updated = await api('/api/profile', {
        method: 'PUT',
        body: { name: name.trim(), email: email.trim() },
      });
      setProfile(updated);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Could not update profile');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!currentPw || !newPw || !confirmPw) { toast.error('All password fields are required'); return; }
    if (newPw !== confirmPw) { toast.error('New passwords do not match'); return; }
    if (newPw.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    setSavingPw(true);
    try {
      await api('/api/profile/password', {
        method: 'PUT',
        body: { current_password: currentPw, new_password: newPw },
      });
      toast.success('Password updated');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) {
      toast.error(err.message || 'Could not update password');
    } finally {
      setSavingPw(false);
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm('Delete your account? All your trips and data will be permanently removed.')) return;
    setDeletingAccount(true);
    try {
      await api('/api/profile', { method: 'DELETE' });
      logout();
      navigate('/login');
      toast.success('Account deleted');
    } catch (err) {
      toast.error(err.message || 'Could not delete account');
      setDeletingAccount(false);
    }
  }

  if (loading) return <Spinner className="py-24" />;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Profile & Settings</h1>

      {/* Profile info */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Account details</h2>
        <p className="mb-4 text-xs text-slate-400">
          Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}
        </p>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {savingProfile ? 'Saving…' : 'Save profile'}
          </button>
        </form>
      </section>

      {/* Change password */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Change password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Current password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">New password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Confirm new password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={savingPw}
            className="w-full rounded-lg bg-slate-700 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {savingPw ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="mb-2 text-base font-semibold text-red-700">Danger zone</h2>
        <p className="mb-4 text-sm text-red-600">
          Deleting your account is permanent. All trips, itineraries, and data will be erased.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deletingAccount}
          className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {deletingAccount ? 'Deleting…' : 'Delete my account'}
        </button>
      </section>
    </div>
  );
}