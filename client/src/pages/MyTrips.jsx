import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api.js';
import Spinner from '../components/Spinner.jsx';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editTrip, setEditTrip] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  async function loadTrips() {
    setLoading(true);
    try {
      const data = await api('/api/trips');
      setTrips(data);
    } catch (err) {
      toast.error(err.message || 'Could not load trips');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTrips(); }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this trip? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api(`/api/trips/${id}`, { method: 'DELETE' });
      toast.success('Trip deleted');
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      toast.error(err.message || 'Could not delete trip');
    } finally {
      setDeletingId(null);
    }
  }

  function openEdit(trip) {
    setEditTrip(trip);
    setEditForm({
      name: trip.name,
      description: trip.description || '',
      start_date: trip.start_date ? trip.start_date.slice(0, 10) : '',
      end_date: trip.end_date ? trip.end_date.slice(0, 10) : '',
      total_budget: trip.total_budget ?? '',
    });
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editForm.name?.trim()) { toast.error('Trip name is required'); return; }
    setSaving(true);
    try {
      const updated = await api(`/api/trips/${editTrip.id}`, {
        method: 'PUT',
        body: {
          name: editForm.name.trim(),
          description: editForm.description || null,
          start_date: editForm.start_date || null,
          end_date: editForm.end_date || null,
          total_budget: editForm.total_budget !== '' ? Number(editForm.total_budget) : null,
        },
      });
      setTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      toast.success('Trip updated');
      setEditTrip(null);
    } catch (err) {
      toast.error(err.message || 'Could not update trip');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Trips</h1>
          <p className="mt-1 text-slate-600">All your planned trips in one place.</p>
        </div>
        <Link
          to="/trips/new"
          className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 font-semibold text-white shadow hover:bg-accent-dark"
        >
          + Plan New Trip
        </Link>
      </div>

      {loading ? (
        <Spinner className="py-24" />
      ) : trips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-lg text-slate-600">You have no trips yet.</p>
          <Link to="/trips/new" className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 font-semibold text-white">
            Create a trip
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <li key={trip.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex-1 p-6">
                <h2 className="text-lg font-semibold text-slate-900">{trip.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{trip.description || 'No description'}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                  {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
                </p>
                {trip.total_budget != null && (
                  <p className="mt-1 text-xs text-slate-500">Budget: ${Number(trip.total_budget).toFixed(2)}</p>
                )}
              </div>
              <div className="flex items-center gap-2 border-t border-slate-100 px-6 py-3">
                <button
                  onClick={() => navigate(`/trips/${trip.id}/itinerary`)}
                  className="flex-1 rounded-lg bg-primary/10 py-1.5 text-sm font-medium text-primary hover:bg-primary/20"
                >
                  View
                </button>
                <button
                  onClick={() => openEdit(trip)}
                  className="flex-1 rounded-lg bg-slate-100 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(trip.id)}
                  disabled={deletingId === trip.id}
                  className="flex-1 rounded-lg bg-red-50 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  {deletingId === trip.id ? '…' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit modal */}
      {editTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Edit Trip</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Trip name *</label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Start date</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={editForm.start_date}
                    onChange={(e) => setEditForm((f) => ({ ...f, start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">End date</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={editForm.end_date}
                    onChange={(e) => setEditForm((f) => ({ ...f, end_date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Budget cap ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editForm.total_budget}
                  onChange={(e) => setEditForm((f) => ({ ...f, total_budget: e.target.value }))}
                  placeholder="Optional"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTrip(null)}
                  className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}