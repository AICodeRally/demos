'use client';

import { ChevronDown, MapPin, Route } from 'lucide-react';

interface RepSelectorProps {
  reps: { id: string; name: string; route: string; hometown: string }[];
  selected: string;
  onChange: (id: string) => void;
}

export function RepSelector({ reps, selected, onChange }: RepSelectorProps) {
  const selectedRep = reps.find((r) => r.id === selected);

  return (
    <div className="relative">
      <div
        className="rounded-lg px-3 py-2 flex items-center gap-2"
        style={{
          background: 'var(--pl-card)',
          border: '1px solid var(--pl-border)',
        }}
      >
        {/* Selected rep info */}
        {selectedRep && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: 'var(--pl-text)' }}>
              {selectedRep.name}
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--pl-text-faint)' }}>
              <span className="flex items-center gap-0.5">
                <Route size={9} />
                {selectedRep.route}
              </span>
              <span className="flex items-center gap-0.5">
                <MapPin size={9} />
                {selectedRep.hometown}
              </span>
            </div>
          </div>
        )}

        <ChevronDown size={14} className="shrink-0" style={{ color: 'var(--pl-text-faint)' }} />

        {/* Native select overlay */}
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Select representative"
        >
          {reps.map((rep) => (
            <option key={rep.id} value={rep.id}>
              {rep.name} — {rep.route} ({rep.hometown})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
