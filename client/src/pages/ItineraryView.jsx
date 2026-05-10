import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Spinner from '../components/Spinner.jsx';
import TripSubNav from '../components/TripSubNav.jsx';
import { useTrip } from '../hooks/useTrip.js';

function formatTime(t) {
  if (!t) return null;
  const [h, m] = t.split(':');
  const d = new Date();
  d.setHours(Number(h), Number(m), 0, 0);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function ItineraryView() {
  const { id } = useParams();
  const tripId = Number(id);
  const { trip, loading } = useTrip(tripId);

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
        <Link to="/dashboard" className="text-sm font-medium text-primary hover:underline">
          ← Dashboard
        </Link>
        <p className="mt-6 text-slate-600">We could not find that trip.</p>
      </div>
    );
  }

  const totalDays = trip.stops?.length || 0;
  const totalActivities = trip.stops?.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0) || 0;
  const totalBudget = trip.total_budget || 0;

  return (
    <div>
      <TripSubNav />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
        <Link to="/dashboard" className="text-sm font-medium text-primary hover:underline">
          ← Dashboard
        </Link>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,0.7fr]">
          <div>
            <h1 className="text-4xl font-black text-slate-900">{trip.name}</h1>
            <p className="mt-3 text-lg text-slate-600">{trip.description || 'Your complete itinerary'}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">Days</p>
              <p className="mt-2 text-3xl font-bold text-teal-600">{totalDays}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">Activities</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">{totalActivities}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">Budget</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">${Number(totalBudget).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 via-cyan-500 to-amber-500 md:left-6" />

        <ul className="space-y-12">
          {(trip.stops || []).map((stop, idx) => (
            <motion.li key={stop.id} variants={itemVariants} className="relative pl-16 md:pl-20">
              {/* Timeline dot */}
              <motion.div
                className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-teal-500 to-cyan-500 text-sm font-bold text-white shadow-lg md:left-2 md:h-12 md:w-12"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                {idx + 1}
              </motion.div>

              {/* Stop card */}
              <motion.div whileHover={{ y: -4 }} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {stop.city_name}
                    {stop.country ? <span className="text-slate-500"> • {stop.country}</span> : ''}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span>📅 {stop.arrival_date || 'TBD'}</span>
                    {stop.departure_date && <span>→ {stop.departure_date}</span>}
                  </div>
                </div>

                {stop.notes && (
                  <div className="rounded-2xl border border-amber-200/50 bg-amber-50 p-4">
                    <p className="text-sm text-amber-900">{stop.notes}</p>
                  </div>
                )}

                {/* Activities list */}
                <div className="space-y-3 border-t border-slate-100 pt-6">
                  <h3 className="font-semibold text-slate-700">Activities</h3>
                  {(stop.activities || []).length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No activities scheduled for this stop.</p>
                  ) : (
                    <motion.ul
                      className="space-y-2"
                      initial="hidden"
                      animate="visible"
                      variants={containerVariants}
                    >
                      {(stop.activities || []).map((activity) => (
                        <motion.li
                          key={activity.id}
                          variants={itemVariants}
                          className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-slate-100"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{activity.name}</p>
                            {activity.description && (
                              <p className="mt-1 text-sm text-slate-600">{activity.description}</p>
                            )}
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700">
                                {activity.category}
                              </span>
                              {activity.scheduled_time && (
                                <span className="inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                                  ⏰ {formatTime(activity.scheduled_time)}
                                </span>
                              )}
                              {activity.duration_minutes && (
                                <span className="inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                                  ⏱ {activity.duration_minutes}m
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-slate-900">
                              ${Number(activity.estimated_cost || 0).toFixed(2)}
                            </p>
                          </div>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </div>
              </motion.div>
            </motion.li>
          ))}
        </ul>

        {trip.stops?.length === 0 && (
          <motion.div variants={itemVariants} className="pl-12 text-center text-slate-500 md:pl-16">
            <p className="text-lg">No stops added yet.</p>
            <p className="text-sm">Start building your itinerary in the editor.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

