import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import SortableStop from '../components/itinerary/SortableStop';
import { Plus, Calendar, Settings } from 'lucide-react';

export default function ItineraryView() {
  const [stops, setStops] = useState([
    {
      id: '1',
      name: 'Paris, France',
      days: 4,
      activities: ['Eiffel Tower', 'Louvre Museum', 'Seine Cruise'],
    },
    {
      id: '2',
      name: 'Interlaken, Switzerland',
      days: 3,
      activities: ['Paragliding', 'Lake Brienz', 'Harder Kulm'],
    },
    {
      id: '3',
      name: 'Rome, Italy',
      days: 5,
      activities: ['Colosseum', 'Vatican City', 'Trevi Fountain'],
    },
    {
      id: '4',
      name: 'Amalfi Coast, Italy',
      days: 3,
      activities: ['Positano Beach', 'Path of the Gods'],
    },
  ]);

  // Sensors for drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag reorder
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setStops((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // Derived stats
  const totalDays = stops.reduce((sum, s) => sum + (s.days || 0), 0);

  const totalActivities = stops.reduce(
    (sum, s) => sum + (s.activities?.length || 0),
    0
  );

  const totalBudget = stops.length * 500; // mock value for UI

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight">Traveloop</h1>
            <div className="w-px h-6 bg-white/10" />
            <h2 className="text-neutral-300 font-medium">Euro Trip 2026</h2>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20" />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Title */}
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

          <button className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-semibold hover:bg-neutral-200 transition">
            <Plus size={18} />
            Add Stop
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 text-neutral-400 text-sm space-y-1">
          <p>Total Days: {totalDays}</p>
          <p>Total Activities: {totalActivities}</p>
          <p>Estimated Budget: ${totalBudget}</p>
        </div>

        {/* Drag & Drop */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={stops} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {stops.map((stop, idx) => (
                <SortableStop key={stop.id} id={stop.id} city={stop} index={idx} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </main>
    </div>
  );
}