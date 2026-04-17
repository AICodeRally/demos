'use client';

import { useMemo } from 'react';
import { DollarSign, Percent, CreditCard, Receipt } from 'lucide-react';
import type { ManagerComponentProps } from './ManagerFeed';
import { formatCurrency } from '@/lib/swic/engine/calculator';

interface MetricCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

/**
 * TeamMetrics — 4-card grid of store-level aggregates.
 *
 * - Store Revenue: sum of all sale.event.grossAmount
 * - Avg Margin %: mean of (grossAmount - costAmount) / grossAmount * 100 per sale
 * - Commission Payout: sum of all sale.commission.total
 * - Avg Ticket: revenue / transaction count
 */
export function TeamMetrics({ sales }: ManagerComponentProps) {
  const metrics: MetricCard[] = useMemo(() => {
    const totalRevenue = sales.reduce((s, sale) => s + sale.event.grossAmount, 0);
    const totalCommission = sales.reduce((s, sale) => s + sale.commission.total, 0);
    const txnCount = sales.length;
    const avgTicket = txnCount > 0 ? totalRevenue / txnCount : 0;

    // Avg margin %: per-sale margin %, then average
    let avgMarginPct = 0;
    if (txnCount > 0) {
      const totalCost = sales.reduce((s, sale) => {
        return s + sale.event.salesLines.reduce((ls, line) => ls + line.costAmount, 0);
      }, 0);
      avgMarginPct = totalRevenue > 0
        ? ((totalRevenue - totalCost) / totalRevenue) * 100
        : 0;
    }

    return [
      {
        label: 'Store Revenue',
        value: formatCurrency(totalRevenue),
        icon: <DollarSign className="w-4 h-4" />,
        color: '#6366f1',
      },
      {
        label: 'Avg Margin %',
        value: `${avgMarginPct.toFixed(1)}%`,
        icon: <Percent className="w-4 h-4" />,
        color: '#8b5cf6',
      },
      {
        label: 'Commission Payout',
        value: formatCurrency(totalCommission),
        icon: <CreditCard className="w-4 h-4" />,
        color: '#22c55e',
      },
      {
        label: 'Avg Ticket',
        value: formatCurrency(avgTicket),
        icon: <Receipt className="w-4 h-4" />,
        color: '#f59e0b',
      },
    ];
  }, [sales]);

  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="glass rounded-xl p-4 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `${m.color}15`, color: m.color }}
            >
              {m.icon}
            </div>
            <span
              className="text-[10px] uppercase tracking-wider font-semibold"
              style={{ color: 'var(--page-muted)' }}
            >
              {m.label}
            </span>
          </div>
          <span
            className="text-xl font-mono font-black"
            style={{ color: 'var(--page-text)' }}
          >
            {m.value}
          </span>
        </div>
      ))}
    </div>
  );
}
