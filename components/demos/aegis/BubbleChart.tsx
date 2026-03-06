'use client';

interface BubbleItem {
  x: number;
  y: number;
  size: number;
  color: string;
  label: string;
}

interface BubbleChartProps {
  data: BubbleItem[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
}

export function BubbleChart({
  data,
  xLabel,
  yLabel,
  height = 300,
}: BubbleChartProps) {
  if (data.length === 0) return null;

  const width = 500;
  const paddingLeft = yLabel ? 48 : 40;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = xLabel ? 44 : 32;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Normalize size to radius (min 8, max 40)
  const maxSize = Math.max(...data.map((d) => d.size), 1);
  const minSize = Math.min(...data.map((d) => d.size), 0);
  const sizeRange = maxSize - minSize || 1;

  function radiusFor(size: number): number {
    const t = (size - minSize) / sizeRange;
    return 8 + t * 32; // 8 to 40
  }

  function xFor(x: number): number {
    return paddingLeft + (x / 100) * chartWidth;
  }

  function yFor(y: number): number {
    return paddingTop + chartHeight - (y / 100) * chartHeight;
  }

  const gridValues = [25, 50, 75];

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="block"
    >
      {/* Horizontal grid lines */}
      {gridValues.map((v) => (
        <line
          key={`hgrid-${v}`}
          x1={paddingLeft}
          y1={yFor(v)}
          x2={width - paddingRight}
          y2={yFor(v)}
          stroke="#F1F5F9"
          strokeWidth={1}
        />
      ))}

      {/* Vertical grid lines */}
      {gridValues.map((v) => (
        <line
          key={`vgrid-${v}`}
          x1={xFor(v)}
          y1={paddingTop}
          x2={xFor(v)}
          y2={paddingTop + chartHeight}
          stroke="#F1F5F9"
          strokeWidth={1}
        />
      ))}

      {/* Axes */}
      <line
        x1={paddingLeft}
        y1={paddingTop + chartHeight}
        x2={width - paddingRight}
        y2={paddingTop + chartHeight}
        stroke="#E7E5E4"
        strokeWidth={1}
      />
      <line
        x1={paddingLeft}
        y1={paddingTop}
        x2={paddingLeft}
        y2={paddingTop + chartHeight}
        stroke="#E7E5E4"
        strokeWidth={1}
      />

      {/* Y-axis tick labels */}
      {[0, 25, 50, 75, 100].map((v) => (
        <text
          key={`ytick-${v}`}
          x={paddingLeft - 6}
          y={yFor(v) + 3}
          textAnchor="end"
          fill="#A8A29E"
          fontSize={9}
          fontFamily="monospace"
        >
          {v}
        </text>
      ))}

      {/* X-axis tick labels */}
      {[0, 25, 50, 75, 100].map((v) => (
        <text
          key={`xtick-${v}`}
          x={xFor(v)}
          y={paddingTop + chartHeight + 16}
          textAnchor="middle"
          fill="#A8A29E"
          fontSize={9}
          fontFamily="monospace"
        >
          {v}
        </text>
      ))}

      {/* Axis labels */}
      {xLabel && (
        <text
          x={paddingLeft + chartWidth / 2}
          y={height - 4}
          textAnchor="middle"
          fill="#57534E"
          fontSize={11}
        >
          {xLabel}
        </text>
      )}

      {yLabel && (
        <text
          x={14}
          y={paddingTop + chartHeight / 2}
          textAnchor="middle"
          fill="#57534E"
          fontSize={11}
          transform={`rotate(-90, 14, ${paddingTop + chartHeight / 2})`}
        >
          {yLabel}
        </text>
      )}

      {/* Bubbles */}
      {data.map((d, i) => {
        const cx = xFor(d.x);
        const cy = yFor(d.y);
        const r = radiusFor(d.size);

        return (
          <g key={`bubble-${i}`}>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={d.color}
              fillOpacity={0.6}
              stroke={d.color}
              strokeWidth={1.5}
              className="transition-all duration-300"
            />
            {/* Label positioned to the right of the bubble, or above if near right edge */}
            <text
              x={cx + r + 4}
              y={cy + 3}
              fill="#1C1917"
              fontSize={10}
              fontWeight={500}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
