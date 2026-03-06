'use client';

interface SeverityGaugeProps {
  value: number;
  max: number;
  label?: string;
  size?: number;
  zones?: { threshold: number; color: string }[];
}

const defaultZones = [
  { threshold: 25, color: '#059669' },
  { threshold: 50, color: '#F59E0B' },
  { threshold: 75, color: '#F97316' },
  { threshold: 100, color: '#DC2626' },
];

export function SeverityGauge({
  value,
  max,
  label,
  size = 160,
  zones = defaultZones,
}: SeverityGaugeProps) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;

  // 270-degree arc from 135deg to 405deg (i.e., starting at bottom-left, sweeping clockwise)
  const startAngle = 135;
  const totalArcDeg = 270;

  const pct = Math.min(Math.max(value / max, 0), 1);

  // Determine color from zones (zones are based on percentage of max)
  const pctOfMax = (value / max) * 100;
  let fillColor = zones[zones.length - 1]?.color ?? '#DC2626';
  for (const zone of zones) {
    if (pctOfMax <= zone.threshold) {
      fillColor = zone.color;
      break;
    }
  }

  // Arc path helper using polar-to-cartesian
  const polarToCartesian = (angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const describeArc = (startDeg: number, endDeg: number) => {
    const start = polarToCartesian(endDeg);
    const end = polarToCartesian(startDeg);
    const sweep = endDeg - startDeg;
    const largeArcFlag = sweep > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const bgArcPath = describeArc(startAngle, startAngle + totalArcDeg);
  const fillArcDeg = pct * totalArcDeg;
  const fillArcPath = fillArcDeg > 0.5
    ? describeArc(startAngle, startAngle + fillArcDeg)
    : '';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="block"
        >
          {/* Background arc */}
          <path
            d={bgArcPath}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Foreground arc */}
          {fillArcPath && (
            <path
              d={fillArcPath}
              fill="none"
              stroke={fillColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.6s ease-out, stroke 0.3s ease',
              }}
            />
          )}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold"
            style={{ color: '#1C1917' }}
          >
            {value}
          </span>
          <span
            className="text-xs"
            style={{ color: '#A8A29E' }}
          >
            / {max}
          </span>
        </div>
      </div>
      {label && (
        <span
          className="-mt-2 text-xs font-medium"
          style={{ color: '#57534E' }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
