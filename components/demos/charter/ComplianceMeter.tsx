'use client';

interface Zone {
  threshold: number;
  color: string;
  label: string;
}

interface Dimension {
  label: string;
  score: number;
}

interface ComplianceMeterProps {
  score: number;
  label: string;
  zones: Zone[];
  dimensions?: Dimension[];
}

export function ComplianceMeter({ score, label, zones, dimensions }: ComplianceMeterProps) {
  const size = 240;
  const cx = size / 2;
  const cy = size / 2 + 20;
  const radius = 90;

  function polarToCartesian(angle: number): { x: number; y: number } {
    return {
      x: cx + radius * Math.cos(angle),
      y: cy - radius * Math.sin(angle),
    };
  }

  function describeArc(start: number, end: number): string {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const largeArc = start - end > Math.PI ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 0 ${e.x} ${e.y}`;
  }

  const sorted = [...zones].sort((a, b) => a.threshold - b.threshold);
  const needleAngle = Math.PI - (score / 100) * Math.PI;
  const needleTip = polarToCartesian(needleAngle);
  const currentZone = sorted.reduce((prev, z) => (score >= z.threshold ? z : prev), sorted[0]);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 40} viewBox={`0 0 ${size} ${size / 2 + 40}`}>
        {sorted.map((zone, i) => {
          const prevThreshold = i > 0 ? sorted[i - 1].threshold : 0;
          const nextThreshold = i < sorted.length - 1 ? sorted[i + 1].threshold : 100;
          const arcStart = Math.PI - (prevThreshold / 100) * Math.PI;
          const arcEnd = Math.PI - (nextThreshold / 100) * Math.PI;
          return (
            <path
              key={i}
              d={describeArc(arcStart, arcEnd)}
              fill="none" stroke={zone.color} strokeWidth="16" strokeLinecap="round" opacity="0.3"
            />
          );
        })}
        <path
          d={describeArc(Math.PI, needleAngle)}
          fill="none" stroke={currentZone.color} strokeWidth="16" strokeLinecap="round"
        />
        <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4" fill="#1C1917" />
        <text x={cx} y={cy - 20} textAnchor="middle" fontSize="28" fontWeight="700" fill="#1C1917">{score}</text>
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fill="#57534E">{label}</text>
      </svg>

      <div className="flex gap-4 mt-2">
        {sorted.map((z) => (
          <div key={z.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: z.color }} />
            <span className="text-[10px]" style={{ color: '#57534E' }}>{z.label}</span>
          </div>
        ))}
      </div>

      {dimensions && dimensions.length > 0 && (
        <div className="w-full mt-4 space-y-2">
          {dimensions.map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <span className="w-24 text-xs text-right" style={{ color: '#57534E' }}>{d.label}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E7E5E4' }}>
                <div className="h-full rounded-full" style={{ width: `${d.score}%`, backgroundColor: currentZone.color }} />
              </div>
              <span className="w-8 text-xs font-medium" style={{ color: '#1C1917' }}>{d.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
