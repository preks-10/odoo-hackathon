-- Traveloop PostgreSQL schema (run once against your database)
-- Example: psql $DATABASE_URL -f schema.sql

-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trips
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  cover_image_url TEXT,
  total_budget NUMERIC(12, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stops (Cities/Destinations in a Trip)
CREATE TABLE IF NOT EXISTS stops (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_name VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL DEFAULT 0, -- For drag-and-drop reordering
  arrival_date DATE,
  departure_date DATE
);
CREATE INDEX IF NOT EXISTS idx_stops_trip_id ON stops(trip_id);

-- Activities (Things to do in a Stop)
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  stop_id INTEGER NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'other',
  estimated_cost NUMERIC(12, 2) DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0, -- For drag-and-drop reordering
  scheduled_time TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_activities_stop_id ON activities(stop_id);

-- Expenses (For Budget Intelligence)
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE
);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
