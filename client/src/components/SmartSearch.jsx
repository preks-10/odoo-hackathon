import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const mockResults = {
  cities: [
    { id: 1, name: 'Paris', country: 'France', emoji: '🇫🇷' },
    { id: 2, name: 'Tokyo', country: 'Japan', emoji: '🇯🇵' },
    { id: 3, name: 'New York', country: 'USA', emoji: '🇺🇸' },
    { id: 4, name: 'Barcelona', country: 'Spain', emoji: '🇪🇸' },
    { id: 5, name: 'Amsterdam', country: 'Netherlands', emoji: '🇳🇱' },
  ],
  activities: [
    { id: 1, name: 'Eiffel Tower visit', category: 'landmark', emoji: '🗼' },
    { id: 2, name: 'Wine tasting', category: 'food', emoji: '🍷' },
    { id: 3, name: 'Museum tour', category: 'culture', emoji: '🎨' },
    { id: 4, name: 'Beach relaxation', category: 'nature', emoji: '🏖️' },
    { id: 5, name: 'Night market', category: 'shopping', emoji: '🛍️' },
  ],
};

export default function SmartSearch({ onSelectCity, onSelectActivity }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchType, setSearchType] = useState('all');
  const debouncedQuery = useDebounce(query);

  const results = useCallback(() => {
    if (!debouncedQuery.trim()) return { cities: [], activities: [] };

    const q = debouncedQuery.toLowerCase();
    return {
      cities: mockResults.cities.filter((c) => c.name.toLowerCase().includes(q)),
      activities: mockResults.activities.filter((a) => a.name.toLowerCase().includes(q)),
    };
  }, [debouncedQuery])();

  const displayResults = searchType === 'all'
    ? [...results.cities, ...results.activities]
    : searchType === 'cities'
    ? results.cities
    : results.activities;

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search cities, activities..."
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-12 text-slate-900 outline-none ring-primary placeholder:text-slate-400 focus:border-primary focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex border-b border-slate-100 p-2 dark:border-slate-700">
              {['all', 'cities', 'activities'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchType(type)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    searchType === type ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {displayResults.length === 0 ? (
                <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                  <p className="text-sm">No results found for "{debouncedQuery}"</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {displayResults.map((item) => (
                    <motion.button
                      key={`${item.id}-${item.name}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => {
                        if (item.country) onSelectCity?.(item);
                        else onSelectActivity?.(item);
                        setQuery('');
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                        {item.country && <p className="text-xs text-slate-500 dark:text-slate-400">{item.country}</p>}
                        {item.category && <p className="text-xs text-slate-500 dark:text-slate-400">{item.category}</p>}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
