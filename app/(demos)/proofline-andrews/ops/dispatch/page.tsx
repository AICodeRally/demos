'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  ROUTES,
  HOMETOWNS,
  getRoutesByHometown,
  getSellerByRoute,
  type Route,
} from '@/data/proofline';
import { fmt, fmtM, pct } from '@/lib/utils';

/** Seeded pseudo-random: deterministic per string seed */
const seededRandom = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

/* ── Delivery status simulation ──────────────── */
type DeliveryStatus = 'loaded' | 'en-route' | 'delivering' | 'returning' | 'exception';

const STATUS_CONFIG: Record<DeliveryStatus, { label: string; color: string; bg: string }> = {
  'loaded':     { label: 'Loaded',     color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  'en-route':   { label: 'En Route',   color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  'delivering': { label: 'Delivering', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  'returning':  { label: 'Returning',  color: 'var(--pl-text-muted)', bg: 'rgba(113,128,150,0.08)' },
  'exception':  { label: 'Exception',  color: '#F87171', bg: 'rgba(248,113,113,0.08)' },
};

// Deterministic status from route ID hash
function getRouteStatus(routeId: string): DeliveryStatus {
  const hash = routeId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const statuses: DeliveryStatus[] = ['en-route', 'delivering', 'en-route', 'loaded', 'delivering', 'en-route', 'returning', 'exception'];
  return statuses[hash % statuses.length];
}

// Simulated cases delivered (based on attainment * quarterly target / 65 working days)
function getCasesDelivered(route: Route): { delivered: number; planned: number } {
  const dailyPlan = Math.round(route.cases / 65);
  const rng = seededRandom(route.id + '2026-03-04')();
  const progress = route.attain >= 1.0 ? 0.85 + rng * 0.15 : 0.5 + rng * 0.35;
  return { delivered: Math.round(dailyPlan * progress), planned: dailyPlan };
}

/* ── Exception Alert ─────────────────────────── */
function ExceptionAlert({ route }: { route: Route }) {
  const seller = getSellerByRoute(route.id);
  const reasons = [
    route.shrinkage > 0.02 ? `High shrinkage (${pct(route.shrinkage)})` : null,
    route.onTimeRate < 0.90 ? `Late deliveries (${pct(route.onTimeRate)} on-time)` : null,
    route.displayCompliance < 0.80 ? `Low display compliance (${pct(route.displayCompliance)})` : null,
  ].filter(Boolean);

  if (reasons.length === 0) return null;

  return (
    <>
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg border" style={{ borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.04)' }}>
      <span className="text-[12px] font-bold font-mono" style={{ color: '#F87171' }}>{route.id}</span>
      <span className="text-[12px]" style={{ color: 'var(--pl-text)' }}>{seller?.name ?? 'Unknown'}</span>
      <span className="text-[13px] font-mono" style={{ color: '#F87171' }}>{reasons.join(' · ')}</span>
    </div>
    </>
  );
}

/* ── Route Card ──────────────────────────────── */
function RouteCard({ route }: { route: Route }) {
  const seller = getSellerByRoute(route.id);
  const status = getRouteStatus(route.id);
  const cfg = STATUS_CONFIG[status];
  const { delivered, planned } = getCasesDelivered(route);
  const deliveredPct = delivered / planned;

  return (
    <>
    <div className="rounded-lg border p-3 hover:shadow-sm transition-shadow" style={{ borderColor: 'var(--pl-border)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{route.id}</span>
          <span
            className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {cfg.label}
          </span>
        </div>
        {status === 'exception' && (
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#F87171' }} />
        )}
      </div>

      <div className="text-[12px] mb-1" style={{ color: 'var(--pl-text)' }}>{seller?.name ?? '—'}</div>
      <div className="text-xs font-mono mb-2" style={{ color: 'var(--pl-text-faint)' }}>
        {route.stopsPerDay} stops · {route.accounts} accts · {route.channel}
      </div>

      {/* Cases delivered progress */}
      <div className="mb-1">
        <div className="flex items-center justify-between text-xs font-mono mb-0.5">
          <span style={{ color: 'var(--pl-text-muted)' }}>Cases</span>
          <span style={{ color: deliveredPct >= 0.8 ? '#22C55E' : deliveredPct >= 0.6 ? '#F59E0B' : '#F87171' }}>
            {fmt(delivered)}/{fmt(planned)}
          </span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: 'var(--pl-chart-bar-track)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(deliveredPct * 100, 100)}%`,
              background: deliveredPct >= 0.8 ? '#22C55E' : deliveredPct >= 0.6 ? '#F59E0B' : '#F87171',
            }}
          />
        </div>
      </div>

      {/* On-time rate */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span style={{ color: 'var(--pl-text-muted)' }}>On-time</span>
        <span
          className="font-bold"
          style={{ color: route.onTimeRate >= 0.95 ? '#22C55E' : route.onTimeRate >= 0.90 ? '#F59E0B' : '#F87171' }}
        >
          {pct(route.onTimeRate)}
        </span>
      </div>
    </div>
    </>
  );
}

export default function DeliveryDispatchPage() {
  const [filterHometown, setFilterHometown] = useState<string>('all');

  // Aggregate KPIs
  const totalCasesToday = ROUTES.reduce((s, r) => s + Math.round(r.cases / 65), 0);
  const avgOnTime = ROUTES.reduce((s, r) => s + r.onTimeRate, 0) / ROUTES.length;
  const exceptionRoutes = ROUTES.filter(r => getRouteStatus(r.id) === 'exception');
  const activeRoutes = ROUTES.filter(r => {
    const s = getRouteStatus(r.id);
    return s === 'en-route' || s === 'delivering';
  });
  const totalRevToday = ROUTES.reduce((s, r) => s + Math.round(r.rev / 65), 0);

  // Filtered hometowns
  const hometowns = filterHometown === 'all' ? HOMETOWNS : HOMETOWNS.filter(h => h.id === filterHometown);

  return (
    <>

      <ActNavigation currentAct={3} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#2563EB' }}>
          Delivery Dispatch &middot; Real-Time Operations
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          Route Dispatch Board
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          {ROUTES.length} routes across {HOMETOWNS.length} hometowns &middot; Live delivery status
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="Routes Active" value={`${activeRoutes.length}/${ROUTES.length}`} accent="#22C55E" sub="En route + delivering" />
        <LightKpiCard label="Daily Cases" value={fmt(totalCasesToday)} accent="#2563EB" sub="Planned today" />
        <LightKpiCard label="Daily Revenue" value={fmtM(totalRevToday)} accent="#2563EB" sub="Projected" />
        <LightKpiCard label="Avg On-Time" value={pct(avgOnTime)} accent={avgOnTime >= 0.93 ? '#22C55E' : '#F59E0B'} sub="Delivery rate" />
        <LightKpiCard label="Exceptions" value={String(exceptionRoutes.length)} accent="#F87171" sub={exceptionRoutes.length > 0 ? 'Needs attention' : 'All clear'} />
      </div>

      {/* Exception Alerts */}
      <LightSectionCard title={`Exception Alerts — ${Math.max(exceptionRoutes.length, 5)} Active`} className="mb-6">
        <div className="space-y-2">
          {exceptionRoutes.map(r => (
            <ExceptionAlert key={r.id} route={r} />
          ))}
          {/* Static exception alerts for demo completeness */}
          {[
            { id: 'EXC-001', type: 'Late Departure', route: 'DAL-03', rep: 'Carlos Mendez', detail: '42 min behind schedule — traffic on I-35E', color: '#F87171' },
            { id: 'EXC-002', type: 'Low Inventory', route: 'FTW-02', rep: 'Jake Thompson', detail: 'Corona Extra 12pk — 8 cases short of order', color: '#F59E0B' },
            { id: 'EXC-003', type: 'Route Deviation', route: 'ALN-01', rep: 'Sarah Kim', detail: 'Skipped stop #4 (Total Wine) — customer closed early', color: '#A855F7' },
            { id: 'EXC-004', type: 'Compliance Flag', route: 'DAL-07', rep: 'Marcus Johnson', detail: 'Display photo missing at Spec\'s #12 — required by promo', color: '#2563EB' },
            { id: 'EXC-005', type: 'Delivery Delay', route: 'LAR-01', rep: 'Diego Ramirez', detail: 'Warehouse loading backup — ETA pushed 25 min', color: '#F97316' },
          ].map(alert => (
            <div key={alert.id} className="flex items-center gap-3 px-4 py-2 rounded-lg border" style={{ borderColor: `${alert.color}30`, background: `${alert.color}06` }}>
              <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: `${alert.color}15`, color: alert.color }}>{alert.type.toUpperCase()}</span>
              <span className="text-[12px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{alert.route}</span>
              <span className="text-[12px]" style={{ color: 'var(--pl-text)' }}>{alert.rep}</span>
              <span className="text-[13px] font-mono flex-1" style={{ color: 'var(--pl-text-muted)' }}>{alert.detail}</span>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* Hometown Filter */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[13px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>Hometown:</span>
        <button
          onClick={() => setFilterHometown('all')}
          className="text-[13px] font-mono px-3 py-1 rounded-lg border transition-colors"
          style={{
            borderColor: filterHometown === 'all' ? '#2563EB' : 'var(--pl-border)',
            background: filterHometown === 'all' ? 'rgba(37,99,235,0.08)' : 'var(--pl-card)',
            color: filterHometown === 'all' ? '#2563EB' : 'var(--pl-text-muted)',
            fontWeight: filterHometown === 'all' ? 700 : 400,
          }}
        >
          All ({ROUTES.length})
        </button>
        {HOMETOWNS.map(h => {
          const count = getRoutesByHometown(h.id).length;
          return (
            <button
              key={h.id}
              onClick={() => setFilterHometown(h.id)}
              className="text-[13px] font-mono px-3 py-1 rounded-lg border transition-colors"
              style={{
                borderColor: filterHometown === h.id ? '#2563EB' : 'var(--pl-border)',
                background: filterHometown === h.id ? 'rgba(37,99,235,0.08)' : 'var(--pl-card)',
                color: filterHometown === h.id ? '#2563EB' : 'var(--pl-text-muted)',
                fontWeight: filterHometown === h.id ? 700 : 400,
              }}
            >
              {h.name.replace(' HQ', '')} ({count})
            </button>
          );
        })}
      </div>

      {/* Status Legend */}
      <div className="flex items-center gap-4 mb-4">
        {(Object.entries(STATUS_CONFIG) as [DeliveryStatus, typeof STATUS_CONFIG[DeliveryStatus]][]).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: cfg.bg, color: cfg.color }}>
              {cfg.label}
            </span>
          </div>
        ))}
      </div>

      {/* Route Cards by Hometown */}
      {hometowns.map(hometown => {
        const routes = getRoutesByHometown(hometown.id);
        const htExceptions = routes.filter(r => getRouteStatus(r.id) === 'exception').length;
        const htAvgOnTime = routes.reduce((s, r) => s + r.onTimeRate, 0) / routes.length;

        return (
          <LightSectionCard
            key={hometown.id}
            title={`${hometown.name} — ${routes.length} Routes`}
            className="mb-6"
          >
            {/* Hometown summary bar */}
            <div className="flex items-center gap-6 mb-4 text-[13px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
              <span>Manager: <strong style={{ color: 'var(--pl-text)' }}>{hometown.manager}</strong></span>
              <span>Avg on-time: <strong style={{ color: htAvgOnTime >= 0.93 ? '#22C55E' : '#F59E0B' }}>{pct(htAvgOnTime)}</strong></span>
              <span>Cases/day: <strong style={{ color: 'var(--pl-text)' }}>{fmt(routes.reduce((s, r) => s + Math.round(r.cases / 65), 0))}</strong></span>
              {htExceptions > 0 && (
                <span style={{ color: '#F87171' }}>
                  <strong>{htExceptions}</strong> exception{htExceptions > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Route card grid */}
            <div className="grid grid-cols-4 gap-3">
              {routes.map(route => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </LightSectionCard>
        );
      })}

      {/* Methodology */}
      <div className="text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        Status reflects simulated real-time delivery tracking. Cases = daily plan based on quarterly target &divide; 65 working days.
        On-time rate sourced from route performance data. Exception threshold: shrinkage &gt;2%, on-time &lt;90%, or display compliance &lt;80%.
      </div>

    </>
  );
}
