'use client';

interface ScatterPoint {
  x: number;              // X value (e.g., annual revenue)
  y: number;              // Y value (e.g., visits/month)
  size: number;           // dot radius
  color: string;          // dot color
  label?: string;         // optional tooltip text (rendered on hover via title element)
}

interface ScatterQuadrantProps {
  points: ScatterPoint[];
  xLabel: string;
  yLabel: string;
  xDivider: number;       // vertical divider X value
  yDivider: number;       // horizontal divider Y value
  xRange: [number, number];
  yRange: [number, number];
  quadrantLabels: { topLeft: string; topRight: string; bottomLeft: string; bottomRight: string };
  width?: number;
  height?: number;
}

export function ScatterQuadrant({
  points, xLabel, yLabel,
  xDivider, yDivider,
  xRange, yRange,
  quadrantLabels,
  width = 600, height = 400,
}: ScatterQuadrantProps) {
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  function scaleX(v: number): number {
    return pad.left + ((v - xRange[0]) / (xRange[1] - xRange[0])) * plotW;
  }
  function scaleY(v: number): number {
    return pad.top + plotH - ((v - yRange[0]) / (yRange[1] - yRange[0])) * plotH;
  }

  const divX = scaleX(xDivider);
  const divY = scaleY(yDivider);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1.0].map(pct => {
        const y = pad.top + plotH * (1 - pct);
        return <line key={`h-${pct}`} x1={pad.left} y1={y} x2={width - pad.right} y2={y}
          stroke="var(--pl-chart-grid)" strokeWidth="0.5" />;
      })}

      {/* Quadrant dividers */}
      <line x1={divX} y1={pad.top} x2={divX} y2={height - pad.bottom}
        stroke="var(--pl-text-faint)" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
      <line x1={pad.left} y1={divY} x2={width - pad.right} y2={divY}
        stroke="var(--pl-text-faint)" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

      {/* Quadrant labels */}
      <text x={pad.left + 8} y={pad.top + 16} fill="var(--pl-text-faint)" fontSize="10" fontFamily="monospace" opacity="0.4">{quadrantLabels.topLeft}</text>
      <text x={width - pad.right - 8} y={pad.top + 16} fill="var(--pl-text-faint)" fontSize="10" fontFamily="monospace" opacity="0.4" textAnchor="end">{quadrantLabels.topRight}</text>
      <text x={pad.left + 8} y={height - pad.bottom - 8} fill="var(--pl-text-faint)" fontSize="10" fontFamily="monospace" opacity="0.4">{quadrantLabels.bottomLeft}</text>
      <text x={width - pad.right - 8} y={height - pad.bottom - 8} fill="var(--pl-text-faint)" fontSize="10" fontFamily="monospace" opacity="0.4" textAnchor="end">{quadrantLabels.bottomRight}</text>

      {/* Points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={scaleX(p.x)}
          cy={scaleY(p.y)}
          r={p.size}
          fill={p.color}
          fillOpacity={0.7}
          stroke="white"
          strokeWidth={0.5}
        >
          {p.label && <title>{p.label}</title>}
        </circle>
      ))}

      {/* X axis label */}
      <text x={width / 2} y={height - 6} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="11" fontFamily="monospace">{xLabel}</text>
      {/* Y axis label */}
      <text x={14} y={height / 2} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="11" fontFamily="monospace"
        transform={`rotate(-90, 14, ${height / 2})`}>{yLabel}</text>
    </svg>
  );
}
