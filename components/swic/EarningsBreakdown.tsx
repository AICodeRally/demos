'use client';

import type { CalculationResult, ClientConfig } from '@/lib/swic/engine/types';
import { formatCurrency } from '@/lib/swic/engine/calculator';
import { X, DollarSign, Zap, TrendingUp, Table, Percent, HelpCircle } from 'lucide-react';

interface EarningsBreakdownProps {
  config: ClientConfig;
  result: CalculationResult;
  onClose: () => void;
}

const RULE_META: Record<string, { icon: typeof DollarSign; color: string }> = {
  percent_of: { icon: Percent, color: '#6366f1' },
  fixed_per_match: { icon: Zap, color: '#f59e0b' },
  tiered: { icon: TrendingUp, color: '#22c55e' },
  lookup: { icon: Table, color: '#3b82f6' },
  multiplier: { icon: DollarSign, color: '#a855f7' },
  placeholder: { icon: HelpCircle, color: '#64748b' },
};

export function EarningsBreakdown({ config, result, onClose }: EarningsBreakdownProps) {
  const accent = config.theme?.accent ?? '#6366f1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
      <div
        className="glass-strong rounded-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto"
      >
        {/* Header with gradient */}
        <div
          className="flex items-center justify-between p-5 relative overflow-hidden"
          style={{ borderBottom: '1px solid var(--glass-border)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${accent}08, transparent)`,
            }}
          />
          <div className="relative">
            <h2 className="text-lg font-bold">Earnings Breakdown</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--page-muted)' }}>
              {config.name} — Sale: {formatCurrency(result.saleTotal)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="relative glass-pill p-2 rounded-lg transition-all hover:scale-105"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Components */}
        <div className="p-5 space-y-3">
          {result.components.map((comp) => {
            const meta = RULE_META[comp.rule] ?? RULE_META.placeholder;
            const Icon = meta.icon;
            return (
              <div key={comp.componentId} className="flex gap-3">
                <div
                  className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${meta.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: meta.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{comp.label}</span>
                    <span
                      className="text-sm font-mono font-bold"
                      style={{ color: comp.amount > 0 ? '#22c55e' : 'var(--page-muted)' }}
                    >
                      {comp.amount > 0 ? '+' : ''}{formatCurrency(comp.amount)}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--page-muted)' }}>{comp.detail}</p>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-mono mt-1 inline-block"
                    style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--page-muted)' }}
                  >
                    {comp.rule}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Metrics */}
        <div className="px-5 pb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--page-muted)' }}>
            Sale Metrics
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {result.summaryMetrics.map((metric) => (
              <div key={metric.id} className="glass flex items-center justify-between p-2.5 rounded-lg">
                <span className="text-xs" style={{ color: 'var(--page-muted)' }}>{metric.label}</span>
                <span className="text-xs font-mono font-bold">
                  {metric.format === 'currency'
                    ? formatCurrency(metric.value)
                    : metric.format === 'percent'
                      ? `${metric.value.toFixed(1)}%`
                      : metric.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer — Total */}
        <div className="p-5 rounded-b-2xl" style={{ borderTop: '1px solid var(--glass-border)', background: 'var(--surface-bg)' }}>
          <div className="flex items-center justify-between">
            <span className="font-bold">Total Commission</span>
            <span
              className="text-xl font-mono font-black"
              style={{ color: '#22c55e' }}
            >
              {formatCurrency(result.totalCommission)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
