'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard } from '@/components/demos/proofline';
import { HOMETOWNS } from '@/data/proofline';
import { fmt, fmtM, pct } from '@/lib/utils';

/* ── Market participants (Lone Star + competitors) ───── */
interface MarketPlayer {
  name: string;
  marketShare: number;   // 0–1
  growthRate: number;     // YoY growth (0–1)
  revenue: number;        // annual revenue estimate
  color: string;
  isCompany?: boolean;
  categories: string;
}

const MARKET_PLAYERS: MarketPlayer[] = [
  {
    name: 'Lone Star Beverage',
    marketShare: 0.22,
    growthRate: 0.12,
    revenue: 128000000,
    color: '#C6A052',
    isCompany: true,
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

/* ── Hometown map positions ──────────────────────────── */
const HOMETOWN_POSITIONS: Record<string, { top: string; left: string }> = {
  dal: { top: '22%', left: '58%' },
  aln: { top: '16%', left: '62%' },
  ftw: { top: '24%', left: '48%' },
  ens: { top: '34%', left: '56%' },
  crp: { top: '78%', left: '52%' },
  lar: { top: '82%', left: '32%' },
};

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
          style={{ color: '#1A1A2E', fontFamily: 'var(--pl-font)' }}
        >
          Market Position &amp; Growth
        </h1>
        <p className="text-[13px]" style={{ color: '#718096' }}>
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
            <linearGradient id="companyGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C6A052" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C6A052" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid background */}
          <rect x={PAD.left} y={PAD.top} width={INNER_W} height={INNER_H} fill="#FAFBFC" rx="4" />

          {/* Grid lines - horizontal */}
          {[0, 0.04, 0.08, 0.12].map((g) => {
            const y = toPlotY(g);
            return (
              <g key={g}>
                <line x1={PAD.left} y1={y} x2={PAD.left + INNER_W} y2={y} stroke="#E2E8F0" strokeWidth="1" />
                <text x={PAD.left - 8} y={y + 4} textAnchor="end" fill="#A0AEC0" fontSize="12" fontFamily="monospace">
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
                <line x1={x} y1={PAD.top} x2={x} y2={PAD.top + INNER_H} stroke="#E2E8F0" strokeWidth="1" />
                <text x={x} y={PAD.top + INNER_H + 18} textAnchor="middle" fill="#A0AEC0" fontSize="12" fontFamily="monospace">
                  {(s * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}

          {/* Axis labels */}
          <text x={PAD.left + INNER_W / 2} y={PLOT_H - 8} textAnchor="middle" fill="#718096" fontSize="12" fontWeight="600" fontFamily="var(--pl-font)">
            Market Share →
          </text>
          <text
            x={16}
            y={PAD.top + INNER_H / 2}
            textAnchor="middle"
            fill="#718096"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--pl-font)"
            transform={`rotate(-90, 16, ${PAD.top + INNER_H / 2})`}
          >
            YoY Growth →
          </text>

          {/* Quadrant labels */}
          <text x={PAD.left + 8} y={PAD.top + 14} fill="#A0AEC0" fontSize="12" fontFamily="monospace" opacity="0.6">
            LOW SHARE / HIGH GROWTH
          </text>
          <text x={PAD.left + INNER_W - 8} y={PAD.top + 14} textAnchor="end" fill="#A0AEC0" fontSize="12" fontFamily="monospace" opacity="0.6">
            HIGH SHARE / HIGH GROWTH
          </text>

          {/* Company highlight zone */}
          {(() => {
            const company = MARKET_PLAYERS[0];
            const ax = toPlotX(company.marketShare);
            const ay = toPlotY(company.growthRate);
            return (
              <circle cx={ax} cy={ay} r={60} fill="url(#companyGlow)" />
            );
          })()}

          {/* Player bubbles */}
          {MARKET_PLAYERS.map((player) => {
            const x = toPlotX(player.marketShare);
            const y = toPlotY(player.growthRate);
            const r = revToRadius(player.revenue);
            const isHovered = hoveredPlayer === player.name;
            const isCompany = player.isCompany;

            return (
              <g
                key={player.name}
                onMouseEnter={() => setHoveredPlayer(player.name)}
                onMouseLeave={() => setHoveredPlayer(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer ring for company */}
                {isCompany && (
                  <circle cx={x} cy={y} r={r + 6} fill="none" stroke={player.color} strokeWidth="2" strokeDasharray="4 3" opacity="0.5" />
                )}

                {/* Main bubble */}
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={player.color}
                  fillOpacity={isHovered ? 0.35 : isCompany ? 0.25 : 0.15}
                  stroke={player.color}
                  strokeWidth={isCompany ? 2.5 : isHovered ? 2 : 1.5}
                  filter={isCompany ? 'url(#scatterGlow)' : undefined}
                />

                {/* Inner circle */}
                <circle cx={x} cy={y} r={r * 0.5} fill={player.color} fillOpacity={isCompany ? 0.5 : 0.3} />

                {/* Name label */}
                <text
                  x={x}
                  y={y - r - 8}
                  textAnchor="middle"
                  fill={isCompany ? player.color : '#4A5568'}
                  fontSize={isCompany ? 12 : 10}
                  fontWeight={isCompany ? 800 : 600}
                  fontFamily="var(--pl-font)"
                >
                  {player.name}
                </text>

                {/* Growth arrow for company */}
                {isCompany && (
                  <text x={x} y={y + 2} textAnchor="middle" dominantBaseline="central" fill={player.color} fontSize="12" fontWeight="800">
                    +12%
                  </text>
                )}

                {/* Hover tooltip */}
                {isHovered && !isCompany && (
                  <g>
                    <rect x={x - 70} y={y - r - 44} width={140} height={30} rx={6} fill="white" stroke="#E2E8F0" />
                    <text x={x} y={y - r - 32} textAnchor="middle" fill="#718096" fontSize="12" fontFamily="monospace">
                      {pct(player.marketShare)} share · +{pct(player.growthRate)} YoY
                    </text>
                    <text x={x} y={y - r - 20} textAnchor="middle" fill="#718096" fontSize="12" fontFamily="monospace">
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
                style={{ background: p.color, border: p.isCompany ? '2px solid #C6A052' : undefined }}
              />
              <span className="text-xs font-mono" style={{ color: p.isCompany ? '#C6A052' : '#718096', fontWeight: p.isCompany ? 700 : 400 }}>
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* ── Texas Territory Map ──────────────────────── */}
      <LightSectionCard title="Texas Territory Map" className="mb-8">
        <div className="relative mx-auto" style={{ width: '100%', maxWidth: 640, height: 420 }}>
          <svg viewBox="0 0 700 520" className="absolute inset-0 w-full h-full" fill="none">
            <defs>
              <radialGradient id="zone-north" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.02" />
              </radialGradient>
              <radialGradient id="zone-south" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
              </radialGradient>
              <radialGradient id="zone-border" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
              </radialGradient>
            </defs>

            {/* Proper Texas state outline */}
            <path
              d="M 198 18 L 440 18 L 440 42 L 468 42 L 468 18 L 510 18 L 510 56 L 540 56 L 540 90 L 556 90 L 556 114 L 574 114 L 574 142 L 590 160 L 602 186 L 610 214 L 612 244 L 608 270 L 598 296 L 582 320 L 560 344 L 534 368 L 506 388 L 480 404 L 452 418 L 420 432 L 384 446 L 346 460 L 308 472 L 272 480 L 238 484 L 206 486 L 178 482 L 148 470 L 130 454 L 118 436 L 108 414 L 100 388 L 94 360 L 90 330 L 88 296 L 88 262 L 90 228 L 94 196 L 100 166 L 108 140 L 118 118 L 130 98 L 144 80 L 160 62 L 176 46 L 190 32 L 198 18 Z"
              stroke="#CBD5E1" strokeWidth="2" fill="rgba(198,160,82,0.03)"
            />

            {/* Territory zone ellipses */}
            <ellipse cx="430" cy="110" rx="140" ry="80" fill="url(#zone-north)" />
            <ellipse cx="300" cy="380" rx="120" ry="70" fill="url(#zone-south)" />
            <ellipse cx="180" cy="440" rx="90" ry="50" fill="url(#zone-border)" />

            {/* Watermark */}
            <text x="350" y="280" fill="#E2E8F0" fontSize="64" fontWeight="bold" fontFamily="var(--pl-font)" textAnchor="middle" opacity="0.35">TX</text>

            {/* Zone labels */}
            <text x="430" y="60" textAnchor="middle" fill="#7C3AED" fontSize="12" fontWeight="600" fontFamily="monospace" opacity="0.6">NORTH TEXAS</text>
            <text x="300" y="332" textAnchor="middle" fill="#2563EB" fontSize="12" fontWeight="600" fontFamily="monospace" opacity="0.6">SOUTH TEXAS</text>
            <text x="180" y="400" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="600" fontFamily="monospace" opacity="0.6">BORDER</text>

            {/* City markers */}
            {[
              { id: 'dal', x: 460, y: 100, color: '#C6A052' },
              { id: 'aln', x: 500, y: 80, color: '#2563EB' },
              { id: 'ftw', x: 390, y: 110, color: '#2563EB' },
              { id: 'ens', x: 440, y: 150, color: '#F59E0B' },
              { id: 'crp', x: 340, y: 400, color: '#2563EB' },
              { id: 'lar', x: 200, y: 450, color: '#F59E0B' },
            ].map((city) => {
              const ht = HOMETOWNS.find((h) => h.id === city.id);
              if (!ht) return null;
              return (
                <g key={city.id}>
                  <circle cx={city.x} cy={city.y} r="16" fill={city.color} fillOpacity="0.12" />
                  <circle cx={city.x} cy={city.y} r="5" fill={city.color} stroke="white" strokeWidth="2" />
                  <text x={city.x + 12} y={city.y - 6} fill="#1A1A2E" fontSize="13" fontWeight="700" fontFamily="var(--pl-font)">{ht.name.replace(' HQ', '')}</text>
                  <text x={city.x + 12} y={city.y + 8} fill="#718096" fontSize="12" fontFamily="monospace">{ht.routes} routes &middot; {fmt(ht.accounts)} accts</text>
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-2 left-2 flex items-center gap-4 text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.9)', color: '#718096' }}>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#C6A052' }} />HQ</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#2563EB' }} />Established</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} />Acquired</div>
          </div>
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
                  <span className="text-[14px] font-bold" style={{ color: '#1A1A2E', fontFamily: 'var(--pl-font)' }}>{item.title}</span>
                </div>
                <p className="text-[12px] leading-relaxed" style={{ color: '#718096' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* ── Growth Vectors ───────────────────────────── */}
      <div className="mb-8">
        <div className="text-[13px] uppercase tracking-[1.5px] font-mono mb-4" style={{ color: '#718096' }}>Growth Vectors</div>
        <div className="grid grid-cols-3 gap-4">
          {GROWTH_VECTORS.map((v) => (
            <div
              key={v.title}
              className="rounded-xl border bg-white p-5 hover:shadow-md transition-shadow"
              style={{ borderColor: '#E2E8F0', borderTop: `3px solid ${v.accent}`, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-bold" style={{ color: '#1A1A2E', fontFamily: 'var(--pl-font)' }}>{v.title}</span>
                <span className="text-[13px] font-bold font-mono px-2 py-0.5 rounded-full" style={{ background: `${v.accent}12`, color: v.accent }}>{v.stat}</span>
              </div>
              <p className="text-[12px] leading-relaxed mb-3" style={{ color: '#718096' }}>{v.desc}</p>
              <div className="text-xs font-mono uppercase" style={{ color: '#A0AEC0' }}>Focus: {v.areas}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lone Star Advantage */}
      <div className="rounded-lg px-4 py-3 text-[12px]" style={{ background: 'rgba(198,160,82,0.06)', color: '#718096' }}>
        <strong style={{ color: '#C6A052' }}>Lone Star Advantage:</strong>{' '}
        Molson Coors + Constellation + Heineken alignment covers 81% of portfolio.
        Sazerac spirits partnership creates a differentiated position against beer-only competitors in South Texas.
        At 22% share with +12% YoY growth, Lone Star is on track to overtake Iron Creek by FY2027.
      </div>
    
    </>
  );
}
