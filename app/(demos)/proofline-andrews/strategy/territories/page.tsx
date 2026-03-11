'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ActNavigation, LightSectionCard, LightKpiCard, ScatterQuadrant, Sparkline } from '@/components/demos/proofline';
import {
  HOMETOWNS,
  ROUTES,
  TOTAL_ROUTES,
  TOTAL_ACCOUNTS,
  getRoutesByHometown,
  getSellersByHometown,
  COVERAGE_METRICS,
  COVERAGE_POINTS,
  getCoverageByHometown,
  type Hometown,
  type CoverageMetric,
  type CoveragePoint,
} from '@/data/proofline';
import { fmt, fmtM, fmtK, pct } from '@/lib/utils';

const TexasMap = dynamic(
  () => import('@/components/demos/proofline/TexasMap').then(m => m.TexasMap),
  { ssr: false, loading: () => <div style={{ height: 360, background: 'var(--pl-card)' }} /> }
);

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

function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

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

  const northStart = HEX_W / 2 - colW * 1.5;
  const northIds = ['dal', 'aln', 'ftw', 'ens'];

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

/* ── Workload color gradient ─────────────────── */
function workloadGradient(idx: number): { fill: string; opacity: number } {
  if (idx > 120) return { fill: '#F87171', opacity: 0.25 };
  if (idx > 110) return { fill: '#F59E0B', opacity: 0.20 };
  if (idx >= 90) return { fill: '#22C55E', opacity: 0.20 };
  return { fill: '#3B82F6', opacity: 0.20 };
}

export default function TerritoryDesignPage() {
  const [mapView, setMapView] = useState<'revenue' | 'workload'>('revenue');
  const [simulatorOpen, setSimulatorOpen] = useState(false);

  const avgCompanyAttain = ROUTES.reduce((s, r) => s + r.attain, 0) / ROUTES.length;
  const hexLayout = getHexLayout();

  /* ── KPI computations ──────────────────── */
  const avgAccountsPerRoute = COVERAGE_METRICS.reduce((s, c) => s + c.accountsPerRoute, 0) / COVERAGE_METRICS.length;
  const avgRevenuePerRoute = COVERAGE_METRICS.reduce((s, c) => s + c.revenuePerRoute, 0) / COVERAGE_METRICS.length;
  const avgStopsPerDay = COVERAGE_METRICS.reduce((s, c) => s + c.stopsPerDay, 0) / COVERAGE_METRICS.length;
  const avgWindshield = COVERAGE_METRICS.reduce((s, c) => s + c.windshieldTimePct, 0) / COVERAGE_METRICS.length;
  const workloadIndices = COVERAGE_METRICS.map(c => c.workloadIndex);
  const mean = workloadIndices.reduce((s, v) => s + v, 0) / workloadIndices.length;
  const cv = Math.sqrt(workloadIndices.reduce((s, v) => s + (v - mean) ** 2, 0) / workloadIndices.length) / mean;
  const coverageRatio = 0.91;

  /* ── Scatter data ──────────────────────── */
  const scatterPoints = COVERAGE_POINTS.map(p => ({
    x: p.annualRevenue,
    y: p.visitsPerMonth,
    size: Math.max(4, Math.min(16, p.casesPerMonth / 50)),
    color: p.tier === 'A' ? '#22C55E' : p.tier === 'B' ? '#3B82F6' : p.tier === 'C' ? '#F59E0B' : '#94A3B8',
    label: `${p.accountName} (${p.tier}) — $${fmt(p.annualRevenue)}/yr, ${p.visitsPerMonth} visits/mo`,
  }));

  /* ── Rebalancing simulator data ────────── */
  const imbalancedRoutes = COVERAGE_METRICS.filter(r => r.workloadIndex > 115 || r.workloadIndex < 85);
  const rebalancedRows = imbalancedRoutes.map(r => {
    const isOverloaded = r.workloadIndex > 115;
    const adjustPct = isOverloaded ? -0.12 : 0.15;
    const proposedAccounts = Math.round(r.accountsPerRoute * (1 + adjustPct));
    const proposedWorkload = Math.round(r.workloadIndex * (proposedAccounts / r.accountsPerRoute));
    return {
      ...r,
      proposedAccounts,
      proposedWorkload,
      delta: proposedWorkload - r.workloadIndex,
    };
  });
  const originalVariance = cv * 100;
  const proposedVariance = Math.max(originalVariance - 3.2, 6.5);

  return (
    <>
      <ActNavigation currentAct={2} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#7C3AED' }}>
          Territory &amp; Coverage &middot; 6 Hometowns
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          North &amp; South Texas Coverage
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          {TOTAL_ROUTES} routes across {HOMETOWNS.length} distribution hometowns &middot; {fmt(TOTAL_ACCOUNTS)} total accounts
        </p>
      </div>

      {/* ── Interactive Territory Map ─────────────────── */}
      <LightSectionCard title="Geographic Coverage — Interactive Map" className="mb-6">
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
          height={360}
        />
      </LightSectionCard>

      {/* ── Hex Territory Grid ────────────────────────── */}
      <LightSectionCard title="Territory Heatmap — Attainment by Hometown" className="mb-6">
        {/* View toggle */}
        <div className="flex justify-end mb-3">
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--pl-border)' }}>
            {(['revenue', 'workload'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setMapView(view)}
                className="text-xs font-mono px-3 py-1.5 transition-colors"
                style={{
                  borderColor: mapView === view ? '#C6A052' : 'var(--pl-border)',
                  background: mapView === view ? 'rgba(198,160,82,0.08)' : 'var(--pl-card)',
                  color: mapView === view ? '#C6A052' : 'var(--pl-text-muted)',
                  borderRight: view === 'revenue' ? '1px solid var(--pl-border)' : undefined,
                }}
              >
                {view === 'revenue' ? 'Revenue View' : 'Workload View'}
              </button>
            ))}
          </div>
        </div>

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
          <text x={HEX_W / 2} y={22} textAnchor="middle" fill="#7C3AED" fontSize="12" fontWeight="600" fontFamily="monospace" opacity="0.7">
            NORTH TEXAS
          </text>
          <text x={HEX_W / 2} y={HEX_H - 8} textAnchor="middle" fill="#7C3AED" fontSize="12" fontWeight="600" fontFamily="monospace" opacity="0.7">
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
            const coverageRoutes = getCoverageByHometown(hometown.id);
            const avgWorkload = coverageRoutes.length > 0
              ? Math.round(coverageRoutes.reduce((s, c) => s + c.workloadIndex, 0) / coverageRoutes.length)
              : 100;

            const grad = mapView === 'revenue' ? attainGradient(avgAttain) : (() => {
              const wg = workloadGradient(avgWorkload);
              return { fill: wg.fill, stroke: wg.fill, opacity: wg.opacity };
            })();

            const isLaredo = hex.id === 'lar';
            const heroNumber = mapView === 'revenue' ? pct(avgAttain) : String(avgWorkload);

            return (
              <Link key={hex.id} href={`/proofline-andrews/strategy/territories/${hex.id}`}>
                <g style={{ cursor: 'pointer' }} className="group">
                  {/* Hex background */}
                  <polygon
                    points={hexPoints(hex.cx, hex.cy, hex.r)}
                    fill={grad.fill}
                    fillOpacity={grad.opacity}
                    stroke={grad.stroke}
                    strokeWidth={isLaredo ? 2 : 2}
                    strokeDasharray={isLaredo ? '8 4' : undefined}
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
                    fontFamily="var(--pl-font)"
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
                    fontSize="12"
                    fontWeight="700"
                    fontFamily="monospace"
                  >
                    {hometown.routePrefix}
                  </text>

                  {/* Hero number */}
                  <text
                    x={hex.cx}
                    y={hex.cy + 12}
                    textAnchor="middle"
                    fill={grad.stroke}
                    fontSize="22"
                    fontWeight="800"
                    fontFamily="var(--pl-font)"
                  >
                    {heroNumber}
                  </text>

                  {/* Stats line */}
                  <text
                    x={hex.cx}
                    y={hex.cy + 30}
                    textAnchor="middle"
                    fill="var(--pl-text-muted)"
                    fontSize="12"
                    fontFamily="monospace"
                  >
                    {hometown.routes} routes &middot; {fmtM(hometown.rev)} &middot; {fmt(hometown.accounts)} accts
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
                        fontSize="12"
                        fontWeight="700"
                        fontFamily="monospace"
                      >
                        {atRiskCount}
                      </text>
                      <text
                        x={hex.cx + 14}
                        y={hex.cy + 49}
                        fill="#F87171"
                        fontSize="12"
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
                    fontSize="12"
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

                  {/* NEW 2024 badge for Laredo */}
                  {isLaredo && (
                    <text
                      x={hex.cx}
                      y={hex.cy + hex.r + 14}
                      textAnchor="middle"
                      fill="#F59E0B"
                      fontSize="10"
                      fontWeight="700"
                      fontFamily="monospace"
                    >
                      NEW 2024
                    </text>
                  )}
                </g>
              </Link>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-2 text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
          {mapView === 'revenue' ? (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-3 rounded" style={{ background: '#22C55E', opacity: 0.25 }} />
                On Track (&ge;100%)
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-3 rounded" style={{ background: '#F59E0B', opacity: 0.20 }} />
                Watch (95-99%)
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-3 rounded" style={{ background: '#F87171', opacity: 0.20 }} />
                At Risk (&lt;95%)
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-3 rounded" style={{ background: '#3B82F6', opacity: 0.20 }} />
                Underutilized (&lt;90)
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-3 rounded" style={{ background: '#22C55E', opacity: 0.20 }} />
                Balanced (90-110)
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-3 rounded" style={{ background: '#F59E0B', opacity: 0.20 }} />
                Heavy (110-120)
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-3 rounded" style={{ background: '#F87171', opacity: 0.25 }} />
                Overloaded (&gt;120)
              </div>
            </>
          )}
        </div>
      </LightSectionCard>

      {/* ── KPI Strip (6 cards) ──────────────────────── */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        <LightKpiCard label="Accounts/Route" value={avgAccountsPerRoute.toFixed(1)} accent="#7C3AED" stagger={0} />
        <LightKpiCard label="Revenue/Route" value={fmtM(avgRevenuePerRoute)} accent="#7C3AED" stagger={1} />
        <LightKpiCard label="Stops/Day" value={avgStopsPerDay.toFixed(1)} accent="#2563EB" stagger={2} />
        <LightKpiCard label="Windshield Time" value={pct(avgWindshield)} accent="#F59E0B" stagger={3} />
        <LightKpiCard label="Workload Variance" value={`${(cv * 100).toFixed(1)}% CV`} accent={cv > 0.15 ? '#F87171' : '#22C55E'} stagger={4} />
        <LightKpiCard label="Coverage Ratio" value={pct(coverageRatio)} accent="#22C55E" stagger={5} />
      </div>

      {/* ── Bottom 2-column: Scatter + Workload Bars ── */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Section C — Coverage Efficiency Scatter */}
        <LightSectionCard title="Coverage Efficiency — Account Distribution">
          <ScatterQuadrant
            points={scatterPoints}
            xLabel="Annual Revenue ($)"
            yLabel="Visits / Month"
            xDivider={500000}
            yDivider={4}
            xRange={[0, 5000000]}
            yRange={[0, 12]}
            quadrantLabels={{
              topLeft: 'Over-served',
              topRight: 'Well-covered',
              bottomLeft: 'Efficient',
              bottomRight: 'Under-covered',
            }}
          />
          {/* Tier legend */}
          <div className="flex items-center justify-center gap-4 mt-2 text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
            {([
              { tier: 'A', color: '#22C55E' },
              { tier: 'B', color: '#3B82F6' },
              { tier: 'C', color: '#F59E0B' },
              { tier: 'D', color: '#94A3B8' },
            ] as const).map(t => (
              <div key={t.tier} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                Tier {t.tier}
              </div>
            ))}
          </div>
        </LightSectionCard>

        {/* Section D — Workload Balance Bars */}
        <LightSectionCard title="Workload Balance by Route">
          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
            {HOMETOWNS.map((h) => {
              const metrics = getCoverageByHometown(h.id).sort((a, b) => b.workloadIndex - a.workloadIndex);
              if (metrics.length === 0) return null;
              return (
                <div key={h.id}>
                  <div className="text-[12px] font-bold mb-1.5" style={{ color: 'var(--pl-text)' }}>{h.name}</div>
                  {metrics.map((m) => {
                    const badgeColor = m.workloadIndex > 115 ? '#F87171' : m.workloadIndex >= 100 ? '#F59E0B' : '#22C55E';
                    const badgeBg = m.workloadIndex > 115 ? 'rgba(248,113,113,0.12)' : m.workloadIndex >= 100 ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.12)';
                    return (
                      <div key={m.routeId} className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono w-14 shrink-0" style={{ color: 'var(--pl-text-muted)' }}>{m.routeId}</span>
                        <div className="flex-1 flex h-[14px] rounded-sm overflow-hidden" style={{ background: 'var(--pl-chart-bar-track)' }}>
                          <div style={{ width: `${m.sellingTimePct * 100}%`, background: '#22C55E', opacity: 0.7 }} />
                          <div style={{ width: `${m.drivingTimePct * 100}%`, background: '#F59E0B', opacity: 0.7 }} />
                          <div style={{ width: `${m.adminTimePct * 100}%`, background: '#94A3B8', opacity: 0.7 }} />
                        </div>
                        <span
                          className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0"
                          style={{ background: badgeBg, color: badgeColor }}
                        >
                          {m.workloadIndex}
                        </span>
                      </div>
                    );
                  })}
                  <div className="border-t mt-2" style={{ borderColor: 'var(--pl-border)' }} />
                </div>
              );
            })}
          </div>
          {/* Bar legend */}
          <div className="flex items-center gap-4 mt-2 text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
            <div className="flex items-center gap-1"><div className="w-3 h-2 rounded-sm" style={{ background: '#22C55E', opacity: 0.7 }} />Selling</div>
            <div className="flex items-center gap-1"><div className="w-3 h-2 rounded-sm" style={{ background: '#F59E0B', opacity: 0.7 }} />Driving</div>
            <div className="flex items-center gap-1"><div className="w-3 h-2 rounded-sm" style={{ background: '#94A3B8', opacity: 0.7 }} />Admin</div>
          </div>
        </LightSectionCard>
      </div>

      {/* ── Section E — Rebalancing Simulator ─────────── */}
      <div className="mb-6">
        <button
          onClick={() => setSimulatorOpen(!simulatorOpen)}
          className="flex items-center gap-2 text-[13px] font-mono font-bold px-4 py-2 rounded-lg border transition-colors"
          style={{
            borderColor: simulatorOpen ? '#C6A052' : 'var(--pl-border)',
            background: simulatorOpen ? 'rgba(198,160,82,0.08)' : 'var(--pl-card)',
            color: simulatorOpen ? '#C6A052' : 'var(--pl-text-muted)',
          }}
        >
          {simulatorOpen ? '\u25BC' : '\u25B6'} Rebalancing Simulator
        </button>
        {simulatorOpen && (
          <LightSectionCard title="Proposed Route Rebalancing" className="mt-3">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ color: 'var(--pl-text-muted)' }}>
                  <th className="text-left font-medium pb-2 pl-1">Route</th>
                  <th className="text-left font-medium pb-2">Hometown</th>
                  <th className="text-right font-medium pb-2">Cur. Accounts</th>
                  <th className="text-right font-medium pb-2">Cur. Workload</th>
                  <th className="text-right font-medium pb-2">Prop. Accounts</th>
                  <th className="text-right font-medium pb-2">Prop. Workload</th>
                  <th className="text-right font-medium pb-2 pr-1">Delta</th>
                </tr>
              </thead>
              <tbody>
                {rebalancedRows.map((r, i) => {
                  const htName = HOMETOWNS.find(h => h.id === r.hometownId)?.name ?? r.hometownId;
                  const deltaColor = r.delta < 0 ? '#22C55E' : r.delta > 0 ? '#F87171' : 'var(--pl-text-muted)';
                  return (
                    <tr key={r.routeId} style={i % 2 === 0 ? { background: 'var(--pl-stripe)' } : undefined}>
                      <td className="py-1.5 pl-1 font-mono font-bold" style={{ color: 'var(--pl-text)' }}>{r.routeId}</td>
                      <td className="py-1.5" style={{ color: 'var(--pl-text-muted)' }}>{htName}</td>
                      <td className="py-1.5 text-right font-mono" style={{ color: 'var(--pl-text)' }}>{r.accountsPerRoute}</td>
                      <td className="py-1.5 text-right font-mono" style={{ color: r.workloadIndex > 115 ? '#F87171' : r.workloadIndex < 85 ? '#3B82F6' : 'var(--pl-text)' }}>
                        {r.workloadIndex}
                      </td>
                      <td className="py-1.5 text-right font-mono font-bold" style={{ color: 'var(--pl-text)' }}>{r.proposedAccounts}</td>
                      <td className="py-1.5 text-right font-mono font-bold" style={{ color: '#22C55E' }}>{r.proposedWorkload}</td>
                      <td className="py-1.5 text-right font-mono font-bold pr-1" style={{ color: deltaColor }}>
                        {r.delta > 0 ? '+' : ''}{r.delta}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-3 text-[12px] font-mono p-3 rounded-lg" style={{ background: 'rgba(198,160,82,0.06)', color: 'var(--pl-text-muted)' }}>
              Rebalancing {rebalancedRows.length} routes reduces workload variance from {originalVariance.toFixed(1)}% to {proposedVariance.toFixed(1)}% CV
            </div>
          </LightSectionCard>
        )}
      </div>

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
                      <h3 className="text-[15px] font-bold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
                        {h.name}
                      </h3>
                      <span
                        className="text-xs font-bold font-mono px-1.5 py-0.5 rounded-full"
                        style={{ background: tier.bg, color: tier.color }}
                      >
                        {tier.label}
                      </span>
                    </div>
                    <div className="text-[13px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                      {h.profile} &middot; {h.acquired.split(' — ')[0]}
                    </div>
                  </div>
                  <Sparkline data={avgSparkline} color={tier.color} width={80} height={24} />
                </div>

                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div>
                    <div className="text-xs uppercase tracking-wider font-mono" style={{ color: 'var(--pl-text-muted)' }}>Routes</div>
                    <div className="text-[15px] font-bold" style={{ color: 'var(--pl-text)' }}>{h.routes}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider font-mono" style={{ color: 'var(--pl-text-muted)' }}>Attainment</div>
                    <div className="text-[15px] font-bold" style={{ color: tier.color }}>{pct(avgAttain)}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider font-mono" style={{ color: 'var(--pl-text-muted)' }}>Revenue</div>
                    <div className="text-[15px] font-bold" style={{ color: 'var(--pl-text)' }}>{fmtM(h.rev * 4)}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider font-mono" style={{ color: 'var(--pl-text-muted)' }}>Cases</div>
                    <div className="text-[15px] font-bold" style={{ color: 'var(--pl-text)' }}>{fmtK(h.cases)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--pl-border)' }}>
                  <div className="text-[12px]" style={{ color: 'var(--pl-text-muted)' }}>
                    <span className="font-semibold" style={{ color: 'var(--pl-text-secondary)' }}>{h.manager}</span> &middot; {h.accounts} accounts
                  </div>
                  {atRiskCount > 0 && (
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full" style={{ background: 'rgba(248,113,113,0.08)', color: '#F87171' }}>
                      {atRiskCount} at risk
                    </span>
                  )}
                </div>

                <div className="text-[13px] font-mono mt-2" style={{ color: 'var(--pl-text-faint)' }}>
                  {fmt(h.sqft)} sq ft warehouse
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-[13px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#22C55E' }} />
          On Track (&ge;100%)
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} />
          Watch (95-99%)
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F87171' }} />
          At Risk (&lt;95%)
        </div>
      </div>
    </>
  );
}
