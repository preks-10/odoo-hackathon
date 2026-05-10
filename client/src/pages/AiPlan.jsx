import { useState } from 'react';
import toast from 'react-hot-toast';

const recommendationMap = {
  beach: 'A sun-soaked seaside itinerary with coastal dining, beachside markets, and sunset boat tours.',
  city: 'A vibrant city circuit of museums, rooftop cafes, neighborhood walks, and evening live music.',
  nature: 'A nature-forward trip with scenic hikes, local farms, forests, and quiet lakeside evenings.',
  default: 'A balanced trip packed with local flavor, top attractions, and a flexible relaxation day.'
};

export default function AiPlan() {
  const [prompt, setPrompt] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!prompt.trim()) {
      toast.error('Tell the planner what kind of trip you want');
      return;
    }
    setLoading(true);
    setPlan('');
    window.setTimeout(() => {
      const lower = prompt.toLowerCase();
      const suggestion = recommendationMap.beach && (lower.includes('beach') || lower.includes('coast'))
        ? recommendationMap.beach
        : lower.includes('nature')
        ? recommendationMap.nature
        : lower.includes('city')
        ? recommendationMap.city
        : recommendationMap.default;
      setPlan(`AI suggestion for “${prompt.trim()}”: ${suggestion}`);
      setLoading(false);
    }, 600);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-slate-900">Plan with AI</h1>
          <p className="mt-3 text-slate-500">
            Describe the kind of trip you want and the planner will suggest a fall-friendly itinerary instantly.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block text-sm font-medium text-slate-700">What kind of trip are you planning?</label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={4}
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-sm outline-none ring-primary focus:border-primary focus:ring-2"
              placeholder="e.g. a cozy autumn city getaway with food festivals and art exhibitions"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow hover:bg-primary-dark disabled:opacity-60"
            >
              {loading ? 'Thinking...' : 'Create itinerary'}
            </button>
          </form>
        </div>
      </section>

      {plan && (
        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Your personalized AI itinerary</h2>
          <p className="mt-4 whitespace-pre-line text-slate-700">{plan}</p>
        </section>
      )}
    </div>
  );
}
