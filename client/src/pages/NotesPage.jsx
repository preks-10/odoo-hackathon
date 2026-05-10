import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api.js';
import Spinner from '../components/Spinner.jsx';
import TripSubNav from '../components/TripSubNav.jsx';
import { useTrip } from '../hooks/useTrip.js';

function formatDateTime(d) {
  if (!d) return '';
  return new Date(d).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function NotesPage() {
  const { id } = useParams();
  const tripId = Number(id);
  const { trip, loading: tripLoading } = useTrip(tripId);
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [content, setContent] = useState('');
  const [stopId, setStopId] = useState('');
  const [adding, setAdding] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function loadNotes() {
    setNotesLoading(true);
    try {
      const data = await api(`/api/trips/${tripId}/notes`);
      setNotes(data);
    } catch (err) {
      toast.error(err.message || 'Could not load notes');
    } finally {
      setNotesLoading(false);
    }
  }

  useEffect(() => { if (tripId) loadNotes(); }, [tripId]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!content.trim()) { toast.error('Note cannot be empty'); return; }
    setAdding(true);
    try {
      const note = await api(`/api/trips/${tripId}/notes`, {
        method: 'POST',
        body: { content: content.trim(), stop_id: stopId ? Number(stopId) : null },
      });
      setNotes((prev) => [note, ...prev]);
      setContent('');
      setStopId('');
      toast.success('Note added');
    } catch (err) {
      toast.error(err.message || 'Could not add note');
    } finally {
      setAdding(false);
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editContent.trim()) { toast.error('Note cannot be empty'); return; }
    setSaving(true);
    try {
      const updated = await api(`/api/trips/${tripId}/notes/${editNote.id}`, {
        method: 'PUT',
        body: { content: editContent.trim() },
      });
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setEditNote(null);
      toast.success('Note updated');
    } catch (err) {
      toast.error(err.message || 'Could not update note');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(noteId) {
    if (!window.confirm('Delete this note?')) return;
    setDeletingId(noteId);
    try {
      await api(`/api/trips/${tripId}/notes/${noteId}`, { method: 'DELETE' });
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      toast.success('Note deleted');
    } catch (err) {
      toast.error(err.message || 'Could not delete note');
    } finally {
      setDeletingId(null);
    }
  }

  if (tripLoading) return <div><TripSubNav /><Spinner className="py-20" /></div>;
  if (!trip) return (
    <div>
      <Link to="/dashboard" className="text-sm font-medium text-primary hover:underline">← Dashboard</Link>
      <p className="mt-6 text-slate-600">Trip not found.</p>
    </div>
  );

  const stops = trip.stops || [];

  return (
    <div>
      <div className="mb-2">
        <Link to="/dashboard" className="text-sm font-medium text-primary hover:underline">← Dashboard</Link>
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Notes & Journal · {trip.name}</h1>
      <p className="mt-1 text-slate-600">Jot down reminders, check-in info, or anything trip-related.</p>

      <TripSubNav />

      {/* Add note form */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-slate-800">Add a note</h2>
        <form onSubmit={handleAdd} className="space-y-3">
          <textarea
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
            placeholder="Write your note here… (hotel check-in info, local contacts, reminders)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {stops.length > 0 && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Link to a stop (optional)
              </label>
              <select
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={stopId}
                onChange={(e) => setStopId(e.target.value)}
              >
                <option value="">No specific stop</option>
                {stops.map((s) => (
                  <option key={s.id} value={s.id}>{s.city_name}{s.country ? `, ${s.country}` : ''}</option>
                ))}
              </select>
            </div>
          )}
          <button
            type="submit"
            disabled={adding}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {adding ? 'Adding…' : 'Add note'}
          </button>
        </form>
      </div>

      {/* Notes list */}
      {notesLoading ? (
        <Spinner className="py-16" />
      ) : notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-500">No notes yet. Add your first one above.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => {
            const linkedStop = stops.find((s) => s.id === note.stop_id);
            return (
              <li key={note.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {editNote?.id === note.id ? (
                  <form onSubmit={handleSaveEdit} className="space-y-3">
                    <textarea
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={4}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button type="submit" disabled={saving}
                        className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                      <button type="button" onClick={() => setEditNote(null)}
                        className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap text-sm text-slate-800">{note.content}</p>
                    <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-400">
                      <span>
                        {linkedStop && (
                          <span className="mr-2 rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                            📍 {linkedStop.city_name}
                          </span>
                        )}
                        {formatDateTime(note.created_at)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditNote(note); setEditContent(note.content); }}
                          className="font-medium text-slate-500 hover:text-primary"
                        >Edit</button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          disabled={deletingId === note.id}
                          className="font-medium text-red-400 hover:text-red-600 disabled:opacity-50"
                        >{deletingId === note.id ? '…' : 'Delete'}</button>
                      </div>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}