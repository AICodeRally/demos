'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  SELLERS,
  HOMETOWNS,
  BBI_GATES,
  COMP_TIERS,
  getGateStatus,
  countUnlockedGates,
  getEffectiveMultiplier,
  type Seller,
} from '@/data/proofline';
import { pct } from '@/lib/utils';

/* ── Attainment Ring (hero gauge) ─────────────── */
function AttainmentRing({ seller }: { seller: Seller }) {
  const size = 160;
  const r = 58;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const pctVal = Math.min(seller.attainment, 1.3);
  const fillPct = pctVal / 1.3;
  const color = seller.attainment >= 1.0 ? '#22C55E' : seller.attainment >= 0.85 ? '#F59E0B' : '#F87171';

  // Tier info
  const tier = COMP_TIERS.find(t => seller.attainment >= t.floor && seller.attainment < t.ceiling) ?? COMP_TIERS[3];
  const gates = countUnlockedGates(seller.bbiGates);
  const mult = getEffectiveMultiplier(seller.bbiGates);

  return (
    <>
    <div className="flex items-center gap-6">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="flex-shrink-0">
        <defs>
          <linearGradient id="att-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth="12" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#att-ring-grad)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${fillPct * circ} ${circ}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="32" fontWeight="bold" fill="#1A1A2E" fontFamily="monospace">
          {(seller.attainment * 100).toFixed(0)}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="12" fill="#718096" fontFamily="monospace">
          attainment
        </text>
      </svg>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <div>
          <div className="text-xs font-mono font-bold" style={{ color: '#A0AEC0' }}>TIER</div>
          <div className="text-[18px] font-bold font-mono" style={{ color: '#1A1A2E' }}>{tier.label.split(' \u2014 ')[1]}</div>
          <div className="text-xs font-mono" style={{ color: '#718096' }}>{(tier.rate * 100).toFixed(1)}% commission rate</div>
        </div>
        <div>
          <div className="text-xs font-mono font-bold" style={{ color: '#A0AEC0' }}>GATES</div>
          <div className="text-[18px] font-bold font-mono" style={{ color: gates >= 3 ? '#22C55E' : '#F59E0B' }}>{gates}/4</div>
          <div className="text-xs font-mono" style={{ color: '#718096' }}>{mult.toFixed(2)}x multiplier</div>
        </div>
        <div>
          <div className="text-xs font-mono font-bold" style={{ color: '#A0AEC0' }}>SPIRITS</div>
          <div className="text-[18px] font-bold font-mono" style={{ color: seller.spiritsAccounts >= 5 ? '#10B981' : '#F87171' }}>{seller.spiritsAccounts}</div>
          <div className="text-xs font-mono" style={{ color: '#718096' }}>{seller.spiritsAccounts >= 5 ? '1.5% adder qualified' : `Need ${5 - seller.spiritsAccounts} more accts`}</div>
        </div>
        <div>
          <div className="text-xs font-mono font-bold" style={{ color: '#A0AEC0' }}>STATUS</div>
          <div className="text-[18px] font-bold font-mono" style={{ color: seller.atRisk ? '#F87171' : '#22C55E' }}>
            {seller.atRisk ? 'AT RISK' : 'ON TRACK'}
          </div>
          <div className="text-xs font-mono" style={{ color: '#718096' }}>Week 9 of 13</div>
        </div>
      </div>
    </div>
    </>
  );
}

/* ── Attainment Curve (SVG) ──────────────────── */
function AttainmentCurve({ seller }: { seller: Seller }) {
  const data = seller.weeklyAttainment;
  const w = 500, h = 120;
  const max = Math.max(...data, 1.1);
  const currentWeek = 8; // we're at week 9 (0-indexed = 8)

  const path = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i / (data.length - 1)) * w},${h - (v / max) * h}`)
    .join(' ');

  // Area under curve
  const areaPath = path + ` L${w},${h} L0,${h} Z`;

  // 100% target line
  const targetY = h - (1.0 / max) * h;

  return (
    <>
    <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full" style={{ height: h + 20 }}>
      {/* Target line */}
      <line x1={0} y1={targetY} x2={w} y2={targetY} stroke="#22C55E" strokeWidth="1" strokeDasharray="4 2" />
      <text x={w - 2} y={targetY - 4} textAnchor="end" fontSize="12" fill="#22C55E" fontFamily="monospace">100% TARGET</text>

      {/* Area */}
      <path d={areaPath} fill="rgba(16,185,129,0.06)" />
      <path d={path} fill="none" stroke="#10B981" strokeWidth="2" />

      {/* "You are here" marker */}
      <line
        x1={(currentWeek / (data.length - 1)) * w} y1={0}
        x2={(currentWeek / (data.length - 1)) * w} y2={h}
        stroke="#F87171" strokeWidth="1.5" strokeDasharray="4 2"
      />
      <circle
        cx={(currentWeek / (data.length - 1)) * w}
        cy={h - (data[currentWeek] / max) * h}
        r={5} fill="#10B981" stroke="white" strokeWidth="2"
      />
      <text
        x={(currentWeek / (data.length - 1)) * w}
        y={h - (data[currentWeek] / max) * h - 10}
        textAnchor="middle" fontSize="12" fontWeight="bold" fill="#10B981" fontFamily="monospace"
      >
        {(data[currentWeek] * 100).toFixed(0)}% — YOU ARE HERE
      </text>

      {/* Week labels */}
      {data.map((_, i) => (
        <text key={i} x={(i / (data.length - 1)) * w} y={h + 14} textAnchor="middle" fontSize="12" fill="#A0AEC0" fontFamily="monospace">
          W{i + 1}
        </text>
      ))}

      {/* Data dots */}
      {data.map((v, i) => (
        <circle key={i} cx={(i / (data.length - 1)) * w} cy={h - (v / max) * h} r={i <= currentWeek ? 3 : 2}
          fill={i <= currentWeek ? '#10B981' : '#CBD5E0'} opacity={i > currentWeek ? 0.5 : 1} />
      ))}
    </svg>
    </>
  );
}

/* ── Gate Progress Card ──────────────────────── */
function GateProgress({ gate, value }: { gate: typeof BBI_GATES[0]; value: number }) {
  const status = getGateStatus(gate.threshold, value);
  const gap = gate.threshold - value;
  const isUnlocked = status === 'unlocked';
  const isAtRisk = status === 'at-risk';

  return (
    <>
    <div className="rounded-lg border p-3" style={{ borderColor: isUnlocked ? '#22C55E40' : '#E2E8F0' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold font-mono" style={{ color: gate.color }}>{gate.name.toUpperCase()}</span>
        <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded" style={{
          background: isUnlocked ? 'rgba(34,197,94,0.1)' : isAtRisk ? 'rgba(245,158,11,0.1)' : 'rgba(248,113,113,0.1)',
          color: isUnlocked ? '#22C55E' : isAtRisk ? '#F59E0B' : '#F87171',
        }}>
          {isUnlocked ? 'UNLOCKED' : isAtRisk ? 'AT-RISK' : `−${(gap * 100).toFixed(0)}pp`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative rounded-full overflow-hidden mb-1" style={{ height: 10, background: '#F1F5F9' }}>
        <div className="h-full rounded-full transition-all" style={{
          width: `${Math.min(value * 100, 100)}%`,
          background: isUnlocked ? '#22C55E' : isAtRisk ? '#F59E0B' : gate.color,
        }} />
        <div className="absolute top-0 h-full" style={{ left: `${gate.threshold * 100}%`, width: 2, background: '#1A1A2E', opacity: 0.4 }} />
      </div>

      <div className="text-xs font-mono" style={{ color: '#718096' }}>
        {(value * 100).toFixed(0)}% / {(gate.threshold * 100).toFixed(0)}% threshold &middot; {gate.multiplier.toFixed(2)}x
      </div>

      {!isUnlocked && (
        <div className="mt-2 text-xs rounded-md px-2 py-1.5" style={{ background: 'rgba(37,99,235,0.04)', color: '#2563EB' }}>
          <strong>Action:</strong> {gate.name === 'core' ? 'Push Miller Lite and Coors Light in convenience accounts' :
            gate.name === 'import' ? 'Focus on Corona and Modelo display placements' :
            gate.name === 'emerging' ? 'Add 2 spirits-carrying accounts and push craft in on-premise' :
            'Need all 3 individual gates first — focus on weakest gate'}
        </div>
      )}
    </div>
    </>
  );
}

export default function MidQuarterVisibilityPage() {
  const [viewMode, setViewMode] = useState<'seller' | 'manager'>('seller');
  const [selectedSeller, setSelectedSeller] = useState(SELLERS[2]); // Marcus

  // Manager view aggregates
  const hometownSellers = SELLERS.filter(s => s.hometown === selectedSeller.hometown);
  const avgAttainment = hometownSellers.reduce((sum, s) => sum + s.attainment, 0) / hometownSellers.length;
  const atRiskCount = hometownSellers.filter(s => s.atRisk).length;

  return (
    <>
    
      <ActNavigation currentAct={4} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#10B981' }}>
          Mid-Quarter Visibility &middot; Week 9 of 13
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#1A1A2E', fontFamily: 'var(--pl-font)' }}>
          Mid-Quarter Check-In
        </h1>
        <p className="text-[13px] mt-1" style={{ color: '#718096' }}>
          Real-time attainment tracking with gate progress and actions-to-unlock coaching
        </p>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 mb-4">
        {(['seller', 'manager'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className="px-4 py-2 rounded-lg text-[12px] font-mono font-bold transition-colors"
            style={{ background: viewMode === mode ? '#10B981' : '#F1F5F9', color: viewMode === mode ? 'white' : '#718096' }}
          >
            {mode === 'seller' ? 'Seller View' : 'Manager View'}
          </button>
        ))}
      </div>

      {viewMode === 'seller' && (
        <>
          {/* Rep selector */}
          <div className="flex flex-wrap gap-1 mb-4">
            {SELLERS.slice(0, 12).map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSeller(s)}
                className="px-2 py-1 rounded-lg text-xs font-mono font-bold transition-colors"
                style={{
                  background: selectedSeller.id === s.id ? '#10B981' : '#F1F5F9',
                  color: selectedSeller.id === s.id ? 'white' : '#718096',
                }}
              >
                {s.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Hero: Attainment Ring + Key Stats */}
          <LightSectionCard title={`${selectedSeller.name} — ${selectedSeller.routeId}`} className="mb-4">
            <AttainmentRing seller={selectedSeller} />
          </LightSectionCard>

          {/* Attainment Curve */}
          <LightSectionCard title="13-Week Attainment Curve" className="mb-4">
            <AttainmentCurve seller={selectedSeller} />
          </LightSectionCard>

          {/* Gate Progress */}
          <LightSectionCard title="Gate Progress — Actions to Unlock" className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              {BBI_GATES.map(gate => (
                <GateProgress key={gate.name} gate={gate} value={selectedSeller.bbiGates[gate.name]} />
              ))}
            </div>
          </LightSectionCard>
        </>
      )}

      {viewMode === 'manager' && (
        <>
          {/* Hometown selector */}
          <div className="flex gap-1 mb-4">
            {HOMETOWNS.map(ht => {
              const isSelected = ht.id === selectedSeller.hometown;
              return (
                <button
                  key={ht.id}
                  onClick={() => {
                    const first = SELLERS.find(s => s.hometown === ht.id);
                    if (first) setSelectedSeller(first);
                  }}
                  className="px-3 py-1.5 rounded-lg text-[13px] font-mono font-bold transition-colors"
                  style={{ background: isSelected ? '#10B981' : '#F1F5F9', color: isSelected ? 'white' : '#718096' }}
                >
                  {ht.name}
                </button>
              );
            })}
          </div>

          {/* Manager KPIs */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <LightKpiCard label="Avg Attainment" value={pct(avgAttainment)} accent={avgAttainment >= 0.95 ? '#22C55E' : '#F59E0B'} sub={`${hometownSellers.length} reps`} />
            <LightKpiCard label="At Risk Reps" value={String(atRiskCount)} accent={atRiskCount > 0 ? '#F87171' : '#22C55E'} sub="Need intervention" />
            <LightKpiCard label="Above Target" value={String(hometownSellers.filter(s => s.attainment >= 1).length)} accent="#22C55E" sub={`of ${hometownSellers.length}`} />
            <LightKpiCard label="Full 4-Gate" value={String(hometownSellers.filter(s => countUnlockedGates(s.bbiGates) === 4).length)} accent="#2563EB" sub="All gates open" />
          </div>

          {/* Rep status cards */}
          <LightSectionCard title={`${HOMETOWNS.find(h => h.id === selectedSeller.hometown)?.name} — Rep Status`} className="mb-6">
            <div className="space-y-2">
              {hometownSellers.map(seller => {
                const sTier = COMP_TIERS.find(t => seller.attainment >= t.floor && seller.attainment < t.ceiling) ?? COMP_TIERS[3];
                const sGates = countUnlockedGates(seller.bbiGates);
                const tierColors = ['#22C55E', '#2563EB', '#F59E0B', '#A0AEC0'];

                return (
                  <div key={seller.id} className="flex items-center gap-4 px-3 py-2 rounded-lg border" style={{
                    borderColor: seller.atRisk ? 'rgba(248,113,113,0.3)' : '#E2E8F0',
                  }}>
                    {/* Status dot */}
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                      background: seller.attainment >= 1 ? '#22C55E' : seller.atRisk ? '#F87171' : '#F59E0B',
                    }} />

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold" style={{ color: '#1A1A2E' }}>{seller.name}</span>
                        <span className="text-xs font-mono" style={{ color: '#A0AEC0' }}>{seller.routeId}</span>
                        {seller.atRisk && (
                          <span className="text-xs font-bold font-mono px-1 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.1)', color: '#F87171' }}>AT-RISK</span>
                        )}
                      </div>
                      <div className="text-xs" style={{ color: '#718096' }}>{seller.coachingNote}</div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-center">
                        <div className="text-[14px] font-bold font-mono" style={{ color: seller.attainment >= 1 ? '#22C55E' : '#F59E0B' }}>
                          {(seller.attainment * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs font-mono" style={{ color: '#A0AEC0' }}>attain</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[12px] font-bold font-mono" style={{ color: tierColors[sTier.level - 1] }}>T{sTier.level}</div>
                        <div className="text-xs font-mono" style={{ color: '#A0AEC0' }}>tier</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[12px] font-bold font-mono" style={{ color: sGates >= 3 ? '#22C55E' : '#F59E0B' }}>{sGates}/4</div>
                        <div className="text-xs font-mono" style={{ color: '#A0AEC0' }}>gates</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* Methodology */}
      <div className="text-[13px] font-mono" style={{ color: '#A0AEC0' }}>
        Mid-quarter visibility shows week-9 attainment snapshots. Attainment curve tracks cumulative performance across 13 weeks.
        Gate progress shows each gate with specific actions to unlock. Manager view aggregates hometown performance for coaching prioritization.
      </div>
    
    </>
  );
}
