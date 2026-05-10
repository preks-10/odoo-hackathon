import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api.js';

// Curated city catalog with country, region, cost index, and popularity
const CITY_CATALOG = [
  { city: 'Paris', country: 'France', region: 'Europe', costIndex: 'High', popularity: 98, emoji: '🗼' },
  { city: 'Tokyo', country: 'Japan', region: 'Asia', costIndex: 'High', popularity: 97, emoji: '⛩️' },
  { city: 'New York', country: 'USA', region: 'Americas', costIndex: 'Very High', popularity: 96, emoji: '🗽' },
  { city: 'Rome', country: 'Italy', region: 'Europe', costIndex: 'Medium', popularity: 95, emoji: '🏛️' },
  { city: 'Barcelona', country: 'Spain', region: 'Europe', costIndex: 'Medium', popularity: 94, emoji: '🏖️' },
  { city: 'London', country: 'UK', region: 'Europe', costIndex: 'Very High', popularity: 96, emoji: '🎡' },
  { city: 'Bangkok', country: 'Thailand', region: 'Asia', costIndex: 'Low', popularity: 93, emoji: '🛕' },
  { city: 'Dubai', country: 'UAE', region: 'Middle East', costIndex: 'High', popularity: 91, emoji: '🌆' },
  { city: 'Istanbul', country: 'Turkey', region: 'Europe/Asia', costIndex: 'Low', popularity: 90, emoji: '🕌' },
  { city: 'Bali', country: 'Indonesia', region: 'Asia', costIndex: 'Low', popularity: 92, emoji: '🌴' },
  { city: 'Amsterdam', country: 'Netherlands', region: 'Europe', costIndex: 'High', popularity: 89, emoji: '🚲' },
  { city: 'Singapore', country: 'Singapore', region: 'Asia', costIndex: 'Very High', popularity: 90, emoji: '🦁' },
  { city: 'Prague', country: 'Czech Republic', region: 'Europe', costIndex: 'Medium', popularity: 88, emoji: '🏰' },
  { city: 'Lisbon', country: 'Portugal', region: 'Europe', costIndex: 'Medium', popularity: 87, emoji: '🚋' },
  { city: 'Kyoto', country: 'Japan', region: 'Asia', costIndex: 'Medium', popularity: 89, emoji: '🌸' },
  { city: 'Buenos Aires', country: 'Argentina', region: 'Americas', costIndex: 'Low', popularity: 83, emoji: '💃' },
  { city: 'Cape Town', country: 'South Africa', region: 'Africa', costIndex: 'Medium', popularity: 84, emoji: '🌊' },
  { city: 'Sydney', country: 'Australia', region: 'Oceania', costIndex: 'High', popularity: 88, emoji: '🦘' },
  { city: 'Marrakech', country: 'Morocco', region: 'Africa', costIndex: 'Low', popularity: 82, emoji: '🕌' },
  { city: 'Santorini', country: 'Greece', region: 'Europe', costIndex: 'High', popularity: 91, emoji: '🏝️' },
  { city: 'Maldives', country: 'Maldives', region: 'Asia', costIndex: 'Very High', popularity: 89, emoji: '🐠' },
  { city: 'Vienna', country: 'Austria', region: 'Europe', costIndex: 'High', popularity: 86, emoji: '🎭' },
  { city: 'Copenhagen', country: 'Denmark', region: 'Europe', costIndex: 'Very High', popularity: 83, emoji: '🧜' },
  { city: 'Hanoi', country: 'Vietnam', region: 'Asia', costIndex: 'Low', popularity: 80, emoji: '🍜' },
  { city: 'Mexico City', country: 'Mexico', region: 'Americas', costIndex: 'Low', popularity: 81, emoji: '🌮' },
  { city: 'Cairo', country: 'Egypt', region: 'Africa', costIndex: 'Low', popularity: 79, emoji: '🐫' },
  { city: 'Mumbai', country: 'India', region: 'Asia', costIndex: 'Low', popularity: 78, emoji: '🎬' },
  { city: 'Nairobi', country: 'Kenya', region: 'Africa', costIndex: 'Low', popularity: 70, emoji: '🦁' },
  { city: 'Seoul', country: 'South Korea', region: 'Asia', costIndex: 'Medium', popularity: 87, emoji: '🏙️' },
  { city: 'Zurich', country: 'Switzerland', region: 'Europe', costIndex: 'Very High', popularity: 80, emoji: '⛷️' },
];

const REGIONS = ['All', ...Array.from(new Set(CITY_CATALOG.map((c) => c.region))).sort()];
const COST_LEVELS = ['All', 'Low', 'Medium', 'High', 'Very High'];

const costColor = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-orange-100 text-orange-700',
  'Very High': 'bg-red-100 text-red-700',
};

export default function CitySearch() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All');
  const [cost, setCost] = useState('All');
  const navigate = useNavigate();

  const filtered = CITY_CATALOG.filter((c) => {
    const matchQuery =
      !query.trim() ||
      c.city.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase());
    const matchRegion = region === 'All' || c.region === region;
    const matchCost = cost === 'All' || c.costIndex === cost;
    return matchQuery && matchRegion && matchCost;
  }).sort((a, b) => b.popularity - a.popularity);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">City Search</h1>
        <p className="mt-1 text-slate-600">Discover destinations and add them to your trips.</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          className="flex-1 min-w-[180px] rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search city or country…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select
          className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        >
          {COST_LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>

      <p className="mb-4 text-xs text-slate-400">{filtered.length} destinations found</p>

      {/* City grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-500">No cities match your search. Try adjusting the filters.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <li
              key={`${c.city}-${c.country}`}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="mr-2 text-2xl">{c.emoji}</span>
                  <span className="text-lg font-semibold text-slate-900">{c.city}</span>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${costColor[c.costIndex]}`}>
                  {c.costIndex}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{c.country} · {c.region}</p>
              <div className="mt-2 flex items-center gap-1">
                <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full bg-primary"
                    style={{ width: `${c.popularity}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{c.popularity}% popular</span>
              </div>
              <button
                onClick={() => navigate('/trips/new', { state: { prefillCity: c.city, prefillCountry: c.country } })}
                className="mt-4 w-full rounded-lg bg-primary/10 py-2 text-sm font-semibold text-primary hover:bg-primary/20"
              >
                Plan a trip here
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}