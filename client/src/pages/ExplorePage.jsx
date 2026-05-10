import { Link, useParams } from 'react-router-dom';

const exploreData = {
  events: {
    title: 'City Events',
    description: 'Browse festivals, live talks, markets, and seasonal city events.',
    items: [
      { title: 'Autumn Street Fair', category: 'Festival', details: 'Food, music, crafts, and family fun.' },
      { title: 'Sunset Concert Series', category: 'Live Show', details: 'Jazz and indie acts at the park.' },
      { title: 'Night Market', category: 'Market', details: 'Local makers, snacks, and performers.' },
    ],
  },
  exhibitions: {
    title: 'Top Exhibitions',
    description: 'Curated gallery exhibits, design showcases, and immersive art experiences.',
    items: [
      { title: 'Modern Travel Design', category: 'Art', details: 'A showcase of contemporary travel-inspired installations.' },
      { title: 'Heritage Museum Tour', category: 'History', details: 'Interactive exhibits on city origins and culture.' },
      { title: 'Science Expo', category: 'Innovation', details: 'Tech demos, VR experiences, and hands-on science.' },
    ],
  },
  shows: {
    title: 'Must-See Shows',
    description: 'The best plays, concerts, and cultural performances in your region.',
    items: [
      { title: 'Broadway Revival', category: 'Theater', details: 'A classic story with a modern twist.' },
      { title: 'Live Comedy Night', category: 'Comedy', details: 'Popular comedians and open-mic spotlight.' },
      { title: 'Classical Orchestra', category: 'Music', details: 'An elegant evening of symphonic favorites.' },
    ],
  },
  restaurants: {
    title: 'Restaurants & Eats',
    description: 'Restaurant suggestions by category, from cozy cafes to upscale dining.',
    items: [
      { title: 'Harvest Table', category: 'Farm-to-table', details: 'Seasonal autumn menu with veggie-forward dishes.' },
      { title: 'Riverside Bistro', category: 'Casual', details: 'Comfort food with a scenic patio.' },
      { title: 'Spice Lane', category: 'International', details: 'Modern plates inspired by global street food.' },
    ],
  },
  hotels: {
    title: 'Hotels & Stays',
    description: 'Find stylish stays, boutique hotels, and hotel recommendations near top venues.',
    items: [
      { title: 'Cozy Inn', category: 'Boutique', details: 'Warm rooms and excellent local service.' },
      { title: 'Skyline Suites', category: 'Luxury', details: 'Modern rooms with city views and rooftop lounge.' },
      { title: 'Traveler Lodge', category: 'Budget', details: 'Convenient location and clean, comfy rooms.' },
    ],
  },
};

export default function ExplorePage() {
  const { type } = useParams();
  const page = exploreData[type] || exploreData.events;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{page.title}</h1>
            <p className="mt-3 max-w-2xl text-slate-500">{page.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(exploreData).map((slug) => (
              <Link
                key={slug}
                to={`/explore/${slug}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  slug === type ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {slug.charAt(0).toUpperCase() + slug.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {page.items.map((item) => (
          <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-xs uppercase tracking-wide text-amber-600">{item.category}</p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{item.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
