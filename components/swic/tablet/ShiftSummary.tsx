'use client';

import { useMemo } from 'react';
import { Clock, Hash, DollarSign, CreditCard, RotateCcw, XCircle } from 'lucide-react';
import type { ManagerComponentProps } from './ManagerFeed';
import { formatCurrency } from '@/lib/swic/engine/calculator';

interface SummaryRow {
  label: string;
  value: string;
  icon: React.ReactNode;
}

/**
 * ShiftSummary — single card showing shift-level operational totals.
 *
 * Includes shift open time, transaction count, total revenue,
 * total commission, returns (hardcoded 0), and voids (hardcoded 0).
 */
export function ShiftSummary({ sales, store }: ManagerComponentProps) {
  const rows: SummaryRow[] = useMemo(() => {
    const totalRevenue = sales.reduce((s, sale) => s + sale.event.grossAmount, 0);
    const totalCommission = sales.reduce((s, sale) => s + sale.commission.total, 0);

    return [
      {
        label: 'Shift Open',
        value: formatShiftTime(store.shiftStart),
        icon: <Clock className="w-3.5 h-3.5" />,
      },
      {
        label: 'Transactions',
        value: String(sales.length),
        icon: <Hash className="w-3.5 h-3.5" />,
      },
      {
        label: 'Total Revenue',
        value: formatCurrency(totalRevenue),
        icon: <DollarSign className="w-3.5 h-3.5" />,
      },
      {
        label: 'Total Commission',
        value: formatCurrency(totalCommission),
        icon: <CreditCard className="w-3.5 h-3.5" />,
      },
      {
        label: 'Returns',
        value: '0',
        icon: <RotateCcw className="w-3.5 h-3.5" />,
      },
      {
        label: 'Voids',
        value: '0',
        icon: <XCircle className="w-3.5 h-3.5" />,
      },
    ];
  }, [sales, store.shiftStart]);

  return (
    <div className="glass rounded-2xl p-5">
      <h3
        className="text-sm font-bold uppercase tracking-wider mb-4"
        style={{ color: 'var(--page-muted)' }}
      >
        Shift Summary
      </h3>

      <div className="space-y-2.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--page-muted)' }}>{row.icon}</span>
              <span
                className="text-xs font-medium"
                style={{ color: 'var(--page-muted)' }}
              >
                {row.label}
              </span>
            </div>
            <span
              className="text-xs font-mono font-semibold"
              style={{ color: 'var(--page-text)' }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatShiftTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
}
