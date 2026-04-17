'use client';

import { useState } from 'react';
import type { SaleItem } from '@/lib/swic/engine/types';
import { formatCurrency } from '@/lib/swic/engine/calculator';
import { getCategoryColor } from '@/lib/swic/util/utils';
import { Plus, Search } from 'lucide-react';

interface SaleBuilderProps {
  catalogItems: SaleItem[];
  onAddItem: (item: SaleItem) => void;
  accent?: string;
  compact?: boolean;
}

export function SaleBuilder({ catalogItems, onAddItem, accent = '#6366f1', compact = false }: SaleBuilderProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(catalogItems.map((item) => item.category))];

  const filtered = catalogItems.filter((item) => {
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-2">
      {/* Search */}
      <div className="relative group">
        <Search
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors duration-200"
          style={{ color: 'var(--page-muted)' }}
        />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`glass-input w-full pl-8 pr-3 rounded-lg text-xs ${compact ? 'py-1.5' : 'py-2.5 rounded-xl'}`}
        />
      </div>

      {/* Category pills */}
      <div className={`flex gap-1.5 flex-wrap ${compact ? '' : 'gap-2'}`}>
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-2 py-1 text-[10px] rounded-full font-medium transition-all duration-200 ${compact ? '' : 'px-3 py-1.5 text-xs'}`}
          style={!selectedCategory ? {
            background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            color: '#ffffff',
            boxShadow: `0 1px 4px ${accent}30`,
          } : {
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            color: 'var(--page-muted)',
          }}
        >
          All
        </button>
        {categories.map((cat) => {
          const catColor = getCategoryColor(cat);
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className={`rounded-full font-medium transition-all duration-200 flex items-center gap-1 ${compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs gap-1.5'}`}
              style={isActive ? {
                background: `linear-gradient(135deg, ${catColor}, ${catColor}cc)`,
                color: '#ffffff',
                boxShadow: `0 1px 4px ${catColor}30`,
              } : {
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--page-muted)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: isActive ? '#ffffff' : catColor }}
              />
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product rows */}
      <div className="space-y-1 no-scrollbar">
        {filtered.map((item) => {
          const catColor = getCategoryColor(item.category);

          if (compact) {
            // Compact: single-line row for narrow pane
            return (
              <button
                key={item.id}
                onClick={() => onAddItem({ ...item, quantity: 1 })}
                className="glass-hover w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left group"
                style={{ borderLeft: `2px solid ${catColor}40` }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium truncate leading-tight">{item.name}</p>
                </div>
                <span className="text-[11px] font-mono font-bold flex-shrink-0">{formatCurrency(item.price)}</span>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 opacity-30 group-hover:opacity-100 group-hover:scale-110 flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
                >
                  <Plus className="w-2.5 h-2.5 text-white" />
                </div>
              </button>
            );
          }

          // Full: two-line row with category badge
          return (
            <button
              key={item.id}
              onClick={() => onAddItem({ ...item, quantity: 1 })}
              className="glass-hover w-full flex items-center justify-between p-3 rounded-xl text-left group"
              style={{ borderLeft: `3px solid ${catColor}40` }}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium inline-block mt-0.5"
                  style={{ backgroundColor: `${catColor}15`, color: catColor }}
                >
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-mono font-bold">{formatCurrency(item.price)}</span>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 opacity-40 group-hover:opacity-100 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
                >
                  <Plus className="w-3 h-3 text-white" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
