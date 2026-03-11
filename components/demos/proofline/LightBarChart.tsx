'use client';

import { fmtK, fmt, pct } from '@/lib/utils';

interface LightBarChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  maxVal?: number;
  formatValue?: (v: number) => string;
}

export function LightBarChart({ data, maxVal, formatValue }: LightBarChartProps) {
  const max = maxVal || Math.max(...data.map((d) => d.value));
  const format = formatValue ?? ((v: number) => (v > 10000 ? fmtK(v) : v <= 1 ? pct(v) : fmt(v)));

  return (
    <div className="flex flex-col gap-2.5">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-[120px] text-[12px] text-right font-medium shrink-0" style={{ color: 'var(--pl-text-secondary)' }}>
            {d.label}
          </div>
          <div className="flex-1 h-[22px] overflow-hidden rounded-md" style={{ background: 'var(--pl-chart-bar-track)' }}>
            <div
              className="h-full rounded-md flex items-center justify-end pr-2 transition-[width] duration-500 ease-out"
              style={{
                width: `${Math.max((d.value / max) * 100, 4)}%`,
                background: d.color,
              }}
            >
              <span className="text-xs font-bold font-mono text-white">
                {format(d.value)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
