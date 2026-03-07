'use client';

interface AreaChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  showDots?: boolean;
  showLabels?: boolean;
}

export function AreaChart({
  data,
  color = '#B45309',
  height = 180,
  showDots = true,
  showLabels = true,
}: AreaChartProps) {
  if (data.length === 0) return null;

  const paddingLeft = 8;
  const paddingRight = 8;
  const paddingTop = 16;
  const paddingBottom = showLabels ? 32 : 12;
  const width = 400;
  const gradientId = `area-grad-${color.replace('#', '')}`;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Map data to coordinates
  function xFor(i: number): number {
    if (data.length === 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (i / (data.length - 1)) * chartWidth;
  }

  function yFor(value: number): number {
    return paddingTop + chartHeight - (value / maxValue) * chartHeight;
  }

  // Build polyline points
  const linePoints = data.map((d, i) => `${xFor(i)},${yFor(d.value)}`).join(' ');

  // Build fill polygon (line + bottom edge)
  const fillPoints = [
    `${xFor(0)},${paddingTop + chartHeight}`,
    ...data.map((d, i) => `${xFor(i)},${yFor(d.value)}`),
    `${xFor(data.length - 1)},${paddingTop + chartHeight}`,
  ].join(' ');

  // Grid lines at 25/50/75/100%
  const gridFractions = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="block"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Horizontal grid lines */}
      {gridFractions.map((frac) => {
        const y = yFor(maxValue * frac);
        return (
          <line
            key={`grid-${frac}`}
            x1={paddingLeft}
            y1={y}
            x2={width - paddingRight}
            y2={y}
            stroke="#334155"
            strokeWidth={1}
          />
        );
      })}

      {/* Fill area */}
      <polygon
        points={fillPoints}
        fill={`url(#${gradientId})`}
        className="transition-all duration-500"
      />

      {/* Line */}
      <polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        className="transition-all duration-500"
      />

      {/* Data dots */}
      {showDots &&
        data.map((d, i) => (
          <circle
            key={`dot-${i}`}
            cx={xFor(i)}
            cy={yFor(d.value)}
            r={3}
            fill="#1E2530"
            stroke={color}
            strokeWidth={1.5}
            className="transition-all duration-500"
          />
        ))}

      {/* X-axis labels */}
      {showLabels &&
        data.map((d, i) => {
          // Skip some labels if too many data points
          const skip = data.length > 12 ? Math.ceil(data.length / 10) : 1;
          if (i % skip !== 0 && i !== data.length - 1) return null;
          return (
            <text
              key={`xlabel-${i}`}
              x={xFor(i)}
              y={height - 6}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize={10}
            >
              {d.label}
            </text>
          );
        })}
    </svg>
  );
}
