'use client';

interface ConfidenceBandProps {
  data: { label: string; value: number; low: number; high: number }[];
  color?: string;
  height?: number;
}

export function ConfidenceBand({
  data,
  color = '#B45309',
  height = 160,
}: ConfidenceBandProps) {
  if (data.length === 0) return null;

  const paddingLeft = 12;
  const paddingRight = 12;
  const paddingTop = 16;
  const paddingBottom = 32;
  const width = 400;

  // Compute value range across all low/high
  const allVals = data.flatMap((d) => [d.low, d.high, d.value]);
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const range = maxVal - minVal || 1;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  function xFor(i: number): number {
    if (data.length === 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (i / (data.length - 1)) * chartWidth;
  }

  function yFor(value: number): number {
    return paddingTop + chartHeight - ((value - minVal) / range) * chartHeight;
  }

  // Band polygon: forward through highs, backward through lows
  const bandPoints = [
    ...data.map((d, i) => `${xFor(i)},${yFor(d.high)}`),
    ...data
      .map((d, i) => `${xFor(i)},${yFor(d.low)}`)
      .reverse(),
  ].join(' ');

  // Central line
  const valueLinePoints = data
    .map((d, i) => `${xFor(i)},${yFor(d.value)}`)
    .join(' ');

  // High boundary line
  const highLinePoints = data
    .map((d, i) => `${xFor(i)},${yFor(d.high)}`)
    .join(' ');

  // Low boundary line
  const lowLinePoints = data
    .map((d, i) => `${xFor(i)},${yFor(d.low)}`)
    .join(' ');

  // Key markers at first, middle, and last point
  const markerIndices: number[] = [];
  if (data.length >= 1) markerIndices.push(0);
  if (data.length >= 3) markerIndices.push(Math.floor(data.length / 2));
  if (data.length >= 2) markerIndices.push(data.length - 1);

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="block"
    >
      {/* Confidence band fill */}
      <polygon
        points={bandPoints}
        fill={color}
        fillOpacity={0.12}
        className="transition-all duration-500"
      />

      {/* High boundary (dashed) */}
      <polyline
        points={highLinePoints}
        fill="none"
        stroke={color}
        strokeOpacity={0.4}
        strokeWidth={1}
        strokeDasharray="4 3"
        strokeLinejoin="round"
      />

      {/* Low boundary (dashed) */}
      <polyline
        points={lowLinePoints}
        fill="none"
        stroke={color}
        strokeOpacity={0.4}
        strokeWidth={1}
        strokeDasharray="4 3"
        strokeLinejoin="round"
      />

      {/* Central value line */}
      <polyline
        points={valueLinePoints}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        className="transition-all duration-500"
      />

      {/* Key marker callouts */}
      {markerIndices.map((idx) => {
        const d = data[idx];
        const x = xFor(idx);
        const labels = ['P10', 'P50', 'P90'];
        const labelIdx = markerIndices.indexOf(idx);

        return (
          <g key={`marker-${idx}`}>
            {/* Dot on center line */}
            <circle
              cx={x}
              cy={yFor(d.value)}
              r={3}
              fill="#1E2530"
              stroke={color}
              strokeWidth={1.5}
            />
            {/* Callout label */}
            <text
              x={x}
              y={yFor(d.high) - 8}
              textAnchor="middle"
              fill={color}
              fontSize={9}
              fontWeight={600}
            >
              {labels[labelIdx] ?? ''}
            </text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {data.map((d, i) => {
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
