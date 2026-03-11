'use client';

import { fmtK, fmt } from '@/lib/utils';

interface BarChartProps {
  data: Array<Record<string, unknown>>;
  valueKey: string;
  labelKey: string;
  color?: string;
  maxVal?: number;
}

export function BarChart({ data, valueKey, labelKey, color = '#C6A052', maxVal }: BarChartProps) {
  const max = maxVal || Math.max(...data.map((d) => Number(d[valueKey])));
  return (
    <div className="flex flex-col gap-1.5">
      {data.map((d, i) => {
        const val = Number(d[valueKey]);
        return (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-[90px] text-[13px] text-right font-mono shrink-0" style={{ color: 'var(--pl-text-muted)' }}>
              {String(d[labelKey])}
            </div>
            <div className="flex-1 h-[18px] overflow-hidden rounded" style={{ background: 'var(--pl-chart-bar-track)' }}>
              <div
                className="h-full rounded flex items-center justify-end pr-1.5 transition-[width] duration-500 ease-out"
                style={{
                  width: `${(val / max) * 100}%`,
                  background: `linear-gradient(90deg, ${color}88, ${color})`,
                }}
              >
                <span className="text-xs font-semibold font-mono text-white">
                  {val > 10000 ? fmtK(val) : fmt(val)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
