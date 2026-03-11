'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  COACHING_CARDS,
  WEEKLY_COACHING_AGENDA,
  DALLAS_DISTRICT_LIVE,
  getDistrictSummary,
  getUrgentCards,
  type CoachingCard,
  type CoachingPriority,
  type DistrictRepSnapshot,
} from '@/data/proofline';
import { fmt, fmtK, fmtM, pct } from '@/lib/utils';
import { broadcastCoaching, broadcastAlert } from '@/lib/proofline-broadcast';

/* ── Priority config ─────────────────────────── */
const PRIORITY_CONFIG: Record<CoachingPriority, { color: string; bg: string; label: string }> = {
  urgent: { color: '#DC2626', bg: 'rgba(220,38,38,0.08)', label: 'URGENT' },
  high:   { color: '#F87171', bg: 'rgba(248,113,113,0.08)', label: 'HIGH' },
  medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', label: 'MED' },
  low:    { color: '#22C55E', bg: 'rgba(34,197,94,0.08)', label: 'LOW' },
};

const STATUS_LIGHT: Record<string, string> = {
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#F87171',
};

const MEETING_LABELS: Record<string, { label: string; color: string }> = {
  '1:1':        { label: '1:1', color: '#3B82F6' },
  'ride-along': { label: 'Ride-Along', color: '#F87171' },
  'review':     { label: 'Review', color: '#F59E0B' },
  'skip':       { label: 'Skip', color: 'var(--pl-text-faint)' },
};

/* ── Rep Status Card (traffic light) ─────────── */
function RepCard({ rep }: { rep: DistrictRepSnapshot }) {
  const light = STATUS_LIGHT[rep.statusColor];
  const progressPct = (rep.currentStop / rep.totalStops) * 100;
  const casesPct = rep.casesTarget > 0 ? rep.casesDelivered / rep.casesTarget : 0;

  return (
    <>
    <Link
      href={`/proofline-andrews/ops/manager/rep/${rep.sellerId}`}
      className="block rounded-lg border p-4 hover:shadow-md transition-shadow"
      style={{ borderColor: rep.statusColor === 'red' ? '#FCA5A5' : 'var(--pl-border)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: light }} />
          <span className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>{rep.sellerName}</span>
        </div>
        <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>{rep.routeId}</span>
      </div>

      {/* Stop progress */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs font-mono mb-0.5">
          <span style={{ color: 'var(--pl-text-muted)' }}>Stop {rep.currentStop}/{rep.totalStops}</span>
          <span style={{ color: light }}>{rep.status}</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: 'var(--pl-chart-bar-track)' }}>
          <div className="h-full rounded-full" style={{ width: `${progressPct}%`, background: light }} />
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-1 text-xs font-mono">
        <div>
          <span style={{ color: 'var(--pl-text-faint)' }}>Cases</span>
          <br /><span style={{ color: casesPct >= 0.8 ? '#22C55E' : '#F59E0B' }}>{fmt(rep.casesDelivered)}/{fmt(rep.casesTarget)}</span>
        </div>
        <div>
          <span style={{ color: 'var(--pl-text-faint)' }}>On-Time</span>
          <br /><span style={{ color: rep.onTimeRate >= 0.90 ? '#22C55E' : '#F87171' }}>{pct(rep.onTimeRate)}</span>
        </div>
        <div>
          <span style={{ color: 'var(--pl-text-faint)' }}>Attain</span>
          <br /><span style={{ color: rep.attainment >= 1.0 ? '#22C55E' : rep.attainment >= 0.90 ? '#F59E0B' : '#F87171' }}>{pct(rep.attainment)}</span>
        </div>
      </div>
    </Link>
    </>
  );
}

/* ── Coaching Card Component ─────────────────── */
function CoachingCardView({ card }: { card: CoachingCard }) {
  const [expanded, setExpanded] = useState(false);
  const pCfg = PRIORITY_CONFIG[card.priority];

  return (
    <>
    <div
      className="rounded-lg border p-4 cursor-pointer hover:shadow-sm transition-shadow"
      style={{ borderColor: card.priority === 'urgent' ? '#FCA5A5' : 'var(--pl-border)' }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <span
          className="text-xs font-bold font-mono px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
          style={{ background: pCfg.bg, color: pCfg.color }}
        >
          {pCfg.label}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[12px] font-bold" style={{ color: 'var(--pl-text)' }}>{card.title}</span>
            {card.aiGenerated && (
              <span className="text-xs font-mono px-1 py-0.5 rounded" style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB' }}>
                AI
              </span>
            )}
          </div>
          <p className="text-[13px] mb-2" style={{ color: 'var(--pl-text-muted)' }}>{card.description}</p>

          {expanded && (
            <>
              {/* Data Points */}
              <div className="mb-2">
                <div className="text-xs font-bold font-mono mb-1" style={{ color: 'var(--pl-text-faint)' }}>DATA POINTS</div>
                <ul className="space-y-0.5">
                  {card.dataPoints.map((dp, i) => (
                    <li key={i} className="text-[13px] flex items-start gap-1.5" style={{ color: 'var(--pl-text-muted)' }}>
                      <span style={{ color: pCfg.color }}>&#x2022;</span> {dp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggested Action */}
              <div className="rounded-lg p-3" style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.1)' }}>
                <div className="text-xs font-bold font-mono mb-1" style={{ color: '#2563EB' }}>SUGGESTED ACTION</div>
                <p className="text-[13px]" style={{ color: 'var(--pl-text)' }}>{card.suggestedAction}</p>
              </div>

              {/* Push to Rep Tablet */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  broadcastCoaching({
                    id: `coach-${card.id}-${Date.now()}`,
                    stopId: card.sellerId,
                    stopName: card.sellerName,
                    message: card.suggestedAction,
                    timestamp: new Date().toISOString(),
                  });
                }}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all hover:opacity-80 active:scale-[0.97]"
                style={{
                  background: 'linear-gradient(135deg, #C6A052, #a8842e)',
                  color: '#0a0f1e',
                  boxShadow: '0 1px 4px rgba(198,160,82,0.2)',
                }}
              >
                Push to Rep Tablet
              </button>
            </>
          )}

          <div className="flex items-center gap-3 mt-2 text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
            <span>{card.sellerName} · {card.routeId}</span>
            <span>{card.category}</span>
            {card.dueDate && <span style={{ color: '#F59E0B' }}>Due: {card.dueDate}</span>}
            <span className="ml-auto">{expanded ? '▲ Collapse' : '▼ Expand'}</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

/* ── Territory Map (simplified SVG) ──────────── */
function TerritoryMap({ reps }: { reps: DistrictRepSnapshot[] }) {
  // Dallas routes on a simplified grid (32.65-33.05 lat, -96.5 to -97.0 lng)
  const positions: Record<string, { x: number; y: number }> = {
    'DAL-01': { x: 180, y: 120 }, 'DAL-02': { x: 240, y: 80 },
    'DAL-03': { x: 140, y: 180 }, 'DAL-04': { x: 300, y: 140 },
    'DAL-05': { x: 100, y: 100 }, 'DAL-06': { x: 260, y: 200 },
    'DAL-07': { x: 200, y: 240 }, 'DAL-08': { x: 340, y: 100 },
  };

  return (
    <>
    <svg viewBox="0 0 420 300" className="w-full rounded-lg" style={{ background: 'var(--pl-stripe)' }}>
      {/* Grid */}
      {[60, 120, 180, 240].map(y => (
        <line key={`h${y}`} x1="20" y1={y} x2="400" y2={y} stroke="var(--pl-chart-grid)" strokeWidth="0.5" />
      ))}
      {[80, 160, 240, 320].map(x => (
        <line key={`v${x}`} x1={x} y1="20" x2={x} y2="280" stroke="var(--pl-chart-grid)" strokeWidth="0.5" />
      ))}

      {/* Route zones (subtle polygons) */}
      {reps.map(rep => {
        const pos = positions[rep.routeId];
        if (!pos) return null;
        return (
          <g key={rep.routeId}>
            {/* Zone circle */}
            <circle
              cx={pos.x} cy={pos.y} r={28}
              fill={STATUS_LIGHT[rep.statusColor]}
              opacity={0.08}
              stroke={STATUS_LIGHT[rep.statusColor]}
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            {/* Rep dot */}
            <circle cx={pos.x} cy={pos.y} r={8} fill={STATUS_LIGHT[rep.statusColor]} />
            <circle cx={pos.x} cy={pos.y} r={12} fill="none" stroke={STATUS_LIGHT[rep.statusColor]} strokeWidth="1" opacity={0.4}>
              <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Label */}
            <text x={pos.x} y={pos.y - 16} textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--pl-text)" fontWeight="bold">
              {rep.routeId}
            </text>
            <text x={pos.x} y={pos.y + 24} textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--pl-text-muted)">
              {rep.sellerName.split(' ')[0]}
            </text>
          </g>
        );
      })}

      {/* Dallas label */}
      <text x="210" y="290" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--pl-text-faint)">
        Dallas District — 8 Routes · Live Positions
      </text>
    </svg>
    </>
  );
}

export default function ManagerDashboardPage() {
  const [tab, setTab] = useState<'coaching' | 'territory'>('coaching');
  const district = getDistrictSummary();
  const urgentCards = getUrgentCards();

  return (
    <>
    
      <ActNavigation currentAct={3} />

      {/* Header */}
      <div className="mt-6 mb-6 flex items-start justify-between">
        <div>
          <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#2563EB' }}>
            Manager Dashboard &middot; Sarah Chen &middot; Dallas District
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
            District Command Center
          </h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
            8 reps · {district.stopsCompleted}/{district.totalStops} stops completed · Real-time coaching & territory view
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/proofline-andrews/proofline-route"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-mono font-bold transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #C6A052, #a8842e)',
              color: '#0a0f1e',
              boxShadow: '0 1px 4px rgba(198,160,82,0.2)',
            }}
          >
            Rep Tablet
          </Link>
          <button
            onClick={() => broadcastAlert({
              id: `alert-${Date.now()}`,
              severity: 'info',
              message: 'All reps: Check updated route priorities in your coaching feed.',
              timestamp: new Date().toISOString(),
            })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-mono transition-all hover:opacity-80"
            style={{ border: '1px solid var(--pl-border)', color: 'var(--pl-text-muted)' }}
          >
            Broadcast All
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6 items-stretch">
        <LightKpiCard label="Cases Today" value={fmt(district.totalCasesDelivered)} accent="#2563EB" sub={`of ${fmt(district.totalCasesTarget)} target`} stagger={0} />
        <LightKpiCard label="Revenue Today" value={fmtM(district.totalRevenue)} accent="#2563EB" sub="Projected" stagger={1} />
        <LightKpiCard label="Avg On-Time" value={pct(district.avgOnTimeRate)} accent={district.avgOnTimeRate >= 0.90 ? '#22C55E' : '#F59E0B'} sub="Delivery rate" stagger={2} />
        <LightKpiCard label="Avg Attainment" value={pct(district.avgAttainment)} accent={district.avgAttainment >= 1.0 ? '#22C55E' : '#F59E0B'} sub="Quota progress" stagger={3} />
        <LightKpiCard label="On Track" value={`${district.onTrackCount}/8`} accent="#22C55E" sub={district.issueCount > 0 ? `${district.issueCount} issue` : 'All clear'} stagger={4} />
        <LightKpiCard label="Urgent Cards" value={String(urgentCards.length)} accent={urgentCards.length > 0 ? '#F87171' : '#22C55E'} sub="Needs attention" stagger={5} />
      </div>

      {/* Tab Toggle */}
      <div className="flex items-center gap-3 mb-6">
        {(['coaching', 'territory'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="text-[12px] font-mono px-4 py-1.5 rounded-lg border transition-colors"
            style={{
              borderColor: tab === t ? '#2563EB' : 'var(--pl-border)',
              background: tab === t ? 'rgba(37,99,235,0.08)' : 'var(--pl-card)',
              color: tab === t ? '#2563EB' : 'var(--pl-text-muted)',
              fontWeight: tab === t ? 700 : 400,
            }}
          >
            {t === 'coaching' ? 'Coaching Dashboard' : 'Territory Command'}
          </button>
        ))}
      </div>

      {tab === 'coaching' ? (
        <>
          {/* Rep Grid (traffic lights) */}
          <LightSectionCard title="Rep Status — Live" className="mb-6">
            <div className="grid grid-cols-4 gap-3">
              {DALLAS_DISTRICT_LIVE.map(rep => (
                <RepCard key={rep.sellerId} rep={rep} />
              ))}
            </div>
          </LightSectionCard>

          {/* Coaching Cards */}
          <LightSectionCard title={`Coaching Cards — ${COACHING_CARDS.length} Active`} className="mb-6">
            <div className="space-y-3">
              {COACHING_CARDS.map(card => (
                <CoachingCardView key={card.id} card={card} />
              ))}
            </div>
          </LightSectionCard>

          {/* Weekly Agenda */}
          <LightSectionCard title="Weekly Coaching Agenda" className="mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr style={{ color: 'var(--pl-text-muted)' }}>
                    <th className="text-left font-medium pb-3 pl-2">Rep</th>
                    <th className="text-left font-medium pb-3">Route</th>
                    <th className="text-left font-medium pb-3">Type</th>
                    <th className="text-left font-medium pb-3">Date</th>
                    <th className="text-left font-medium pb-3">Focus</th>
                    <th className="text-right font-medium pb-3 pr-2">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {WEEKLY_COACHING_AGENDA.map((item, i) => {
                    const mt = MEETING_LABELS[item.meetingType];
                    const pCfg = PRIORITY_CONFIG[item.urgency];
                    return (
                      <tr key={item.sellerId} style={{ background: i % 2 === 0 ? 'var(--pl-stripe)' : undefined }}>
                        <td className="py-2 pl-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-semibold" style={{ color: 'var(--pl-text)' }}>{item.sellerName}</span>
                            <span className="text-xs font-mono px-1 py-0.5 rounded" style={{ background: pCfg.bg, color: pCfg.color }}>
                              {pCfg.label}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 font-mono" style={{ color: 'var(--pl-text-muted)' }}>{item.routeId}</td>
                        <td className="py-2">
                          <span className="text-xs font-bold font-mono" style={{ color: mt.color }}>{mt.label}</span>
                        </td>
                        <td className="py-2 font-mono" style={{ color: 'var(--pl-text-muted)' }}>{item.scheduledDate}</td>
                        <td className="py-2 text-[13px] max-w-[200px]" style={{ color: 'var(--pl-text-muted)' }}>
                          {item.focusTopics[0]}
                        </td>
                        <td className="py-2 text-right pr-2 font-mono font-bold" style={{ color: item.attainmentGap > 0.05 ? '#F87171' : item.attainmentGap > 0 ? '#F59E0B' : '#22C55E' }}>
                          {item.attainmentGap > 0 ? '-' : '+'}{Math.abs(item.attainmentGap * 100).toFixed(0)}pp
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </LightSectionCard>
        </>
      ) : (
        <>
          {/* Territory Map */}
          <LightSectionCard title="Dallas District — Live Route Positions" className="mb-6">
            <TerritoryMap reps={DALLAS_DISTRICT_LIVE} />
            <div className="flex items-center gap-6 mt-3 text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} /> On Track / Ahead</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ background: '#F59E0B' }} /> Behind Schedule</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ background: '#F87171' }} /> Issue</div>
              <span>Pulsing dot = live position</span>
            </div>
          </LightSectionCard>

          {/* Rolling KPI Counters */}
          <LightSectionCard title="Rolling District KPIs" className="mb-6">
            <div className="grid grid-cols-4 gap-4">
              {DALLAS_DISTRICT_LIVE.map(rep => {
                const light = STATUS_LIGHT[rep.statusColor];
                return (
                  <div key={rep.sellerId} className="rounded-lg border p-3" style={{ borderColor: 'var(--pl-border)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: light }} />
                      <span className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>{rep.sellerName.split(' ')[0]}</span>
                      <span className="text-xs font-mono ml-auto" style={{ color: 'var(--pl-text-faint)' }}>{rep.routeId}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <span style={{ color: 'var(--pl-text-faint)' }}>Cases</span>
                        <div className="font-bold" style={{ color: 'var(--pl-text)' }}>{fmt(rep.casesDelivered)}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--pl-text-faint)' }}>Revenue</span>
                        <div className="font-bold" style={{ color: '#2563EB' }}>${fmtK(rep.revenueToday)}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--pl-text-faint)' }}>Stops</span>
                        <div className="font-bold" style={{ color: light }}>{rep.currentStop}/{rep.totalStops}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--pl-text-faint)' }}>Attain</span>
                        <div className="font-bold" style={{ color: rep.attainment >= 1.0 ? '#22C55E' : '#F59E0B' }}>{pct(rep.attainment)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          {/* Exception Feed */}
          <LightSectionCard title="Exception Alert Feed" className="mb-6">
            <div className="space-y-2">
              {DALLAS_DISTRICT_LIVE.filter(r => r.status === 'issue' || r.status === 'behind').map(rep => {
                const light = STATUS_LIGHT[rep.statusColor];
                const card = COACHING_CARDS.find(c => c.sellerId === rep.sellerId);
                return (
                  <div key={rep.sellerId} className="flex items-start gap-3 px-4 py-3 rounded-lg border" style={{ borderColor: light + '40' }}>
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 animate-pulse" style={{ background: light }} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] font-bold" style={{ color: 'var(--pl-text)' }}>{rep.sellerName}</span>
                        <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>{rep.routeId}</span>
                        <span className="text-xs font-bold font-mono uppercase" style={{ color: light }}>{rep.status}</span>
                      </div>
                      <p className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
                        {card?.title ?? `Stop ${rep.currentStop}/${rep.totalStops} — on-time rate ${pct(rep.onTimeRate)}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          {/* Spirits Penetration */}
          <LightSectionCard title="Spirits Penetration — Dallas District" className="mb-6">
            <div className="space-y-2">
              {DALLAS_DISTRICT_LIVE.map(rep => {
                // Pull spirits data from route data
                const spiritsAccounts = Math.round(rep.attainment * 10); // simulated
                const target = 12;
                const pctDone = spiritsAccounts / target;
                return (
                  <div key={rep.sellerId} className="flex items-center gap-3">
                    <span className="text-[13px] font-mono w-20" style={{ color: 'var(--pl-text)' }}>{rep.routeId}</span>
                    <span className="text-[13px] w-28 truncate" style={{ color: 'var(--pl-text-muted)' }}>{rep.sellerName}</span>
                    <div className="flex-1 h-3 rounded-full" style={{ background: 'var(--pl-chart-bar-track)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(pctDone * 100, 100)}%`,
                          background: pctDone >= 1.0 ? '#22C55E' : pctDone >= 0.7 ? '#F59E0B' : '#F87171',
                        }}
                      />
                    </div>
                    <span className="text-[13px] font-mono w-16 text-right" style={{ color: pctDone >= 1.0 ? '#22C55E' : 'var(--pl-text-muted)' }}>
                      {spiritsAccounts}/{target}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
              Target: 12 spirits-carrying accounts per route. W-permit and MB-license accounts only.
            </div>
          </LightSectionCard>
        </>
      )}

      {/* Methodology */}
      <div className="text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        Manager view: Sarah Chen, Dallas District (8 reps). Coaching cards AI-generated from route performance, CRM, and competitive intel.
        Territory map shows live positions (simulated). Click any rep card to view detailed performance history.
      </div>
    
    </>
  );
}
