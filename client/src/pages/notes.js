import { Router } from 'express';
import { pool } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

async function assertTripOwner(tripId, userId) {
  const r = await pool.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);
  return r.rows[0];
}

// GET /api/trips/:tripId/notes
router.get('/', async (req, res) => {
  try {
    const tripId = Number(req.params.tripId);
    if (!(await assertTripOwner(tripId, req.userId))) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    const result = await pool.query(
      `SELECT id, trip_id, stop_id, content, created_at
       FROM trip_notes WHERE trip_id = $1 ORDER BY created_at DESC`,
      [tripId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load notes' });
  }
});

// POST /api/trips/:tripId/notes
router.post('/', async (req, res) => {
  try {
    const tripId = Number(req.params.tripId);
    if (!(await assertTripOwner(tripId, req.userId))) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    const { content, stop_id } = req.body || {};
    if (!content?.trim()) {
      return res.status(400).json({ error: 'Note content is required' });
    }
    const result = await pool.query(
      `INSERT INTO trip_notes (trip_id, stop_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, trip_id, stop_id, content, created_at`,
      [tripId, stop_id || null, content.trim()],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PUT /api/trips/:tripId/notes/:noteId
router.put('/:noteId', async (req, res) => {
  try {
    const tripId = Number(req.params.tripId);
    const noteId = Number(req.params.noteId);
    if (!(await assertTripOwner(tripId, req.userId))) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    const { content } = req.body || {};
    if (!content?.trim()) {
      return res.status(400).json({ error: 'Note content is required' });
    }
    const result = await pool.query(
      `UPDATE trip_notes SET content = $1 WHERE id = $2 AND trip_id = $3
       RETURNING id, trip_id, stop_id, content, created_at`,
      [content.trim(), noteId, tripId],
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Note not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE /api/trips/:tripId/notes/:noteId
router.delete('/:noteId', async (req, res) => {
  try {
    const tripId = Number(req.params.tripId);
    const noteId = Number(req.params.noteId);
    if (!(await assertTripOwner(tripId, req.userId))) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    await pool.query('DELETE FROM trip_notes WHERE id = $1 AND trip_id = $2', [noteId, tripId]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;