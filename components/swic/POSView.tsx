'use client';

import type { SaleItem } from '@/lib/swic/engine/types';
import { formatCurrency } from '@/lib/swic/engine/calculator';
import { getCategoryColor } from '@/lib/swic/util/utils';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

interface POSViewProps {
  items: SaleItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  accent?: string;
  compact?: boolean;
}

export function POSView({ items, onUpdateQuantity, onRemoveItem, accent = '#6366f1', compact = false }: POSViewProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCost = items.reduce((sum, item) => sum + item.cost * item.quantity, 0);
  const margin = total - totalCost;
  const marginPct = total > 0 ? (margin / total) * 100 : 0;
  const marginColor = marginPct >= 35 ? '#22c55e' : marginPct >= 20 ? '#f59e0b' : '#ef4444';

  if (items.length === 0) {
    return (
      <div className={`glass rounded-2xl text-center ${compact ? 'p-4 py-6' : 'p-6 py-12'}`}>
        <div className="animate-float inline-block">
          <ShoppingCart className={compact ? 'w-8 h-8 mx-auto mb-2' : 'w-12 h-12 mx-auto mb-3'} style={{ color: 'var(--page-muted)', opacity: 0.4 }} />
        </div>
        <p className={`font-medium ${compact ? 'text-[11px]' : 'text-sm'}`} style={{ color: 'var(--page-muted)' }}>No items in sale</p>
        <p className={`mt-1 ${compact ? 'text-[10px]' : 'text-xs'}`} style={{ color: 'var(--page-muted)', opacity: 0.5 }}>
          Tap a product to start
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className={`flex items-center justify-between ${compact ? 'px-4 pt-3 pb-2' : 'px-5 pt-5 pb-3'}`}>
        <h3 className={`font-bold tracking-tight ${compact ? 'text-xs' : 'text-sm'}`}>Current Sale</h3>
        <span className={`glass-pill px-2 py-0.5 rounded-full ${compact ? 'text-[10px]' : 'text-xs px-2.5 py-1'}`} style={{ color: 'var(--page-muted)' }}>
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Items */}
      <div className={compact ? 'px-3 space-y-1' : 'px-5 space-y-2'}>
        {items.map((item) => {
          const catColor = getCategoryColor(item.category);

          if (compact) {
            // Compact: tight single-line with inline controls
            return (
              <div
                key={item.id}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg group"
                style={{
                  background: 'var(--input-bg)',
                  borderLeft: `2px solid ${catColor}60`,
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium truncate">{item.name}</p>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="glass-pill w-5 h-5 rounded flex items-center justify-center"
                  >
                    <Minus className="w-2.5 h-2.5" style={{ color: 'var(--page-muted)' }} />
                  </button>
                  <span className="text-[11px] font-mono w-5 text-center font-bold">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="glass-pill w-5 h-5 rounded flex items-center justify-center"
                  >
                    <Plus className="w-2.5 h-2.5" style={{ color: 'var(--page-muted)' }} />
                  </button>
                </div>
                <span className="text-[11px] font-mono font-bold flex-shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </span>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-0.5 rounded opacity-20 hover:opacity-100 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-3 h-3" style={{ color: '#ef4444' }} />
                </button>
              </div>
            );
          }

          // Full: two-line with category badge
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl group transition-all duration-200"
              style={{
                background: 'var(--input-bg)',
                borderLeft: `3px solid ${catColor}60`,
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: `${catColor}15`, color: catColor }}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs font-mono" style={{ color: 'var(--page-muted)' }}>
                    @ {formatCurrency(item.price)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="glass-pill w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <Minus className="w-3 h-3" style={{ color: 'var(--page-muted)' }} />
                </button>
                <span className="text-sm font-mono w-7 text-center font-bold">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="glass-pill w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <Plus className="w-3 h-3" style={{ color: 'var(--page-muted)' }} />
                </button>
              </div>
              <span className="text-sm font-mono font-bold w-24 text-right">
                {formatCurrency(item.price * item.quantity)}
              </span>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-1.5 rounded-lg transition-all opacity-30 hover:opacity-100 hover:bg-red-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className={compact ? 'px-3 py-3 mt-2' : 'px-5 py-4 mt-3'} style={{ borderTop: '1px solid var(--glass-border)' }}>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px]" style={{ color: 'var(--page-muted)' }}>Revenue</span>
            <span className={`font-mono ${compact ? 'text-[11px]' : 'text-sm'}`}>{formatCurrency(total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px]" style={{ color: 'var(--page-muted)' }}>Cost</span>
            <span className={`font-mono ${compact ? 'text-[11px]' : 'text-sm'}`}>{formatCurrency(totalCost)}</span>
          </div>
          <div
            className="flex items-center justify-between pt-1.5 mt-1.5"
            style={{ borderTop: '1px solid var(--glass-border)' }}
          >
            <div className="flex items-center gap-1.5">
              <span className={`font-bold ${compact ? 'text-xs' : 'text-sm'}`}>Margin</span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: `${marginColor}15`, color: marginColor }}
              >
                {marginPct.toFixed(1)}%
              </span>
            </div>
            <span
              className={`font-mono font-black ${compact ? 'text-base' : 'text-xl'}`}
              style={{ color: marginColor }}
            >
              {formatCurrency(margin)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
