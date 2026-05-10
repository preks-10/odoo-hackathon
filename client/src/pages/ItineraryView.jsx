import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableStop from '../components/itinerary/SortableStop';
import { Plus, Calendar, Settings } from 'lucide-react';

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

  return (
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
    </div>
  );
}
