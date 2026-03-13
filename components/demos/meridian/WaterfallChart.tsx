'use client';

import type { WaterfallTier } from '@/data/meridian';

interface WaterfallChartProps {
  tiers: WaterfallTier[];
  totalDistributions: number;
}

export function WaterfallChart({ tiers, totalDistributions }: WaterfallChartProps) {
  const w = 700, h = 280;
  const pad = { top: 40, right: 20, bottom: 60, left: 80 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const barW = chartW / tiers.length - 20;

  const maxVal = totalDistributions;
  const toY = (v: number) => pad.top + chartH - (v / maxVal) * chartH;

  let running = 0;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1.0].map((pct) => (
        <g key={pct}>
          <line
            x1={pad.left} y1={toY(pct * maxVal)}
            x2={w - pad.right} y2={toY(pct * maxVal)}
            stroke="var(--mr-chart-grid)" strokeWidth="1" strokeDasharray="4 4"
          />
          <text x={pad.left - 8} y={toY(pct * maxVal) + 4} textAnchor="end" fontSize="11" fill="var(--mr-text-faint)" fontFamily="monospace">
            ${(pct * maxVal / 1e9).toFixed(1)}B
          </text>
        </g>
      ))}

      {/* Bars */}
      {tiers.map((tier, i) => {
        const x = pad.left + i * (chartW / tiers.length) + 10;
        const barBottom = toY(running);
        const barTop = toY(running + tier.amount);
        const barHeight = barBottom - barTop;
        running += tier.amount;

        return (
          <g key={tier.name}>
            <rect x={x} y={barTop} width={barW} height={barHeight} rx={4} fill={tier.color} opacity={0.85} />
            {/* Amount label */}
            <text x={x + barW / 2} y={barTop - 8} textAnchor="middle" fontSize="12" fontWeight="bold" fill={tier.color} fontFamily="monospace">
              ${(tier.amount / 1e9).toFixed(2)}B
            </text>
            {/* Cumulative marker */}
            {i < tiers.length - 1 && (
              <line x1={x + barW} y1={barTop} x2={x + barW + 20} y2={barTop} stroke={tier.color} strokeWidth="1.5" strokeDasharray="3 3" />
            )}
            {/* Tier name below */}
            <text x={x + barW / 2} y={h - pad.bottom + 16} textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--mr-text-muted)" fontFamily="monospace">
              {tier.name.split(' ').slice(0, 2).join(' ')}
            </text>
            <text x={x + barW / 2} y={h - pad.bottom + 30} textAnchor="middle" fontSize="10" fill="var(--mr-text-faint)" fontFamily="monospace">
              {tier.split[0]}/{tier.split[1]} GP/LP
            </text>
          </g>
        );
      })}

      {/* Title */}
      <text x={w / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="bold" fill="var(--mr-text)" fontFamily="monospace">
        EUROPEAN WATERFALL — FUND IV PROJECTED DISTRIBUTIONS
      </text>
    </svg>
  );
}
