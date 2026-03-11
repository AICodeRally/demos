'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard } from '@/components/demos/proofline';
import { HOMETOWNS } from '@/data/proofline';
import { fmt, fmtM, pct } from '@/lib/utils';

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
        <div className="relative mx-auto" style={{ width: '100%', maxWidth: 680 }}>
          <svg viewBox="0 0 680 520" className="w-full" style={{ height: 520 }}>
            <defs>
              <filter id="glow-gold" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <filter id="glow-blue" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <radialGradient id="dfw-zone" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#C6A052" stopOpacity="0.12" /><stop offset="100%" stopColor="#C6A052" stopOpacity="0.02" /></radialGradient>
              <radialGradient id="central-zone" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#F59E0B" stopOpacity="0.10" /><stop offset="100%" stopColor="#F59E0B" stopOpacity="0.01" /></radialGradient>
              <radialGradient id="south-zone" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#F87171" stopOpacity="0.10" /><stop offset="100%" stopColor="#F87171" stopOpacity="0.01" /></radialGradient>
            </defs>

            {/* Texas state outline — simplified but recognizable */}
            <path
              d="M 198 18 L 440 18 L 440 42 L 468 42 L 468 18 L 510 18 L 510 56 L 540 56 L 540 90 L 556 90 L 556 114 L 574 114 L 574 142 L 590 160 L 602 186 L 610 214 L 612 244 L 608 270 L 598 296 L 582 320 L 560 344 L 534 368 L 506 388 L 480 404 L 452 418 L 420 432 L 384 446 L 346 460 L 308 472 L 272 480 L 238 484 L 206 486 L 178 482 L 148 470 L 130 454 L 118 436 L 108 414 L 100 388 L 94 360 L 90 330 L 88 296 L 88 262 L 90 228 L 94 196 L 100 166 L 108 140 L 118 118 L 130 98 L 144 80 L 160 62 L 176 46 L 190 32 L 198 18 Z"
              fill="var(--pl-map-bg)"
              stroke="var(--pl-border)"
              strokeWidth="2"
            />

            {/* Territory coverage zones */}
            <ellipse cx="430" cy="130" rx="100" ry="65" fill="url(#dfw-zone)" stroke="#C6A052" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7" />
            <ellipse cx="380" cy="250" rx="60" ry="45" fill="url(#central-zone)" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
            <ellipse cx="280" cy="420" rx="90" ry="45" fill="url(#south-zone)" stroke="#F87171" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />

            {/* Connection routes between territories */}
            <path d="M 430 180 Q 410 220 380 240" fill="none" stroke="var(--pl-border)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
            <path d="M 380 280 Q 340 340 280 400" fill="none" stroke="var(--pl-border)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />

            {/* Zone labels */}
            <text x="430" y="80" textAnchor="middle" fill="#C6A052" fontSize="13" fontWeight="700" fontFamily="var(--pl-font)" letterSpacing="2">DFW METRO</text>
            <text x="380" y="218" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="600" fontFamily="var(--pl-font)" letterSpacing="1">CENTRAL</text>
            <text x="280" y="388" textAnchor="middle" fill="#F87171" fontSize="12" fontWeight="600" fontFamily="var(--pl-font)" letterSpacing="1">SOUTH TEXAS</text>

            {/* City markers with labels */}
            {([
              { id: 'dal', label: 'Dallas', sub: 'HQ', x: 460, y: 118, color: '#C6A052', r: 8 },
              { id: 'ftw', label: 'Fort Worth', sub: null, x: 380, y: 130, color: '#2563EB', r: 6 },
              { id: 'aln', label: 'Allen', sub: null, x: 470, y: 96, color: '#2563EB', r: 5 },
              { id: 'ens', label: 'Ennis', sub: 'ACQ', x: 400, y: 248, color: '#F59E0B', r: 6 },
              { id: 'crp', label: 'Corpus Christi', sub: null, x: 340, y: 440, color: '#2563EB', r: 6 },
              { id: 'lar', label: 'Laredo', sub: 'ACQ', x: 210, y: 430, color: '#F59E0B', r: 6 },
            ] as const).map((city) => {
              const ht = HOMETOWNS.find(h => h.id === city.id);
              return (
                <g key={city.id}>
                  {/* Pulse ring for HQ */}
                  {city.sub === 'HQ' && <circle cx={city.x} cy={city.y} r={16} fill={city.color} opacity="0.15" />}
                  {/* Marker */}
                  <circle cx={city.x} cy={city.y} r={city.r} fill={city.color} stroke="var(--pl-card)" strokeWidth="2" filter={city.sub === 'HQ' ? 'url(#glow-gold)' : 'url(#glow-blue)'} />
                  {/* Label card */}
                  <rect x={city.x + 14} y={city.y - 18} width={city.label.length * 8 + (city.sub ? 36 : 8)} height="36" rx="6" fill="var(--pl-card)" stroke="var(--pl-border)" strokeWidth="1" />
                  <text x={city.x + 20} y={city.y - 2} fill="var(--pl-text)" fontSize="13" fontWeight="700" fontFamily="var(--pl-font)">{city.label}</text>
                  {city.sub && <text x={city.x + 22 + city.label.length * 8} y={city.y - 2} fill={city.color} fontSize="12" fontWeight="800">{city.sub}</text>}
                  {ht && <text x={city.x + 20} y={city.y + 12} fill="var(--pl-text-muted)" fontSize="12" fontFamily="monospace">{ht.routes} routes · {fmt(ht.accounts)} accts</text>}
                </g>
              );
            })}

            {/* Legend */}
            <rect x="16" y="470" width="280" height="34" rx="8" fill="var(--pl-card)" stroke="var(--pl-border)" strokeWidth="1" />
            <circle cx="36" cy="487" r="5" fill="#C6A052" /><text x="48" y="491" fill="var(--pl-text-muted)" fontSize="12">HQ</text>
            <circle cx="86" cy="487" r="5" fill="#2563EB" /><text x="98" y="491" fill="var(--pl-text-muted)" fontSize="12">Established</text>
            <circle cx="186" cy="487" r="5" fill="#F59E0B" /><text x="198" y="491" fill="var(--pl-text-muted)" fontSize="12">Acquired</text>
          </svg>
        </div>
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
