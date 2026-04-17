'use client';

import { useMemo } from 'react';
import type { SaleItem } from '@/lib/swic/engine/types';
import type { DetectedBundle } from './BundleBuilder';
import { formatCurrency } from '@/lib/swic/engine/calculator';
import { Minus, Plus, X, ShoppingCart, Package } from 'lucide-react';

// ── Props ──────────────────────────────────────────────────

interface SaleTicketProps {
  items: SaleItem[];
  taxRate: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  bundles: DetectedBundle[];
}

// ── Component ──────────────────────────────────────────────

export function SaleTicket({
  items,
  taxRate,
  onUpdateQuantity,
  onRemoveItem,
  bundles,
}: SaleTicketProps) {
  // Build a set of item IDs that belong to any detected bundle
  const bundledItemIds = useMemo(() => {
    const ids = new Set<string>();
    for (const bundle of bundles) {
      for (const item of bundle.items) {
        ids.add(item.id);
      }
    }
    return ids;
  }, [bundles]);

  // Items NOT in any bundle
  const unbundledItems = useMemo(
    () => items.filter((item) => !bundledItemIds.has(item.id)),
    [items, bundledItemIds],
  );

  // Totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * taxRate;
  const grandTotal = subtotal + tax;

  // ── Empty State ────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 py-12 text-center">
        <div className="animate-float inline-block">
          <ShoppingCart
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: 'var(--page-muted)', opacity: 0.3 }}
          />
        </div>
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--page-muted)' }}
        >
          Scan or add items to begin
        </p>
        <p
          className="text-xs mt-1"
          style={{ color: 'var(--page-muted)', opacity: 0.5 }}
        >
          Products will appear here as a receipt
        </p>
      </div>
    );
  }

  // ── Render a single line item ──────────────────────────────

  function renderLineItem(item: SaleItem) {
    const lineTotal = item.price * item.quantity;

    return (
      <div
        key={item.id}
        className="flex items-center gap-2 py-2 group animate-fade-in-up"
        style={{ borderBottom: '1px solid var(--glass-border)' }}
      >
        {/* Name */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium truncate"
            style={{ color: 'var(--page-text)' }}
          >
            {item.name}
          </p>
        </div>

        {/* Qty Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="glass-pill w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            aria-label={`Decrease ${item.name} quantity`}
          >
            <Minus
              className="w-3 h-3"
              style={{ color: 'var(--page-muted)' }}
            />
          </button>
          <span className="text-sm font-mono w-6 text-center font-bold">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="glass-pill w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            aria-label={`Increase ${item.name} quantity`}
          >
            <Plus
              className="w-3 h-3"
              style={{ color: 'var(--page-muted)' }}
            />
          </button>
        </div>

        {/* Unit Price */}
        <span
          className="text-xs font-mono w-16 text-right flex-shrink-0"
          style={{ color: 'var(--page-muted)' }}
        >
          @ {formatCurrency(item.price)}
        </span>

        {/* Line Total */}
        <span className="text-sm font-mono font-bold w-20 text-right flex-shrink-0">
          {formatCurrency(lineTotal)}
        </span>

        {/* Remove */}
        <button
          onClick={() => onRemoveItem(item.id)}
          className="p-1 rounded-lg transition-all opacity-30 hover:opacity-100 hover:bg-red-500/10 flex-shrink-0"
          aria-label={`Remove ${item.name}`}
        >
          <X className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
        </button>
      </div>
    );
  }

  // ── Main Render ────────────────────────────────────────────

  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-sm font-bold tracking-tight">Sale Ticket</h3>
        <span
          className="glass-pill px-2.5 py-1 rounded-full text-xs"
          style={{ color: 'var(--page-muted)' }}
        >
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Line Items */}
      <div className="flex-1 overflow-y-auto px-5">
        {/* Bundle groups */}
        {bundles.map((bundle) => (
          <div key={bundle.definition.id} className="mb-3">
            {/* Bundle Header */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-t-lg"
              style={{
                background: 'rgba(34, 197, 94, 0.08)',
                borderLeft: '3px solid #22c55e',
              }}
            >
              <Package className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
              <span
                className="text-xs font-bold"
                style={{ color: '#22c55e' }}
              >
                {bundle.definition.label}
              </span>
              <span
                className="text-[10px] ml-auto font-mono"
                style={{ color: '#22c55e', opacity: 0.7 }}
              >
                x{bundle.count} &middot; +{formatCurrency(bundle.definition.bonusAmount * bundle.count)} bonus
              </span>
            </div>

            {/* Bundle Items */}
            <div
              className="px-2 rounded-b-lg"
              style={{
                background: 'rgba(34, 197, 94, 0.03)',
                borderLeft: '3px solid rgba(34, 197, 94, 0.2)',
              }}
            >
              {bundle.items.map((item) => renderLineItem(item))}
            </div>
          </div>
        ))}

        {/* Unbundled items */}
        {unbundledItems.map((item) => renderLineItem(item))}
      </div>

      {/* Totals */}
      <div
        className="px-5 py-4 mt-2 space-y-1.5"
        style={{ borderTop: '1px solid var(--glass-border)' }}
      >
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs"
            style={{ color: 'var(--page-muted)' }}
          >
            Subtotal
          </span>
          <span className="text-sm font-mono">{formatCurrency(subtotal)}</span>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs"
            style={{ color: 'var(--page-muted)' }}
          >
            Tax ({(taxRate * 100).toFixed(2)}%)
          </span>
          <span className="text-sm font-mono">{formatCurrency(tax)}</span>
        </div>

        {/* Grand Total */}
        <div
          className="flex items-center justify-between pt-2 mt-1"
          style={{ borderTop: '1px solid var(--glass-border)' }}
        >
          <span className="text-sm font-bold">Total</span>
          <span className="text-xl font-mono font-black">
            {formatCurrency(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
