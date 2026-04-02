'use client';

interface StatCardProps {
  label: string;
  value: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: string;
  sparkline?: number[];
  onClick?: () => void;
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

export function StatCard({ label, value, trend, trendValue, color = '#1E3A5F', sparkline, onClick }: StatCardProps) {
  return (
    <div
      className={`rounded-xl bg-white border p-5 relative overflow-hidden${onClick ? ' cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      style={{ borderColor: '#E7E5E4', borderLeft: `4px solid ${color}` }}
      onClick={onClick}
    >
      <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>{label}</p>
      <p className="text-3xl font-bold mt-1" style={{ color: '#1C1917' }}>{value}</p>
      {trend && trendValue && (
        <p className="text-sm mt-1 font-medium" style={{ color: trend === 'up' ? '#16A34A' : '#DC2626' }}>
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
