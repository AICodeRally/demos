'use client';

import { useState, useMemo } from 'react';
import type { SaleItem } from '@/lib/swic/engine/types';
import { formatCurrency } from '@/lib/swic/engine/calculator';
import { Search, Plus, Package } from 'lucide-react';

// ── Props ──────────────────────────────────────────────────

interface ShowroomCatalogProps {
  catalog: SaleItem[];
  onAddItem: (item: SaleItem) => void;
}

// ── Category Tab Colors ────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Mattress: '#ef4444',
  'Adjustable Base': '#3b82f6',
  Accessory: '#a855f7',
  'Protection Plan': '#22c55e',
  Delivery: '#f59e0b',
};

function getCatColor(category: string): string {
  return CATEGORY_COLORS[category] ?? '#6366f1';
}

// ── Component ──────────────────────────────────────────────

export function ShowroomCatalog({ catalog, onAddItem }: ShowroomCatalogProps) {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Derive unique categories in stable order
  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const item of catalog) {
      seen.add(item.category);
    }
    return Array.from(seen);
  }, [catalog]);

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of catalog) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
    return counts;
  }, [catalog]);

  // Filter by active tab + search
  const filteredItems = useMemo(() => {
    let items = catalog;

    if (activeTab !== 'All') {
      items = items.filter((item) => item.category === activeTab);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(q));
    }

    return items;
  }, [catalog, activeTab, search]);

  return (
    <div className="flex flex-col h-full">
      {/* ── Search Bar ──────────────────────────────────────── */}
      <div className="relative mb-3">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: 'var(--page-muted)' }}
        />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="glass-input w-full rounded-xl pl-9 pr-4 py-2.5 text-sm"
        />
      </div>

      {/* ── Category Tabs ───────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3">
        {/* All tab */}
        <button
          onClick={() => setActiveTab('All')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'All'
              ? 'text-white shadow-md'
              : 'glass-pill'
          }`}
          style={
            activeTab === 'All'
              ? { backgroundColor: '#6366f1' }
              : { color: 'var(--page-muted)' }
          }
        >
          All
          <span className="ml-1 opacity-70">{catalog.length}</span>
        </button>

        {categories.map((cat) => {
          const color = getCatColor(cat);
          const isActive = activeTab === cat;

          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive ? 'text-white shadow-md' : 'glass-pill'
              }`}
              style={
                isActive
                  ? { backgroundColor: color }
                  : { color: 'var(--page-muted)' }
              }
            >
              {cat}
              <span className="ml-1 opacity-70">
                {categoryCounts[cat] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Product Grid ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="animate-float">
              <Package
                className="w-10 h-10 mb-3"
                style={{ color: 'var(--page-muted)', opacity: 0.3 }}
              />
            </div>
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--page-muted)' }}
            >
              No products found
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: 'var(--page-muted)', opacity: 0.5 }}
            >
              Try a different search or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredItems.map((item) => {
              const margin =
                item.price > 0
                  ? ((item.price - item.cost) / item.price) * 100
                  : 0;
              const marginColor =
                margin >= 40
                  ? '#22c55e'
                  : margin >= 25
                    ? '#f59e0b'
                    : '#ef4444';
              const catColor = getCatColor(item.category);

              return (
                <button
                  key={item.id}
                  onClick={() => onAddItem(item)}
                  className="glass-hover rounded-xl p-3 text-left group min-h-[100px] flex flex-col justify-between"
                  style={{ borderLeft: `3px solid ${catColor}60` }}
                >
                  {/* Name + Category */}
                  <div>
                    <p
                      className="text-sm font-semibold leading-tight truncate"
                      style={{ color: 'var(--page-text)' }}
                    >
                      {item.name}
                    </p>
                    <span
                      className="inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1"
                      style={{
                        backgroundColor: `${catColor}15`,
                        color: catColor,
                      }}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Pricing Row */}
                  <div className="flex items-end justify-between mt-2">
                    <div>
                      <p className="text-base font-bold font-mono">
                        {formatCurrency(item.price)}
                      </p>
                      <p
                        className="text-[10px] font-mono"
                        style={{ color: 'var(--page-muted)' }}
                      >
                        Cost {formatCurrency(item.cost)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${marginColor}15`,
                          color: marginColor,
                        }}
                      >
                        {margin.toFixed(0)}%
                      </span>

                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                        style={{
                          backgroundColor: `${catColor}15`,
                          color: catColor,
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
