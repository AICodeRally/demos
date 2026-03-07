'use client';

interface TreeMapItem {
  label: string;
  value: number;
  color?: string;
}

interface TreeMapProps {
  data: TreeMapItem[];
}

const defaultPalette = [
  '#B45309',
  '#2563EB',
  '#059669',
  '#DC2626',
  '#7C3AED',
  '#EA580C',
  '#0891B2',
  '#BE185D',
  '#4F46E5',
  '#D97706',
];

function formatValue(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

/**
 * Simple squarified treemap layout.
 * Produces rectangles positioned within a container of given width x height.
 */
interface LayoutRect {
  x: number;
  y: number;
  w: number;
  h: number;
  item: TreeMapItem;
  colorIndex: number;
}

function layoutTreemap(
  items: TreeMapItem[],
  containerW: number,
  containerH: number,
): LayoutRect[] {
  if (items.length === 0) return [];

  const total = items.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return [];

  // Sort descending by value for better squarification
  const sorted = items
    .map((item, idx) => ({ item, originalIndex: idx }))
    .sort((a, b) => b.item.value - a.item.value);

  const rects: LayoutRect[] = [];
  let x = 0;
  let y = 0;
  let w = containerW;
  let h = containerH;
  let remaining = total;

  let i = 0;
  while (i < sorted.length) {
    // Decide orientation: lay out along shorter side
    const isHorizontal = w >= h;

    // Greedily add items to current row/column
    const row: typeof sorted = [];
    let rowTotal = 0;

    // First item always goes in
    row.push(sorted[i]);
    rowTotal += sorted[i].item.value;
    i++;

    // Try adding more items if it improves aspect ratios
    const sideLength = isHorizontal ? h : w;
    const areaForRow = () => (rowTotal / remaining) * (isHorizontal ? w : h);

    while (i < sorted.length) {
      const candidate = sorted[i];
      const testRowTotal = rowTotal + candidate.item.value;

      // Compute worst aspect ratio with and without candidate
      const currentWorst = worstAspectRatio(row.map((r) => r.item.value), rowTotal, sideLength, remaining, isHorizontal ? w : h);
      const testRow = [...row, candidate];
      const testWorst = worstAspectRatio(testRow.map((r) => r.item.value), testRowTotal, sideLength, remaining, isHorizontal ? w : h);

      if (testWorst <= currentWorst) {
        row.push(candidate);
        rowTotal += candidate.item.value;
        i++;
      } else {
        break;
      }
    }

    // Layout this row
    const rowFraction = rowTotal / remaining;
    const rowThickness = isHorizontal
      ? w * rowFraction
      : h * rowFraction;

    let offset = 0;
    for (const entry of row) {
      const entryFraction = entry.item.value / rowTotal;
      const entryLength = sideLength * entryFraction;

      if (isHorizontal) {
        rects.push({
          x: x,
          y: y + offset,
          w: rowThickness,
          h: entryLength,
          item: entry.item,
          colorIndex: entry.originalIndex,
        });
      } else {
        rects.push({
          x: x + offset,
          y: y,
          w: entryLength,
          h: rowThickness,
          item: entry.item,
          colorIndex: entry.originalIndex,
        });
      }
      offset += entryLength;
    }

    // Shrink remaining area
    if (isHorizontal) {
      x += rowThickness;
      w -= rowThickness;
    } else {
      y += rowThickness;
      h -= rowThickness;
    }
    remaining -= rowTotal;
  }

  return rects;
}

function worstAspectRatio(
  values: number[],
  rowTotal: number,
  sideLength: number,
  remainingTotal: number,
  availableExtent: number,
): number {
  const rowFraction = rowTotal / remainingTotal;
  const rowThickness = availableExtent * rowFraction;
  if (rowThickness === 0) return Infinity;

  let worst = 0;
  for (const v of values) {
    const entryFraction = v / rowTotal;
    const entryLength = sideLength * entryFraction;
    if (entryLength === 0) continue;
    const aspect = Math.max(
      rowThickness / entryLength,
      entryLength / rowThickness,
    );
    worst = Math.max(worst, aspect);
  }
  return worst;
}

export function TreeMap({ data }: TreeMapProps) {
  // Use SVG-based layout for precise positioning
  const containerWidth = 500;
  const containerHeight = 300;
  const gap = 2;

  const filtered = data.filter((d) => d.value > 0);
  if (filtered.length === 0) return null;

  const rects = layoutTreemap(filtered, containerWidth, containerHeight);

  return (
    <svg
      width="100%"
      height={containerHeight}
      viewBox={`0 0 ${containerWidth} ${containerHeight}`}
      preserveAspectRatio="xMidYMid meet"
      className="block"
    >
      {rects.map((rect, i) => {
        const color =
          rect.item.color ?? defaultPalette[rect.colorIndex % defaultPalette.length];
        const innerW = Math.max(rect.w - gap, 0);
        const innerH = Math.max(rect.h - gap, 0);

        // Only show labels if rect is large enough
        const showLabel = innerW > 40 && innerH > 28;
        const showValue = innerW > 30 && innerH > 18;

        return (
          <g key={`rect-${i}`}>
            <rect
              x={rect.x + gap / 2}
              y={rect.y + gap / 2}
              width={innerW}
              height={innerH}
              rx={3}
              fill={color}
              className="transition-all duration-300"
            />
            {showLabel && (
              <text
                x={rect.x + rect.w / 2}
                y={rect.y + rect.h / 2 - (showValue ? 6 : 0)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#F1F5F9"
                fontSize={innerW > 80 ? 12 : 10}
                fontWeight={600}
              >
                {rect.item.label.length > Math.floor(innerW / 7)
                  ? rect.item.label.slice(0, Math.floor(innerW / 7)) + '...'
                  : rect.item.label}
              </text>
            )}
            {showLabel && showValue && (
              <text
                x={rect.x + rect.w / 2}
                y={rect.y + rect.h / 2 + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(241,245,249,0.8)"
                fontSize={10}
                fontFamily="monospace"
              >
                {formatValue(rect.item.value)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
