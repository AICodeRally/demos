'use client';

import { useMemo } from 'react';
import { Wallet } from 'lucide-react';
import type { ManagerComponentProps } from './ManagerFeed';
import { formatCurrency } from '@/lib/swic/engine/calculator';

/**
 * CommissionBudget — progress bar showing totalCommission vs store.commissionBudget.
 *
 * Color coding: green (<60%), amber (60-80%), red (>80%).
 * Shows "$X of $Y budget used" text and percentage label.
 */
export function CommissionBudget({ sales, store }: ManagerComponentProps) {
  const { totalCommission, pct, color, colorBg } = useMemo(() => {
    const total = sales.reduce((s, sale) => s + sale.commission.total, 0);
    const percentage = store.commissionBudget > 0
      ? (total / store.commissionBudget) * 100
      : 0;

    let barColor: string;
    let barBg: string;
    if (percentage > 80) {
      barColor = '#ef4444'; // red
      barBg = 'rgba(239, 68, 68, 0.12)';
    } else if (percentage > 60) {
      barColor = '#f59e0b'; // amber
      barBg = 'rgba(245, 158, 11, 0.12)';
    } else {
      barColor = '#22c55e'; // green
      barBg = 'rgba(34, 197, 94, 0.12)';
    }

    return {
      totalCommission: total,
      pct: Math.min(percentage, 100),
      color: barColor,
      colorBg: barBg,
    };
  }, [sales, store.commissionBudget]);

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Wallet className="w-4 h-4" style={{ color }} />
        <h3
          className="text-sm font-bold uppercase tracking-wider"
          style={{ color: 'var(--page-muted)' }}
        >
          Commission Budget
        </h3>
      </div>

      {/* Progress bar */}
      <div
        className="h-6 rounded-lg overflow-hidden mb-3"
        style={{ background: 'var(--surface-bg)', border: '1px solid var(--glass-border)' }}
      >
        <div
          className="h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
          style={{
            width: `${Math.max(pct, 3)}%`,
            background: `linear-gradient(90deg, ${colorBg}, ${color}30)`,
            borderRight: `2px solid ${color}`,
          }}
        >
          {pct >= 15 && (
            <span
              className="text-[10px] font-mono font-bold"
              style={{ color }}
            >
              {pct.toFixed(0)}%
            </span>
          )}
        </div>
      </div>

      {/* Text summary */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--page-muted)' }}>
          <span className="font-mono font-bold" style={{ color }}>
            {formatCurrency(totalCommission)}
          </span>
          {' '}of{' '}
          <span className="font-mono font-semibold" style={{ color: 'var(--page-text)' }}>
            {formatCurrency(store.commissionBudget)}
          </span>
          {' '}budget used
        </span>

        {pct < 15 && (
          <span
            className="text-[10px] font-mono font-bold"
            style={{ color }}
          >
            {pct.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
}
