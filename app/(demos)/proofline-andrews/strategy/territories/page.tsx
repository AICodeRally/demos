'use client';

import Link from 'next/link';
import { ActNavigation, LightSectionCard, LightKpiCard, Sparkline } from '@/components/demos/proofline';
import {
  HOMETOWNS,
  ROUTES,
  TOTAL_ROUTES,
  TOTAL_ACCOUNTS,
  getRoutesByHometown,
  getSellersByHometown,
  type Hometown,
} from '@/data/proofline';
import { fmt, fmtM, fmtK, pct } from '@/lib/utils';

/* ── Performance Tiers ──────────────────────── */
function getPerformanceTier(hometown: Hometown): { label: string; color: string; bg: string } {
  const routes = getRoutesByHometown(hometown.id);
  const avgAttain = routes.reduce((s, r) => s + r.attain, 0) / routes.length;
  if (avgAttain >= 1.0) return { label: 'On Track', color: '#22C55E', bg: 'rgba(34,197,94,0.08)' };
  if (avgAttain >= 0.95) return { label: 'Watch', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' };
  return { label: 'At Risk', color: '#F87171', bg: 'rgba(248,113,113,0.08)' };
}

/* ── Hex grid constants ──────────────────────── */
const HEX_W = 780;
const HEX_H = 500;

// Flat-top hexagon: width = 2*r, height = sqrt(3)*r
function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

// Hex grid layout: 2 rows (North TX top, South TX bottom)
// Row 1: Dallas, Allen, Fort Worth, Ennis (4 hexes)
// Row 2: Corpus Christi, Laredo (2 hexes, centered)
const HEX_R = 90;
const ROW_GAP = HEX_R * Math.sqrt(3) + 20;

interface HexLayout {
  id: string;
  cx: number;
  cy: number;
  r: number;
}

function getHexLayout(): HexLayout[] {
  const topY = HEX_H / 2 - ROW_GAP / 2 + 10;
  const botY = topY + ROW_GAP;
  const colW = HEX_R * 1.75;

  // North TX row (4 hexes centered)
  const northStart = HEX_W / 2 - colW * 1.5;
  const northIds = ['dal', 'aln', 'ftw', 'ens'];

  // South TX row (2 hexes centered)
  const southStart = HEX_W / 2 - colW * 0.5;
  const southIds = ['crp', 'lar'];

  return [
    ...northIds.map((id, i) => ({
      id,
      cx: northStart + i * colW,
      cy: topY,
      r: HEX_R,
    })),
    ...southIds.map((id, i) => ({
      id,
      cx: southStart + i * colW,
      cy: botY,
      r: HEX_R,
    })),
  ];
}

/* ── Attainment color gradient ───────────────── */
function attainGradient(attain: number): { fill: string; stroke: string; opacity: number } {
  if (attain >= 1.02) return { fill: '#22C55E', stroke: '#16A34A', opacity: 0.25 };
  if (attain >= 1.0) return { fill: '#22C55E', stroke: '#22C55E', opacity: 0.18 };
  if (attain >= 0.97) return { fill: '#F59E0B', stroke: '#D97706', opacity: 0.20 };
  if (attain >= 0.95) return { fill: '#F59E0B', stroke: '#F59E0B', opacity: 0.15 };
  return { fill: '#F87171', stroke: '#DC2626', opacity: 0.20 };
}

export default function TerritoryDesignPage() {
  const avgCompanyAttain = ROUTES.reduce((s, r) => s + r.attain, 0) / ROUTES.length;
  const avgDisplayCompliance = ROUTES.reduce((s, r) => s + r.displayCompliance, 0) / ROUTES.length;
  const totalSpiritsAccounts = ROUTES.reduce((s, r) => s + r.spiritsAccounts, 0);
  const hexLayout = getHexLayout();

  return (
    <>

      <ActNavigation currentAct={2} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-[10px] tracking-[3px] uppercase font-mono mb-1" style={{ color: '#7C3AED' }}>
          Territory Design &middot; 6 Hometowns
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}>
          North &amp; South Texas Coverage
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          {TOTAL_ROUTES} routes across {HOMETOWNS.length} distribution hometowns &middot; {fmt(TOTAL_ACCOUNTS)} total accounts
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <LightKpiCard label="Total Routes" value={String(TOTAL_ROUTES)} accent="#7C3AED" />
        <LightKpiCard label="Avg Attainment" value={pct(avgCompanyAttain)} accent={avgCompanyAttain >= 1.0 ? '#22C55E' : '#F59E0B'} />
        <LightKpiCard label="Display Compliance" value={pct(avgDisplayCompliance)} accent="#2563EB" />
        <LightKpiCard label="Spirits Accounts" value={fmt(totalSpiritsAccounts)} accent="#F87171" sub={`${pct(totalSpiritsAccounts / TOTAL_ACCOUNTS)} penetration`} />
      </div>

      {/* ── Hex Territory Grid ────────────────────────── */}
      <LightSectionCard title="Territory Heatmap — Attainment by Hometown" className="mb-6">
        <svg viewBox={`0 0 ${HEX_W} ${HEX_H}`} className="w-full" style={{ height: 480 }}>
          <defs>
            <filter id="hexGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Region labels */}
          <text x={HEX_W / 2} y={22} textAnchor="middle" fill="#7C3AED" fontSize="11" fontWeight="600" fontFamily="monospace" opacity="0.5">
            NORTH TEXAS
          </text>
          <text x={HEX_W / 2} y={HEX_H - 8} textAnchor="middle" fill="#7C3AED" fontSize="11" fontWeight="600" fontFamily="monospace" opacity="0.5">
            SOUTH TEXAS
          </text>

          {/* Connection lines between hexes */}
          {hexLayout.map((h1, i) =>
            hexLayout.slice(i + 1).map((h2) => {
              const dist = Math.sqrt((h1.cx - h2.cx) ** 2 + (h1.cy - h2.cy) ** 2);
              if (dist > HEX_R * 4) return null;
              return (
                <line
                  key={`${h1.id}-${h2.id}`}
                  x1={h1.cx}
                  y1={h1.cy}
                  x2={h2.cx}
                  y2={h2.cy}
                  stroke="var(--pl-chart-grid)"
                  strokeWidth="1"
                  strokeDasharray="6 4"
                />
              );
            })
          )}

          {/* Hex cells */}
          {hexLayout.map((hex) => {
            const hometown = HOMETOWNS.find(h => h.id === hex.id);
            if (!hometown) return null;

            const routes = getRoutesByHometown(hometown.id);
            const sellers = getSellersByHometown(hometown.id);
            const avgAttain = routes.reduce((s, r) => s + r.attain, 0) / routes.length;
            const atRiskCount = sellers.filter(s => s.atRisk).length;
            const grad = attainGradient(avgAttain);

            return (
              <Link key={hex.id} href={`/proofline-andrews/strategy/territories/${hex.id}`}>
                <g style={{ cursor: 'pointer' }} className="group">
                  {/* Hex background */}
                  <polygon
                    points={hexPoints(hex.cx, hex.cy, hex.r)}
                    fill={grad.fill}
                    fillOpacity={grad.opacity}
                    stroke={grad.stroke}
                    strokeWidth="2"
                    className="transition-all duration-200"
                  />

                  {/* Inner hex border */}
                  <polygon
                    points={hexPoints(hex.cx, hex.cy, hex.r - 6)}
                    fill="none"
                    stroke={grad.stroke}
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                    opacity="0.3"
                  />

                  {/* Hometown name */}
                  <text
                    x={hex.cx}
                    y={hex.cy - 32}
                    textAnchor="middle"
                    fill="var(--pl-text)"
                    fontSize="14"
                    fontWeight="800"
                    fontFamily="'Space Grotesk', sans-serif"
                  >
                    {hometown.name.replace(' HQ', '')}
                  </text>

                  {/* Route prefix badge */}
                  <rect
                    x={hex.cx - 18}
                    y={hex.cy - 22}
                    width={36}
                    height={16}
                    rx={4}
                    fill={grad.stroke}
                    fillOpacity={0.15}
                  />
                  <text
                    x={hex.cx}
                    y={hex.cy - 11}
                    textAnchor="middle"
                    fill={grad.stroke}
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="monospace"
                  >
                    {hometown.routePrefix}
                  </text>

                  {/* Attainment - hero number */}
                  <text
                    x={hex.cx}
                    y={hex.cy + 12}
                    textAnchor="middle"
                    fill={grad.stroke}
                    fontSize="22"
                    fontWeight="800"
                    fontFamily="'Space Grotesk', sans-serif"
                  >
                    {pct(avgAttain)}
                  </text>

                  {/* Stats line */}
                  <text
                    x={hex.cx}
                    y={hex.cy + 30}
                    textAnchor="middle"
                    fill="var(--pl-text-muted)"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {hometown.routes} routes · {fmtM(hometown.rev)} · {fmt(hometown.accounts)} accts
                  </text>

                  {/* At risk indicator */}
                  {atRiskCount > 0 && (
                    <>
                      <circle cx={hex.cx} cy={hex.cy + 45} r={8} fill="#F87171" fillOpacity={0.15} />
                      <text
                        x={hex.cx}
                        y={hex.cy + 49}
                        textAnchor="middle"
                        fill="#F87171"
                        fontSize="9"
                        fontWeight="700"
                        fontFamily="monospace"
                      >
                        {atRiskCount}
                      </text>
                      <text
                        x={hex.cx + 14}
                        y={hex.cy + 49}
                        fill="#F87171"
                        fontSize="8"
                        fontFamily="monospace"
                      >
                        at risk
                      </text>
                    </>
                  )}

                  {/* Manager name */}
                  <text
                    x={hex.cx}
                    y={hex.cy + 62}
                    textAnchor="middle"
                    fill="var(--pl-text-faint)"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    Mgr: {hometown.manager}
                  </text>

                  {/* Route dots around the bottom of hex */}
                  {routes.map((route, i) => {
                    const angle = (Math.PI / (routes.length + 1)) * (i + 1) + Math.PI * 0.5;
                    const dotR = hex.r - 14;
                    const dx = hex.cx + Math.cos(angle) * dotR;
                    const dy = hex.cy + Math.sin(angle) * dotR;
                    const clr = route.attain >= 1.0 ? '#22C55E' : route.attain >= 0.95 ? '#F59E0B' : '#F87171';
                    return (
                      <circle
                        key={route.id}
                        cx={dx}
                        cy={dy}
                        r={3.5}
                        fill={clr}
                        fillOpacity={0.7}
                        stroke="white"
                        strokeWidth={1}
                      />
                    );
                  })}
                </g>
              </Link>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-2 text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-3 rounded" style={{ background: '#22C55E', opacity: 0.25 }} />
            On Track (≥100%)
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-3 rounded" style={{ background: '#F59E0B', opacity: 0.20 }} />
            Watch (95–99%)
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-3 rounded" style={{ background: '#F87171', opacity: 0.20 }} />
            At Risk (&lt;95%)
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#22C55E', opacity: 0.7 }} />
            Route ≥100%
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#F87171', opacity: 0.7 }} />
            Route &lt;95%
          </div>
        </div>
      </LightSectionCard>

      {/* Hometown Cards Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {HOMETOWNS.map((h) => {
          const tier = getPerformanceTier(h);
          const routes = getRoutesByHometown(h.id);
          const sellers = getSellersByHometown(h.id);
          const avgAttain = routes.reduce((s, r) => s + r.attain, 0) / routes.length;
          const atRiskCount = sellers.filter(s => s.atRisk).length;
          const avgSparkline = routes[0]?.weeklyAttainment ?? [];

          return (
            <Link key={h.id} href={`/proofline-andrews/strategy/territories/${h.id}`} className="group">
              <div
                className="rounded-xl border p-5 transition-shadow hover:shadow-lg"
                style={{ background: 'var(--pl-card)', borderColor: 'var(--pl-border)', boxShadow: 'var(--pl-shadow)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[15px] font-bold" style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}>
                        {h.name}
                      </h3>
                      <span
                        className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full"
                        style={{ background: tier.bg, color: tier.color }}
                      >
                        {tier.label}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                      {h.profile} &middot; {h.acquired.split(' — ')[0]}
                    </div>
                  </div>
                  <Sparkline data={avgSparkline} color={tier.color} width={80} height={24} />
                </div>

                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-mono" style={{ color: 'var(--pl-text-muted)' }}>Routes</div>
                    <div className="text-[15px] font-bold" style={{ color: 'var(--pl-text)' }}>{h.routes}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-mono" style={{ color: 'var(--pl-text-muted)' }}>Attainment</div>
                    <div className="text-[15px] font-bold" style={{ color: tier.color }}>{pct(avgAttain)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-mono" style={{ color: 'var(--pl-text-muted)' }}>Revenue</div>
                    <div className="text-[15px] font-bold" style={{ color: 'var(--pl-text)' }}>{fmtM(h.rev * 4)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-mono" style={{ color: 'var(--pl-text-muted)' }}>Cases</div>
                    <div className="text-[15px] font-bold" style={{ color: 'var(--pl-text)' }}>{fmtK(h.cases)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--pl-border)' }}>
                  <div className="text-[12px]" style={{ color: 'var(--pl-text-muted)' }}>
                    <span className="font-semibold" style={{ color: 'var(--pl-text-secondary)' }}>{h.manager}</span> &middot; {h.accounts} accounts
                  </div>
                  {atRiskCount > 0 && (
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full" style={{ background: 'rgba(248,113,113,0.08)', color: '#F87171' }}>
                      {atRiskCount} at risk
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono mt-2" style={{ color: 'var(--pl-text-faint)' }}>
                  {fmt(h.sqft)} sq ft warehouse
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-[11px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#22C55E' }} />
          On Track (≥100%)
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} />
          Watch (95–99%)
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F87171' }} />
          At Risk (&lt;95%)
        </div>
      </div>

    </>
  );
}
