'use client';

import { useCountUp } from './useCountUp';

interface StatCardProps {
  label: string;
  value: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: string;
  sparkline?: number[];
  onClick?: () => void;
  animationDelay?: number;
}

function buildSparklinePath(values: number[], width: number, height: number): string {
  if (values.length < 2) return '';
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  return values
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(' ');
}

function parseNumericValue(value: string): { num: number; prefix: string; suffix: string; decimals: number } | null {
  const match = value.match(/^([^0-9-]*)(-?[\d,]+\.?\d*)(.*)$/);
  if (!match) return null;
  const num = parseFloat(match[2].replace(/,/g, ''));
  if (isNaN(num)) return null;
  const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0;
  return { num, prefix: match[1], suffix: match[3], decimals };
}

function AnimatedValue({ value, color }: { value: string; color?: string }) {
  const parsed = parseNumericValue(value);
  if (!parsed) {
    return <span className="lot-value" style={color ? { color } : undefined}>{value}</span>;
  }

  const display = useCountUp({
    end: parsed.num,
    duration: 800,
    decimals: parsed.decimals,
    prefix: parsed.prefix,
    suffix: parsed.suffix,
  });

  // Format with commas
  const formatted = display.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return <span className="lot-value" style={color ? { color } : undefined}>{formatted}</span>;
}

export function StatCard({ label, value, trend, trendValue, color = '#1E3A5F', sparkline, onClick, animationDelay = 0 }: StatCardProps) {
  return (
    <div
      className={`lot-card lot-animate-in relative overflow-hidden${onClick ? ' cursor-pointer' : ''}`}
      style={{
        borderLeft: `4px solid ${color}`,
        animationDelay: `${animationDelay * 0.06}s`,
      }}
      onClick={onClick}
    >
      <p className="lot-label">{label}</p>
      <div className="mt-1">
        <AnimatedValue value={value} />
      </div>
      {trend && trendValue && (
        <p style={{ fontSize: 'var(--lot-font-caption)', marginTop: '4px', fontWeight: 600, color: trend === 'up' ? '#16A34A' : '#DC2626' }}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </p>
      )}
      {sparkline && sparkline.length > 1 && (
        <svg className="absolute bottom-3 right-3" width="80" height="28" viewBox="0 0 80 28">
          <polyline
            points={buildSparklinePath(sparkline, 80, 28)}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.5}
          />
        </svg>
      )}
    </div>
  );
}
