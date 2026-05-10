import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { api } from '../api.js';
import { useTrip } from '../hooks/useTrip.js';
import TripSubNav from '../components/TripSubNav.jsx';
import Spinner from '../components/Spinner.jsx';

const COLORS = ['#14b8a6', '#F59E0B', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899', '#6366f1'];

const categoryEmoji = {
  food: '🍽️',
  transport: '🚗',
  accommodation: '🏨',
  entertainment: '🎭',
  shopping: '🛍️',
  activity: '🎯',
  other: '📌',
};

export default function BudgetPage() {
  const { tripId } = useTrip() || {};
  const { trip, loading } = useTrip(tripId);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Mock budget data (in real app, fetch from API)
  const budgetData = useMemo(() => {
    if (!trip) return { entries: [], categoryBreakdown: [], dailySpending: [] };

    const entries = [
      { id: 1, category: 'food', description: 'Restaurant lunch', amount: 45, currency: 'USD' },
      { id: 2, category: 'transport', description: 'Taxi to hotel', amount: 25, currency: 'USD' },
      { id: 3, category: 'accommodation', description: '2 nights hotel', amount: 200, currency: 'USD' },
      { id: 4, category: 'entertainment', description: 'Museum ticket', amount: 18, currency: 'USD' },
      { id: 5, category: 'activity', description: 'Hiking tour', amount: 65, currency: 'USD' },
      { id: 6, category: 'food', description: 'Dinner', amount: 62, currency: 'USD' },
    ];

    const categoryTotals = entries.reduce((acc, entry) => {
      const existing = acc.find((item) => item.category === entry.category);
      if (existing) {
        existing.amount += entry.amount;
        existing.count += 1;
      } else {
        acc.push({ category: entry.category, amount: entry.amount, count: 1 });
      }
      return acc;
    }, []);

    const dailyData = [
      { day: 'Day 1', spending: 145, budget: 200 },
      { day: 'Day 2', spending: 310, budget: 200 },
      { day: 'Day 3', spending: 180, budget: 200 },
      { day: 'Day 4', spending: 225, budget: 200 },
    ];

    return { entries, categoryBreakdown: categoryTotals, dailySpending: dailyData };
  }, [trip]);

  if (loading) {
    return (
      <div>
        <TripSubNav />
        <Spinner className="py-20" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div>
        <p className="text-slate-600">Trip not found.</p>
      </div>
    );
  }

  const totalSpent = budgetData.entries.reduce((sum, entry) => sum + entry.amount, 0);
  const budgetRemaining = (trip.total_budget || 0) - totalSpent;
  const spentPercentage = trip.total_budget ? Math.round((totalSpent / trip.total_budget) * 100) : 0;

  const chartContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="space-y-8">
      <TripSubNav />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-black text-slate-900">Budget Intelligence</h1>
        <p className="mt-2 text-slate-600">Track spending and optimize your trip budget</p>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { staggerChildren: 0.1 } }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div
          variants={chartContainerVariants}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <p className="text-sm uppercase tracking-widest text-slate-400">Total budget</p>
          <p className="mt-3 text-4xl font-black text-slate-900">${Number(trip.total_budget || 0).toLocaleString()}</p>
        </motion.div>

        <motion.div variants={chartContainerVariants} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-widest text-teal-600">Spent</p>
          <p className="mt-3 text-4xl font-black text-teal-600">${Number(totalSpent).toLocaleString()}</p>
        </motion.div>

        <motion.div
          variants={chartContainerVariants}
          className={`rounded-3xl border p-6 shadow-sm ${budgetRemaining >= 0 ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}
        >
          <p className={`text-sm uppercase tracking-widest ${budgetRemaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            Remaining
          </p>
          <p className={`mt-3 text-4xl font-black ${budgetRemaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ${Number(Math.max(0, budgetRemaining)).toLocaleString()}
          </p>
        </motion.div>

        <motion.div variants={chartContainerVariants} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-widest text-slate-400">Spent %</p>
          <p className="mt-3 text-4xl font-black text-slate-900">{spentPercentage}%</p>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Breakdown - Pie Chart */}
        <motion.div
          variants={chartContainerVariants}
          initial="hidden"
          animate="visible"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-900">Spending by category</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData.categoryBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                >
                  {budgetData.categoryBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
            {budgetData.categoryBreakdown.map((item, idx) => (
              <button
                key={item.category}
                onClick={() => setSelectedCategory(selectedCategory === item.category ? null : item.category)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 transition ${
                  selectedCategory === item.category
                    ? 'bg-slate-100'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="capitalize text-slate-700">
                    {categoryEmoji[item.category] || '📌'} {item.category}
                  </span>
                </div>
                <p className="font-semibold text-slate-900">${Number(item.amount).toLocaleString()}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Daily Spending - Bar Chart */}
        <motion.div
          variants={chartContainerVariants}
          initial="hidden"
          animate="visible"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-900">Daily spending vs budget</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData.dailySpending}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  formatter={(value) => `$${value}`}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}
                />
                <Legend />
                <Bar dataKey="spending" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="budget" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Transactions List */}
      <motion.div
        variants={chartContainerVariants}
        initial="hidden"
        animate="visible"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold text-slate-900">Recent transactions</h2>
        <div className="mt-6 space-y-2">
          {budgetData.entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 hover:bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg">
                  {categoryEmoji[entry.category] || '📌'}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{entry.description}</p>
                  <p className="text-xs capitalize text-slate-500">{entry.category}</p>
                </div>
              </div>
              <p className="font-bold text-slate-900">${Number(entry.amount).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
