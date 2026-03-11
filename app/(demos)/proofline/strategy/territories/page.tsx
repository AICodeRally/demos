'use client';

import React, { useState } from 'react';
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

/* ── Heatmap color helpers ──────────────────── */
function heatColor(value: number, thresholds: { green: number; yellow: number; direction: 'higher' | 'lower' }): string {
  const { green, yellow, direction } = thresholds;
  if (direction === 'higher') {
    if (value >= green) return 'rgba(34,197,94,';
    if (value >= yellow) return 'rgba(245,158,11,';
    return 'rgba(248,113,113,';
  }
  // lower is better
  if (value <= green) return 'rgba(34,197,94,';
  if (value <= yellow) return 'rgba(245,158,11,';
  return 'rgba(248,113,113,';
}

function heatOpacity(value: number, min: number, max: number): number {
  const range = max - min || 1;
  return 0.15 + 0.45 * Math.abs((value - min) / range);
}

export default function TerritoryDesignPage() {
  const [simulatorOpen, setSimulatorOpen] = useState(false);

  const avgCompanyAttain = ROUTES.reduce((s, r) => s + r.attain, 0) / ROUTES.length;

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

      {/* ── Territory Performance Heatmap ────────────── */}
      <LightSectionCard title="Territory Heatmap — Route Performance" className="mb-6">
        <p className="text-xs font-mono mb-4" style={{ color: 'var(--pl-text-faint)' }}>
          36 routes across 6 hometowns. Color intensity shows relative performance — darker = stronger.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] font-mono border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-2 font-bold" style={{ color: 'var(--pl-text-muted)', width: 80 }}>Route</th>
                <th className="text-center py-2 px-1 font-bold" style={{ color: 'var(--pl-text-muted)' }}>Attainment</th>
                <th className="text-center py-2 px-1 font-bold" style={{ color: 'var(--pl-text-muted)' }}>On-Time</th>
                <th className="text-center py-2 px-1 font-bold" style={{ color: 'var(--pl-text-muted)' }}>Workload</th>
                <th className="text-center py-2 px-1 font-bold" style={{ color: 'var(--pl-text-muted)' }}>Stops/Day</th>
                <th className="text-center py-2 px-1 font-bold" style={{ color: 'var(--pl-text-muted)' }}>Selling %</th>
                <th className="text-center py-2 px-1 font-bold" style={{ color: 'var(--pl-text-muted)' }}>Windshield %</th>
                <th className="text-center py-2 px-1 font-bold" style={{ color: 'var(--pl-text-muted)' }}>Accounts</th>
              </tr>
            </thead>
            <tbody>
              {HOMETOWNS.map((hometown) => {
                const routes = getRoutesByHometown(hometown.id);
                const coverage = getCoverageByHometown(hometown.id);
                return (
                  <React.Fragment key={hometown.id}>
                    {/* Hometown group header */}
                    <tr>
                      <td colSpan={8} className="pt-3 pb-1 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold" style={{ color: '#7C3AED' }}>{hometown.name}</span>
                          <span className="text-[10px]" style={{ color: 'var(--pl-text-faint)' }}>
                            {hometown.routes} routes &middot; {fmt(hometown.accounts)} accts &middot; Mgr: {hometown.manager}
                          </span>
                          {hometown.id === 'lar' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>NEW 2024</span>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* Route rows */}
                    {routes.map((route) => {
                      const cov = coverage.find(c => c.routeId === route.id);
                      const workload = cov?.workloadIndex ?? 100;
                      const stopsDay = cov?.stopsPerDay ?? route.stopsPerDay;
                      const sellingPct = cov?.sellingTimePct ?? 0.50;
                      const windshield = cov?.windshieldTimePct ?? 0.25;
                      const accounts = cov?.accountsPerRoute ?? 350;

                      // Heatmap cell helper
                      const cell = (val: number, display: string, colorBase: string, opacity: number) => (
                        <td className="py-1.5 px-1 text-center">
                          <div className="rounded px-2 py-1 font-bold" style={{
                            background: `${colorBase}${opacity.toFixed(2)})`,
                            color: 'var(--pl-text)',
                          }}>
                            {display}
                          </div>
                        </td>
                      );

                      return (
                        <tr key={route.id}>
                          <td className="py-1.5 px-2 font-bold" style={{ color: 'var(--pl-text)' }}>{route.id}</td>
                          {cell(route.attain, pct(route.attain),
                            heatColor(route.attain, { green: 1.0, yellow: 0.95, direction: 'higher' }),
                            heatOpacity(route.attain, 0.85, 1.10))}
                          {cell(route.onTimeRate, pct(route.onTimeRate),
                            heatColor(route.onTimeRate, { green: 0.92, yellow: 0.85, direction: 'higher' }),
                            heatOpacity(route.onTimeRate, 0.75, 1.0))}
                          {cell(workload, String(workload),
                            heatColor(Math.abs(workload - 100), { green: 10, yellow: 15, direction: 'lower' }),
                            heatOpacity(Math.abs(workload - 100), 0, 25))}
                          {cell(stopsDay, String(stopsDay),
                            heatColor(stopsDay, { green: 15, yellow: 12, direction: 'higher' }),
                            heatOpacity(stopsDay, 10, 22))}
                          {cell(sellingPct, pct(sellingPct),
                            heatColor(sellingPct, { green: 0.52, yellow: 0.45, direction: 'higher' }),
                            heatOpacity(sellingPct, 0.35, 0.65))}
                          {cell(windshield, pct(windshield),
                            heatColor(windshield, { green: 0.25, yellow: 0.32, direction: 'lower' }),
                            heatOpacity(windshield, 0.18, 0.40))}
                          {cell(accounts, String(accounts),
                            heatColor(accounts, { green: 380, yellow: 300, direction: 'higher' }),
                            heatOpacity(accounts, 200, 450))}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-3 rounded" style={{ background: 'rgba(34,197,94,0.4)' }} />
            Strong
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-3 rounded" style={{ background: 'rgba(245,158,11,0.35)' }} />
            Watch
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-3 rounded" style={{ background: 'rgba(248,113,113,0.35)' }} />
            At Risk
          </div>
          <span className="text-[10px]">Darker = further from threshold</span>
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
            <Link key={h.id} href={`/proofline/strategy/territories/${h.id}`} className="group">
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
