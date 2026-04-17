'use client';

import { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import type { ManagerComponentProps } from './ManagerFeed';
import { formatCurrency } from '@/lib/swic/engine/calculator';

interface RepAgg {
  name: string;
  totalCommission: number;
  txnCount: number;
}

const MEDAL_COLORS = ['#fbbf24', '#94a3b8', '#cd7f32'] as const; // gold, silver, bronze

/**
 * Leaderboard — aggregate sales by rep, sum commission, sort descending.
 *
 * Shows rank (with medal colors for top 3), rep name, total commission,
 * horizontal bar chart proportional to the leader, and transaction count.
 */
export function Leaderboard({ sales }: ManagerComponentProps) {
  const rankings = useMemo(() => {
    const map = new Map<string, RepAgg>();
    for (const sale of sales) {
      const existing = map.get(sale.rep.id);
      if (existing) {
        existing.totalCommission += sale.commission.total;
        existing.txnCount += 1;
      } else {
        map.set(sale.rep.id, {
          name: sale.rep.name,
          totalCommission: sale.commission.total,
          txnCount: 1,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalCommission - a.totalCommission);
  }, [sales]);

  const maxCommission = rankings.length > 0 ? rankings[0].totalCommission : 1;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4" style={{ color: '#fbbf24' }} />
        <h3
          className="text-sm font-bold uppercase tracking-wider"
          style={{ color: 'var(--page-muted)' }}
        >
          Leaderboard
        </h3>
      </div>

      {rankings.length === 0 ? (
        <p className="text-xs text-center py-4" style={{ color: 'var(--page-muted)' }}>
          No sales data yet
        </p>
      ) : (
        <div className="space-y-2">
          {rankings.map((rep, idx) => {
            const barWidth = maxCommission > 0
              ? Math.max((rep.totalCommission / maxCommission) * 100, 4)
              : 0;
            const medalColor = idx < 3 ? MEDAL_COLORS[idx] : undefined;

            return (
              <div
                key={rep.name}
                className="relative rounded-lg overflow-hidden px-3 py-2.5"
                style={{
                  background: 'var(--surface-bg)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                {/* Bar background */}
                <div
                  className="absolute inset-0 rounded-lg transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    background: medalColor
                      ? `${medalColor}12`
                      : 'rgba(99, 102, 241, 0.06)',
                  }}
                />

                {/* Content */}
                <div className="relative flex items-center gap-3">
                  {/* Rank */}
                  <span
                    className="text-xs font-black w-5 text-center shrink-0"
                    style={{ color: medalColor ?? 'var(--page-muted)' }}
                  >
                    {idx + 1}
                  </span>

                  {/* Rep name */}
                  <span
                    className="text-xs font-semibold flex-1 truncate"
                    style={{ color: 'var(--page-text)' }}
                  >
                    {rep.name}
                  </span>

                  {/* Transaction count */}
                  <span
                    className="text-[10px] shrink-0"
                    style={{ color: 'var(--page-muted)' }}
                  >
                    {rep.txnCount} txn{rep.txnCount !== 1 ? 's' : ''}
                  </span>

                  {/* Total commission */}
                  <span
                    className="text-xs font-mono font-bold shrink-0"
                    style={{ color: '#22c55e' }}
                  >
                    {formatCurrency(rep.totalCommission)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
