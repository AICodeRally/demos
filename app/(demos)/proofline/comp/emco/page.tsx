'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  EMCO_GATES,
  SELLERS,
  HOMETOWNS,
  getGateStatus,
  countUnlockedGates,
  getEffectiveMultiplier,
} from '@/data/proofline';
import { pct } from '@/lib/utils';

/* ── Gate Status Badge ───────────────────────── */
function GateStatusBadge({ status }: { status: 'locked' | 'unlocked' | 'at-risk' }) {
  const cfg = {
    locked: { bg: 'rgba(248,113,113,0.1)', color: '#F87171', icon: '\u2717' },
    unlocked: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', icon: '\u2713' },
    'at-risk': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', icon: '\u26A0' },
  }[status];

  return (
    <>
    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-0.5"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.icon} {status.toUpperCase()}
    </span>
    </>
  );
}

/* ── Mini Sparkline (13-week attainment) ─────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80, h = 20;
  const max = Math.max(...data, 1);
  const path = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i / (data.length - 1)) * w},${h - (v / max) * h}`)
    .join(' ');

  return (
    <>
    <svg viewBox={`0 0 ${w} ${h}`} width={80} height={20}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={w} cy={h - (data[data.length - 1] / max) * h} r={2} fill={color} />
    </svg>
    </>
  );
}

/* ── Gate Progress Bar ───────────────────────── */
function GateBar({ value, threshold, color }: { value: number; threshold: number; color: string }) {
  const pctVal = Math.min(value * 100, 100);
  const threshPct = threshold * 100;
  const status = getGateStatus(threshold, value);
  const barColor = status === 'unlocked' ? '#22C55E' : status === 'at-risk' ? '#F59E0B' : color;

  return (
    <>
    <div className="relative" style={{ width: 120, height: 16 }}>
      <div className="absolute inset-0 rounded-full" style={{ background: '#F1F5F9' }} />
      <div className="absolute top-0 left-0 h-full rounded-full transition-all" style={{ width: `${pctVal}%`, background: barColor, opacity: 0.7 }} />
      {/* Threshold marker */}
      <div className="absolute top-0 h-full" style={{ left: `${threshPct}%`, width: 2, background: '#1A1A2E', opacity: 0.3 }} />
      <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold font-mono" style={{ color: '#1A1A2E' }}>
        {(value * 100).toFixed(0)}%
      </div>
    </div>
    </>
  );
}

export default function EmcoGatesPage() {
  const [selectedHometown, setSelectedHometown] = useState<string | null>(null);
  const sellers = SELLERS.filter(s => !selectedHometown || s.hometown === selectedHometown);

  // Aggregate stats
  const allSellers = SELLERS;
  const gateStats = EMCO_GATES.map(gate => {
    const unlocked = allSellers.filter(s => getGateStatus(gate.threshold, s.emcoGates[gate.name]) === 'unlocked').length;
    const atRisk = allSellers.filter(s => getGateStatus(gate.threshold, s.emcoGates[gate.name]) === 'at-risk').length;
    return { gate, unlocked, atRisk, locked: allSellers.length - unlocked - atRisk };
  });

  const avgGatesUnlocked = allSellers.reduce((s, sel) => s + countUnlockedGates(sel.emcoGates), 0) / allSellers.length;
  const full4Gate = allSellers.filter(s => countUnlockedGates(s.emcoGates) === 4).length;
  const zeroGate = allSellers.filter(s => countUnlockedGates(s.emcoGates) === 0).length;

  return (
    <>
    
      <ActNavigation currentAct={4} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-[10px] tracking-[3px] uppercase font-mono mb-1" style={{ color: '#10B981' }}>
          EMCO Gate System &middot; 4-Gate Architecture
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#1A1A2E', fontFamily: "'Space Grotesk', sans-serif" }}>
          EMCO Gate Performance
        </h1>
        <p className="text-[13px] mt-1" style={{ color: '#718096' }}>
          {allSellers.length} reps &middot; {EMCO_GATES.length} gates &middot; {full4Gate} with all 4 unlocked
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="Avg Gates Unlocked" value={avgGatesUnlocked.toFixed(1)} accent="#22C55E" sub={`of ${EMCO_GATES.length} gates`} />
        <LightKpiCard label="Full 4-Gate" value={String(full4Gate)} accent="#22C55E" sub={`${((full4Gate / allSellers.length) * 100).toFixed(0)}% of reps`} />
        <LightKpiCard label="Zero Gates" value={String(zeroGate)} accent={zeroGate > 0 ? '#F87171' : '#22C55E'} sub="Need coaching" />
        <LightKpiCard label="Core Gate Pass" value={pct(gateStats[0].unlocked / allSellers.length)} accent="#60A5FA" sub={`${gateStats[0].unlocked}/${allSellers.length} reps`} />
        <LightKpiCard label="Combined Gate" value={pct(gateStats[3].unlocked / allSellers.length)} accent="#10B981" sub={`${gateStats[3].unlocked}/${allSellers.length} reps (1.5x)`} />
      </div>

      {/* Gate Summary Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {gateStats.map(({ gate, unlocked, atRisk, locked }) => (
          <div key={gate.name} className="rounded-lg border p-4" style={{ borderColor: `${gate.color}40` }}>
            <div className="text-[10px] font-bold font-mono mb-1" style={{ color: gate.color }}>{gate.name.toUpperCase()} GATE</div>
            <div className="text-[14px] font-bold mb-1" style={{ color: '#1A1A2E' }}>{gate.label}</div>
            <div className="text-[10px] font-mono mb-2" style={{ color: '#718096' }}>Multiplier: {gate.multiplier.toFixed(2)}x</div>

            {/* Stacked status bar */}
            <div className="flex rounded-full overflow-hidden mb-2" style={{ height: 8 }}>
              <div style={{ width: `${(unlocked / allSellers.length) * 100}%`, background: '#22C55E' }} />
              <div style={{ width: `${(atRisk / allSellers.length) * 100}%`, background: '#F59E0B' }} />
              <div style={{ width: `${(locked / allSellers.length) * 100}%`, background: '#F1F5F9' }} />
            </div>

            <div className="flex gap-3 text-[9px] font-mono">
              <span style={{ color: '#22C55E' }}>{unlocked} unlocked</span>
              <span style={{ color: '#F59E0B' }}>{atRisk} at-risk</span>
              <span style={{ color: '#A0AEC0' }}>{locked} locked</span>
            </div>
          </div>
        ))}
      </div>

      {/* Hometown Filter */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setSelectedHometown(null)}
          className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-colors"
          style={{ background: !selectedHometown ? '#10B981' : '#F1F5F9', color: !selectedHometown ? 'white' : '#718096' }}
        >
          All ({allSellers.length})
        </button>
        {HOMETOWNS.map(ht => {
          const count = SELLERS.filter(s => s.hometown === ht.id).length;
          return (
            <button
              key={ht.id}
              onClick={() => setSelectedHometown(ht.id)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-colors"
              style={{ background: selectedHometown === ht.id ? '#10B981' : '#F1F5F9', color: selectedHometown === ht.id ? 'white' : '#718096' }}
            >
              {ht.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Rep Gate Table */}
      <LightSectionCard title={`Rep Gate Status${selectedHometown ? ` — ${HOMETOWNS.find(h => h.id === selectedHometown)?.name}` : ''}`} className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                <th className="text-left py-2 px-2 font-mono font-bold" style={{ color: '#718096' }}>Rep</th>
                <th className="text-left py-2 px-2 font-mono font-bold" style={{ color: '#718096' }}>Route</th>
                <th className="text-center py-2 px-2 font-mono font-bold" style={{ color: '#60A5FA' }}>Core</th>
                <th className="text-center py-2 px-2 font-mono font-bold" style={{ color: '#F59E0B' }}>Import</th>
                <th className="text-center py-2 px-2 font-mono font-bold" style={{ color: '#A78BFA' }}>Emerging</th>
                <th className="text-center py-2 px-2 font-mono font-bold" style={{ color: '#10B981' }}>Combined</th>
                <th className="text-center py-2 px-2 font-mono font-bold" style={{ color: '#718096' }}>Gates</th>
                <th className="text-center py-2 px-2 font-mono font-bold" style={{ color: '#718096' }}>Mult</th>
                <th className="text-center py-2 px-2 font-mono font-bold" style={{ color: '#718096' }}>13-Wk</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map(seller => {
                const unlocked = countUnlockedGates(seller.emcoGates);
                const mult = getEffectiveMultiplier(seller.emcoGates);

                return (
                  <tr key={seller.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td className="py-2 px-2 font-bold" style={{ color: '#1A1A2E' }}>{seller.name}</td>
                    <td className="py-2 px-2 font-mono" style={{ color: '#718096' }}>{seller.routeId}</td>

                    {EMCO_GATES.map(gate => {
                      const val = seller.emcoGates[gate.name];
                      const status = getGateStatus(gate.threshold, val);
                      return (
                        <td key={gate.name} className="py-2 px-2 text-center">
                          <GateBar value={val} threshold={gate.threshold} color={gate.color} />
                        </td>
                      );
                    })}

                    <td className="py-2 px-2 text-center">
                      <span className="font-bold font-mono" style={{
                        color: unlocked === 4 ? '#22C55E' : unlocked >= 2 ? '#F59E0B' : '#F87171'
                      }}>
                        {unlocked}/4
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-bold" style={{
                      color: mult > 1.25 ? '#22C55E' : mult > 1 ? '#F59E0B' : '#A0AEC0'
                    }}>
                      {mult.toFixed(2)}x
                    </td>
                    <td className="py-2 px-2 text-center">
                      <Sparkline
                        data={seller.weeklyAttainment}
                        color={seller.attainment >= 1.0 ? '#22C55E' : seller.attainment >= 0.85 ? '#F59E0B' : '#F87171'}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[11px] font-mono" style={{ color: '#A0AEC0' }}>
        EMCO = Extended Mixed Category Objective. Gates evaluate supplier-group attainment as a % of quarterly target.
        Thresholds: Core ≥85% (Molson Coors), Import ≥80% (Constellation+Heineken), Emerging ≥70% (Craft+Spirits+FMB), Combined ≥90% (all).
        At-risk = within 5% of threshold. Multipliers stack — only highest unlocked gate applies.
      </div>
    
    </>
  );
}
