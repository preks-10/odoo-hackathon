import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MapPin, Clock } from 'lucide-react';

export default function SortableStop({ id, city }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative bg-neutral-800/80 backdrop-blur-md border ${isDragging ? 'border-blue-500 shadow-blue-500/20' : 'border-white/10'} p-5 rounded-2xl mb-4 shadow-lg flex items-start gap-4 transition-colors`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="mt-1 cursor-grab active:cursor-grabbing text-neutral-500 hover:text-white transition-colors"
      >
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-blue-400" />
            <h3 className="text-xl font-semibold text-white">{city.name}</h3>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 bg-white/10 text-neutral-300 rounded-full">
            {city.days} days
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-neutral-400 mb-3">
          <Clock size={14} />
          <span>{city.activities.length} planned activities</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {city.activities.map((activity, idx) => (
            <span key={idx} className="text-xs px-2 py-1 bg-black/40 text-neutral-300 rounded-md border border-white/5">
              {activity}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
