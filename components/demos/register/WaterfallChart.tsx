'use client';

interface WaterfallItem {
  label: string;
  value: number;
  type: 'add' | 'subtract' | 'total';
}

interface WaterfallChartProps {
  data: WaterfallItem[];
  height?: number;
}

export function WaterfallChart({ data, height = 300 }: WaterfallChartProps) {
  if (data.length === 0) return null;

  const width = 500;
  const paddingLeft = 12;
  const paddingRight = 12;
  const paddingTop = 24;
  const paddingBottom = 44;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Compute running totals and find value range
  const bars: {
    label: string;
    type: 'add' | 'subtract' | 'total';
    value: number;
    start: number;
    end: number;
  }[] = [];

  let runningTotal = 0;
  for (const item of data) {
    if (item.type === 'total') {
      bars.push({
        label: item.label,
        type: item.type,
        value: runningTotal,
        start: 0,
        end: runningTotal,
      });
    } else if (item.type === 'add') {
      const start = runningTotal;
      runningTotal += item.value;
      bars.push({
        label: item.label,
        type: item.type,
        value: item.value,
        start,
        end: runningTotal,
      });
    } else {
      const start = runningTotal;
      runningTotal -= item.value;
      bars.push({
        label: item.label,
        type: item.type,
        value: item.value,
        start,
        end: runningTotal,
      });
    }
  }

  // Find min and max for scaling
  let minVal = 0;
  let maxVal = 0;
  for (const bar of bars) {
    minVal = Math.min(minVal, bar.start, bar.end);
    maxVal = Math.max(maxVal, bar.start, bar.end);
  }

  // Add a bit of padding to the scale
  const range = maxVal - minVal || 1;
  const scalePadding = range * 0.1;
  const scaleMin = minVal - scalePadding;
  const scaleMax = maxVal + scalePadding;
  const scaleRange = scaleMax - scaleMin;

  function yFor(value: number): number {
    return paddingTop + chartHeight - ((value - scaleMin) / scaleRange) * chartHeight;
  }

  const barGap = 8;
  const totalBarSpace = chartWidth - barGap * (data.length - 1);
  const barWidth = Math.min(totalBarSpace / data.length, 60);
  const actualTotalWidth = barWidth * data.length + barGap * (data.length - 1);
  const offsetX = paddingLeft + (chartWidth - actualTotalWidth) / 2;

  function xFor(i: number): number {
    return offsetX + i * (barWidth + barGap);
  }

  const colors = {
    add: '#059669',
    subtract: '#DC2626',
    total: '#8B7355',
  };

  // Zero line
  const zeroY = yFor(0);

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="block"
    >
      {/* Zero baseline */}
      <line
        x1={paddingLeft}
        y1={zeroY}
        x2={width - paddingRight}
        y2={zeroY}
        stroke="#E7E5E4"
        strokeWidth={1}
      />

      {bars.map((bar, i) => {
        const x = xFor(i);
        const top = yFor(Math.max(bar.start, bar.end));
        const bottom = yFor(Math.min(bar.start, bar.end));
        const barH = Math.max(bottom - top, 2);
        const color = colors[bar.type];
        const displayValue = bar.type === 'total' ? bar.value : bar.value;
        const formattedValue =
          bar.type === 'subtract'
            ? `-${displayValue.toLocaleString()}`
            : bar.type === 'add'
              ? `+${displayValue.toLocaleString()}`
              : displayValue.toLocaleString();

        // Value label position — above bar if positive space, below if not
        const valueLabelY = top - 6;

        return (
          <g key={`bar-${i}`}>
            {/* Connecting line from previous bar */}
            {i > 0 && bar.type !== 'total' && (
              <line
                x1={xFor(i - 1) + barWidth}
                y1={yFor(bars[i - 1].end)}
                x2={x}
                y2={yFor(bars[i - 1].end)}
                stroke="#A8A29E"
                strokeWidth={1}
                strokeDasharray="3,2"
              />
            )}

            {/* Bar */}
            <rect
              x={x}
              y={top}
              width={barWidth}
              height={barH}
              rx={2}
              fill={color}
              className="transition-all duration-300"
            />

            {/* Value label */}
            <text
              x={x + barWidth / 2}
              y={valueLabelY}
              textAnchor="middle"
              fill="#1C1917"
              fontSize={10}
              fontFamily="monospace"
              fontWeight={600}
            >
              {formattedValue}
            </text>

            {/* X-axis label */}
            <text
              x={x + barWidth / 2}
              y={height - 8}
              textAnchor="middle"
              fill="#57534E"
              fontSize={10}
            >
              {bar.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
