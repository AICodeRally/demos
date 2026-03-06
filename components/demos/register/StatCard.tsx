'use client';

import { SparklineRow } from './SparklineRow';

interface StatCardProps {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  color?: string;
  sparkline?: number[];
}

const trendConfig = {
  up: { arrow: '\u2191', color: '#059669' },
  down: { arrow: '\u2193', color: '#DC2626' },
  flat: { arrow: '\u2192', color: '#A8A29E' },
} as const;

export function StatCard({
  label,
  value,
  trend,
  trendValue,
  color = '#8B7355',
  sparkline,
}: StatCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border p-5"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E7E5E4' }}
    >
      <p
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: '#A8A29E' }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-2xl font-bold"
        style={{ color: '#1C1917' }}
      >
        {value}
      </p>
      {trend && (
        <div className="mt-2 flex items-center gap-1">
          <span
            className="text-sm font-semibold"
            style={{ color: trendConfig[trend].color }}
          >
            {trendConfig[trend].arrow}
          </span>
          {trendValue && (
            <span
              className="text-xs font-medium"
              style={{ color: trendConfig[trend].color }}
            >
              {trendValue}
            </span>
          )}
        </div>
      )}
      {sparkline && sparkline.length > 1 && (
        <div className="absolute bottom-3 right-3">
          <SparklineRow data={sparkline} color={color} width={60} height={24} />
        </div>
      )}
    </div>
  );
}
