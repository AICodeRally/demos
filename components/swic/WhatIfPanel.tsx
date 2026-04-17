'use client';

import type { ClientConfig, PeriodContext, SaleItem } from '@/lib/swic/engine/types';
import { whatIf } from '@/lib/swic-engine';
import type { WhatIfResult } from '@/lib/swic-engine';
import { useMemo } from 'react';
import { ArrowUp, ArrowDown, Minus, Star, TrendingUp } from 'lucide-react';

interface WhatIfPanelProps {
  config: ClientConfig;
  period: PeriodContext;
  saleItems: SaleItem[];
  accent?: string;
}

function formatDelta(n: number): string {
  const sign = n >= 0 ? '+' : '';
  return `${sign}$${Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function WhatIfPanel({ config, period, saleItems, accent = '#6366f1' }: WhatIfPanelProps) {
  const result = useMemo<WhatIfResult | null>(() => {
    if (saleItems.length === 0) return null;
    return whatIf({
      baseline: period,
      config,
      additionalDeals: [{
        revenue: saleItems.reduce((s, i) => s + i.price * i.quantity, 0),
        cost: saleItems.reduce((s, i) => s + i.cost * i.quantity, 0),
        items: saleItems,
        probability: 1,
      }],
    });
  }, [config, period, saleItems]);

  if (!result || result.delta === 0) return null;

  const isPositive = result.delta > 0;
  const DeltaIcon = isPositive ? ArrowUp : ArrowDown;

  return (
    <div className="glass rounded-2xl p-4 mt-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold tracking-tight uppercase flex items-center gap-1.5" style={{ color: 'var(--page-muted)' }}>
          <TrendingUp className="w-3.5 h-3.5" style={{ color: accent }} />
          What-If Impact
        </h3>
        <span
          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
          style={{
            color: isPositive ? '#22c55e' : '#ef4444',
            background: isPositive ? '#22c55e12' : '#ef444412',
            border: `1px solid ${isPositive ? '#22c55e' : '#ef4444'}25`,
          }}
        >
          <DeltaIcon className="w-3 h-3 inline mr-0.5" />
          {formatDelta(result.delta)}
        </span>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <div className="text-[10px]" style={{ color: 'var(--page-muted)' }}>Baseline</div>
          <div className="text-sm font-mono font-bold">
            ${result.baselineCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="text-lg" style={{ color: 'var(--page-muted)' }}>→</div>
        <div className="flex-1">
          <div className="text-[10px]" style={{ color: 'var(--page-muted)' }}>Projected</div>
          <div className="text-sm font-mono font-bold" style={{ color: isPositive ? '#22c55e' : '#ef4444' }}>
            ${result.projectedCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-[10px]" style={{ color: 'var(--page-muted)' }}>Change</div>
          <div className="text-sm font-mono font-bold" style={{ color: isPositive ? '#22c55e' : '#ef4444' }}>
            {(result.deltaPercent * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Component deltas */}
      <div className="space-y-1">
        {result.componentDeltas
          .filter((cd) => cd.delta !== 0)
          .map((cd) => {
            const cdPositive = cd.delta > 0;
            return (
              <div key={cd.componentId} className="flex items-center justify-between py-1 px-2 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
                <span className="text-[11px] font-medium">{cd.label}</span>
                <span
                  className="text-[11px] font-mono font-semibold flex items-center gap-0.5"
                  style={{ color: cdPositive ? '#22c55e' : '#ef4444' }}
                >
                  {cdPositive ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                  {formatDelta(cd.delta)}
                </span>
              </div>
            );
          })}
      </div>

      {/* New tier badge */}
      {result.newTier && (
        <div
          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold"
          style={{
            background: `linear-gradient(135deg, ${accent}15, ${accent}08)`,
            border: `1px solid ${accent}30`,
            color: accent,
          }}
        >
          <Star className="w-4 h-4" />
          New tier reached! Rate: {(result.newTier.rate * 100).toFixed(1)}%
        </div>
      )}
    </div>
  );
}
