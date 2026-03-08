'use client';

import React from 'react';

interface HeatMapProps {
  rows: string[];
  cols: string[];
  data: number[][]; // rows x cols, values 0-100
  colorScale?: { low: string; mid: string; high: string };
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function interpolateColor(c1: string, c2: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return rgbToHex(
    r1 + (r2 - r1) * t,
    g1 + (g2 - g1) * t,
    b1 + (b2 - b1) * t,
  );
}

function getCellColor(
  value: number,
  scale: { low: string; mid: string; high: string },
): string {
  const v = Math.max(0, Math.min(100, value));
  if (v <= 33) {
    return interpolateColor(scale.low, scale.mid, v / 33);
  } else if (v <= 66) {
    return interpolateColor(scale.mid, scale.high, (v - 33) / 33);
  } else {
    return scale.high;
  }
}

function isLightColor(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  // Relative luminance
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum > 150;
}

export function HeatMap({
  rows,
  cols,
  data,
  colorScale = { low: '#059669', mid: '#F59E0B', high: '#DC2626' },
}: HeatMapProps) {
  return (
    <div className="overflow-x-auto">
      <div
        className="inline-grid gap-[2px]"
        style={{
          gridTemplateColumns: `120px repeat(${cols.length}, minmax(36px, 1fr))`,
        }}
      >
        {/* Top-left empty cell */}
        <div />

        {/* Column headers */}
        {cols.map((col, ci) => (
          <div
            key={`col-${ci}`}
            className="flex items-end justify-center pb-1"
          >
            <span
              className="text-[10px] leading-tight text-center"
              style={{ color: '#A8A29E' }}
            >
              {col}
            </span>
          </div>
        ))}

        {/* Data rows */}
        {rows.map((row, ri) => (
          <React.Fragment key={`row-${ri}`}>
            {/* Row label */}
            <div
              className="flex items-center pr-2"
            >
              <span
                className="text-[11px] truncate w-[120px]"
                style={{ color: '#57534E' }}
                title={row}
              >
                {row}
              </span>
            </div>

            {/* Cells */}
            {cols.map((_, ci) => {
              const value = data[ri]?.[ci] ?? 0;
              const bg = getCellColor(value, colorScale);
              const textColor = isLightColor(bg) ? '#1C1917' : '#FFFFFF';

              return (
                <div
                  key={`cell-${ri}-${ci}`}
                  className="flex items-center justify-center rounded-sm min-w-[36px] min-h-[28px] transition-colors duration-300"
                  style={{ backgroundColor: bg }}
                >
                  <span
                    className="text-[9px] font-mono"
                    style={{ color: textColor }}
                  >
                    {value}
                  </span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
