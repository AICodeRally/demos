'use client';

import type { TierStep } from '@/lib/swic/engine/types';

interface TierStaircaseProps {
  tiers: TierStep[];
  accent: string;
}

/** Small inline SVG showing tiered rates as a visual staircase */
export function TierStaircase({ tiers, accent }: TierStaircaseProps) {
  if (tiers.length === 0) return null;

  const maxRate = Math.max(...tiers.map((t) => t.rate), 0.01);
  const maxMin = Math.max(...tiers.map((t) => t.min), 1);
  const w = 200;
  const h = 60;
  const padX = 4;
  const padY = 4;
  const usableW = w - padX * 2;
  const usableH = h - padY * 2;

  const points: { x: number; y: number; rate: number; min: number }[] = [];
  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    const x = padX + (tier.min / maxMin) * usableW * 0.9;
    const y = padY + usableH - (tier.rate / maxRate) * usableH;
    points.push({ x, y, rate: tier.rate, min: tier.min });
  }
  // Extend last tier to edge
  if (points.length > 0) {
    const last = points[points.length - 1];
    points.push({ x: w - padX, y: last.y, rate: last.rate, min: last.min });
  }

  // Build staircase path
  let path = `M ${points[0].x} ${h - padY}`;
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (i === 0) {
      path += ` L ${p.x} ${p.y}`;
    } else {
      path += ` L ${p.x} ${points[i - 1].y} L ${p.x} ${p.y}`;
    }
  }

  // Fill path (close to bottom)
  const fillPath = path + ` L ${w - padX} ${h - padY} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <defs>
        <linearGradient id="stair-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill="url(#stair-fill)" />
      <path d={path} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots at each tier step */}
      {points.slice(0, tiers.length).map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3"
          fill={accent}
          stroke="var(--page-bg, #080a12)"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
