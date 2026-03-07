'use client';

interface GanttBar {
  id: string;
  label: string;
  start: number;
  duration: number;
  color: string;
  phase?: string;
}

interface GanttChartProps {
  bars: GanttBar[];
  totalDays?: number;
  todayOffset?: number;
  height?: number;
}

export type { GanttBar };

export function GanttChart({
  bars,
  totalDays,
  todayOffset,
  height: propHeight,
}: GanttChartProps) {
  if (bars.length === 0) return null;

  const rowHeight = 28;
  const pad = { top: 28, right: 16, bottom: 24, left: 110 };
  const maxDay = totalDays ?? Math.max(...bars.map((b) => b.start + b.duration)) + 5;
  const chartHeight = bars.length * rowHeight;
  const H = propHeight ?? chartHeight + pad.top + pad.bottom;
  const W = 500;
  const chartW = W - pad.left - pad.right;

  function xFor(day: number): number {
    return pad.left + (day / maxDay) * chartW;
  }

  // Day axis ticks
  const dayStep = maxDay <= 30 ? 5 : maxDay <= 90 ? 10 : 30;
  const dayTicks: number[] = [];
  for (let d = 0; d <= maxDay; d += dayStep) {
    dayTicks.push(d);
  }

  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}>
      <h3 className="text-sm font-semibold mb-2" style={{ color: '#F1F5F9' }}>
        Pad Schedule
      </h3>
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="block"
      >
        {/* Day axis ticks */}
        {dayTicks.map((d) => {
          const x = xFor(d);
          return (
            <g key={`tick-${d}`}>
              <line x1={x} y1={pad.top} x2={x} y2={pad.top + chartHeight} stroke="#334155" strokeWidth={0.5} />
              <text x={x} y={pad.top - 6} textAnchor="middle" fill="#94A3B8" fontSize={8}>
                D{d}
              </text>
            </g>
          );
        })}

        {/* Row backgrounds and bars */}
        {bars.map((bar, i) => {
          const y = pad.top + i * rowHeight;
          const barX = xFor(bar.start);
          const barW = Math.max((bar.duration / maxDay) * chartW, 2);

          return (
            <g key={bar.id}>
              {/* Alternating row bg */}
              {i % 2 === 0 && (
                <rect x={pad.left} y={y} width={chartW} height={rowHeight} fill="#252B36" opacity={0.5} />
              )}

              {/* Row label */}
              <text
                x={pad.left - 6}
                y={y + rowHeight / 2 + 3}
                textAnchor="end"
                fill="#CBD5E1"
                fontSize={9}
                fontWeight={500}
              >
                {bar.label}
              </text>

              {/* Bar */}
              <rect
                x={barX}
                y={y + 4}
                width={barW}
                height={rowHeight - 8}
                rx={3}
                fill={bar.color}
                opacity={0.85}
              />

              {/* Phase label inside bar if wide enough */}
              {bar.phase && barW > 40 && (
                <text
                  x={barX + barW / 2}
                  y={y + rowHeight / 2 + 3}
                  textAnchor="middle"
                  fill="#F1F5F9"
                  fontSize={7}
                  fontWeight="bold"
                >
                  {bar.phase}
                </text>
              )}

              {/* Duration label */}
              <text
                x={barX + barW + 4}
                y={y + rowHeight / 2 + 3}
                textAnchor="start"
                fill="#94A3B8"
                fontSize={7}
              >
                {bar.duration}d
              </text>
            </g>
          );
        })}

        {/* Today line */}
        {todayOffset != null && (
          <g>
            <line
              x1={xFor(todayOffset)}
              y1={pad.top - 2}
              x2={xFor(todayOffset)}
              y2={pad.top + chartHeight + 2}
              stroke="#EF4444"
              strokeWidth={1.5}
              strokeDasharray="4,3"
            />
            <text
              x={xFor(todayOffset)}
              y={pad.top + chartHeight + 14}
              textAnchor="middle"
              fill="#EF4444"
              fontSize={8}
              fontWeight="bold"
            >
              Today
            </text>
          </g>
        )}

        {/* X-axis label */}
        <text x={W / 2} y={H - 4} textAnchor="middle" fill="#94A3B8" fontSize={9}>
          Days from Spud
        </text>
      </svg>
    </div>
  );
}
