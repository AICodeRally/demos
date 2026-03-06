'use client';

import { Crown, Store, Tag, ShoppingBag, type LucideIcon } from 'lucide-react';

export interface StoreFormat {
  id: string;
  name: string;
  stores: number;
  icon: LucideIcon;
}

export const FORMATS: StoreFormat[] = [
  { id: 'flagship', name: 'Flagship', stores: 25, icon: Crown },
  { id: 'standard', name: 'Standard', stores: 100, icon: Store },
  { id: 'outlet', name: 'Outlet', stores: 50, icon: Tag },
  { id: 'shop-in-shop', name: 'Shop-in-Shop', stores: 25, icon: ShoppingBag },
];

interface FormatSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function FormatSelector({ selected, onSelect }: FormatSelectorProps) {
  return (
    <div className="flex gap-2 mb-6">
      {FORMATS.map((f) => {
        const isActive = f.id === selected;
        const Icon = f.icon;
        return (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
            style={{
              backgroundColor: isActive ? '#FFFFFF' : '#F1F5F9',
              color: isActive ? '#1E3A5F' : '#475569',
              border: `1px solid ${isActive ? '#1E3A5F' : '#E2E8F0'}`,
              borderBottom: isActive ? '3px solid #1E3A5F' : '1px solid #E2E8F0',
              boxShadow: isActive ? '0 4px 12px rgba(30,58,95,0.15)' : 'none',
            }}
          >
            <Icon size={16} />
            <span>{f.name}</span>
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor: isActive ? '#1E3A5F' : '#E2E8F0',
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
