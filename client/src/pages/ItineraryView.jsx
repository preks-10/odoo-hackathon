<<<<<<< HEAD
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
=======
import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableStop from '../components/itinerary/SortableStop';
import { Plus, Calendar, Settings } from 'lucide-react';
>>>>>>> 093d26ac37a8a17e626dd7426b808f36fec1f45d

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
  const [stops, setStops] = useState([
    { id: '1', name: 'Paris, France', days: 4, activities: ['Eiffel Tower', 'Louvre Museum', 'Seine Cruise'] },
    { id: '2', name: 'Interlaken, Switzerland', days: 3, activities: ['Paragliding', 'Lake Brienz', 'Harder Kulm'] },
    { id: '3', name: 'Rome, Italy', days: 5, activities: ['Colosseum', 'Vatican City', 'Trevi Fountain'] },
    { id: '4', name: 'Amalfi Coast, Italy', days: 3, activities: ['Positano Beach', 'Path of the Gods'] }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setStops((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const totalDays = trip.stops?.length || 0;
  const totalActivities = trip.stops?.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0) || 0;
  const totalBudget = trip.total_budget || 0;

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-blue-500/30">
      {/* Top Navigation / Header */}
      <header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight">Traveloop</h1>
            <div className="w-px h-6 bg-white/10" />
            <h2 className="text-neutral-300 font-medium">Euro Trip 2026</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Itinerary Builder</h1>
            <div className="flex items-center gap-2 text-neutral-400 text-sm">
              <Calendar size={16} />
              <span>June 15, 2026 - June 30, 2026</span>
              <span className="mx-2">•</span>
              <span>{stops.length} stops</span>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-5 py-2.5 rounded-xl font-semibold transition-colors transform active:scale-95">
            <Plus size={18} />
            Add Stop
          </button>
        </div>
        
        <div className="mb-8">
          <p className="text-neutral-400">Drag and drop to reorder your destinations. Changes are saved automatically.</p>
        </div>
        
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter} 
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-4">
            <SortableContext items={stops} strategy={verticalListSortingStrategy}>
              {stops.map((stop, idx) => (
                <div key={stop.id} className="relative">
                  {/* Connection Line */}
                  {idx !== stops.length - 1 && (
                    <div className="absolute left-7 top-14 bottom-[-16px] w-px bg-white/10 z-0" />
                  )}
                  <SortableStop id={stop.id} city={stop} />
                </div>
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </main>
>>>>>>> 093d26ac37a8a17e626dd7426b808f36fec1f45d
    </div>
  );
}

