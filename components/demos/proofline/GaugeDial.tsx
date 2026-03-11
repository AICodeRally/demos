'use client';

interface GaugeDialProps {
  score: number;           // 0-100
  label: string;           // hometown name
  subLabel?: string;       // e.g. "Growth: 40"
  size?: number;           // SVG width, default 120
}

export function GaugeDial({ score, label, subLabel, size = 120 }: GaugeDialProps) {
  const cx = size / 2;
  const cy = size * 0.6;
  const radius = size * 0.35;
  const strokeW = size * 0.08;

  // Arc from 180 degrees (left) to 0 degrees (right) = semicircle
  // score/100 maps to 0..180 degrees
  const startAngle = Math.PI;       // left
  const sweepAngle = (score / 100) * Math.PI;

  // Background arc (full semicircle)
  const bgX1 = cx + radius * Math.cos(Math.PI);
  const bgY1 = cy + radius * Math.sin(Math.PI);
  const bgX2 = cx + radius * Math.cos(0);
  const bgY2 = cy + radius * Math.sin(0);
  const bgPath = `M ${bgX1} ${bgY1} A ${radius} ${radius} 0 1 1 ${bgX2} ${bgY2}`;

  // Value arc
  const endAngle = startAngle - sweepAngle;
  const valX1 = cx + radius * Math.cos(startAngle);
  const valY1 = cy + radius * Math.sin(startAngle);
  const valX2 = cx + radius * Math.cos(endAngle);
  const valY2 = cy + radius * Math.sin(endAngle);
  const largeArc = sweepAngle > Math.PI ? 1 : 0;
  const valPath = `M ${valX1} ${valY1} A ${radius} ${radius} 0 ${largeArc} 1 ${valX2} ${valY2}`;

  const color =
    score >= 85 ? '#22C55E' :
    score >= 70 ? '#F59E0B' :
    score >= 50 ? '#F87171' :
    '#DC2626';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${size} ${size * 0.7}`} width={size} height={size * 0.7}>
        {/* Background arc */}
        <path
          d={bgPath}
          fill="none"
          stroke="var(--pl-chart-bar-track)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={valPath}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fill={color}
          fontSize={size * 0.18}
          fontWeight="800"
          fontFamily="var(--pl-font)"
        >
          {score}
        </text>
      </svg>
      <div
        className="text-[11px] font-bold font-mono text-center -mt-1"
        style={{ color: 'var(--pl-text)' }}
      >
        {label}
      </div>
      {subLabel && (
        <div
          className="text-[9px] font-mono text-center"
          style={{ color: 'var(--pl-text-faint)' }}
        >
          {subLabel}
        </div>
      )}
    </div>
  );
}
