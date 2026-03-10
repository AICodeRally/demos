'use client';

import { useState, useMemo } from 'react';
import { ActNavigation, LightBarChart, LightSectionCard } from '@/components/demos/proofline';
import {
  BRAND_FAMILIES,
  SUPPLIER_COLORS,
  CATEGORY_COLORS,
  type BrandFamily,
  type Category,
  type SupplierGroup,
} from '@/data/proofline';
import { fmt, fmtM, pct } from '@/lib/utils';

/* ── Category filter tabs ────────────────────────────── */
type FilterKey = 'all' | Category;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'beer-domestic', label: 'Domestic' },
  { key: 'beer-import', label: 'Import' },
  { key: 'craft-regional', label: 'Craft' },
  { key: 'spirits', label: 'Spirits' },
  { key: 'fmb-rtd', label: 'FMB/RTD' },
];

/* ── Supplier labels ─────────────────────────────────── */
const SUPPLIER_LABELS: Record<string, string> = {
  'molson-coors': 'Molson Coors',
  constellation: 'Constellation',
  heineken: 'Heineken',
  craft: 'Craft',
  sazerac: 'Sazerac',
  'fmb-rtd': 'FMB/RTD',
};

/* ── Bubble packing algorithm ────────────────────────── */
const SVG_W = 780;
const SVG_H = 460;
const MIN_R = 14;
const MAX_R = 52;

interface PackedBubble {
  brand: BrandFamily;
  x: number;
  y: number;
  r: number;
  color: string;
}

function packBubbles(brands: BrandFamily[]): PackedBubble[] {
  if (brands.length === 0) return [];

  const sorted = [...brands].sort((a, b) => b.revQ - a.revQ);
  const maxRev = sorted[0].revQ;
  const cx = SVG_W / 2;
  const cy = SVG_H / 2;

  const items: PackedBubble[] = sorted.map((b) => ({
    brand: b,
    x: cx,
    y: cy,
    r: MIN_R + Math.sqrt(b.revQ / maxRev) * (MAX_R - MIN_R),
    color: SUPPLIER_COLORS[b.supplier],
  }));

  // Place first bubble at center
  items[0].x = cx;
  items[0].y = cy;

  // Place remaining bubbles using spiral search
  for (let i = 1; i < items.length; i++) {
    let bestX = cx;
    let bestY = cy;
    let bestDist = Infinity;

    // Search outward in a spiral for a valid position
    for (let dist = 0; dist < 400; dist += 3) {
      const steps = Math.max(8, Math.floor(dist * 0.5));
      for (let s = 0; s < steps; s++) {
        const angle = (s / steps) * Math.PI * 2;
        const tx = cx + Math.cos(angle) * dist;
        const ty = cy + Math.sin(angle) * dist;

        // Check bounds
        if (tx - items[i].r < 8 || tx + items[i].r > SVG_W - 8) continue;
        if (ty - items[i].r < 8 || ty + items[i].r > SVG_H - 8) continue;

        // Check overlap with all placed
        let valid = true;
        for (let j = 0; j < i; j++) {
          const dx = tx - items[j].x;
          const dy = ty - items[j].y;
          const minD = items[i].r + items[j].r + 3;
          if (dx * dx + dy * dy < minD * minD) {
            valid = false;
            break;
          }
        }

        if (valid) {
          const d = Math.sqrt((tx - cx) ** 2 + (ty - cy) ** 2);
          if (d < bestDist) {
            bestDist = d;
            bestX = tx;
            bestY = ty;
          }
        }
      }
      if (bestDist < Infinity) break;
    }

    items[i].x = bestX;
    items[i].y = bestY;
  }

  return items;
}

/* ── Supplier revenue aggregation ────────────────────── */
function getSupplierBreakdown(brands: BrandFamily[]) {
  const map = new Map<SupplierGroup, number>();
  for (const b of brands) {
    map.set(b.supplier, (map.get(b.supplier) ?? 0) + b.revQ);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([supplier, rev]) => ({
      supplier,
      rev,
      label: SUPPLIER_LABELS[supplier],
      color: SUPPLIER_COLORS[supplier],
      pct: rev / brands.reduce((s, b) => s + b.revQ, 0),
    }));
}

export default function BrandPortfolioPage() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [selected, setSelected] = useState<BrandFamily | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered =
    filter === 'all'
      ? BRAND_FAMILIES
      : BRAND_FAMILIES.filter((b) => b.category === filter);

  const bubbles = useMemo(() => packBubbles(filtered), [filtered]);
  const supplierBreakdown = useMemo(() => getSupplierBreakdown(filtered), [filtered]);

  const totalRev = filtered.reduce((s, b) => s + b.revQ, 0);
  const avgMargin = filtered.reduce((s, b) => s + b.gp, 0) / (filtered.length || 1);
  const spiritsCount = filtered.filter((b) => b.category === 'spirits').length;

  /* Detail panel bar data */
  const detailBarData = selected
    ? ['Q1', 'Q2', 'Q3', 'Q4'].map((q, qi) => ({
        label: q,
        value: Math.round(selected.revQ * (selected.seasonalTrend[qi] ?? 1)),
        color: SUPPLIER_COLORS[selected.supplier],
      }))
    : [];

  return (
    <>

      <ActNavigation currentAct={1} />

      {/* Page Header */}
      <div className="mt-6 mb-6">
        <div className="text-[10px] tracking-[3px] uppercase font-mono mb-1" style={{ color: '#C6A052' }}>
          Act 1 &middot; Corporate Strategy
        </div>
        <h1
          className="text-2xl font-extrabold mb-1"
          style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Brand Portfolio Command
        </h1>
        <p className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
          {BRAND_FAMILIES.length} brand families across 6 supplier groups &middot; Bubble size = quarterly revenue
        </p>
      </div>

      {/* ── Summary Bar ──────────────────────────────── */}
      <div
        className="grid grid-cols-4 gap-4 mb-6 rounded-xl border p-4"
        style={{ background: 'var(--pl-card)', borderColor: 'var(--pl-border)', boxShadow: 'var(--pl-shadow)' }}
      >
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[1px] font-mono mb-1" style={{ color: 'var(--pl-text-muted)' }}>
            Total Brands
          </div>
          <div className="text-xl font-bold" style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}>
            {filtered.length}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[1px] font-mono mb-1" style={{ color: 'var(--pl-text-muted)' }}>
            Quarterly Revenue
          </div>
          <div className="text-xl font-bold" style={{ color: '#C6A052', fontFamily: "'Space Grotesk', sans-serif" }}>
            {fmtM(totalRev)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[1px] font-mono mb-1" style={{ color: 'var(--pl-text-muted)' }}>
            Avg Margin
          </div>
          <div className="text-xl font-bold" style={{ color: '#2563EB', fontFamily: "'Space Grotesk', sans-serif" }}>
            {pct(avgMargin)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[1px] font-mono mb-1" style={{ color: 'var(--pl-text-muted)' }}>
            Spirits Brands
          </div>
          <div className="text-xl font-bold" style={{ color: '#F87171', fontFamily: "'Space Grotesk', sans-serif" }}>
            {spiritsCount}
          </div>
        </div>
      </div>

      {/* ── Category Filter Tabs ─────────────────────── */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          const tabColor = f.key === 'all' ? '#C6A052' : CATEGORY_COLORS[f.key as Category];
          return (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setSelected(null); }}
              className="text-[11px] font-bold font-mono px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: isActive ? tabColor : 'var(--pl-chart-bar-track)',
                color: isActive ? '#fff' : 'var(--pl-text-muted)',
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* ── Bubble Chart + Detail Panel ───────────────── */}
      <div className="flex gap-4 mb-6">
        {/* SVG Bubble Chart */}
        <LightSectionCard title="Revenue Bubble Map" className={selected ? 'flex-1' : 'w-full'}>
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full"
            style={{ height: selected ? 420 : 480 }}
          >
            {/* Background grid */}
            <defs>
              <pattern id="bubbleGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--pl-chart-bar-track)" strokeWidth="0.5" />
              </pattern>
              {/* Glow filter for hover/selection */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width={SVG_W} height={SVG_H} fill="url(#bubbleGrid)" rx="8" />

            {/* Bubbles */}
            {bubbles.map((b) => {
              const isSelected = selected?.id === b.brand.id;
              const isHovered = hovered === b.brand.id;
              const isActive = isSelected || isHovered;
              return (
                <g
                  key={b.brand.id}
                  onClick={() => setSelected(isSelected ? null : b.brand)}
                  onMouseEnter={() => setHovered(b.brand.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer glow ring */}
                  {isActive && (
                    <circle
                      cx={b.x}
                      cy={b.y}
                      r={b.r + 4}
                      fill="none"
                      stroke={b.color}
                      strokeWidth={2}
                      opacity={0.4}
                    />
                  )}
                  {/* Main bubble */}
                  <circle
                    cx={b.x}
                    cy={b.y}
                    r={b.r}
                    fill={b.color}
                    fillOpacity={isActive ? 0.25 : 0.15}
                    stroke={b.color}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    filter={isActive ? 'url(#glow)' : undefined}
                  />
                  {/* Inner filled circle */}
                  <circle
                    cx={b.x}
                    cy={b.y}
                    r={b.r * 0.7}
                    fill={b.color}
                    fillOpacity={isActive ? 0.5 : 0.3}
                  />
                  {/* Brand name */}
                  {b.r >= 22 && (
                    <text
                      x={b.x}
                      y={b.y - (b.r >= 32 ? 5 : 0)}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="var(--pl-text)"
                      fontSize={b.r >= 40 ? 11 : b.r >= 30 ? 10 : 9}
                      fontWeight="700"
                      fontFamily="'Space Grotesk', sans-serif"
                    >
                      {b.brand.name.length > 14 && b.r < 40
                        ? b.brand.name.slice(0, 12) + '...'
                        : b.brand.name}
                    </text>
                  )}
                  {/* Revenue label for larger bubbles */}
                  {b.r >= 32 && (
                    <text
                      x={b.x}
                      y={b.y + 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="var(--pl-text-muted)"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {fmtM(b.brand.revQ)}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Hover tooltip */}
            {hovered && !selected && (() => {
              const b = bubbles.find(b => b.brand.id === hovered);
              if (!b || b.r >= 32) return null;
              return (
                <g>
                  <rect
                    x={b.x - 55}
                    y={b.y - b.r - 36}
                    width={110}
                    height={28}
                    rx={6}
                    fill="var(--pl-chart-tooltip-bg)"
                    stroke="var(--pl-chart-tooltip-border)"
                    strokeWidth={1}
                    filter="url(#glow)"
                  />
                  <text
                    x={b.x}
                    y={b.y - b.r - 25}
                    textAnchor="middle"
                    fill="var(--pl-text)"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="'Space Grotesk', sans-serif"
                  >
                    {b.brand.name}
                  </text>
                  <text
                    x={b.x}
                    y={b.y - b.r - 13}
                    textAnchor="middle"
                    fill="var(--pl-text-muted)"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {fmtM(b.brand.revQ)} &middot; {pct(b.brand.gp)}
                  </text>
                </g>
              );
            })()}
          </svg>

          {/* Supplier legend */}
          <div className="flex items-center justify-center gap-5 mt-3 flex-wrap">
            {supplierBreakdown.map((s) => (
              <div key={s.supplier} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                <span className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                  {s.label} ({pct(s.pct)})
                </span>
              </div>
            ))}
          </div>
        </LightSectionCard>

        {/* ── Detail Panel ─────────────────────────────── */}
        {selected && (
          <div
            className="w-[320px] shrink-0 rounded-xl border p-5 self-start sticky top-4"
            style={{
              background: 'var(--pl-card)',
              borderColor: 'var(--pl-border)',
              borderTop: `3px solid ${SUPPLIER_COLORS[selected.supplier]}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
          >
            {/* Close button */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-[1.5px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                Brand Detail
              </span>
              <button
                onClick={() => setSelected(null)}
                className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                style={{ color: 'var(--pl-text-muted)', background: 'var(--pl-chart-bar-track)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <h3
              className="text-lg font-bold mb-1"
              style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {selected.name}
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded"
                style={{ background: `${SUPPLIER_COLORS[selected.supplier]}15`, color: SUPPLIER_COLORS[selected.supplier] }}
              >
                {SUPPLIER_LABELS[selected.supplier]}
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: selected.tier === 'Core' ? 'rgba(198,160,82,0.10)' : selected.tier === 'Emerging' ? 'rgba(245,158,11,0.10)' : 'rgba(168,85,247,0.10)',
                  color: selected.tier === 'Core' ? '#C6A052' : selected.tier === 'Emerging' ? '#F59E0B' : '#A855F7',
                }}
              >
                {selected.tier}
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Cases/Qtr', value: fmt(selected.casesQ), color: 'var(--pl-text)' },
                { label: 'Revenue/Qtr', value: fmtM(selected.revQ), color: 'var(--pl-text)' },
                { label: 'Market Share', value: pct(selected.marketSharePct), color: '#2563EB' },
                { label: 'Rev/Case', value: `$${selected.revenuePerCase}`, color: 'var(--pl-text)' },
              ].map((s) => (
                <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: 'var(--pl-card-alt)' }}>
                  <div className="text-[10px] font-mono uppercase" style={{ color: 'var(--pl-text-faint)' }}>{s.label}</div>
                  <div className="text-[16px] font-bold" style={{ color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Margin vs target */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span style={{ color: 'var(--pl-text-muted)' }}>Margin vs Target</span>
                <span
                  className="font-bold font-mono"
                  style={{ color: selected.gp >= selected.marginTarget ? '#C6A052' : '#F87171' }}
                >
                  {pct(selected.gp)} / {pct(selected.marginTarget)}
                </span>
              </div>
              <div className="w-full h-2 rounded-full relative" style={{ background: 'var(--pl-chart-bar-track)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((selected.gp / selected.marginTarget) * 100, 100)}%`,
                    background: selected.gp >= selected.marginTarget ? '#C6A052' : '#F87171',
                  }}
                />
                <div className="absolute top-[-2px] w-[2px] h-[12px]" style={{ left: '100%', background: 'var(--pl-text)' }} />
              </div>
            </div>

            {/* Seasonal Revenue */}
            <div className="text-[10px] uppercase tracking-[1px] font-mono mb-2" style={{ color: 'var(--pl-text-muted)' }}>
              Seasonal Revenue
            </div>
            <LightBarChart
              data={detailBarData}
              formatValue={(v) => `$${(v / 1e6).toFixed(1)}M`}
            />
          </div>
        )}
      </div>

      {/* Supplier Revenue Breakdown */}
      <LightSectionCard title="Supplier Revenue Share">
        <div className="flex items-end gap-2" style={{ height: 120 }}>
          {supplierBreakdown.map((s) => {
            const barH = (s.pct / supplierBreakdown[0].pct) * 100;
            return (
              <div key={s.supplier} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold font-mono" style={{ color: s.color }}>
                  {pct(s.pct)}
                </span>
                <div className="w-full rounded-t-lg" style={{ height: barH, background: s.color, opacity: 0.7 }} />
                <span className="text-[9px] font-mono text-center leading-tight" style={{ color: 'var(--pl-text-muted)' }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </LightSectionCard>

    </>
  );
}
