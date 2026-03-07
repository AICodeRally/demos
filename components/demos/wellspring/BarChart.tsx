'use client';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  maxVal?: number;
  unit?: string;
  color?: string;
}

export function BarChart({
  data,
  maxVal,
  unit = '',
  color = '#B45309',
}: BarChartProps) {
  const computedMax = maxVal ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex flex-col gap-2">
      {data.map((item, i) => {
        const barColor = item.color ?? color;
        const pct = Math.min((item.value / computedMax) * 100, 100);

        return (
          <div key={i} className="flex items-center gap-3">
            <span
              className="w-[100px] shrink-0 text-right text-[11px] leading-tight"
              style={{ color: '#CBD5E1' }}
            >
              {item.label}
            </span>
            <div
              className="relative h-[20px] flex-1 overflow-hidden rounded"
              style={{ backgroundColor: '#2A3241' }}
            >
              <div
                className="absolute inset-y-0 left-0 flex items-center rounded transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`,
                  minWidth: pct > 0 ? '24px' : '0px',
                }}
              >
                <span className="px-2 text-[10px] font-mono text-white whitespace-nowrap">
                  {item.value}
                  {unit}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
