-- Traveloop PostgreSQL schema (normalized & extended)
-- Example: psql $DATABASE_URL -f schema.sql

<<<<<<< HEAD
-- Users table with profile enhancements
=======
-- Users
>>>>>>> 093d26ac37a8a17e626dd7426b808f36fec1f45d
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
<<<<<<< HEAD
  theme VARCHAR(10) DEFAULT 'light',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Trips table (main planning entity)
=======
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trips
>>>>>>> 093d26ac37a8a17e626dd7426b808f36fec1f45d
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  cover_image_url TEXT,
  total_budget NUMERIC(12, 2),
  budget_currency VARCHAR(3) DEFAULT 'USD',
  cover_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

<<<<<<< HEAD
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);

-- Stops (cities/locations) - normalized
=======
-- Stops (Cities/Destinations in a Trip)
>>>>>>> 093d26ac37a8a17e626dd7426b808f36fec1f45d
CREATE TABLE IF NOT EXISTS stops (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_name VARCHAR(255) NOT NULL,
<<<<<<< HEAD
  country VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  arrival_date DATE,
  departure_date DATE,
  position INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
=======
  position INTEGER NOT NULL DEFAULT 0, -- For drag-and-drop reordering
  arrival_date DATE,
  departure_date DATE
>>>>>>> 093d26ac37a8a17e626dd7426b808f36fec1f45d
);
CREATE INDEX IF NOT EXISTS idx_stops_trip_id ON stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_stops_position ON stops(trip_id, position);

<<<<<<< HEAD
-- Activities (events/things to do)
=======
-- Activities (Things to do in a Stop)
>>>>>>> 093d26ac37a8a17e626dd7426b808f36fec1f45d
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  stop_id INTEGER NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'other',
  estimated_cost NUMERIC(12, 2) DEFAULT 0,
<<<<<<< HEAD
  duration_minutes INTEGER,
  description TEXT,
  scheduled_time TIME,
  position INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
=======
  position INTEGER NOT NULL DEFAULT 0, -- For drag-and-drop reordering
  scheduled_time TIMESTAMPTZ
>>>>>>> 093d26ac37a8a17e626dd7426b808f36fec1f45d
);
CREATE INDEX IF NOT EXISTS idx_activities_stop_id ON activities(stop_id);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);

<<<<<<< HEAD
-- Budget breakdown (normalized for better reporting)
CREATE TABLE IF NOT EXISTS budget_entries (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES activities(id) ON DELETE SET NULL,
  category VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50),
  date_paid DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budget_trip ON budget_entries(trip_id);
CREATE INDEX IF NOT EXISTS idx_budget_category ON budget_entries(category);

-- Packing list items
CREATE TABLE IF NOT EXISTS packing_items (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  is_packed BOOLEAN NOT NULL DEFAULT FALSE,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_packing_trip ON packing_items(trip_id);

-- Journal/notes for trips
CREATE TABLE IF NOT EXISTS trip_notes (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  stop_id INTEGER REFERENCES stops(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  mood VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_trip ON trip_notes(trip_id);

-- User sessions for secure cookie-based auth
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON user_sessions(expires_at);
=======
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
>>>>>>> 093d26ac37a8a17e626dd7426b808f36fec1f45d
