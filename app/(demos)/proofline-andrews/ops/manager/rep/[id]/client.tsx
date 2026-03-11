'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  SELLERS,
  getSellerById,
  ROUTES,
  getRouteById,
  BRAND_FAMILIES,
  SUPPLIER_COLORS,
  getBrandsBySupplier,
  DALLAS_DISTRICT_LIVE,
  getLiveSnapshot,
  getCoachingHistory,
  getCoachingCardsBySeller,
  getAgendaForSeller,
  EMCO_GATES,
  COMP_TIERS,
  getGateStatus,
  type SupplierGroup,
  type Seller,
} from '@/data/proofline';
import { fmt, fmtM, pct } from '@/lib/utils';

function localFmtK(n: number) { return `${(n / 1e3).toFixed(0)}K`; }

/* -- Supplier display names -- */
const SUPPLIER_NAMES: Record<SupplierGroup, string> = {
  'molson-coors': 'Molson Coors',
  'constellation': 'Constellation',
  'heineken': 'Heineken',
  'craft': 'Craft / Regional',
  'sazerac': 'Sazerac',
  'fmb-rtd': 'FMB / RTD',
};

const SUPPLIERS: SupplierGroup[] = ['molson-coors', 'constellation', 'heineken', 'craft', 'sazerac', 'fmb-rtd'];

/* -- 13-Week Attainment Chart (SVG area) -- */
function AttainmentChart({ weekly, peerAvg }: { weekly: number[]; peerAvg: number[] }) {
  const w = 600, h = 180, px = 40, py = 20;
  const plotW = w - px * 2, plotH = h - py * 2;
  const maxVal = 1.15;

  const toPoint = (val: number, idx: number) => ({
    x: px + (idx / 12) * plotW,
    y: py + plotH - (val / maxVal) * plotH,
  });

  const repPoints = weekly.map((v, i) => toPoint(v, i));
  const peerPoints = peerAvg.map((v, i) => toPoint(v, i));
  const repPath = repPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const repArea = repPath + ` L${repPoints[12].x},${py + plotH} L${repPoints[0].x},${py + plotH} Z`;
  const peerPath = peerPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  const targetY = py + plotH - (1.0 / maxVal) * plotH;

  return (
    <>
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {[0.25, 0.50, 0.75, 1.00].map(v => {
        const y = py + plotH - (v / maxVal) * plotH;
        return (
          <g key={v}>
            <line x1={px} y1={y} x2={w - px} y2={y} stroke="var(--pl-chart-grid)" strokeWidth="0.5" />
            <text x={px - 4} y={y + 3} textAnchor="end" fontSize="12" fill="var(--pl-text-faint)" fontFamily="monospace">{(v * 100).toFixed(0)}%</text>
          </g>
        );
      })}

      <line x1={px} y1={targetY} x2={w - px} y2={targetY} stroke="#2563EB" strokeWidth="1" strokeDasharray="4 2" />
      <text x={w - px + 4} y={targetY + 3} fontSize="12" fill="#2563EB" fontFamily="monospace">100%</text>

      <path d={peerPath} fill="none" stroke="var(--pl-text-faint)" strokeWidth="1" strokeDasharray="3 3" />

      <path d={repArea} fill="rgba(37,99,235,0.08)" />
      <path d={repPath} fill="none" stroke="#2563EB" strokeWidth="2" />

      {repPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#2563EB" />
      ))}

      {weekly.map((_, i) => (
        <text key={i} x={px + (i / 12) * plotW} y={h - 2} textAnchor="middle" fontSize="12" fill="var(--pl-text-faint)" fontFamily="monospace">
          W{i + 1}
        </text>
      ))}
    </svg>
    </>
  );
}

export default function RepDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showPeerCompare, setShowPeerCompare] = useState(false);

  const seller = getSellerById(id);
  if (!seller) {
    return (
      <>
        <ActNavigation currentAct={3} />
        <div className="mt-6 p-8 text-center">
          <h1 className="text-xl font-bold" style={{ color: 'var(--pl-text)' }}>Rep not found: {id}</h1>
          <Link href="/proofline-andrews/ops/manager" className="text-[13px] mt-2" style={{ color: '#2563EB' }}>Back to Manager Dashboard</Link>
        </div>
      </>
    );
  }

  const route = getRouteById(seller.routeId);
  const liveSnap = getLiveSnapshot(id);
  const coachingCards = getCoachingCardsBySeller(id);
  const history = getCoachingHistory(id);
  const agenda = getAgendaForSeller(id);
  const tier = COMP_TIERS.find(t => t.level === seller.tier);

  const peerSellers = SELLERS.filter(s => s.hometown === seller.hometown && s.id !== seller.id);
  const peerAvg = seller.weeklyAttainment.map((_, wi) => {
    const sum = peerSellers.reduce((s, ps) => s + (ps.weeklyAttainment[wi] ?? 0), 0);
    return peerSellers.length > 0 ? sum / peerSellers.length : 0;
  });

  const gates = [
    { name: 'Core', value: seller.emcoGates.core, threshold: EMCO_GATES[0]?.threshold ?? 0.85 },
    { name: 'Import', value: seller.emcoGates.import, threshold: EMCO_GATES[1]?.threshold ?? 0.80 },
    { name: 'Emerging', value: seller.emcoGates.emerging, threshold: EMCO_GATES[2]?.threshold ?? 0.70 },
    { name: 'Combined', value: seller.emcoGates.combined, threshold: EMCO_GATES[3]?.threshold ?? 0.90 },
  ];

  return (
    <>
      <ActNavigation currentAct={3} />

      {/* Breadcrumb */}
      <div className="mt-4 flex items-center gap-2 text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        <Link href="/proofline-andrews/ops/manager" style={{ color: '#2563EB' }}>Manager Dashboard</Link>
        <span>/</span>
        <span>{seller.name}</span>
      </div>

      {/* Header */}
      <div className="mt-4 mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
            {seller.name}
          </h1>
          <span className="text-[13px] font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB' }}>
            {seller.routeId}
          </span>
          <span
            className="text-[13px] font-mono px-2 py-0.5 rounded"
            style={{
              background: seller.atRisk ? 'rgba(248,113,113,0.08)' : 'rgba(34,197,94,0.08)',
              color: seller.atRisk ? '#F87171' : '#22C55E',
            }}
          >
            {seller.atRisk ? 'AT RISK' : `Tier ${seller.tier}`}
          </span>
          {liveSnap && (
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{
                background: liveSnap.statusColor === 'green' ? 'rgba(34,197,94,0.08)' : liveSnap.statusColor === 'amber' ? 'rgba(245,158,11,0.08)' : 'rgba(248,113,113,0.08)',
                color: liveSnap.statusColor === 'green' ? '#22C55E' : liveSnap.statusColor === 'amber' ? '#F59E0B' : '#F87171',
              }}
            >
              LIVE: Stop {liveSnap.currentStop}/{liveSnap.totalStops} &middot; {liveSnap.status}
            </span>
          )}
        </div>
        <p className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
          {seller.tenure} months tenure &middot; {route?.accounts ?? '\u2014'} accounts &middot; {seller.spiritsAccounts} spirits &middot; {route?.channel ?? '\u2014'}
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        <LightKpiCard label="Attainment" value={pct(seller.attainment)} accent={seller.attainment >= 1.0 ? '#22C55E' : '#F59E0B'} sub={`Tier ${seller.tier}`} />
        <LightKpiCard label="Q Revenue" value={fmtM(route?.rev ?? 0)} accent="#2563EB" sub={`${localFmtK(route?.cases ?? 0)} cases`} />
        <LightKpiCard label="Spirits Accts" value={String(seller.spiritsAccounts)} accent="#F87171" sub={`of ${route?.accounts ?? 0} total`} />
        <LightKpiCard label="On-Time" value={pct(route?.onTimeRate ?? 0)} accent={(route?.onTimeRate ?? 0) >= 0.93 ? '#22C55E' : '#F59E0B'} />
        <LightKpiCard label="Display" value={pct(route?.displayCompliance ?? 0)} accent={(route?.displayCompliance ?? 0) >= 0.90 ? '#22C55E' : '#F59E0B'} />
        <LightKpiCard label="Gates" value={`${gates.filter(g => g.value >= g.threshold).length}/4`} accent="#2563EB" sub="Unlocked" />
      </div>

      {/* 13-Week Attainment Chart */}
      <LightSectionCard title="13-Week Cumulative Attainment" className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => setShowPeerCompare(!showPeerCompare)}
            className="text-[13px] font-mono px-3 py-1 rounded-lg border transition-colors"
            style={{
              borderColor: showPeerCompare ? '#2563EB' : 'var(--pl-border)',
              background: showPeerCompare ? 'rgba(37,99,235,0.08)' : 'var(--pl-card)',
              color: showPeerCompare ? '#2563EB' : 'var(--pl-text-muted)',
            }}
          >
            {showPeerCompare ? 'Hide' : 'Show'} Peer Comparison
          </button>
          <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
            Blue = {seller.name.split(' ')[0]} &middot; {showPeerCompare ? 'Dashed = district avg' : 'Dashed line = 100% target'}
          </span>
        </div>
        <AttainmentChart weekly={seller.weeklyAttainment} peerAvg={showPeerCompare ? peerAvg : seller.weeklyAttainment.map(() => 0)} />
      </LightSectionCard>

      {/* Brand Mix vs Targets */}
      <LightSectionCard title="Brand Mix \u2014 Current vs Target" className="mb-6">
        <div className="space-y-3">
          {SUPPLIERS.map(s => {
            const current = seller.brandMix[s] ?? 0;
            const brands = getBrandsBySupplier(s);
            const totalRev = BRAND_FAMILIES.reduce((sum, b) => sum + b.revQ, 0);
            const supplierRev = brands.reduce((sum, b) => sum + b.revQ, 0);
            const target = supplierRev / totalRev;
            const color = SUPPLIER_COLORS[s];

            return (
              <div key={s}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    <span className="text-[12px] font-semibold" style={{ color: 'var(--pl-text)' }}>{SUPPLIER_NAMES[s]}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span style={{ color: 'var(--pl-text-muted)' }}>Current: <strong style={{ color }}>{pct(current)}</strong></span>
                    <span style={{ color: 'var(--pl-text-faint)' }}>Target: {pct(target)}</span>
                    <span style={{ color: current >= target ? '#22C55E' : '#F87171' }}>
                      {current >= target ? '+' : ''}{((current - target) * 100).toFixed(1)}pp
                    </span>
                  </div>
                </div>
                <div className="relative h-3 rounded-full" style={{ background: 'var(--pl-chart-bar-track)' }}>
                  <div className="absolute top-0 h-full rounded-full" style={{ width: `${current * 200}%`, background: color, opacity: 0.6, maxWidth: '100%' }} />
                  <div className="absolute top-0 h-full w-0.5" style={{ left: `${target * 200}%`, background: 'var(--pl-text)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </LightSectionCard>

      {/* Gate Status */}
      <LightSectionCard title="Gate Status" className="mb-6">
        <div className="grid grid-cols-4 gap-3">
          {gates.map(g => {
            const unlocked = g.value >= g.threshold;
            return (
              <div
                key={g.name}
                className="rounded-lg border p-4 text-center"
                style={{ borderColor: unlocked ? '#22C55E' : 'var(--pl-border)', background: unlocked ? 'rgba(34,197,94,0.04)' : 'var(--pl-card)' }}
              >
                <div className="text-xs font-mono mb-1" style={{ color: 'var(--pl-text-faint)' }}>{g.name} Gate</div>
                <div className="text-[22px] font-bold font-mono" style={{ color: unlocked ? '#22C55E' : '#F87171' }}>
                  {pct(g.value)}
                </div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                  Threshold: {pct(g.threshold)} {unlocked ? '\u2713' : '\u2717'}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
          Comp tier: <strong style={{ color: 'var(--pl-text)' }}>Tier {seller.tier}</strong>
          {tier && <> &middot; Rate: {pct(tier.rate)}</>}
          &middot; {gates.filter(g => g.value >= g.threshold).length} of 4 gates unlocked
        </div>
      </LightSectionCard>

      {/* Coaching History */}
      {history.length > 0 && (
        <LightSectionCard title="Coaching History" className="mb-6">
          <div className="space-y-3">
            {history.map(entry => (
              <div key={entry.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#2563EB' }} />
                  <div className="w-0.5 flex-1" style={{ background: 'var(--pl-border)' }} />
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-bold" style={{ color: 'var(--pl-text)' }}>{entry.summary}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
                    <span>{entry.date}</span>
                    <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB' }}>{entry.type}</span>
                  </div>
                  <ul className="space-y-0.5 mb-1">
                    {entry.outcomes.map((o, i) => (
                      <li key={i} className="text-[13px] flex items-start gap-1.5" style={{ color: 'var(--pl-text-muted)' }}>
                        <span style={{ color: '#22C55E' }}>&#x2022;</span> {o}
                      </li>
                    ))}
                  </ul>
                  {entry.managerNotes && (
                    <p className="text-xs italic" style={{ color: 'var(--pl-text-faint)' }}>&mdash; {entry.managerNotes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </LightSectionCard>
      )}

      {/* Active Coaching Cards */}
      {coachingCards.length > 0 && (
        <LightSectionCard title={`Active Coaching Cards \u2014 ${coachingCards.length}`} className="mb-6">
          <div className="space-y-2">
            {coachingCards.map(card => (
              <div key={card.id} className="rounded-lg border p-3" style={{ borderColor: 'var(--pl-border)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                    style={{
                      background: card.priority === 'urgent' ? 'rgba(220,38,38,0.08)' : card.priority === 'high' ? 'rgba(248,113,113,0.08)' : 'rgba(245,158,11,0.08)',
                      color: card.priority === 'urgent' ? '#DC2626' : card.priority === 'high' ? '#F87171' : '#F59E0B',
                    }}
                  >
                    {card.priority.toUpperCase()}
                  </span>
                  <span className="text-[12px] font-bold" style={{ color: 'var(--pl-text)' }}>{card.title}</span>
                </div>
                <p className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>{card.suggestedAction}</p>
              </div>
            ))}
          </div>
        </LightSectionCard>
      )}

      {/* Manager note */}
      <div className="text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        {seller.coachingNote}
      </div>
    </>
  );
}
