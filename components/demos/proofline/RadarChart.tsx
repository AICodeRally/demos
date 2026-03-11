'use client';

interface RadarSeries {
  label: string;
  values: number[];         // one value per axis, 0-1 scale
  color: string;
  filled?: boolean;         // true = filled polygon, false = outline only
  dashed?: boolean;
}

interface RadarChartProps {
  axes: string[];           // axis labels
  series: RadarSeries[];
  size?: number;            // SVG width/height, default 400
}

export function RadarChart({ axes, series, size = 400 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const n = axes.length;
  const labelOffset = 24;

  function polarToXY(index: number, value: number): [number, number] {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    return [
      cx + radius * value * Math.cos(angle),
      cy + radius * value * Math.sin(angle),
    ];
  }

  function polygonPoints(values: number[]): string {
    return values.map((v, i) => polarToXY(i, v).join(',')).join(' ');
  }

  // Concentric rings
  const rings = [0.25, 0.50, 0.75, 1.00];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full" style={{ maxHeight: size }}>
      {/* Concentric rings */}
      {rings.map(r => (
        <polygon
          key={r}
          points={Array.from({ length: n }, (_, i) => polarToXY(i, r).join(',')).join(' ')}
          fill="none"
          stroke="var(--pl-chart-grid)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
      ))}

      {/* Axis lines */}
      {axes.map((_, i) => {
        const [x, y] = polarToXY(i, 1);
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y}
            stroke="var(--pl-chart-grid)" strokeWidth="0.5" />
        );
      })}

      {/* Series polygons */}
      {series.map(s => (
        <polygon
          key={s.label}
          points={polygonPoints(s.values)}
          fill={s.filled !== false ? s.color : 'none'}
          fillOpacity={s.filled !== false ? 0.12 : 0}
          stroke={s.color}
          strokeWidth={s.dashed ? 2 : 1.5}
          strokeDasharray={s.dashed ? '6 3' : undefined}
        />
      ))}

      {/* Axis labels */}
      {axes.map((label, i) => {
        const [x, y] = polarToXY(i, 1);
        const dx = x > cx ? labelOffset : x < cx ? -labelOffset : 0;
        const dy = y > cy ? labelOffset : y < cy ? -labelOffset : 0;
        const anchor = x > cx + 5 ? 'start' : x < cx - 5 ? 'end' : 'middle';
        return (
          <text
            key={label}
            x={x + dx}
            y={y + dy}
            textAnchor={anchor}
            fill="var(--pl-text-muted)"
            fontSize="11"
            fontFamily="monospace"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
