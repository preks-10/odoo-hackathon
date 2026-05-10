# Traveloop — World-Class Travel Platform

## Architecture Overview

**Tech Stack:**
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Styling**: Tailwind CSS + Framer Motion (animations) + Glassmorphism effects
- **Database**: PostgreSQL (Neon)
- **Backend**: Node.js + Express
- **Authentication**: JWT + HTTP-only cookies (planned)
- **UI Libraries**: dnd-kit (drag-drop), Recharts (charts), react-hot-toast (notifications)

---

## Folder Structure

```
odoo-hackathon/
├── client/                          # React Vite frontend
│   ├── src/
│   │   ├── api.js                   # API client with token management
│   │   ├── App.jsx                  # Route configuration
│   │   ├── index.css                # Global styles
│   │   ├── main.jsx                 # Entry point
│   │   ├── components/
│   │   │   ├── AppLayout.jsx        # Main app layout + nav
│   │   │   ├── SmartSearch.jsx      # Debounced search component
│   │   │   ├── Spinner.jsx          # Loading spinner
│   │   │   ├── TripSubNav.jsx       # Trip subnav
│   │   │   └── ProtectedRoute.jsx   # Route guard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state + methods
│   │   │   └── ThemeContext.jsx     # Dark/light mode toggle
│   │   ├── hooks/
│   │   │   └── useTrip.js           # Fetch trip data
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Premium split-screen login
│   │   │   ├── Register.jsx         # Signup form
│   │   │   ├── Dashboard.jsx        # Main trip list
│   │   │   ├── Profile.jsx          # User profile + phone verify
│   │   │   ├── AiPlan.jsx           # AI itinerary planner
│   │   │   ├── ExplorePage.jsx      # Events, restaurants, hotels
│   │   │   ├── CreateTrip.jsx       # Trip creation wizard
│   │   │   ├── ItineraryBuilder.jsx # Drag-drop itinerary editor
│   │   │   ├── ItineraryView.jsx    # Timeline view (animated)
│   │   │   ├── BudgetPage.jsx       # Budget tracking
│   │   │   ├── BudgetPageEnhanced.jsx # Budget dashboard (Recharts)
│   │   │   ├── PackingPage.jsx      # Packing checklist
│   │   │   ├── SharePage.jsx        # Public trip sharing
│   │   │   └── Journal.jsx          # Trip notes/journal (planned)
│   │   └── public/
│   ├── package.json
│   ├── tailwind.config.js           # Theme config with custom colors
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── index.html
│
├── server/                          # Node.js Express backend
│   ├── src/
│   │   ├── db.js                    # Database connection
│   │   ├── index.js                 # Express app setup + routes
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT verification
│   │   └── routes/
│   │       ├── auth.js              # /api/auth (register, login, profile)
│   │       ├── trips.js             # /api/trips (CRUD)
│   │       ├── stops.js             # /api/stops (cities)
│   │       ├── activities.js        # /api/activities (things to do)
│   │       ├── packing.js           # /api/packing
│   │       ├── share.js             # /api/share (public links)
│   │       └── budgets.js           # /api/budgets (planned)
│   ├── package.json
│   ├── schema.sql                   # Normalized database schema
│   └── .env
│
└── README.md
```

---

## Database Schema (PostgreSQL/Neon)

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  phone_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  password_hash VARCHAR(255) NOT NULL,
  theme VARCHAR(10) DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Trips Table
```sql
CREATE TABLE trips (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_public BOOLEAN DEFAULT FALSE,
  share_token VARCHAR(64) UNIQUE,
  total_budget NUMERIC(12, 2),
  budget_currency VARCHAR(3) DEFAULT 'USD',
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Stops Table (Cities/Locations)
```sql
CREATE TABLE stops (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_name VARCHAR(255) NOT NULL,
  country VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  arrival_date DATE,
  departure_date DATE,
  position INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Activities Table
```sql
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  stop_id INTEGER NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'other',
  estimated_cost NUMERIC(12, 2) DEFAULT 0,
  duration_minutes INTEGER,
  description TEXT,
  scheduled_time TIME,
  position INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Budget Entries Table
```sql
CREATE TABLE budget_entries (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES activities(id) ON DELETE SET NULL,
  category VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50),
  date_paid DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Packing Items Table
```sql
CREATE TABLE packing_items (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  is_packed BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Trip Notes (Journal) Table
```sql
CREATE TABLE trip_notes (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  stop_id INTEGER REFERENCES stops(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  mood VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### User Sessions (for HTTP-only cookies)
```sql
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Key Components & Features

### 1. Premium Login Page (`Login.jsx`)
- **Split-screen layout**: Left side with animated quotes, right side with form
- **Rotating quotes** on 5-second interval with smooth animations
- **Glassmorphic form** with backdrop blur effect
- **Dark gradient background** with animated accent shapes
- **Framer Motion animations** for smooth UX
- **Social login buttons** (Google, GitHub placeholder)

### 2. Itinerary View (`ItineraryView.jsx`)
- **Timeline visualization** with animated timeline dots
- **Staggered animations** for stops and activities
- **Summary cards** showing trip stats (days, activities, budget)
- **Activity details** with categories, times, durations, costs
- **Glassmorphic cards** with hover effects
- **Responsive design** for mobile and desktop

### 3. Budget Intelligence Dashboard (`BudgetPageEnhanced.jsx`)
- **Summary statistics** (total, spent, remaining, percentage)
- **Pie chart** for category breakdown using Recharts
- **Bar chart** for daily spending vs budget
- **Transaction list** with emojis and categories
- **Interactive category filtering**
- **Real-time calculations** and progress bars

### 4. Smart Search Component (`SmartSearch.jsx`)
- **Debounced search** (300ms delay)
- **Searchable across** cities, activities, restaurants
- **Tabbed results** (all, cities, activities)
- **Mock data** ready for API integration
- **Smooth animations** with AnimatePresence
- **Keyboard-friendly** with proper focus management

### 5. Theme Context (`ThemeContext.jsx`)
- **Light/Dark mode toggle**
- **Persistent preference** in localStorage
- **System preference detection** on first load
- **CSS class-based** dark mode support via Tailwind

### 6. Authentication Context (`AuthContext.jsx`)
- **JWT token management**
- **User profile updates** with `updateProfile()`
- **Phone verification** support
- **Avatar upload** readiness
- **Secure token storage** (localStorage → HTTP-only cookies planned)

---

## Design System

### Color Palette (Fall & Pastel Theme)
```javascript
// Tailwind config colors
primary: {
  DEFAULT: '#FFA07A',      // Light Salmon
  dark: '#FF8C69',         // Dark Salmon
  light: '#FFB6C1',        // Light Pink
}
accent: {
  DEFAULT: '#F4A460',      // Sandy Brown
  dark: '#D2691E',         // Chocolate
}
secondary: {
  DEFAULT: '#D2B48C',      // Tan
  light: '#F5DEB3',        // Wheat
}
background: {
  DEFAULT: '#FFF8DC',      // Cornsilk
  light: '#FFFFF0',        // Ivory
}
```

### Typography
- **Font**: Poppins (modern, rounded)
- **Sizes**: Tailwind scale (sm, base, lg, xl, 2xl, 3xl, 4xl)
- **Weights**: 300, 400, 500, 600, 700 (medium+ for headers)

### Spacing & Radius
- **Spacing**: Consistent 4px grid (Tailwind default)
- **Border Radius**: 
  - Buttons: `rounded-full` or `rounded-2xl`
  - Cards: `rounded-3xl`
  - Inputs: `rounded-2xl`

### Animations
- **Framer Motion** for:
  - Page transitions (fade + slide)
  - Staggered lists
  - Hover effects (scale, shadow)
  - Quote rotations
- **Micro-interactions**: Button springs, smooth color transitions

---

## Backend Routes Overview

### Auth Routes (`/api/auth`)
- `POST /register` — Create account with email, password, phone, avatar
- `POST /login` — Login with email, password
- `GET /me` — Get current user profile
- `PATCH /me` — Update profile (name, phone, avatar, phone_verified)

### Trips Routes (`/api/trips`)
- `GET /` — List user's trips
- `POST /` — Create new trip
- `GET /:id` — Get trip details with stops and activities
- `PATCH /:id` — Update trip
- `DELETE /:id` — Delete trip

### Stops Routes (`/api/stops`)
- `POST /` — Add stop to trip
- `PATCH /:id` — Update stop
- `DELETE /:id` — Delete stop
- `POST /:id/reorder` — Reorder stops (drag-drop)

### Activities Routes (`/api/activities`)
- `POST /` — Add activity to stop
- `PATCH /:id` — Update activity
- `DELETE /:id` — Delete activity
- `PATCH /:id/complete` — Mark as done

### Budget Routes (`/api/budgets`)
- `POST /` — Add budget entry
- `GET /trips/:tripId/breakdown` — Get spending by category
- `DELETE /:id` — Remove budget entry

---

## Future Enhancements

1. **HTTP-only Cookies**: Replace localStorage JWT with secure refresh tokens
2. **Real-time Collaboration**: WebSocket for multi-user trip planning
3. **AI Integration**: ChatGPT/Claude API for smarter recommendations
4. **Maps Integration**: Leaflet or Mapbox for location visualization
5. **Offline Mode**: Service workers for offline access
6. **Email Notifications**: Trip reminders and collaborative updates
7. **Social Features**: Trip sharing, comments, ratings
8. **Mobile App**: React Native version

---

## Installation & Setup

### Backend
```bash
cd server
npm install
# Configure .env with DATABASE_URL, JWT_SECRET
node src/index.js
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### Database
```bash
psql $DATABASE_URL -f schema.sql
```

---

## Environment Variables

**Server (.env)**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-min-16-chars
JWT_EXPIRES_IN=7d
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

**Client (.env.local)**
```
VITE_API_URL=http://localhost:4000
```

---

Generated for Odoo Hackathon 2026 🌍✈️
