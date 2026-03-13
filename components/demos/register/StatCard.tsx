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
  up: { arrow: '\u2191', color: 'var(--register-success, #10B981)' },
  down: { arrow: '\u2193', color: 'var(--register-danger, #EF4444)' },
  flat: { arrow: '\u2192', color: 'var(--register-text-muted, #94A3B8)' },
} as const;

export function StatCard({
  label,
  value,
  trend,
  trendValue,
  color = 'var(--register-accent)',
  sparkline,
}: StatCardProps) {
  return (
    <div className="register-card register-card-hover relative overflow-hidden p-5">
      <p className="register-meta-label">{label}</p>
      <p
        className="register-kpi-value mt-1"
        style={{ color: 'var(--register-text)' }}
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
