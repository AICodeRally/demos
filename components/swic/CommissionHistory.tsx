'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/swic/engine/calculator';
import { History, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';

interface PeriodSummary {
  period: string;
  label: string;
  totalCommission: number;
  revenue: number;
  deals: number;
}

interface CommissionHistoryProps {
  clientId: string;
  repName: string;
  accent?: string;
}

// Generate demo historical data based on clientId for consistency
function generateHistory(clientId: string): PeriodSummary[] {
  const seeds: Record<string, number[]> = {
    'mattress-firm': [4280, 5120, 3890, 6340, 5680, 4920],
    'acme-electronics': [2150, 2890, 1980, 3420, 2760, 3100],
    'premier-motors': [8900, 12400, 7600, 15200, 11800, 9400],
    'summit-shield': [3200, 2800, 4100, 3600, 2950, 3800],
    'cloudstack-ai': [18500, 22000, 15800, 28400, 24600, 19200],
    'medvance': [6800, 7200, 5400, 8900, 7600, 6100],
  };

  const commissions = seeds[clientId] ?? [3000, 3500, 2800, 4200, 3800, 3200];
  const months = ['Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026'];
  const monthKeys = ['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02'];

  return months.map((label, i) => ({
    period: monthKeys[i],
    label,
    totalCommission: commissions[i],
    revenue: commissions[i] * 18, // rough revenue multiplier
    deals: Math.floor(commissions[i] / 400) + 5,
  }));
}

function Sparkline({ data, accent, width = 120, height = 32 }: { data: number[]; accent: string; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      {/* Dot on last point */}
      {(() => {
        const lastX = width;
        const lastY = height - ((data[data.length - 1] - min) / range) * (height - 4) - 2;
        return <circle cx={lastX} cy={lastY} r="3" fill={accent} />;
      })()}
    </svg>
  );
}

export function CommissionHistory({ clientId, repName, accent = '#6366f1' }: CommissionHistoryProps) {
  const [expanded, setExpanded] = useState(false);
  const history = generateHistory(clientId);
  const latest = history[history.length - 1];
  const prev = history[history.length - 2];
  const delta = latest && prev ? ((latest.totalCommission - prev.totalCommission) / prev.totalCommission) * 100 : 0;
  const isUp = delta >= 0;

  return (
    <div className="glass rounded-2xl overflow-hidden mt-4">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${accent}15` }}
          >
            <History className="w-3.5 h-3.5" style={{ color: accent }} />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold">Commission History</span>
            <p className="text-[10px]" style={{ color: 'var(--page-muted)' }}>{repName} — Last 6 months</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Sparkline data={history.map((h) => h.totalCommission)} accent={accent} width={80} height={24} />
          <div className="flex items-center gap-1">
            {isUp
              ? <TrendingUp className="w-3 h-3" style={{ color: '#22c55e' }} />
              : <TrendingDown className="w-3 h-3" style={{ color: '#ef4444' }} />}
            <span
              className="text-[10px] font-mono font-bold"
              style={{ color: isUp ? '#22c55e' : '#ef4444' }}
            >
              {isUp ? '+' : ''}{delta.toFixed(1)}%
            </span>
          </div>
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--page-muted)' }} />
            : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--page-muted)' }} />}
        </div>
      </button>

      {/* Detail rows */}
      {expanded && (
        <div className="px-4 pb-4 space-y-1.5 animate-fade-in-up">
          {history.map((p, i) => {
            const prevP = i > 0 ? history[i - 1] : null;
            const change = prevP ? ((p.totalCommission - prevP.totalCommission) / prevP.totalCommission) * 100 : 0;
            const isLatest = i === history.length - 1;
            return (
              <div
                key={p.period}
                className="flex items-center gap-3 px-3 py-2 rounded-lg"
                style={{
                  background: isLatest ? `${accent}08` : 'var(--glass-bg)',
                  border: isLatest ? `1px solid ${accent}20` : '1px solid transparent',
                }}
              >
                <span className="text-[10px] w-16 font-medium" style={{ color: isLatest ? accent : 'var(--page-muted)' }}>
                  {p.label}
                </span>
                <div className="flex-1 flex items-center gap-2">
                  {/* Mini bar */}
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--glass-border)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(p.totalCommission / Math.max(...history.map((h) => h.totalCommission))) * 100}%`,
                        background: isLatest ? accent : `${accent}60`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold w-16 text-right">
                  {formatCurrency(p.totalCommission)}
                </span>
                {prevP && (
                  <span
                    className="text-[10px] font-mono w-12 text-right"
                    style={{ color: change >= 0 ? '#22c55e' : '#ef4444' }}
                  >
                    {change >= 0 ? '+' : ''}{change.toFixed(0)}%
                  </span>
                )}
                {!prevP && <span className="w-12" />}
              </div>
            );
          })}
          {/* Summary row */}
          <div className="flex items-center justify-between px-3 pt-2 mt-1" style={{ borderTop: '1px solid var(--glass-border)' }}>
            <span className="text-[10px] font-medium" style={{ color: 'var(--page-muted)' }}>6-Month Total</span>
            <span className="text-xs font-mono font-bold" style={{ color: accent }}>
              {formatCurrency(history.reduce((s, h) => s + h.totalCommission, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
