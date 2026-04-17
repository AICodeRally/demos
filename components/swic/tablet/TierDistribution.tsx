'use client';

import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import type { ManagerComponentProps } from './ManagerFeed';
import { SAMPLE_PERIODS, TABLET_CONFIG } from '@/lib/swic/data/tablet';

interface TierBucket {
  label: string;
  rate: string;
  repCount: number;
}

/**
 * TierDistribution — horizontal bar chart showing how many reps
 * are at each commission tier based on their YTD revenue.
 *
 * Uses tier definitions from TABLET_CONFIG (the base-comm tiered rule)
 * and YTD revenue from SAMPLE_PERIODS to classify each unique rep.
 */
export function TierDistribution({ sales }: ManagerComponentProps) {
  const buckets: TierBucket[] = useMemo(() => {
    // Get the tiered rule from the config
    const baseComp = TABLET_CONFIG.components.find((c) => c.id === 'base-comm');
    if (!baseComp || baseComp.rule.type !== 'tiered') return [];

    const tiers = baseComp.rule.tiers;

    // Tier definitions: label them by tier number
    // Tier 1 = $0+, Tier 2 = $50K+, Tier 3 = $75K+
    // We also add a Tier 4+ conceptually for >=100K
    const tierDefs = tiers.map((t, idx) => ({
      min: t.min,
      max: idx < tiers.length - 1 ? tiers[idx + 1].min : Infinity,
      rate: t.rate,
      label: `Tier ${idx + 1}`,
      rateLabel: `${(t.rate * 100).toFixed(0)}%`,
    }));

    // Collect unique reps from both sales AND SAMPLE_PERIODS
    const repRevenue = new Map<string, number>();

    // Start with SAMPLE_PERIODS YTD
    for (const [repId, period] of Object.entries(SAMPLE_PERIODS)) {
      repRevenue.set(repId, period.revenue);
    }

    // Add current-day revenue from sales on top
    for (const sale of sales) {
      const current = repRevenue.get(sale.rep.id) ?? 0;
      repRevenue.set(sale.rep.id, current + sale.event.grossAmount);
    }

    // Classify each rep into a tier
    const counts = new Array(tierDefs.length).fill(0) as number[];
    for (const revenue of repRevenue.values()) {
      // Find the highest tier the rep qualifies for
      let tierIdx = 0;
      for (let i = tierDefs.length - 1; i >= 0; i--) {
        if (revenue >= tierDefs[i].min) {
          tierIdx = i;
          break;
        }
      }
      counts[tierIdx]++;
    }

    return tierDefs.map((td, idx) => ({
      label: td.label,
      rate: td.rateLabel,
      repCount: counts[idx],
    }));
  }, [sales]);

  const maxCount = Math.max(...buckets.map((b) => b.repCount), 1);

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4" style={{ color: '#8b5cf6' }} />
        <h3
          className="text-sm font-bold uppercase tracking-wider"
          style={{ color: 'var(--page-muted)' }}
        >
          Tier Distribution
        </h3>
      </div>

      {buckets.length === 0 ? (
        <p className="text-xs text-center py-4" style={{ color: 'var(--page-muted)' }}>
          No tier data available
        </p>
      ) : (
        <div className="space-y-3">
          {buckets.map((bucket) => {
            const barWidth = maxCount > 0
              ? Math.max((bucket.repCount / maxCount) * 100, 6)
              : 0;

            return (
              <div key={bucket.label}>
                {/* Label row */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: 'var(--page-text)' }}
                    >
                      {bucket.label}
                    </span>
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: 'var(--page-muted)' }}
                    >
                      @ {bucket.rate}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: 'var(--page-muted)' }}
                  >
                    {bucket.repCount} rep{bucket.repCount !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Bar */}
                <div
                  className="h-5 rounded-lg overflow-hidden"
                  style={{ background: 'var(--surface-bg)', border: '1px solid var(--glass-border)' }}
                >
                  <div
                    className="h-full rounded-lg transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
