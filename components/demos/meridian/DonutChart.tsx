'use client';

interface DonutSlice {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
  label?: string;
}

export function DonutChart({ data, size = 200, label }: DonutChartProps) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.38;
  const strokeW = size * 0.12;
  const circ = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.value, 0);

  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((slice) => {
        const pct = slice.value / total;
        const dash = pct * circ;
        const gap = circ - dash;
        const rotation = (offset / total) * 360 - 90;
        offset += slice.value;

        return (
          <circle
            key={slice.name}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={slice.color}
            strokeWidth={strokeW}
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rotation} ${cx} ${cy})`}
          />
        );
      })}
      {label && (
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="13" fontWeight="bold" fill="var(--mr-text)" fontFamily="monospace">
          {label}
        </text>
      )}
    </svg>
  );
}
