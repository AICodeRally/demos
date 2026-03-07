'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ActNavigation, LightSectionCard, LightKpiCard, Sparkline } from '@/components/demos/proofline';
import {
  HOMETOWNS,
  getHometownById,
  getRoutesByHometown,
  getSellersByHometown,
  getManagerByHometown,
  type Route,
  type Seller,
} from '@/data/proofline';
import { fmt, fmtM, fmtK, pct } from '@/lib/utils';

/* -- Attainment color -- */
function attainColor(v: number): string {
  if (v >= 1.0) return '#22C55E';
  if (v >= 0.95) return '#F59E0B';
  return '#F87171';
}

function tierBadge(tier: 1 | 2 | 3 | 4) {
  const map: Record<number, { label: string; color: string; bg: string }> = {
    1: { label: 'T1', color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
    2: { label: 'T2', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
    3: { label: 'T3', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
    4: { label: 'T4', color: '#F87171', bg: 'rgba(248,113,113,0.08)' },
  };
  return map[tier];
}

/* -- Radar Chart -- */
const RADAR_AXES = [
  { key: 'attain', label: 'Attainment', max: 1.15 },
  { key: 'display', label: 'Display', max: 1.0 },
  { key: 'onTime', label: 'On-Time', max: 1.0 },
  { key: 'quality', label: 'Quality', max: 1.0 },
  { key: 'spirits', label: 'Spirits', max: 20 },
] as const;

const RADAR_CX = 200;
const RADAR_CY = 180;
const RADAR_R = 140;

function radarPoint(axisIdx: number, value: number, maxVal: number): { x: number; y: number } {
  const angle = (2 * Math.PI / RADAR_AXES.length) * axisIdx - Math.PI / 2;
  const r = (Math.min(value, maxVal) / maxVal) * RADAR_R;
  return { x: RADAR_CX + r * Math.cos(angle), y: RADAR_CY + r * Math.sin(angle) };
}

function getRouteRadarValues(route: Route) {
  return {
    attain: route.attain,
    display: route.displayCompliance,
    onTime: route.onTimeRate,
    quality: 1 - route.shrinkage,
    spirits: route.spiritsAccounts,
  };
}

function RadarChart({ routes, selectedRouteId }: { routes: Route[]; selectedRouteId: string | null }) {
  const axisCount = RADAR_AXES.length;
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <>
    <svg viewBox="0 0 400 370" className="w-full" style={{ height: 370 }}>
      <defs>
        <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {rings.map((pctVal) => {
        const pts = Array.from({ length: axisCount }, (_, i) => {
          const angle = (2 * Math.PI / axisCount) * i - Math.PI / 2;
          const r = RADAR_R * pctVal;
          return `${RADAR_CX + r * Math.cos(angle)},${RADAR_CY + r * Math.sin(angle)}`;
        }).join(' ');
        return (
          <polygon key={pctVal} points={pts} fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
        );
      })}

      {RADAR_AXES.map((axis, i) => {
        const angle = (2 * Math.PI / axisCount) * i - Math.PI / 2;
        const ex = RADAR_CX + RADAR_R * Math.cos(angle);
        const ey = RADAR_CY + RADAR_R * Math.sin(angle);
        const lx = RADAR_CX + (RADAR_R + 20) * Math.cos(angle);
        const ly = RADAR_CY + (RADAR_R + 20) * Math.sin(angle);
        return (
          <g key={axis.key}>
            <line x1={RADAR_CX} y1={RADAR_CY} x2={ex} y2={ey} stroke="#E2E8F0" strokeWidth="0.5" />
            <text
              x={lx}
              y={ly + 4}
              textAnchor="middle"
              fill="#718096"
              fontSize="10"
              fontWeight="600"
              fontFamily="'Space Grotesk', sans-serif"
            >
              {axis.label}
            </text>
          </g>
        );
      })}

      {routes.map((route) => {
        const vals = getRouteRadarValues(route);
        const isSelected = selectedRouteId === route.id;
        const color = attainColor(route.attain);
        const pts = RADAR_AXES.map((axis, i) => {
          const v = vals[axis.key as keyof typeof vals];
          const p = radarPoint(i, v, axis.max);
          return `${p.x},${p.y}`;
        }).join(' ');

        return (
          <polygon
            key={route.id}
            points={pts}
            fill={color}
            fillOpacity={isSelected ? 0.25 : 0.06}
            stroke={color}
            strokeWidth={isSelected ? 2.5 : 1}
            strokeOpacity={isSelected ? 1 : 0.4}
            filter={isSelected ? 'url(#radarGlow)' : undefined}
          />
        );
      })}

      {selectedRouteId && (() => {
        const route = routes.find((r: Route) => r.id === selectedRouteId);
        if (!route) return null;
        const vals = getRouteRadarValues(route);
        const color = attainColor(route.attain);
        return RADAR_AXES.map((axis, i) => {
          const v = vals[axis.key as keyof typeof vals];
          const p = radarPoint(i, v, axis.max);
          return (
            <circle key={axis.key} cx={p.x} cy={p.y} r={4} fill={color} stroke="white" strokeWidth={2} />
          );
        });
      })()}
    </svg>
    </>
  );
}

/* -- Slope Chart (13-week attainment trends) -- */
const SLOPE_W = 720;
const SLOPE_H = 200;
const SLOPE_PAD = { left: 50, right: 20, top: 20, bottom: 30 };
const SLOPE_INNER_W = SLOPE_W - SLOPE_PAD.left - SLOPE_PAD.right;
const SLOPE_INNER_H = SLOPE_H - SLOPE_PAD.top - SLOPE_PAD.bottom;

function SlopeChart({ routes, selectedRouteId }: { routes: Route[]; selectedRouteId: string | null }) {
  const allVals = routes.flatMap((r: Route) => r.weeklyAttainment);
  const yMax = Math.max(1.1, Math.ceil(Math.max(...allVals) * 10) / 10);
  const yMin = 0;
  const weeks = 13;

  function toX(week: number) {
    return SLOPE_PAD.left + (week / (weeks - 1)) * SLOPE_INNER_W;
  }
  function toY(val: number) {
    return SLOPE_PAD.top + SLOPE_INNER_H - ((val - yMin) / (yMax - yMin)) * SLOPE_INNER_H;
  }

  return (
    <>
    <svg viewBox={`0 0 ${SLOPE_W} ${SLOPE_H}`} className="w-full" style={{ height: 200 }}>
      {[0.25, 0.5, 0.75, 1.0].map((v) => (
        <g key={v}>
          <line x1={SLOPE_PAD.left} y1={toY(v)} x2={SLOPE_PAD.left + SLOPE_INNER_W} y2={toY(v)} stroke="#E2E8F0" strokeWidth="0.5" />
          <text x={SLOPE_PAD.left - 6} y={toY(v) + 4} textAnchor="end" fill="#A0AEC0" fontSize="9" fontFamily="monospace">
            {pct(v)}
          </text>
        </g>
      ))}

      <line x1={SLOPE_PAD.left} y1={toY(1.0)} x2={SLOPE_PAD.left + SLOPE_INNER_W} y2={toY(1.0)} stroke="#7C3AED" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
      <text x={SLOPE_PAD.left + SLOPE_INNER_W + 4} y={toY(1.0) + 3} fill="#7C3AED" fontSize="8" fontFamily="monospace" opacity="0.6">
        100%
      </text>

      {[0, 3, 6, 9, 12].map((w) => (
        <text key={w} x={toX(w)} y={SLOPE_H - 6} textAnchor="middle" fill="#A0AEC0" fontSize="9" fontFamily="monospace">
          W{w + 1}
        </text>
      ))}

      {routes.map((route: Route) => {
        const isSelected = selectedRouteId === route.id;
        const color = attainColor(route.attain);
        const d = route.weeklyAttainment
          .map((v: number, i: number) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`)
          .join(' ');

        return (
          <g key={route.id}>
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={isSelected ? 2.5 : 1}
              strokeOpacity={isSelected ? 1 : 0.3}
            />
            {isSelected && (
              <circle
                cx={toX(12)}
                cy={toY(route.weeklyAttainment[12])}
                r={4}
                fill={color}
                stroke="white"
                strokeWidth={2}
              />
            )}
          </g>
        );
      })}

      {selectedRouteId && (() => {
        const route = routes.find((r: Route) => r.id === selectedRouteId);
        if (!route) return null;
        const color = attainColor(route.attain);
        const endVal = route.weeklyAttainment[12];
        return (
          <text x={toX(12) + 8} y={toY(endVal) + 4} fill={color} fontSize="10" fontWeight="700" fontFamily="monospace">
            {route.id}: {pct(endVal)}
          </text>
        );
      })()}
    </svg>
    </>
  );
}

/* -- Route Row -- */
function RouteRow({ route, seller, idx, isSelected, onSelect }: {
  route: Route;
  seller: Seller | undefined;
  idx: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const tb = seller ? tierBadge(seller.tier) : null;

  return (
    <>
    <tr
      className={`cursor-pointer transition-colors ${isSelected ? 'bg-purple-50' : idx % 2 === 0 ? 'bg-[#F8FAFC]' : ''} hover:bg-purple-50/50`}
      onClick={onSelect}
    >
      <td className="py-3 pl-3">
        <span className="text-[13px] font-bold font-mono" style={{ color: isSelected ? '#7C3AED' : '#1A1A2E' }}>{route.id}</span>
      </td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold" style={{ color: '#1A1A2E' }}>{seller?.name ?? '\u2014'}</span>
          {tb && (
            <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full" style={{ background: tb.bg, color: tb.color }}>
              {tb.label}
            </span>
          )}
          {seller?.atRisk && (
            <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(248,113,113,0.08)', color: '#F87171' }}>
              AT RISK
            </span>
          )}
        </div>
      </td>
      <td className="py-3 text-right">
        <span className="text-[13px] font-mono" style={{ color: '#1A1A2E' }}>{fmtK(route.cases)}</span>
      </td>
      <td className="py-3 text-right">
        <span className="text-[13px] font-mono" style={{ color: '#1A1A2E' }}>{fmtM(route.rev)}</span>
      </td>
      <td className="py-3 text-right">
        <span className="text-[13px] font-mono font-bold" style={{ color: attainColor(route.attain) }}>
          {pct(route.attain)}
        </span>
      </td>
      <td className="py-3 text-right">
        <span className="text-[13px] font-mono" style={{ color: route.displayCompliance >= 0.90 ? '#22C55E' : route.displayCompliance >= 0.85 ? '#F59E0B' : '#F87171' }}>
          {pct(route.displayCompliance)}
        </span>
      </td>
      <td className="py-3 text-right">
        <span className="text-[13px] font-mono" style={{ color: '#718096' }}>{route.spiritsAccounts}</span>
      </td>
      <td className="py-3 text-right pr-3">
        <Sparkline data={route.weeklyAttainment} color={attainColor(route.attain)} width={80} height={22} />
      </td>
    </tr>
    </>
  );
}

export default function HometownDetailClient({ params }: { params: Promise<{ hometown: string }> }) {
  const { hometown: hometownId } = use(params);
  const hometown = getHometownById(hometownId);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  if (!hometown) {
    return (
      <>
        <div className="text-center py-20">
          <h1 className="text-xl font-bold" style={{ color: '#1A1A2E' }}>Hometown not found</h1>
          <Link href="/proofline-andrews/strategy/territories" className="text-[13px] font-semibold mt-2 block" style={{ color: '#7C3AED' }}>
            Back to Territory Design
          </Link>
        </div>
      </>
    );
  }

  const routes = getRoutesByHometown(hometownId);
  const sellers = getSellersByHometown(hometownId);
  const manager = getManagerByHometown(hometownId);

  const avgAttain = routes.reduce((s: number, r: Route) => s + r.attain, 0) / routes.length;
  const totalCases = routes.reduce((s: number, r: Route) => s + r.cases, 0);
  const totalRev = routes.reduce((s: number, r: Route) => s + r.rev, 0);
  const avgDisplayCompliance = routes.reduce((s: number, r: Route) => s + r.displayCompliance, 0) / routes.length;
  const totalSpiritsAccts = routes.reduce((s: number, r: Route) => s + r.spiritsAccounts, 0);
  const atRiskCount = sellers.filter((s: Seller) => s.atRisk).length;

  const hIdx = HOMETOWNS.findIndex((h) => h.id === hometownId);
  const prevHometown = hIdx > 0 ? HOMETOWNS[hIdx - 1] : null;
  const nextHometown = hIdx < HOMETOWNS.length - 1 ? HOMETOWNS[hIdx + 1] : null;

  return (
    <>
      <ActNavigation currentAct={2} />

      {/* Breadcrumb + Header */}
      <div className="mt-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/proofline-andrews/strategy/territories" className="text-[11px] font-mono hover:underline" style={{ color: '#7C3AED' }}>
            Territory Design
          </Link>
          <span className="text-[11px] font-mono" style={{ color: '#A0AEC0' }}>/</span>
          <span className="text-[11px] font-mono" style={{ color: '#718096' }}>{hometown.name}</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: '#1A1A2E', fontFamily: "'Space Grotesk', sans-serif" }}>
              {hometown.name}
            </h1>
            <p className="text-[13px] mt-1" style={{ color: '#718096' }}>
              {hometown.profile} &middot; {hometown.acquired} &middot; {fmt(hometown.sqft)} sq ft
            </p>
          </div>
          <div className="flex items-center gap-2">
            {prevHometown && (
              <Link
                href={`/proofline-andrews/strategy/territories/${prevHometown.id}`}
                className="text-[11px] font-mono px-3 py-1.5 rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#E2E8F0', color: '#718096' }}
              >
                &larr; {prevHometown.name.replace(' HQ', '')}
              </Link>
            )}
            {nextHometown && (
              <Link
                href={`/proofline-andrews/strategy/territories/${nextHometown.id}`}
                className="text-[11px] font-mono px-3 py-1.5 rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#E2E8F0', color: '#718096' }}
              >
                {nextHometown.name.replace(' HQ', '')} &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Manager Banner */}
      {manager && (
        <div
          className="rounded-lg px-5 py-3 mb-6 flex items-center justify-between"
          style={{ background: 'rgba(124,58,237,0.06)', borderLeft: '3px solid #7C3AED' }}
        >
          <div>
            <span className="text-[13px] font-bold" style={{ color: '#1A1A2E' }}>{manager.name}</span>
            <span className="text-[12px] ml-2" style={{ color: '#718096' }}>
              District Manager &middot; {Math.floor(manager.tenure / 12)}y {manager.tenure % 12}m tenure
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono" style={{ color: '#718096' }}>
            <span>{manager.directReports.length} direct reports</span>
            <span>Spirits: {pct(manager.districtKPIs.spiritsPenetration)}</span>
          </div>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="Routes" value={String(hometown.routes)} accent="#7C3AED" />
        <LightKpiCard label="Avg Attainment" value={pct(avgAttain)} accent={attainColor(avgAttain)} />
        <LightKpiCard label="Q Revenue" value={fmtM(totalRev)} accent="#7C3AED" />
        <LightKpiCard label="Display Compliance" value={pct(avgDisplayCompliance)} accent="#2563EB" />
        <LightKpiCard
          label="Spirits Accounts"
          value={String(totalSpiritsAccts)}
          accent="#F87171"
          sub={atRiskCount > 0 ? `${atRiskCount} rep${atRiskCount > 1 ? 's' : ''} at risk` : undefined}
        />
      </div>

      {/* Radar + Slope Charts */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <LightSectionCard title={`Route KPI Radar${selectedRoute ? ` \u2014 ${selectedRoute}` : ''}`}>
          <p className="text-[11px] mb-2" style={{ color: '#A0AEC0' }}>
            Click a route in the table to highlight &middot; All routes overlaid for comparison
          </p>
          <RadarChart routes={routes} selectedRouteId={selectedRoute} />
        </LightSectionCard>

        <LightSectionCard title={`13-Week Attainment Trend${selectedRoute ? ` \u2014 ${selectedRoute}` : ''}`}>
          <p className="text-[11px] mb-2" style={{ color: '#A0AEC0' }}>
            Cumulative attainment trajectory &middot; Dashed line = 100% target
          </p>
          <SlopeChart routes={routes} selectedRouteId={selectedRoute} />
        </LightSectionCard>
      </div>

      {/* Route Performance Table */}
      <LightSectionCard title={`Route Performance \u2014 ${hometown.name}`} className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ color: '#718096' }}>
                <th className="text-left font-medium pb-3 pl-3">Route</th>
                <th className="text-left font-medium pb-3">Rep</th>
                <th className="text-right font-medium pb-3">Cases</th>
                <th className="text-right font-medium pb-3">Revenue</th>
                <th className="text-right font-medium pb-3">Attain</th>
                <th className="text-right font-medium pb-3">Display</th>
                <th className="text-right font-medium pb-3">Spirits</th>
                <th className="text-right font-medium pb-3 pr-3">13-Week</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route: Route, idx: number) => {
                const seller = sellers.find((s: Seller) => s.routeId === route.id);
                return (
                  <RouteRow
                    key={route.id}
                    route={route}
                    seller={seller}
                    idx={idx}
                    isSelected={selectedRoute === route.id}
                    onSelect={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                  />
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2" style={{ borderColor: '#E2E8F0' }}>
                <td className="py-3 pl-3 text-[12px] font-bold" style={{ color: '#1A1A2E' }} colSpan={2}>TOTAL / AVG</td>
                <td className="py-3 text-right text-[12px] font-bold font-mono" style={{ color: '#1A1A2E' }}>{fmtK(totalCases)}</td>
                <td className="py-3 text-right text-[12px] font-bold font-mono" style={{ color: '#1A1A2E' }}>{fmtM(totalRev)}</td>
                <td className="py-3 text-right text-[12px] font-bold font-mono" style={{ color: attainColor(avgAttain) }}>{pct(avgAttain)}</td>
                <td className="py-3 text-right text-[12px] font-bold font-mono" style={{ color: avgDisplayCompliance >= 0.90 ? '#22C55E' : '#F59E0B' }}>{pct(avgDisplayCompliance)}</td>
                <td className="py-3 text-right text-[12px] font-bold font-mono" style={{ color: '#718096' }}>{totalSpiritsAccts}</td>
                <td className="py-3 pr-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      </LightSectionCard>

      {/* EMCO Gate Summary */}
      <LightSectionCard title="EMCO Gate Performance by Rep" className="mb-6">
        <div className="grid grid-cols-1 gap-2">
          {sellers.map((seller: Seller) => {
            const gates = seller.emcoGates;
            const isSelected = selectedRoute === seller.routeId;
            return (
              <div
                key={seller.id}
                className={`flex items-center gap-4 py-2 px-3 rounded-lg transition-colors cursor-pointer ${isSelected ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedRoute(isSelected ? null : seller.routeId)}
              >
                <div className="w-32 shrink-0">
                  <div className="text-[12px] font-semibold" style={{ color: isSelected ? '#7C3AED' : '#1A1A2E' }}>{seller.name}</div>
                  <div className="text-[10px] font-mono" style={{ color: '#A0AEC0' }}>{seller.routeId}</div>
                </div>
                {[
                  { label: 'Core', val: gates.core, target: 0.85 },
                  { label: 'Import', val: gates.import, target: 0.80 },
                  { label: 'Emerging', val: gates.emerging, target: 0.70 },
                  { label: 'Combined', val: gates.combined, target: 0.90 },
                ].map(g => {
                  const passed = g.val >= g.target;
                  return (
                    <div key={g.label} className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px] font-mono" style={{ color: '#A0AEC0' }}>{g.label}</span>
                        <span className="text-[10px] font-mono font-bold" style={{ color: passed ? '#22C55E' : '#F87171' }}>
                          {pct(g.val)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: '#F1F5F9' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${Math.min(g.val * 100, 100)}%`, background: passed ? '#22C55E' : '#F87171' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </LightSectionCard>

      {/* Quick nav to Day Planner */}
      <div
        className="rounded-lg px-5 py-4 flex items-center justify-between"
        style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)' }}
      >
        <div>
          <div className="text-[13px] font-semibold" style={{ color: '#1A1A2E' }}>
            See these routes in action
          </div>
          <div className="text-[11px]" style={{ color: '#718096' }}>
            Jump to the Day Planner to view stop-level detail for any rep in {hometown.name.replace(' HQ', '')}
          </div>
        </div>
        <Link
          href="/proofline-andrews/ops/day-planner"
          className="text-[12px] font-bold px-4 py-2 rounded-lg transition-colors"
          style={{ background: '#2563EB', color: 'white' }}
        >
          Open Day Planner &rarr;
        </Link>
      </div>
    </>
  );
}
