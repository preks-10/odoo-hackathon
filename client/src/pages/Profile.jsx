import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [phoneVerified, setPhoneVerified] = useState(Boolean(user?.phone_verified));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setAvatar(user?.avatar || '');
    setPhoneVerified(Boolean(user?.phone_verified));
  }, [user]);

  function validateProfile() {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Name is required';
    if (!phone.trim()) nextErrors.phone = 'Phone is required';
    else if (!/^\d{10,}$/.test(phone.replace(/\D/g, ''))) nextErrors.phone = 'Enter at least 10 digits';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!validateProfile()) return;
    setLoading(true);
    try {
      const updated = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        avatar,
        phone_verified: phoneVerified,
      });
      setPhoneVerified(Boolean(updated.phone_verified));
      toast.success('Profile saved successfully');
    } catch (err) {
      toast.error(err.message || 'Could not save profile');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyPhone() {
    if (!phone.trim() || !/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
      toast.error('Enter a valid phone number with at least 10 digits');
      return;
    }
    setLoading(true);
    try {
      const updated = await updateProfile({ phone: phone.trim(), phone_verified: true });
      setPhoneVerified(Boolean(updated.phone_verified));
      toast.success('Phone number verified');
    } catch (err) {
      toast.error(err.message || 'Phone verification failed');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <Spinner className="py-24" />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  className="h-28 w-28 rounded-3xl object-cover shadow-inner"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-amber-100 text-4xl font-bold text-amber-700 shadow-inner">
                  {name?.charAt(0)?.toUpperCase() || 'T'}
                </div>
              )}
              <label className="absolute bottom-0 right-0 flex cursor-pointer items-center justify-center rounded-full bg-white p-2 text-slate-600 shadow transition hover:bg-slate-100">
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                ✎
              </label>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
              <p className="mt-2 max-w-2xl text-slate-500">
                Keep your travel profile fresh with an image, verified phone, and fast access to AI planning and local discovery.
              </p>
            </div>
          </div>
          <Link
            to="/plan-ai"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow hover:bg-primary-dark"
          >
            Plan with AI
          </Link>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-primary focus:border-primary focus:ring-2"
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="email"
              value={user.email}
              readOnly
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-500"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter at least 10 digits"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-primary focus:border-primary focus:ring-2"
            />
            {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Verification status</label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${phoneVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {phoneVerified ? 'Phone verified' : 'Not verified'}
              </span>
              <button
                type="button"
                onClick={handleVerifyPhone}
                disabled={loading}
                className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
              >
                {phoneVerified ? 'Re-verify' : 'Verify now'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? <Spinner className="py-0" /> : 'Save profile'}
          </button>
          <Link
            to="/explore/events"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Discover local events
          </Link>
        </div>
      </form>
    </div>
  );
}
