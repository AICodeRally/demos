'use client';

interface CasingSpec {
  depth: number;
  diameter: string;
}

interface WellboreSchematicProps {
  surfaceCasing?: CasingSpec;
  intermediateCasing?: CasingSpec;
  productionCasing?: CasingSpec;
  liner?: CasingSpec;
  lateralLength?: number;
  targetZone?: string;
  totalDepth?: number;
  perforations?: number;
}

const DEFAULTS = {
  surfaceCasing: { depth: 1500, diameter: '13⅜"' },
  intermediateCasing: { depth: 5000, diameter: '9⅝"' },
  productionCasing: { depth: 8200, diameter: '7"' },
  liner: { depth: 10200, diameter: '4½"' },
  lateralLength: 10000,
  targetZone: 'Wolfcamp A',
  totalDepth: 18500,
  perforations: 40,
};

export function WellboreSchematic({
  surfaceCasing = DEFAULTS.surfaceCasing,
  intermediateCasing = DEFAULTS.intermediateCasing,
  productionCasing = DEFAULTS.productionCasing,
  liner = DEFAULTS.liner,
  lateralLength = DEFAULTS.lateralLength,
  targetZone = DEFAULTS.targetZone,
  totalDepth = DEFAULTS.totalDepth,
  perforations = DEFAULTS.perforations,
}: WellboreSchematicProps) {
  // Layout constants
  const W = 300;
  const H = 600;
  const margin = { top: 20, left: 50, right: 20, bottom: 20 };
  const verticalTop = margin.top;
  const verticalBottom = 400; // where the curve starts
  const lateralY = 440; // horizontal lateral y position
  const lateralStartX = 130;
  const lateralEndX = W - margin.right;

  // Depth scale for vertical section (0 to ~10000 ft)
  const maxVerticalDepth = 10000;
  const depthMarks = [0, 2000, 4000, 6000, 8000, 10000];

  function depthToY(depth: number): number {
    const ratio = Math.min(depth / maxVerticalDepth, 1);
    return verticalTop + ratio * (verticalBottom - verticalTop);
  }

  // Casing widths (visual)
  const casings = [
    { ...surfaceCasing, width: 40, color: '#6B7280', label: `Surface ${surfaceCasing.diameter}` },
    { ...intermediateCasing, width: 30, color: '#9CA3AF', label: `Intermediate ${intermediateCasing.diameter}` },
    { ...productionCasing, width: 20, color: '#D1D5DB', label: `Production ${productionCasing.diameter}` },
    { ...liner, width: 12, color: '#E5E7EB', label: `Liner ${liner.diameter}` },
  ];

  // Wellbore center X
  const cx = 110;

  // Perforation positions along lateral
  const perfSpacing = (lateralEndX - lateralStartX) / (perforations + 1);

  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}>
      <h3 className="text-sm font-semibold mb-2" style={{ color: '#F1F5F9' }}>
        Wellbore Schematic
      </h3>
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="block"
      >
        {/* Background */}
        <rect x={0} y={0} width={W} height={H} fill="#1A1D23" rx={8} />

        {/* Depth axis labels */}
        {depthMarks.map((d) => {
          const y = depthToY(d);
          return (
            <g key={`depth-${d}`}>
              <line x1={margin.left - 5} y1={y} x2={margin.left} y2={y} stroke="#334155" strokeWidth={1} />
              <text x={margin.left - 8} y={y + 3} textAnchor="end" fill="#94A3B8" fontSize={8}>
                {d.toLocaleString()}&apos;
              </text>
              {/* Grid line */}
              <line x1={margin.left} y1={y} x2={W - margin.right} y2={y} stroke="#334155" strokeWidth={0.5} strokeDasharray="2,3" />
            </g>
          );
        })}

        {/* Target zone band */}
        <rect
          x={margin.left}
          y={depthToY(7500)}
          width={W - margin.left - margin.right}
          height={depthToY(9000) - depthToY(7500)}
          fill="#B45309"
          opacity={0.12}
        />
        <text
          x={W - margin.right - 4}
          y={depthToY(8250) + 3}
          textAnchor="end"
          fill="#B45309"
          fontSize={8}
          fontWeight="bold"
        >
          {targetZone}
        </text>

        {/* Target zone in lateral area */}
        <rect
          x={lateralStartX}
          y={lateralY - 20}
          width={lateralEndX - lateralStartX}
          height={40}
          fill="#B45309"
          opacity={0.08}
          rx={4}
        />

        {/* Vertical casing strings */}
        {casings.map((c, i) => {
          const y1 = verticalTop;
          const y2 = depthToY(c.depth);
          const halfW = c.width / 2;
          return (
            <g key={`casing-v-${i}`}>
              {/* Left wall */}
              <line x1={cx - halfW} y1={y1} x2={cx - halfW} y2={y2} stroke={c.color} strokeWidth={2} />
              {/* Right wall */}
              <line x1={cx + halfW} y1={y1} x2={cx + halfW} y2={y2} stroke={c.color} strokeWidth={2} />
              {/* Bottom cap */}
              <line x1={cx - halfW} y1={y2} x2={cx - halfW + 4} y2={y2} stroke={c.color} strokeWidth={2} />
              <line x1={cx + halfW} y1={y2} x2={cx + halfW - 4} y2={y2} stroke={c.color} strokeWidth={2} />
              {/* Label */}
              <text x={cx + halfW + 6} y={y2 - 2} fill={c.color} fontSize={7} fontWeight={500}>
                {c.label}
              </text>
            </g>
          );
        })}

        {/* Wellbore path: vertical section */}
        <line x1={cx} y1={verticalTop} x2={cx} y2={verticalBottom} stroke="#475569" strokeWidth={1} strokeDasharray="4,2" />

        {/* Curve / kick-off section */}
        <path
          d={`M ${cx} ${verticalBottom} Q ${cx} ${lateralY} ${lateralStartX} ${lateralY}`}
          fill="none"
          stroke="#475569"
          strokeWidth={1}
          strokeDasharray="4,2"
        />

        {/* Lateral section */}
        <line x1={lateralStartX} y1={lateralY} x2={lateralEndX} y2={lateralY} stroke="#475569" strokeWidth={1} strokeDasharray="4,2" />

        {/* Lateral casing walls */}
        <line x1={lateralStartX} y1={lateralY - 5} x2={lateralEndX} y2={lateralY - 5} stroke="#D1D5DB" strokeWidth={1.5} />
        <line x1={lateralStartX} y1={lateralY + 5} x2={lateralEndX} y2={lateralY + 5} stroke="#D1D5DB" strokeWidth={1.5} />

        {/* Perforation clusters */}
        {Array.from({ length: perforations }).map((_, i) => {
          const px = lateralStartX + perfSpacing * (i + 1);
          return (
            <g key={`perf-${i}`}>
              <line x1={px} y1={lateralY - 5} x2={px} y2={lateralY - 10} stroke="#EF4444" strokeWidth={1.5} />
              <line x1={px} y1={lateralY + 5} x2={px} y2={lateralY + 10} stroke="#EF4444" strokeWidth={1.5} />
            </g>
          );
        })}

        {/* Surface marker */}
        <rect x={cx - 24} y={verticalTop - 6} width={48} height={12} rx={3} fill="#252B36" stroke="#334155" strokeWidth={1} />
        <text x={cx} y={verticalTop + 2} textAnchor="middle" fill="#F1F5F9" fontSize={7} fontWeight="bold">
          Surface
        </text>

        {/* TD marker */}
        <text x={lateralEndX} y={lateralY + 24} textAnchor="end" fill="#94A3B8" fontSize={7}>
          TD: {totalDepth.toLocaleString()}&apos; MD
        </text>

        {/* Lateral length label */}
        <text x={(lateralStartX + lateralEndX) / 2} y={lateralY + 24} textAnchor="middle" fill="#CBD5E1" fontSize={7}>
          Lateral: {lateralLength.toLocaleString()}&apos;
        </text>

        {/* Perforations count */}
        <text x={(lateralStartX + lateralEndX) / 2} y={lateralY - 16} textAnchor="middle" fill="#EF4444" fontSize={7}>
          {perforations} perf clusters
        </text>

        {/* KOP label */}
        <text x={cx + 30} y={verticalBottom + 4} fill="#94A3B8" fontSize={7}>
          KOP ~{(8000).toLocaleString()}&apos;
        </text>

        {/* Legend */}
        <text x={margin.left} y={H - 45} fill="#94A3B8" fontSize={7}>
          Depth Scale (ft MD)
        </text>
        {[
          { color: '#EF4444', label: 'Perforations' },
          { color: '#B45309', label: 'Target Zone' },
        ].map((item, i) => (
          <g key={`legend-${i}`}>
            <rect x={margin.left + i * 80} y={H - 35} width={10} height={6} fill={item.color} opacity={0.7} rx={1} />
            <text x={margin.left + i * 80 + 14} y={H - 30} fill="#CBD5E1" fontSize={7}>
              {item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
