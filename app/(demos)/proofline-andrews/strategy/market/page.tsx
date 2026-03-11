'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ActNavigation, LightSectionCard } from '@/components/demos/proofline';
import { HOMETOWNS, getRoutesByHometown } from '@/data/proofline';
import { fmt, fmtM, pct } from '@/lib/utils';

const TexasMap = dynamic(
  () => import('@/components/demos/proofline/TexasMap').then(m => m.TexasMap),
  { ssr: false, loading: () => <div style={{ height: 480, background: 'var(--pl-card)' }} /> }
);

/* ── Market participants (Lone Star + competitors) ─────── */
interface MarketPlayer {
  name: string;
  marketShare: number;   // 0–1
  growthRate: number;     // YoY growth (0–1)
  revenue: number;        // annual revenue estimate
  color: string;
  isHighlighted?: boolean;
  categories: string;
}

const MARKET_PLAYERS: MarketPlayer[] = [
  {
    name: 'Lone Star Distribution',
    marketShare: 0.22,
    growthRate: 0.12,
    revenue: 128000000,
    color: '#C6A052',
    isHighlighted: true,
    categories: 'Molson Coors + Constellation + Heineken + Sazerac',
  },
  {
    name: 'Redtail Beverage Co.',
    marketShare: 0.34,
    growthRate: 0.04,
    revenue: 198000000,
    color: '#F87171',
    categories: 'AB InBev aligned — all categories',
  },
  {
    name: 'Iron Creek Distributing',
    marketShare: 0.18,
    growthRate: 0.02,
    revenue: 105000000,
    color: '#60A5FA',
    categories: 'AB InBev portfolio — South TX',
  },
  {
    name: 'Magnolia Spirits Group',
    marketShare: 0.12,
    growthRate: 0.06,
    revenue: 72000000,
    color: '#A78BFA',
    categories: 'Spirits & wine statewide',
  },
  {
    name: 'Pecan Valley Spirits',
    marketShare: 0.08,
    growthRate: 0.03,
    revenue: 48000000,
    color: '#F59E0B',
    categories: 'Spirits & wine',
  },
  {
    name: 'Others',
    marketShare: 0.06,
    growthRate: -0.01,
    revenue: 35000000,
    color: '#94A3B8',
    categories: 'Regional & specialty',
  },
];

/* ── Scatter plot constants ──────────────────────────── */
const PLOT_W = 720;
const PLOT_H = 400;
const PAD = { top: 40, right: 40, bottom: 60, left: 70 };
const INNER_W = PLOT_W - PAD.left - PAD.right;
const INNER_H = PLOT_H - PAD.top - PAD.bottom;

// Axis ranges
const X_MIN = 0;
const X_MAX = 0.40;
const Y_MIN = -0.02;
const Y_MAX = 0.16;

function toPlotX(share: number): number {
  return PAD.left + ((share - X_MIN) / (X_MAX - X_MIN)) * INNER_W;
}
function toPlotY(growth: number): number {
  return PAD.top + INNER_H - ((growth - Y_MIN) / (Y_MAX - Y_MIN)) * INNER_H;
}
function revToRadius(rev: number): number {
  const maxRev = 198000000;
  return 16 + Math.sqrt(rev / maxRev) * 28;
}

/* ── Acquisition timeline ────────────────────────────── */
const TIMELINE = [
  { year: '1976', title: 'Founded in Corpus Christi', desc: 'Founded as a single-territory Coors distributorship in South Texas.', color: '#C6A052' },
  { year: '2014', title: 'Coors Fort Worth Acquisition', desc: 'Expanded into western DFW with a 532,000 sq ft distribution center.', color: '#7C3AED' },
  { year: '2022', title: 'Price Distributing (Ennis)', desc: 'Acquired rural/semi-urban coverage between Dallas and Waco.', color: '#2563EB' },
  { year: '2024', title: 'Southern Distributing (Laredo)', desc: 'Border market acquisition — unlocks cross-border growth corridor.', color: '#F87171' },
  { year: '2024', title: 'Sazerac Spirits Partnership', desc: 'Buffalo Trace, Fireball, Southern Comfort — spirits category entry.', color: '#A855F7' },
];

/* ── Growth vectors ──────────────────────────────────── */
const GROWTH_VECTORS = [
  { title: 'South Texas Expansion', desc: 'Laredo + Corpus Christi form a growth corridor. Combined target: 5.5M annual cases.', stat: '5.5M cases', accent: '#F87171', areas: 'Laredo, Corpus Christi' },
  { title: 'Spirits Integration', desc: 'Sazerac partnership launched 2024. Buffalo Trace leads at 36% margin. Target: grow spirits from 5% to 8%.', stat: '5% → 8%', accent: '#A855F7', areas: 'All territories' },
  { title: 'Suburban Growth', desc: 'Allen/Collin County is the fastest-growing market. Population +4.2% YoY drives premium mix.', stat: '+4.2% pop', accent: '#10B981', areas: 'Allen, Collin County' },
];


export default function MarketPositionPage() {
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);

  return (
    <>

      <ActNavigation currentAct={1} />

      {/* Page Header */}
      <div className="mt-6 mb-8">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#C6A052' }}>
          Act 1 &middot; Corporate Strategy
        </div>
        <h1
          className="text-2xl font-extrabold mb-1"
          style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}
        >
          Market Position &amp; Growth
        </h1>
        <p className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
          Texas beverage distribution competitive landscape &middot; Lone Star is the fastest-growing distributor at +12% YoY
        </p>
      </div>

      {/* ── Competitive Positioning Scatter Plot ─────── */}
      <LightSectionCard title="Competitive Positioning — Market Share vs Growth" className="mb-8">
        <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} className="w-full" style={{ height: 420 }}>
          <defs>
            <filter id="scatterGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="andrewsGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C6A052" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C6A052" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid background */}
          <rect x={PAD.left} y={PAD.top} width={INNER_W} height={INNER_H} fill="var(--pl-card-alt)" rx="4" />

          {/* Grid lines - horizontal */}
          {[0, 0.04, 0.08, 0.12].map((g) => {
            const y = toPlotY(g);
            return (
              <g key={g}>
                <line x1={PAD.left} y1={y} x2={PAD.left + INNER_W} y2={y} stroke="var(--pl-chart-grid)" strokeWidth="1" />
                <text x={PAD.left - 8} y={y + 4} textAnchor="end" fill="var(--pl-text-faint)" fontSize="12" fontFamily="monospace">
                  {(g * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}

          {/* Grid lines - vertical */}
          {[0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35].map((s) => {
            const x = toPlotX(s);
            return (
              <g key={s}>
                <line x1={x} y1={PAD.top} x2={x} y2={PAD.top + INNER_H} stroke="var(--pl-chart-grid)" strokeWidth="1" />
                <text x={x} y={PAD.top + INNER_H + 18} textAnchor="middle" fill="var(--pl-text-faint)" fontSize="12" fontFamily="monospace">
                  {(s * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}

          {/* Axis labels */}
          <text x={PAD.left + INNER_W / 2} y={PLOT_H - 8} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="12" fontWeight="600" fontFamily="var(--pl-font)">
            Market Share →
          </text>
          <text
            x={16}
            y={PAD.top + INNER_H / 2}
            textAnchor="middle"
            fill="var(--pl-text-muted)"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--pl-font)"
            transform={`rotate(-90, 16, ${PAD.top + INNER_H / 2})`}
          >
            YoY Growth →
          </text>

          {/* Quadrant labels */}
          <text x={PAD.left + 8} y={PAD.top + 14} fill="var(--pl-text-faint)" fontSize="12" fontFamily="monospace" opacity="0.6">
            LOW SHARE / HIGH GROWTH
          </text>
          <text x={PAD.left + INNER_W - 8} y={PAD.top + 14} textAnchor="end" fill="var(--pl-text-faint)" fontSize="12" fontFamily="monospace" opacity="0.6">
            HIGH SHARE / HIGH GROWTH
          </text>

          {/* Lone Star highlight zone */}
          {(() => {
            const andrews = MARKET_PLAYERS[0];
            const ax = toPlotX(andrews.marketShare);
            const ay = toPlotY(andrews.growthRate);
            return (
              <circle cx={ax} cy={ay} r={60} fill="url(#andrewsGlow)" />
            );
          })()}

          {/* Player bubbles */}
          {MARKET_PLAYERS.map((player) => {
            const x = toPlotX(player.marketShare);
            const y = toPlotY(player.growthRate);
            const r = revToRadius(player.revenue);
            const isHovered = hoveredPlayer === player.name;
            const isHighlighted = player.isHighlighted;

            return (
              <g
                key={player.name}
                onMouseEnter={() => setHoveredPlayer(player.name)}
                onMouseLeave={() => setHoveredPlayer(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer ring for Lone Star */}
                {isHighlighted && (
                  <circle cx={x} cy={y} r={r + 6} fill="none" stroke={player.color} strokeWidth="2" strokeDasharray="4 3" opacity="0.5" />
                )}

                {/* Main bubble */}
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={player.color}
                  fillOpacity={isHovered ? 0.35 : isHighlighted ? 0.25 : 0.15}
                  stroke={player.color}
                  strokeWidth={isHighlighted ? 2.5 : isHovered ? 2 : 1.5}
                  filter={isHighlighted ? 'url(#scatterGlow)' : undefined}
                />

                {/* Inner circle */}
                <circle cx={x} cy={y} r={r * 0.5} fill={player.color} fillOpacity={isHighlighted ? 0.5 : 0.3} />

                {/* Name label */}
                <text
                  x={x}
                  y={y - r - 8}
                  textAnchor="middle"
                  fill={isHighlighted ? player.color : 'var(--pl-text-secondary)'}
                  fontSize={isHighlighted ? 12 : 10}
                  fontWeight={isHighlighted ? 800 : 600}
                  fontFamily="var(--pl-font)"
                >
                  {player.name}
                </text>

                {/* Growth arrow for Lone Star */}
                {isHighlighted && (
                  <text x={x} y={y + 2} textAnchor="middle" dominantBaseline="central" fill={player.color} fontSize="12" fontWeight="800">
                    +12%
                  </text>
                )}

                {/* Hover tooltip */}
                {isHovered && !isHighlighted && (
                  <g>
                    <rect x={x - 70} y={y - r - 44} width={140} height={30} rx={6} fill="var(--pl-chart-tooltip-bg)" stroke="var(--pl-chart-tooltip-border)" />
                    <text x={x} y={y - r - 32} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="12" fontFamily="monospace">
                      {pct(player.marketShare)} share · +{pct(player.growthRate)} YoY
                    </text>
                    <text x={x} y={y - r - 20} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="12" fontFamily="monospace">
                      ~{fmtM(player.revenue)} annual rev
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-2 flex-wrap">
          {MARKET_PLAYERS.map((p) => (
            <div key={p.name} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: p.color, border: p.isHighlighted ? '2px solid #C6A052' : undefined }}
              />
              <span className="text-xs font-mono" style={{ color: p.isHighlighted ? '#C6A052' : 'var(--pl-text-muted)', fontWeight: p.isHighlighted ? 700 : 400 }}>
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* ── Territory Coverage Map ──────────────────── */}
      <LightSectionCard title="Territory Coverage — Texas Operations" className="mb-8">
        <TexasMap
          markers={HOMETOWNS.map((h) => {
            const routes = getRoutesByHometown(h.id);
            const avgAttain = routes.length > 0
              ? routes.reduce((s, r) => s + r.attain, 0) / routes.length
              : 0.95;
            return {
              id: h.id,
              name: h.name,
              lat: h.lat,
              lng: h.lng,
              routes: h.routes,
              accounts: h.accounts,
              attainment: avgAttain,
              isNewAcquisition: h.id === 'lar',
            };
          })}
          connections={[
            { from: [32.7767, -96.7970], to: [33.1032, -96.6706] },
            { from: [32.7767, -96.7970], to: [32.7555, -97.3308] },
            { from: [32.7767, -96.7970], to: [32.3293, -96.6253] },
            { from: [32.3293, -96.6253], to: [27.8006, -97.3964] },
            { from: [27.8006, -97.3964], to: [27.5036, -99.5076] },
          ]}
          height={480}
        />
      </LightSectionCard>

      {/* ── Acquisition Timeline ─────────────────────── */}
      <LightSectionCard title="Growth Through Acquisition" className="mb-8">
        <div className="relative pl-8">
          <div className="absolute left-[13px] top-0 bottom-0 w-[2px]" style={{ background: 'linear-gradient(to bottom, #C6A052, #A855F7)' }} />
          {TIMELINE.map((item, i) => (
            <div key={i} className="relative mb-6 last:mb-0">
              <div className="absolute left-[-21px] w-[18px] h-[18px] rounded-full border-2 border-white" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}40`, top: '2px' }} />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-bold font-mono px-2 py-0.5 rounded" style={{ background: `${item.color}12`, color: item.color }}>{item.year}</span>
                  <span className="text-[14px] font-bold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>{item.title}</span>
                </div>
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* ── Growth Vectors ───────────────────────────── */}
      <div className="mb-8">
        <div className="text-[13px] uppercase tracking-[1.5px] font-mono mb-4" style={{ color: 'var(--pl-text-muted)' }}>Growth Vectors</div>
        <div className="grid grid-cols-3 gap-4">
          {GROWTH_VECTORS.map((v) => (
            <div
              key={v.title}
              className="rounded-xl border p-5 hover:shadow-md transition-shadow"
              style={{ background: 'var(--pl-card)', borderColor: 'var(--pl-border)', borderTop: `3px solid ${v.accent}`, boxShadow: 'var(--pl-shadow)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-bold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>{v.title}</span>
                <span className="text-[13px] font-bold font-mono px-2 py-0.5 rounded-full" style={{ background: `${v.accent}12`, color: v.accent }}>{v.stat}</span>
              </div>
              <p className="text-[12px] leading-relaxed mb-3" style={{ color: 'var(--pl-text-muted)' }}>{v.desc}</p>
              <div className="text-xs font-mono uppercase" style={{ color: 'var(--pl-text-faint)' }}>Focus: {v.areas}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lone Star Advantage */}
      <div className="rounded-lg px-4 py-3 text-[12px]" style={{ background: 'rgba(198,160,82,0.06)', color: 'var(--pl-text-muted)' }}>
        <strong style={{ color: '#C6A052' }}>Lone Star Advantage:</strong>{' '}
        Molson Coors + Constellation + Heineken alignment covers 81% of portfolio.
        Sazerac spirits partnership creates a differentiated position against beer-only competitors in South Texas.
        At 22% share with +12% YoY growth, Lone Star is on track to overtake Iron Creek by FY2027.
      </div>

    </>
  );
}
