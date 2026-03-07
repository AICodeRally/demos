'use client';

interface RadarChartProps {
  axes: { label: string; value: number }[];
  maxVal?: number;
  color?: string;
  benchmarkData?: number[];
  size?: number;
}

export function RadarChart({
  axes,
  maxVal = 100,
  color = '#B45309',
  benchmarkData,
  size = 280,
}: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const labelMargin = 44;
  const radius = (size - labelMargin * 2) / 2;
  const n = axes.length;
  const guideRings = 4;

  // Angle for each axis (starting from top, going clockwise)
  function angleFor(i: number): number {
    return (Math.PI * 2 * i) / n - Math.PI / 2;
  }

  // Point on a given axis at a fraction (0-1) of radius
  function pointAt(i: number, fraction: number): { x: number; y: number } {
    const angle = angleFor(i);
    return {
      x: cx + radius * fraction * Math.cos(angle),
      y: cy + radius * fraction * Math.sin(angle),
    };
  }

  // Build polygon points string from array of values
  function polygonPoints(values: number[]): string {
    return values
      .map((v, i) => {
        const frac = Math.min(v / maxVal, 1);
        const pt = pointAt(i, frac);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');
  }

  // Guide polygon at a given fraction
  function guidePolygon(fraction: number): string {
    return Array.from({ length: n })
      .map((_, i) => {
        const pt = pointAt(i, fraction);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');
  }

  // Label position (outside chart)
  function labelPos(i: number): {
    x: number;
    y: number;
    anchor: 'start' | 'middle' | 'end';
  } {
    const angle = angleFor(i);
    const offset = radius + 18;
    const x = cx + offset * Math.cos(angle);
    const y = cy + offset * Math.sin(angle);

    // Determine text-anchor based on position
    const cos = Math.cos(angle);
    let anchor: 'start' | 'middle' | 'end' = 'middle';
    if (cos > 0.3) anchor = 'start';
    else if (cos < -0.3) anchor = 'end';

    return { x, y, anchor };
  }

  const dataPoints = axes.map((a) => a.value);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="block"
    >
      {/* Concentric guide polygons */}
      {Array.from({ length: guideRings }).map((_, ring) => {
        const frac = (ring + 1) / guideRings;
        return (
          <polygon
            key={`guide-${ring}`}
            points={guidePolygon(frac)}
            fill="#2A3241"
            stroke="#334155"
            strokeWidth={1}
            fillOpacity={ring === 0 ? 0.5 : 0}
          />
        );
      })}

      {/* Axis lines from center */}
      {Array.from({ length: n }).map((_, i) => {
        const edge = pointAt(i, 1);
        return (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={edge.x}
            y2={edge.y}
            stroke="#334155"
            strokeWidth={1}
          />
        );
      })}

      {/* Benchmark polygon (optional) */}
      {benchmarkData && benchmarkData.length === n && (
        <polygon
          points={polygonPoints(benchmarkData)}
          fill="none"
          stroke="#94A3B8"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      )}

      {/* Data polygon */}
      <polygon
        points={polygonPoints(dataPoints)}
        fill={color}
        fillOpacity={0.2}
        stroke={color}
        strokeWidth={2}
        className="transition-all duration-500"
      />

      {/* Data point dots */}
      {dataPoints.map((v, i) => {
        const frac = Math.min(v / maxVal, 1);
        const pt = pointAt(i, frac);
        return (
          <circle
            key={`dot-${i}`}
            cx={pt.x}
            cy={pt.y}
            r={3.5}
            fill={color}
            className="transition-all duration-500"
          />
        );
      })}

      {/* Axis labels */}
      {axes.map((axis, i) => {
        const pos = labelPos(i);
        return (
          <text
            key={`label-${i}`}
            x={pos.x}
            y={pos.y}
            textAnchor={pos.anchor}
            dominantBaseline="central"
            fill="#CBD5E1"
            fontSize={11}
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}
