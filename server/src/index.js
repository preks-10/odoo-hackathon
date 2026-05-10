import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import tripsRoutes from './routes/trips.js';
import stopsRoutes from './routes/stops.js';
import activitiesRoutes from './routes/activities.js';
import packingRoutes from './routes/packing.js';
import shareRoutes from './routes/share.js';
import notesRoutes from './routes/notes.js';
import profileRoutes from './routes/profile.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'Traveloop API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/trips/:tripId/notes', notesRoutes);
app.use('/api/stops', stopsRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/packing', packingRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/profile', profileRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Traveloop API listening on http://localhost:${PORT}`);
});