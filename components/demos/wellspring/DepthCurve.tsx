'use client';

interface DepthCurveProps {
  data: { day: number; depth: number }[];
  targetDepth?: number;
  color?: string;
  height?: number;
}

export function DepthCurve({
  data,
  targetDepth,
  color = '#3B82F6',
  height = 220,
}: DepthCurveProps) {
  if (data.length === 0) return null;

  const W = 400;
  const pad = { top: 20, right: 20, bottom: 36, left: 56 };
  const chartW = W - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const gradientId = `depth-grad-${color.replace('#', '')}`;

  const maxDay = Math.max(...data.map((d) => d.day), 1);
  const maxDepth = Math.max(
    ...data.map((d) => d.depth),
    targetDepth ?? 0,
    1
  );

  // Depth is inverted: deeper values appear lower on screen
  function xFor(day: number): number {
    return pad.left + (day / maxDay) * chartW;
  }

  function yFor(depth: number): number {
    return pad.top + (depth / maxDepth) * chartH;
  }

  // Build line points
  const linePoints = data.map((d) => `${xFor(d.day)},${yFor(d.depth)}`).join(' ');

  // Fill polygon (from 0 depth line down to data, back to 0)
  const fillPoints = [
    `${xFor(data[0].day)},${pad.top}`,
    ...data.map((d) => `${xFor(d.day)},${yFor(d.depth)}`),
    `${xFor(data[data.length - 1].day)},${pad.top}`,
  ].join(' ');

  // Y-axis depth ticks
  const depthStep = maxDepth <= 5000 ? 1000 : maxDepth <= 15000 ? 2000 : 5000;
  const depthTicks: number[] = [];
  for (let d = 0; d <= maxDepth; d += depthStep) {
    depthTicks.push(d);
  }

  // X-axis day ticks
  const dayStep = maxDay <= 20 ? 5 : maxDay <= 60 ? 10 : 20;
  const dayTicks: number[] = [];
  for (let d = 0; d <= maxDay; d += dayStep) {
    dayTicks.push(d);
  }

  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}>
      <h3 className="text-sm font-semibold mb-2" style={{ color: '#F1F5F9' }}>
        Depth vs. Time
      </h3>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${W} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="block"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.05} />
            <stop offset="100%" stopColor={color} stopOpacity={0.3} />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines (depth) */}
        {depthTicks.map((d) => {
          const y = yFor(d);
          return (
            <g key={`ygrid-${d}`}>
              <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#334155" strokeWidth={0.5} />
              <text x={pad.left - 6} y={y + 3} textAnchor="end" fill="#94A3B8" fontSize={8}>
                {d.toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Vertical grid lines (days) */}
        {dayTicks.map((d) => {
          const x = xFor(d);
          return (
            <g key={`xgrid-${d}`}>
              <line x1={x} y1={pad.top} x2={x} y2={pad.top + chartH} stroke="#334155" strokeWidth={0.5} />
              <text x={x} y={height - pad.bottom + 14} textAnchor="middle" fill="#94A3B8" fontSize={8}>
                D{d}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <polygon points={fillPoints} fill={`url(#${gradientId})`} />

        {/* Data line */}
        <polyline
          points={linePoints}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data dots */}
        {data.map((d, i) => (
          <circle
            key={`dot-${i}`}
            cx={xFor(d.day)}
            cy={yFor(d.depth)}
            r={2.5}
            fill="#1E2530"
            stroke={color}
            strokeWidth={1.5}
          />
        ))}

        {/* Target depth line */}
        {targetDepth != null && (
          <g>
            <line
              x1={pad.left}
              y1={yFor(targetDepth)}
              x2={W - pad.right}
              y2={yFor(targetDepth)}
              stroke="#EF4444"
              strokeWidth={1}
              strokeDasharray="6,3"
            />
            <text
              x={W - pad.right}
              y={yFor(targetDepth) - 4}
              textAnchor="end"
              fill="#EF4444"
              fontSize={8}
              fontWeight="bold"
            >
              Target: {targetDepth.toLocaleString()} ft
            </text>
          </g>
        )}

        {/* Axis labels */}
        <text x={W / 2} y={height - 4} textAnchor="middle" fill="#94A3B8" fontSize={9}>
          Days
        </text>
        <text
          x={12}
          y={pad.top + chartH / 2}
          textAnchor="middle"
          fill="#94A3B8"
          fontSize={9}
          transform={`rotate(-90, 12, ${pad.top + chartH / 2})`}
        >
          Depth (ft)
        </text>
      </svg>
    </div>
  );
}
