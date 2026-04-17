'use client';

import { useRef, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { ClosedSale, D365StoreContext } from '@/lib/swic/data/d365-schemas';
import { formatCurrency } from '@/lib/swic/engine/calculator';

export interface ManagerComponentProps {
  sales: ClosedSale[];
  store: D365StoreContext;
}

/**
 * ManagerFeed — scrolling real-time list of closed sales.
 *
 * Most recent at top. New entries animate in with a fade. Max 20 visible rows,
 * scrollable for overflow. Each row shows timestamp, rep name, item summary,
 * commission earned, and a checkmark icon.
 */
export function ManagerFeed({ sales }: ManagerComponentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when new sale arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [sales.length]);

  const visibleSales = sales.slice(0, 20);

  if (visibleSales.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 flex flex-col h-full">
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-4"
          style={{ color: 'var(--page-muted)' }}
        >
          Live Sales Feed
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center animate-float">
            <div
              className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: 'var(--surface-bg)', border: '1px solid var(--glass-border)' }}
            >
              <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--page-muted)' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--page-muted)' }}>
              Waiting for sales...
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--page-muted)', opacity: 0.6 }}>
              Close a sale on the POS tab or seed demo data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-sm font-bold uppercase tracking-wider"
          style={{ color: 'var(--page-muted)' }}
        >
          Live Sales Feed
        </h3>
        <span
          className="glass-pill px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1"
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-status-pulse"
            style={{ background: '#22c55e' }}
          />
          {visibleSales.length} sale{visibleSales.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1 no-scrollbar"
        style={{ maxHeight: 'calc(100vh - 320px)' }}
      >
        {visibleSales.map((sale, idx) => (
          <FeedRow key={`${sale.event.transactionId}-${idx}`} sale={sale} isNew={idx === 0} />
        ))}
      </div>
    </div>
  );
}

/* ── Feed Row ──────────────────────────────────────────────── */

function FeedRow({ sale, isNew }: { sale: ClosedSale; isNew: boolean }) {
  const ts = new Date(sale.timestamp);
  const time = ts.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  // Rep name: first name + last initial
  const nameParts = sale.rep.name.split(' ');
  const shortName =
    nameParts.length >= 2
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
      : sale.rep.name;

  // Item summary: condense sales lines into readable text
  const lines = sale.event.salesLines;
  let itemSummary: string;
  if (lines.length === 0) {
    itemSummary = 'Empty sale';
  } else if (lines.length === 1) {
    itemSummary = truncate(lines[0].description, 32);
  } else if (lines.length === 2) {
    itemSummary = `${truncate(lines[0].description, 20)} + ${truncate(lines[1].description, 20)}`;
  } else {
    itemSummary = `${truncate(lines[0].description, 24)} +${lines.length - 1} more`;
  }

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isNew ? 'animate-fade-in-up' : ''}`}
      style={{
        background: isNew ? 'rgba(34, 197, 94, 0.06)' : 'var(--surface-bg)',
        border: `1px solid ${isNew ? 'rgba(34, 197, 94, 0.15)' : 'var(--glass-border)'}`,
      }}
    >
      {/* Timestamp */}
      <span
        className="text-[11px] font-mono shrink-0 w-10 text-center"
        style={{ color: 'var(--page-muted)' }}
      >
        {time}
      </span>

      {/* Rep name */}
      <span
        className="text-xs font-semibold shrink-0 w-20 truncate"
        style={{ color: 'var(--page-text)' }}
      >
        {shortName}
      </span>

      {/* Item summary */}
      <span
        className="text-xs flex-1 truncate"
        style={{ color: 'var(--page-muted)' }}
      >
        {itemSummary}
      </span>

      {/* Commission */}
      <span
        className="text-xs font-mono font-bold shrink-0"
        style={{ color: '#22c55e' }}
      >
        {formatCurrency(sale.commission.total)}
      </span>

      {/* Checkmark */}
      <CheckCircle2
        className="w-3.5 h-3.5 shrink-0"
        style={{ color: '#22c55e' }}
      />
    </div>
  );
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + '\u2026' : str;
}
