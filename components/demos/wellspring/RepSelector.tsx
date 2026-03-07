'use client';

import { MapPin, Route, Truck } from 'lucide-react';

interface RepSelectorProps {
  foremen: { id: string; name: string; route: string; region: string }[];
  selected: string;
  onChange: (foremanId: string) => void;
}

export function RepSelector({ foremen, selected, onChange }: RepSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {foremen.map((foreman) => {
        const isSelected = foreman.id === selected;
        return (
          <button
            key={foreman.id}
            onClick={() => onChange(foreman.id)}
            className="rounded-lg px-4 py-2.5 transition-all duration-200 text-left"
            style={{
              background: isSelected ? '#B45309' : '#1E2530',
              border: '1px solid',
              borderColor: isSelected ? '#D97706' : '#334155',
              minWidth: 180,
            }}
          >
            <div
              className="text-sm font-semibold truncate"
              style={{ color: isSelected ? '#FFFFFF' : '#F1F5F9' }}
            >
              {foreman.name}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span
                className="text-[10px] flex items-center gap-0.5"
                style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#94A3B8' }}
              >
                <Route size={9} />
                {foreman.route}
              </span>
              <span
                className="text-[10px] flex items-center gap-0.5"
                style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#94A3B8' }}
              >
                <MapPin size={9} />
                {foreman.region}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
