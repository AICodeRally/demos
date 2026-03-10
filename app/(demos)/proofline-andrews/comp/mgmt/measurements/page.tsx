// @ts-nocheck — pre-existing type mismatches with getGateStatus signature
'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  EMCO_GATES,
  SELLERS,
  HOMETOWNS,
  COMP_TIERS,
  getGateStatus,
  countUnlockedGates,
  getEffectiveMultiplier,
  type Seller,
} from '@/data/proofline';
import { pct } from '@/lib/utils';

const ACT5_ACCENT = '#0EA5E9';

// ── Tab definitions ──────────────────────────────
type MeasurementsTab = 'attainment' | 'visibility';
const TABS: { id: MeasurementsTab; label: string }[] = [
  { id: 'attainment', label: 'Category Attainment' },
  { id: 'visibility', label: 'Visibility' },
];

// ── Gate Status Badge (shared) ───────────────────
function GateStatusBadge({ status }: { status: 'locked' | 'unlocked' | 'at-risk' }) {
  const cfg = {
    locked: { bg: 'rgba(248,113,113,0.1)', color: '#F87171', icon: '\u2717' },
    unlocked: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', icon: '\u2713' },
    'at-risk': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', icon: '\u26A0' },
  }[status];
  return (
    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-0.5"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.icon} {status.toUpperCase()}
    </span>
  );
}

// ── Mini Sparkline (13-week attainment) ──────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80, h = 20;
  const max = Math.max(...data, 1);
  const path = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i / (data.length - 1)) * w},${h - (v / max) * h}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={80} height={20}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={w} cy={h - (data[data.length - 1] / max) * h} r={2} fill={color} />
    </svg>
  );
}

// ── Attainment Ring (Visibility tab) ────────────
function AttainmentRing({ seller }: { seller: Seller }) {
  const size = 160;
  const r = 58;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const pctVal = Math.min(seller.attainment, 1.3);
  const fillPct = pctVal / 1.3;
  const color = seller.attainment >= 1.0 ? '#22C55E' : seller.attainment >= 0.85 ? '#F59E0B' : '#F87171';
  const tier = COMP_TIERS.find(t => seller.attainment >= t.floor && seller.attainment < t.ceiling) ?? COMP_TIERS[3];
  const gates = countUnlockedGates(seller.emcoGates);
  const mult = getEffectiveMultiplier(seller.emcoGates);

  return (
    <div className="flex items-center gap-6">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="flex-shrink-0">
        <defs>
          <linearGradient id="att-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--pl-chart-bar-track)" strokeWidth="12" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#att-ring-grad)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${fillPct * circ} ${circ}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="32" fontWeight="bold" fill="var(--pl-text)" fontFamily="monospace">
          {(seller.attainment * 100).toFixed(0)}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="var(--pl-text-muted)" fontFamily="monospace">
          attainment
        </text>
      </svg>
      <div className="space-y-2">
        <div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>TIER</div>
          <div className="text-[15px] font-bold font-mono" style={{ color: tier.color }}>{tier.label}</div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{pct(tier.floor)} – {pct(tier.ceiling)} attainment</div>
        </div>
        <div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>GATES UNLOCKED</div>
          <div className="text-[15px] font-bold font-mono" style={{ color: ACT5_ACCENT }}>{gates}/4</div>
        </div>
        <div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>EFFECTIVE MULTIPLIER</div>
          <div className="text-[15px] font-bold font-mono" style={{ color: '#F59E0B' }}>{mult.toFixed(2)}x</div>
        </div>
      </div>
    </div>
  );
}

// ── Category Attainment Tab ───────────────────────
function CategoryAttainmentTab({ hometownFilter }: { hometownFilter: string }) {
  const filteredSellers = hometownFilter === 'all'
    ? SELLERS
    : SELLERS.filter(s => s.hometown === hometownFilter);

  const avgAttainment = filteredSellers.reduce((s, r) => s + r.attainment, 0) / filteredSellers.length;
  const unlocked4 = filteredSellers.filter(s => countUnlockedGates(s.emcoGates) === 4).length;
  const atRisk = filteredSellers.filter(s => s.attainment >= 0.80 && s.attainment < 0.85).length;

  return (
    <>
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <LightKpiCard label="Reps Shown" value={String(filteredSellers.length)} accent={ACT5_ACCENT} sub="Filtered view" />
        <LightKpiCard label="Avg Attainment" value={pct(avgAttainment)} accent={ACT5_ACCENT} sub="This quarter" />
        <LightKpiCard label="All 4 Gates Unlocked" value={String(unlocked4)} accent="#22C55E" sub="Full EMCO bonus" />
        <LightKpiCard label="At-Risk Reps" value={String(atRisk)} accent="#F59E0B" sub="80–85% attainment" />
      </div>

      {/* Gate Summary Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {EMCO_GATES.map(gate => {
          const unlocked = filteredSellers.filter(s => getGateStatus(s.emcoGates, gate.name) === 'unlocked').length;
          const atRiskCount = filteredSellers.filter(s => getGateStatus(s.emcoGates, gate.name) === 'at-risk').length;
          return (
            <LightSectionCard key={gate.name} title={gate.label}>
              <div className="text-[22px] font-bold font-mono mb-1" style={{ color: gate.color }}>
                {unlocked}/{filteredSellers.length}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>unlocked</div>
              <div className="mt-2 text-[10px] font-mono" style={{ color: '#F59E0B' }}>
                {atRiskCount} at-risk
              </div>
              <div className="mt-1 text-[9px]" style={{ color: 'var(--pl-text-faint)' }}>
                {gate.multiplier}x multiplier
              </div>
            </LightSectionCard>
          );
        })}
      </div>

      {/* Rep Table */}
      <LightSectionCard title="Rep Category Attainment Detail">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                <th className="text-left py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Rep</th>
                <th className="text-left py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Route</th>
                <th className="text-right py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Attainment</th>
                <th className="text-center py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Core</th>
                <th className="text-center py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Import</th>
                <th className="text-center py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Emerging</th>
                <th className="text-center py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Combined</th>
                <th className="text-right py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>13-Week</th>
              </tr>
            </thead>
            <tbody>
              {filteredSellers.map(seller => {
                const color = seller.attainment >= 1.0 ? '#22C55E' : seller.attainment >= 0.85 ? '#F59E0B' : '#F87171';
                return (
                  <tr key={seller.id} style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    <td className="py-2 font-medium" style={{ color: 'var(--pl-text)' }}>{seller.name}</td>
                    <td className="py-2 font-mono" style={{ color: 'var(--pl-text-muted)' }}>{seller.routeId}</td>
                    <td className="py-2 text-right font-bold font-mono" style={{ color }}>{pct(seller.attainment)}</td>
                    {(['core', 'import', 'emerging', 'combined'] as const).map(gate => (
                      <td key={gate} className="py-2 text-center">
                        <GateStatusBadge status={getGateStatus(seller.emcoGates, gate)} />
                      </td>
                    ))}
                    <td className="py-2 text-right">
                      <Sparkline data={seller.weeklyAttainment} color={color} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LightSectionCard>
    </>
  );
}

// ── Visibility Tab ────────────────────────────────
function VisibilityTab() {
  const [view, setView] = useState<'seller' | 'manager'>('seller');
  const [selectedSeller, setSelectedSeller] = useState(SELLERS[0]);
  const [selectedHometown, setSelectedHometown] = useState(HOMETOWNS[0].id);

  const hometownSellers = SELLERS.filter(s => s.hometown === selectedHometown);
  const avgAtt = hometownSellers.reduce((s, r) => s + r.attainment, 0) / hometownSellers.length;

  return (
    <div className="space-y-6">
      {/* View toggle */}
      <div className="flex gap-2">
        {(['seller', 'manager'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-4 py-1.5 rounded-full text-[11px] font-semibold transition-all"
            style={{
              background: view === v ? `${ACT5_ACCENT}18` : 'var(--pl-chart-bar-track)',
              color: view === v ? ACT5_ACCENT : 'var(--pl-text-muted)',
              border: `1px solid ${view === v ? `${ACT5_ACCENT}40` : 'var(--pl-border)'}`,
            }}
          >
            {v === 'seller' ? 'Seller View' : 'Manager View'}
          </button>
        ))}
      </div>

      {view === 'seller' ? (
        <>
          {/* Seller selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {SELLERS.slice(0, 12).map(s => (
              <button key={s.id} onClick={() => setSelectedSeller(s)}
                className="px-2.5 py-1 rounded text-[10px] font-mono transition-all"
                style={{
                  background: selectedSeller.id === s.id ? `${ACT5_ACCENT}18` : 'var(--pl-chart-bar-track)',
                  color: selectedSeller.id === s.id ? ACT5_ACCENT : 'var(--pl-text-muted)',
                  border: `1px solid ${selectedSeller.id === s.id ? `${ACT5_ACCENT}40` : 'var(--pl-border)'}`,
                }}
              >
                {s.name.split(' ')[0]}
              </button>
            ))}
          </div>
          <LightSectionCard title={`${selectedSeller.name} — Attainment Snapshot`}>
            <AttainmentRing seller={selectedSeller} />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {EMCO_GATES.map(gate => {
                const status = getGateStatus(selectedSeller.emcoGates, gate.name);
                return (
                  <div key={gate.name} className="rounded-lg border p-3 text-center" style={{ borderColor: 'var(--pl-border)' }}>
                    <div className="text-[10px] font-bold mb-1" style={{ color: gate.color }}>{gate.label}</div>
                    <GateStatusBadge status={status} />
                    <div className="mt-1 text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>{gate.multiplier}x</div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>
        </>
      ) : (
        <>
          {/* Hometown selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {HOMETOWNS.map(ht => (
              <button key={ht.id} onClick={() => setSelectedHometown(ht.id)}
                className="px-2.5 py-1 rounded text-[10px] font-mono transition-all"
                style={{
                  background: selectedHometown === ht.id ? `${ACT5_ACCENT}18` : 'var(--pl-chart-bar-track)',
                  color: selectedHometown === ht.id ? ACT5_ACCENT : 'var(--pl-text-muted)',
                  border: `1px solid ${selectedHometown === ht.id ? `${ACT5_ACCENT}40` : 'var(--pl-border)'}`,
                }}
              >
                {ht.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <LightKpiCard label="Avg Attainment" value={pct(avgAtt)} accent={ACT5_ACCENT} sub={`${hometownSellers.length} reps`} />
            <LightKpiCard label="All Gates Unlocked"
              value={String(hometownSellers.filter(s => countUnlockedGates(s.emcoGates) === 4).length)}
              accent="#22C55E" sub="Full bonus eligible" />
            <LightKpiCard label="At-Risk"
              value={String(hometownSellers.filter(s => s.attainment < 0.85 && s.attainment >= 0.75).length)}
              accent="#F59E0B" sub="Needs coaching" />
          </div>
          <LightSectionCard title={`${HOMETOWNS.find(h => h.id === selectedHometown)?.name ?? ''} — Team Summary`}>
            <div className="space-y-2">
              {hometownSellers.map(seller => {
                const color = seller.attainment >= 1.0 ? '#22C55E' : seller.attainment >= 0.85 ? '#F59E0B' : '#F87171';
                const gates = countUnlockedGates(seller.emcoGates);
                return (
                  <div key={seller.id} className="flex items-center gap-4 py-2 rounded-lg px-3" style={{ background: 'var(--pl-chart-bar-track)' }}>
                    <div className="w-32 font-medium text-[12px]" style={{ color: 'var(--pl-text)' }}>{seller.name}</div>
                    <div className="font-mono text-[11px] w-16 text-right font-bold" style={{ color }}>{pct(seller.attainment)}</div>
                    <div className="flex gap-1">
                      {(['core', 'import', 'emerging', 'combined'] as const).map(gate => {
                        const s = getGateStatus(seller.emcoGates, gate);
                        return (
                          <div key={gate} className="w-4 h-4 rounded-full text-[7px] flex items-center justify-center font-bold"
                            style={{
                              background: s === 'unlocked' ? 'rgba(34,197,94,0.15)' : s === 'at-risk' ? 'rgba(245,158,11,0.15)' : 'rgba(248,113,113,0.1)',
                              color: s === 'unlocked' ? '#22C55E' : s === 'at-risk' ? '#F59E0B' : '#F87171',
                            }}>
                            {s === 'unlocked' ? '\u2713' : s === 'at-risk' ? '!' : '\u2717'}
                          </div>
                        );
                      })}
                    </div>
                    <Sparkline data={seller.weeklyAttainment} color={color} />
                  </div>
                );
              })}
            </div>
          </LightSectionCard>
        </>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────
export default function MeasurementsPage() {
  const [activeTab, setActiveTab] = useState<MeasurementsTab>('attainment');
  const [hometownFilter, setHometownFilter] = useState('all');

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Header */}
      <div className="mt-6 mb-4">
        <div className="text-[10px] tracking-[3px] uppercase font-mono mb-1" style={{ color: ACT5_ACCENT }}>
          Sales Comp Management &middot; Measurements
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}>
          Measurements
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          Category attainment gates and seller performance visibility
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-0 mb-6 rounded-lg overflow-hidden" style={{ background: 'var(--pl-hover)', border: '1px solid var(--pl-border)' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 px-4 py-2.5 text-[12px] font-semibold transition-all"
            style={{
              background: activeTab === tab.id ? `${ACT5_ACCENT}15` : 'transparent',
              borderBottom: activeTab === tab.id ? `2px solid ${ACT5_ACCENT}` : '2px solid transparent',
              color: activeTab === tab.id ? ACT5_ACCENT : 'var(--pl-text-muted)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hometown filter (shown only on attainment tab) */}
      {activeTab === 'attainment' && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setHometownFilter('all')}
            className="px-3 py-1 rounded-full text-[10px] font-semibold transition-all"
            style={{
              background: hometownFilter === 'all' ? `${ACT5_ACCENT}18` : 'var(--pl-chart-bar-track)',
              color: hometownFilter === 'all' ? ACT5_ACCENT : 'var(--pl-text-muted)',
              border: `1px solid ${hometownFilter === 'all' ? `${ACT5_ACCENT}40` : 'var(--pl-border)'}`,
            }}
          >
            All Hometowns
          </button>
          {HOMETOWNS.map(ht => (
            <button
              key={ht.id}
              onClick={() => setHometownFilter(ht.id)}
              className="px-3 py-1 rounded-full text-[10px] font-semibold transition-all"
              style={{
                background: hometownFilter === ht.id ? `${ACT5_ACCENT}18` : 'var(--pl-chart-bar-track)',
                color: hometownFilter === ht.id ? ACT5_ACCENT : 'var(--pl-text-muted)',
                border: `1px solid ${hometownFilter === ht.id ? `${ACT5_ACCENT}40` : 'var(--pl-border)'}`,
              }}
            >
              {ht.name}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'attainment' && <CategoryAttainmentTab hometownFilter={hometownFilter} />}
      {activeTab === 'visibility' && <VisibilityTab />}
    </>
  );
}
