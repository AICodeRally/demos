'use client';

import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import type { SaleItem } from '@/lib/swic-engine/types';

const CATEGORIES = ['All', 'Mattress', 'Adjustable Base', 'Accessory', 'Protection Plan', 'Delivery'] as const;

interface ShowroomCatalogProps {
  items: SaleItem[];
  onAddItem: (item: SaleItem) => void;
}

export function ShowroomCatalog({ items, onAddItem }: ShowroomCatalogProps) {
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = items.filter((item) => {
    const matchesCat = category === 'All' || item.category === category;
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Search */}
      <div style={{ padding: '8px 12px' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid var(--register-border)',
            background: 'var(--register-bg-surface)',
            color: 'var(--register-text)',
            fontSize: '0.8rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '0 12px 8px', flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid var(--register-border)',
              background: category === cat ? 'var(--register-ai)' : 'var(--register-bg-surface)',
              color: category === cat ? '#FFFFFF' : 'var(--register-text-muted)',
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map((item) => {
          const hasSpiff = item.tags.includes('adjustable-base');
          const isPremium = item.tags.includes('premium-tier');
          return (
            <button
              key={item.id}
              onClick={() => onAddItem({ ...item, quantity: 1 })}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--register-border)',
                background: 'var(--register-bg-elevated)',
                cursor: 'pointer',
                textAlign: 'left',
                gap: 8,
              }}
            >
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, lineHeight: 1.3 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </span>
                  {hasSpiff && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 2,
                      padding: '1px 6px', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700,
                      background: 'rgba(245,158,11,0.15)', color: '#F59E0B',
                    }}>
                      <Sparkles size={8} /> SPIFF
                    </span>
                  )}
                  {isPremium && (
                    <span style={{
                      padding: '1px 6px', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700,
                      background: 'rgba(139,92,246,0.12)', color: '#A78BFA',
                    }}>
                      PREMIUM
                    </span>
                  )}
                </div>
                {category === 'All' && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)', lineHeight: 1.2, display: 'block', marginTop: 2 }}>
                    {item.category}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--register-text)', whiteSpace: 'nowrap' }}>
                ${item.price.toLocaleString()}
              </span>
              <Plus size={16} style={{ color: 'var(--register-accent)', flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
