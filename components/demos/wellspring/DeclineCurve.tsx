'use client';

interface DataPoint {
  month: number;
  oilBpd: number;
}

interface DeclineCurveProps {
  actual: DataPoint[];
  forecast?: DataPoint[];
  typeCurve?: DataPoint[];
  eur?: number; // MBOE
  height?: number;
}

export function DeclineCurve({
  actual,
  forecast,
  typeCurve,
  eur,
  height = 220,
}: DeclineCurveProps) {
  if (actual.length === 0) return null;

  const W = 400;
  const pad = { top: 20, right: 24, bottom: 36, left: 52 };
  const chartW = W - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  // Determine scales
  const allPoints = [
    ...actual,
    ...(forecast ?? []),
    ...(typeCurve ?? []),
  ];
  const maxMonth = Math.max(...allPoints.map((d) => d.month), 1);
  const maxBpd = Math.max(...allPoints.map((d) => d.oilBpd), 1);

  function xFor(month: number): number {
    return pad.left + (month / maxMonth) * chartW;
  }

  function yFor(bpd: number): number {
    return pad.top + chartH - (bpd / maxBpd) * chartH;
  }

  function toPolyline(data: DataPoint[]): string {
    return data.map((d) => `${xFor(d.month)},${yFor(d.oilBpd)}`).join(' ');
  }

  // Y-axis ticks
  const bpdStep = maxBpd <= 1000 ? 200 : maxBpd <= 5000 ? 1000 : 2000;
  const yTicks: number[] = [];
  for (let v = 0; v <= maxBpd; v += bpdStep) {
    yTicks.push(v);
  }

  // X-axis ticks
  const monthStep = maxMonth <= 24 ? 3 : maxMonth <= 60 ? 6 : 12;
  const xTicks: number[] = [];
  for (let m = 0; m <= maxMonth; m += monthStep) {
    xTicks.push(m);
  }

  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}>
      <h3 className="text-sm font-semibold mb-2" style={{ color: '#F1F5F9' }}>
        Production Decline Curve
      </h3>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${W} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="block"
      >
        {/* Grid lines */}
        {yTicks.map((v) => (
          <g key={`ygrid-${v}`}>
            <line x1={pad.left} y1={yFor(v)} x2={W - pad.right} y2={yFor(v)} stroke="#334155" strokeWidth={0.5} />
            <text x={pad.left - 6} y={yFor(v) + 3} textAnchor="end" fill="#94A3B8" fontSize={8}>
              {v.toLocaleString()}
            </text>
          </g>
        ))}
        {xTicks.map((m) => (
          <g key={`xgrid-${m}`}>
            <line x1={xFor(m)} y1={pad.top} x2={xFor(m)} y2={pad.top + chartH} stroke="#334155" strokeWidth={0.5} />
            <text x={xFor(m)} y={height - pad.bottom + 14} textAnchor="middle" fill="#94A3B8" fontSize={8}>
              M{m}
            </text>
          </g>
        ))}

        {/* Type curve (dotted gray, behind everything) */}
        {typeCurve && typeCurve.length > 1 && (
          <polyline
            points={toPolyline(typeCurve)}
            fill="none"
            stroke="#6B7280"
            strokeWidth={1.5}
            strokeDasharray="2,3"
            strokeLinejoin="round"
          />
        )}

        {/* Forecast (dashed, lighter) */}
        {forecast && forecast.length > 1 && (
          <polyline
            points={toPolyline(forecast)}
            fill="none"
            stroke="#F59E0B"
            strokeWidth={1.5}
            strokeDasharray="6,3"
            opacity={0.7}
            strokeLinejoin="round"
          />
        )}

        {/* Actual production (solid line + dots) */}
        <polyline
          points={toPolyline(actual)}
          fill="none"
          stroke="#10B981"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {actual.map((d, i) => (
          <circle
            key={`adot-${i}`}
            cx={xFor(d.month)}
            cy={yFor(d.oilBpd)}
            r={2.5}
            fill="#1E2530"
            stroke="#10B981"
            strokeWidth={1.5}
          />
        ))}

        {/* EUR label */}
        {eur != null && forecast && forecast.length > 0 && (
          <g>
            <rect
              x={W - pad.right - 74}
              y={pad.top + 4}
              width={70}
              height={22}
              rx={4}
              fill="#252B36"
              stroke="#334155"
              strokeWidth={1}
            />
            <text
              x={W - pad.right - 39}
              y={pad.top + 13}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize={7}
            >
              EUR
            </text>
            <text
              x={W - pad.right - 39}
              y={pad.top + 22}
              textAnchor="middle"
              fill="#F1F5F9"
              fontSize={9}
              fontWeight="bold"
            >
              {eur.toLocaleString()} MBOE
            </text>
          </g>
        )}

        {/* Legend */}
        <g transform={`translate(${pad.left}, ${height - 8})`}>
          <line x1={0} y1={-3} x2={14} y2={-3} stroke="#10B981" strokeWidth={2} />
          <text x={18} y={0} fill="#CBD5E1" fontSize={7}>Actual</text>

          {forecast && (
            <>
              <line x1={60} y1={-3} x2={74} y2={-3} stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4,2" />
              <text x={78} y={0} fill="#CBD5E1" fontSize={7}>Forecast</text>
            </>
          )}

          {typeCurve && (
            <>
              <line x1={130} y1={-3} x2={144} y2={-3} stroke="#6B7280" strokeWidth={1.5} strokeDasharray="2,2" />
              <text x={148} y={0} fill="#CBD5E1" fontSize={7}>Type Curve</text>
            </>
          )}
        </g>

        {/* Axis labels */}
        <text x={W / 2} y={height - pad.bottom + 28} textAnchor="middle" fill="#94A3B8" fontSize={9}>
          Months
        </text>
        <text
          x={10}
          y={pad.top + chartH / 2}
          textAnchor="middle"
          fill="#94A3B8"
          fontSize={9}
          transform={`rotate(-90, 10, ${pad.top + chartH / 2})`}
        >
          Oil (bbl/d)
        </text>
      </svg>
    </div>
  );
}
