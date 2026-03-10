'use client';

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
  size?: number;
}

export function DonutChart({
  segments,
  centerLabel,
  centerValue,
  size = 180,
}: DonutChartProps) {
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  // Calculate dash segments
  let cumulativeOffset = 0;
  const arcs = segments.map((seg) => {
    const segLength = (seg.value / total) * circumference;
    const dashOffset = circumference - cumulativeOffset;
    cumulativeOffset += segLength;
    return {
      ...seg,
      dashArray: `${segLength} ${circumference - segLength}`,
      dashOffset,
    };
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="block"
        >
          {/* Background ring */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="var(--pl-stripe, #F1F5F9)"
            strokeWidth={strokeWidth}
          />
          {/* Segment arcs */}
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={arc.dashArray}
              strokeDashoffset={arc.dashOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
              className="transition-all duration-500"
            />
          ))}
        </svg>
        {/* Center text */}
        {(centerValue || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && (
              <span
                className="text-xl font-bold"
                style={{ color: 'var(--pl-text, #1C1917)' }}
              >
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span
                className="text-xs"
                style={{ color: 'var(--pl-text-muted, #A8A29E)' }}
              >
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-[11px]" style={{ color: 'var(--pl-text-secondary, #57534E)' }}>
              {seg.label}
            </span>
            <span className="text-[11px] font-medium" style={{ color: 'var(--pl-text, #1C1917)' }}>
              {seg.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
