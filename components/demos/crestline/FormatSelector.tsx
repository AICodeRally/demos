'use client';

import { Crown, Store, Tag, Sparkles, type LucideIcon } from 'lucide-react';

export interface CrestlineFormat {
  id: string;
  name: string;
  stores: number;
  icon: LucideIcon;
  color: string;
}

export const CRESTLINE_FORMATS: CrestlineFormat[] = [
  { id: 'flagship', name: 'Flagship', stores: 25, icon: Crown, color: '#7c3aed' },
  { id: 'standard', name: 'Standard', stores: 100, icon: Store, color: '#2563eb' },
  { id: 'rack', name: 'Rack', stores: 50, icon: Tag, color: '#059669' },
  { id: 'counter', name: 'Counter', stores: 25, icon: Sparkles, color: '#d946ef' },
];

interface FormatSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function FormatSelector({ selected, onSelect }: FormatSelectorProps) {
  return (
    <div className="flex gap-2 mb-6">
      {CRESTLINE_FORMATS.map((f) => {
        const isActive = f.id === selected;
        const Icon = f.icon;
        return (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
            style={{
              backgroundColor: isActive ? '#FFFFFF' : '#F1F5F9',
              color: isActive ? f.color : '#475569',
              border: `1px solid ${isActive ? f.color : '#E2E8F0'}`,
              borderBottom: isActive ? `3px solid ${f.color}` : '1px solid #E2E8F0',
              boxShadow: isActive ? `0 4px 12px ${f.color}25` : 'none',
            }}
          >
            <Icon size={16} />
            <span>{f.name}</span>
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor: isActive ? f.color : '#E2E8F0',
                color: isActive ? '#FFFFFF' : '#64748B',
              }}
            >
              {f.stores}
            </span>
          </button>
        );
      })}
    </div>
  );
}
