import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function TripCard({ trip, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${trip.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api(`/api/trips/${trip.id}`, { method: 'DELETE' });
      toast.success('Trip deleted');
      onDelete(trip.id);
    } catch (err) {
      toast.error(err.message || 'Could not delete trip');
      setDeleting(false);
    }
  }

  const start = formatDate(trip.start_date);
  const end = formatDate(trip.end_date);
  const duration =
    trip.start_date && trip.end_date
      ? Math.max(1, Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000))
      : null;

  return (
    <li className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-300 hover:shadow-md">
      <Link to={`/trips/${trip.id}/itinerary`} className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900 group-hover:text-teal-700">{trip.name}</h2>
          {trip.is_public && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
              Public
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-500">{trip.description || 'No description'}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          {start && (
            <span className="flex items-center gap-1">
              📅 {start} {end ? `— ${end}` : ''}
            </span>
          )}
          {duration && <span className="flex items-center gap-1">⏱ {duration}d</span>}
          {trip.total_budget && (
            <span className="flex items-center gap-1">💰 ${Number(trip.total_budget).toLocaleString()}</span>
          )}
        </div>
      </Link>
      <div className="flex border-t border-slate-100">
        <Link
          to={`/trips/${trip.id}/itinerary`}
          className="flex-1 py-2.5 text-center text-xs font-semibold text-teal-600 hover:bg-teal-50"
        >
          Itinerary
        </Link>
        <Link
          to={`/trips/${trip.id}/budget`}
          className="flex-1 py-2.5 text-center text-xs font-semibold text-slate-500 hover:bg-slate-50"
        >
          Budget
        </Link>
        <Link
          to={`/trips/${trip.id}/packing`}
          className="flex-1 py-2.5 text-center text-xs font-semibold text-slate-500 hover:bg-slate-50"
        >
          Packing
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
        >
          {deleting ? '…' : 'Delete'}
        </button>
      </div>
    </li>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api('/api/trips');
        if (!cancelled) setTrips(data);
      } catch (err) {
        toast.error(err.message || 'Could not load trips');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const upcoming = trips.filter((t) => !t.end_date || new Date(t.end_date) >= new Date());
  const past = trips.filter((t) => t.end_date && new Date(t.end_date) < new Date());

  function removeTrip(id) {
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div>
      <div className="mb-8 grid gap-6 xl:grid-cols-[1.4fr,0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} ✨
              </h1>
              <p className="mt-2 max-w-2xl text-slate-500">
                Your travel hub now includes a richer profile area, phone verification, and quick discovery tools for <Link to="/explore/events" className="text-primary hover:underline">events</Link>, <Link to="/explore/hotels" className="text-primary hover:underline">hotels</Link>, and <Link to="/explore/restaurants" className="text-primary hover:underline">restaurants</Link>.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl font-bold text-amber-700">
                {user?.name?.charAt(0)?.toUpperCase() || 'T'}
              </span>
              <div>
                <p className="text-sm text-slate-500">Profile ready</p>
                <Link
                  to="/profile"
                  className="mt-1 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-dark"
                >
                  Edit profile
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm uppercase tracking-wide text-slate-400">Trips</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{trips.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm uppercase tracking-wide text-slate-400">Verified phone</p>
              <p className="mt-3 text-3xl font-bold text-teal-700">{user?.phone || 'No phone'}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm uppercase tracking-wide text-slate-400">Next step</p>
              <Link to="/explore/events" className="mt-3 block text-3xl font-bold text-slate-900 hover:text-primary">
                Explore more
              </Link>
            </div>
          </div>
        </section>
        <section className="grid gap-4">
          <Link
            to="/plan-ai"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">AI Planner</p>
            <h2 className="mt-4 text-xl font-bold text-slate-900">Build trips in seconds</h2>
            <p className="mt-2 text-sm text-slate-500">Tell the AI your mood and get a curated itinerary instantly.</p>
          </Link>
          <Link
            to="/explore/events"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">Events</p>
            <h2 className="mt-4 text-xl font-bold text-slate-900">Find local experiences</h2>
            <p className="mt-2 text-sm text-slate-500">Search festivals, exhibitions, and shows with category filters.</p>
          </Link>
          <Link
            to="/explore/restaurants"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Restaurants</p>
            <h2 className="mt-4 text-xl font-bold text-slate-900">Reserve the best tables</h2>
            <p className="mt-2 text-sm text-slate-500">Browse top restaurants and nearby hotel stays.</p>
          </Link>
        </section>
      </div>

      {loading ? (
        <Spinner className="py-24" />
      ) : trips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mb-4 text-5xl">🗺️</div>
          <p className="text-lg font-semibold text-slate-700">No trips yet</p>
          <p className="mt-2 text-slate-500">Create your first trip and start building your itinerary.</p>
          <Link
            to="/trips/new"
            className="mt-6 inline-block rounded-xl bg-teal-600 px-6 py-3 font-bold text-white hover:bg-teal-700"
          >
            Create a trip
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-600">Upcoming</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {upcoming.map((trip) => (
                  <TripCard key={trip.id} trip={trip} onDelete={removeTrip} />
                ))}
              </ul>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Past trips</h2>
              <ul className="grid gap-4 sm:grid-cols-2 opacity-75">
                {past.map((trip) => (
                  <TripCard key={trip.id} trip={trip} onDelete={removeTrip} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
