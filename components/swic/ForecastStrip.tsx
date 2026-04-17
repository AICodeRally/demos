'use client';

import type { ClientConfig, PeriodContext } from '@/lib/swic/engine/types';
import { forecast } from '@/lib/swic-engine';
import type { ForecastResult } from '@/lib/swic-engine';
import { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Zap, Clock } from 'lucide-react';

interface ForecastStripProps {
  config: ClientConfig;
  period: PeriodContext;
  daysInPeriod: number;
  daysElapsed: number;
  accent?: string;
}

const RISK_STYLES = {
  on_track: { color: '#22c55e', bg: '#22c55e15', label: 'On Track', icon: TrendingUp },
  at_risk: { color: '#f59e0b', bg: '#f59e0b15', label: 'At Risk', icon: AlertTriangle },
  behind: { color: '#ef4444', bg: '#ef444415', label: 'Behind', icon: TrendingDown },
} as const;

export function ForecastStrip({ config, period, daysInPeriod, daysElapsed, accent = '#6366f1' }: ForecastStripProps) {
  const result = useMemo<ForecastResult | null>(() => {
    if (!period.target || daysElapsed <= 0) return null;
    return forecast({
      config,
      baseline: period,
      pipeline: [], // No pipeline deals in POS mode — pure run-rate forecast
      daysInPeriod,
      daysElapsed,
      iterations: 500,
      seed: 42,
    });
  }, [config, period, daysInPeriod, daysElapsed]);

  if (!result || !period.target) return null;

  const risk = RISK_STYLES[result.riskLevel];
  const RiskIcon = risk.icon;
  const projectedRevenue = period.revenue + result.runRate * result.daysRemaining;
  const projectedPct = period.target ? (projectedRevenue / period.target) * 100 : 0;

  return (
    <div className="glass-nav">
      <div className="max-w-[1600px] mx-auto px-4 py-1.5 flex items-center justify-between">
        {/* Left: Risk badge + attainment probability */}
        <div className="flex items-center gap-3">
          <span
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: risk.bg, color: risk.color, border: `1px solid ${risk.color}25` }}
          >
            <RiskIcon className="w-3 h-3" />
            {risk.label}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--page-muted)' }}>
            <Target className="w-3 h-3 inline mr-1" style={{ color: accent }} />
            Attainment: <strong className="font-mono" style={{ color: risk.color }}>{(result.attainmentProbability * 100).toFixed(0)}%</strong> likely
          </span>
        </div>

        {/* Center: Run rate vs required rate */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-[10px]" style={{ color: 'var(--page-muted)' }}>
            <Zap className="w-3 h-3 inline mr-1" style={{ color: '#22c55e' }} />
            Run Rate: <strong className="font-mono">${result.runRate.toLocaleString(undefined, { maximumFractionDigits: 0 })}/day</strong>
          </span>
          <span className="text-[10px]" style={{ color: 'var(--page-muted)' }}>
            <TrendingUp className="w-3 h-3 inline mr-1" style={{ color: result.requiredRate > result.runRate ? '#ef4444' : '#22c55e' }} />
            Need: <strong className="font-mono" style={{ color: result.requiredRate > result.runRate ? '#ef4444' : '#22c55e' }}>
              ${result.requiredRate.toLocaleString(undefined, { maximumFractionDigits: 0 })}/day
            </strong>
          </span>
          {/* Mini progress bar */}
          <div className="flex items-center gap-1.5">
            <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--glass-border)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(projectedPct, 100)}%`,
                  background: `linear-gradient(90deg, ${risk.color}, ${accent})`,
                }}
              />
            </div>
            <span className="text-[10px] font-mono font-bold" style={{ color: risk.color }}>
              {projectedPct.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Right: Days remaining */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" style={{ color: 'var(--page-muted)' }} />
          <span className="text-[10px] font-mono" style={{ color: 'var(--page-muted)' }}>
            <strong>{result.daysRemaining}d</strong> left
          </span>
        </div>
      </div>
    </div>
  );
}
