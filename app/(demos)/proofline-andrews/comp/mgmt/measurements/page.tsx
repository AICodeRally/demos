'use client';

import { useState, useEffect } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  BBI_GATES,
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

// ── CSS keyframes injected once ─────────────────
const STYLE_ID = 'measurements-animations';
function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes m-fade-slide {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes m-bar-grow {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
    @keyframes m-ring-draw {
      from { stroke-dashoffset: var(--circ); }
      to   { stroke-dashoffset: var(--offset); }
    }
    .m-fade-slide { animation: m-fade-slide 0.35s ease-out both; }
    .m-bar-grow  { animation: m-bar-grow 0.6s cubic-bezier(0.22,1,0.36,1) both; transform-origin: left; }
  `;
  document.head.appendChild(style);
}

// ── Tab definitions ──────────────────────────────
type MeasurementsTab = 'attainment' | 'visibility';
const TABS: { id: MeasurementsTab; label: string; icon: string }[] = [
  { id: 'attainment', label: 'Category Attainment', icon: '\u2593' },
  { id: 'visibility', label: 'Visibility', icon: '\u25C9' },
];

// ── Status Dot (compact indicator) ───────────────
function StatusDot({ status, size = 8 }: { status: 'locked' | 'unlocked' | 'at-risk'; size?: number }) {
  const colors = {
    locked: '#F87171',
    unlocked: '#22C55E',
    'at-risk': '#F59E0B',
  };
  return (
    <span
      className="inline-block rounded-full flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: colors[status],
        boxShadow: `0 0 ${size}px ${colors[status]}40`,
      }}
    />
  );
}

// ── Gate Status Badge (enhanced with glow) ───────
function GateStatusBadge({ status }: { status: 'locked' | 'unlocked' | 'at-risk' }) {
  const cfg = {
    locked: { bg: 'rgba(248,113,113,0.12)', color: '#F87171', icon: '\u2717', glow: 'none' },
    unlocked: { bg: 'rgba(34,197,94,0.12)', color: '#22C55E', icon: '\u2713', glow: '0 0 6px rgba(34,197,94,0.3)' },
    'at-risk': { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', icon: '\u26A0', glow: '0 0 6px rgba(245,158,11,0.2)' },
  }[status];
  return (
    <span className="text-xs font-bold tabular-nums px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5 transition-all"
      style={{ background: cfg.bg, color: cfg.color, boxShadow: cfg.glow }}>
      {cfg.icon} {status.toUpperCase()}
    </span>
  );
}

// ── Mini Sparkline (enhanced with gradient fill) ─
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80, h = 24;
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - (v / max) * (h - 4),
  }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;
  const gradId = `spark-${data.length}-${Math.round(data[0] * 100)}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={80} height={24}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={2.5} fill={color} />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={4} fill={color} opacity="0.2" />
    </svg>
  );
}

// ── Progress Bar (animated) ──────────────────────
function ProgressBar({ value, max = 1.0, color, label, delay = 0 }: { value: number; max?: number; color: string; label?: string; delay?: number }) {
  const pctVal = Math.min(value / max, 1);
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--pl-text-faint)' }}>{label}</span>
          <span className="text-xs font-bold tabular-nums" style={{ color }}>{(value * 100).toFixed(0)}%</span>
        </div>
      )}
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--pl-chart-bar-track)' }}>
        <div
          className="h-full rounded-full m-bar-grow"
          style={{
            width: `${pctVal * 100}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            animationDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

// ── Animated Progress Ring ───────────────────────
function ProgressRing({ value, max = 1.3, size = 170, color, children }: { value: number; max?: number; size?: number; color: string; children?: React.ReactNode }) {
  const r = (size / 2) - 22;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const fillPct = Math.min(value / max, 1);
  const offset = circ * (1 - fillPct);
  const gradId = `ring-grad-${Math.round(value * 100)}`;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="flex-shrink-0">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.35" />
        </linearGradient>
        <filter id="ring-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--pl-chart-bar-track)" strokeWidth="12" />
      {/* Glow layer */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
        strokeDasharray={`${fillPct * circ} ${circ}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        opacity="0.15"
        filter="url(#ring-glow)"
      />
      {/* Main arc */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#${gradId})`} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${fillPct * circ} ${circ}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{
          '--circ': `${circ}`,
          '--offset': `${offset}`,
          animation: 'm-ring-draw 1s cubic-bezier(0.22,1,0.36,1) both',
        } as React.CSSProperties}
      />
      {/* Threshold tick marks */}
      {[0.85, 1.0].map(thresh => {
        const angle = -90 + (thresh / max) * 360;
        const rad = (angle * Math.PI) / 180;
        const tx = cx + r * Math.cos(rad);
        const ty = cy + r * Math.sin(rad);
        return (
          <circle key={thresh} cx={tx} cy={ty} r={2} fill="var(--pl-text-faint)" opacity="0.5" />
        );
      })}
      {children}
    </svg>
  );
}

// ── Heat-map color helpers ───────────────────────
function heatColor(value: number, min: number, max: number): string {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  if (t >= 0.75) return 'rgba(34,197,94,0.15)';
  if (t >= 0.5) return 'rgba(14,165,233,0.10)';
  if (t >= 0.25) return 'rgba(245,158,11,0.12)';
  return 'rgba(248,113,113,0.10)';
}

function heatTextColor(value: number, min: number, max: number): string {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  if (t >= 0.75) return '#22C55E';
  if (t >= 0.5) return '#0EA5E9';
  if (t >= 0.25) return '#F59E0B';
  return '#F87171';
}

// ── Attainment Ring (Visibility tab — enhanced) ──
function AttainmentRing({ seller }: { seller: Seller }) {
  const size = 170;
  const color = seller.attainment >= 1.0 ? '#22C55E' : seller.attainment >= 0.85 ? '#F59E0B' : '#F87171';
  const tier = COMP_TIERS.find(t => seller.attainment >= t.floor && seller.attainment < t.ceiling) ?? COMP_TIERS[3];
  const gates = countUnlockedGates(seller.bbiGates);
  const mult = getEffectiveMultiplier(seller.bbiGates);
  const cx = size / 2, cy = size / 2;

  return (
    <div className="flex items-center gap-6">
      <ProgressRing value={seller.attainment} max={1.3} size={size} color={color}>
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="34" fontWeight="bold" fill="var(--pl-text)" fontFamily="var(--pl-font)">
          {(seller.attainment * 100).toFixed(0)}%
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="12" fill="var(--pl-text-muted)" fontFamily="monospace">
          attainment
        </text>
      </ProgressRing>
      <div className="space-y-3">
        <div className="rounded-xl p-2.5" style={{ background: `${tier.color}10`, border: `1px solid ${tier.color}25` }}>
          <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--pl-text-faint)' }}>Tier</div>
          <div className="text-[15px] font-bold tabular-nums" style={{ color: tier.color }}>{tier.label}</div>
          <div className="text-xs" style={{ color: 'var(--pl-text-muted)' }}>{pct(tier.floor)} &ndash; {pct(tier.ceiling)} attainment</div>
        </div>
        <div className="flex gap-3">
          <div className="rounded-xl p-2.5 flex-1" style={{ background: `${ACT5_ACCENT}08`, border: `1px solid ${ACT5_ACCENT}20` }}>
            <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--pl-text-faint)' }}>Gates</div>
            <div className="text-[15px] font-bold tabular-nums" style={{ color: ACT5_ACCENT }}>{gates}/4</div>
          </div>
          <div className="rounded-xl p-2.5 flex-1" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--pl-text-faint)' }}>Multiplier</div>
            <div className="text-[15px] font-bold tabular-nums" style={{ color: '#F59E0B' }}>{mult.toFixed(2)}x</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Gate Card (enhanced with progress bar + breakdown) ──
function GateCard({ gate, filteredSellers, delay }: { gate: typeof BBI_GATES[number]; filteredSellers: Seller[]; delay: number }) {
  const unlocked = filteredSellers.filter(s => getGateStatus(s.bbiGates, gate.name) === 'unlocked').length;
  const atRiskCount = filteredSellers.filter(s => getGateStatus(s.bbiGates, gate.name) === 'at-risk').length;
  const locked = filteredSellers.length - unlocked - atRiskCount;
  const unlockedPct = filteredSellers.length > 0 ? unlocked / filteredSellers.length : 0;

  return (
    <div
      className="rounded-xl border p-4 transition-all hover:shadow-md m-fade-slide"
      style={{
        background: `linear-gradient(135deg, var(--pl-card) 0%, ${gate.color}06 100%)`,
        borderColor: 'var(--pl-border)',
        boxShadow: 'var(--pl-shadow)',
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Header with colored accent line */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-8 rounded-full" style={{ background: `linear-gradient(180deg, ${gate.color}, ${gate.color}40)` }} />
        <div>
          <div className="text-[13px] font-semibold" style={{ color: 'var(--pl-text)' }}>{gate.label}</div>
          <div className="text-xs" style={{ color: 'var(--pl-text-faint)' }}>{gate.multiplier}x multiplier</div>
        </div>
      </div>

      {/* Big number */}
      <div className="text-[26px] font-bold tabular-nums mb-1" style={{ color: gate.color }}>
        {unlocked}<span className="text-[14px] font-normal" style={{ color: 'var(--pl-text-faint)' }}>/{filteredSellers.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{ background: 'var(--pl-chart-bar-track)' }}>
        <div className="h-full rounded-full m-bar-grow" style={{
          width: `${unlockedPct * 100}%`,
          background: `linear-gradient(90deg, ${gate.color}88, ${gate.color})`,
          animationDelay: `${delay + 150}ms`,
        }} />
      </div>

      {/* Status breakdown with colored dots */}
      <div className="flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1">
          <StatusDot status="unlocked" size={6} />
          <span style={{ color: '#22C55E' }}>{unlocked}</span>
        </span>
        <span className="flex items-center gap-1">
          <StatusDot status="at-risk" size={6} />
          <span style={{ color: '#F59E0B' }}>{atRiskCount}</span>
        </span>
        <span className="flex items-center gap-1">
          <StatusDot status="locked" size={6} />
          <span style={{ color: '#F87171' }}>{locked}</span>
        </span>
      </div>
    </div>
  );
}

// ── Category Attainment Tab (enhanced) ───────────
function CategoryAttainmentTab({ hometownFilter }: { hometownFilter: string }) {
  useEffect(() => { injectStyles(); }, []);

  const filteredSellers = hometownFilter === 'all'
    ? SELLERS
    : SELLERS.filter(s => s.hometown === hometownFilter);

  const avgAttainment = filteredSellers.reduce((s, r) => s + r.attainment, 0) / filteredSellers.length;
  const unlocked4 = filteredSellers.filter(s => countUnlockedGates(s.bbiGates) === 4).length;
  const atRisk = filteredSellers.filter(s => s.attainment >= 0.80 && s.attainment < 0.85).length;

  return (
    <div className="m-fade-slide">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <LightKpiCard label="Reps Shown" value={String(filteredSellers.length)} accent={ACT5_ACCENT} sub="Filtered view" stagger={0} />
        <LightKpiCard label="Avg Attainment" value={pct(avgAttainment)} accent={ACT5_ACCENT} sub="This quarter" stagger={1} />
        <LightKpiCard label="All 4 Gates Unlocked" value={String(unlocked4)} accent="#22C55E" sub="Full gate bonus" stagger={2} />
        <LightKpiCard label="At-Risk Reps" value={String(atRisk)} accent="#F59E0B" sub="80-85% attainment" stagger={3} />
      </div>

      {/* Gate Summary Cards (enhanced) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {BBI_GATES.map((gate, i) => (
          <GateCard key={gate.name} gate={gate} filteredSellers={filteredSellers} delay={i * 80} />
        ))}
      </div>

      {/* Rep Table (enhanced with inline progress bars) */}
      <LightSectionCard title="Rep Category Attainment Detail">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: '2px solid var(--pl-border)' }}>
                <th className="text-left py-2.5 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Rep</th>
                <th className="text-left py-2.5 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Route</th>
                <th className="text-left py-2.5 font-semibold pl-2" style={{ color: 'var(--pl-text-muted)', minWidth: 140 }}>Attainment</th>
                <th className="text-center py-2.5 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Core</th>
                <th className="text-center py-2.5 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Import</th>
                <th className="text-center py-2.5 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Emerging</th>
                <th className="text-center py-2.5 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Combined</th>
                <th className="text-right py-2.5 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>13-Week</th>
              </tr>
            </thead>
            <tbody>
              {filteredSellers.map((seller, idx) => {
                const color = seller.attainment >= 1.0 ? '#22C55E' : seller.attainment >= 0.85 ? '#F59E0B' : '#F87171';
                const barPct = Math.min(seller.attainment / 1.2, 1);
                return (
                  <tr key={seller.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--pl-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${color}08`)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="py-2.5 font-medium" style={{ color: 'var(--pl-text)' }}>
                      <div className="flex items-center gap-2">
                        <StatusDot status={seller.attainment >= 1.0 ? 'unlocked' : seller.attainment >= 0.85 ? 'at-risk' : 'locked'} size={6} />
                        {seller.name}
                      </div>
                    </td>
                    <td className="py-2.5 tabular-nums" style={{ color: 'var(--pl-text-muted)' }}>{seller.routeId}</td>
                    <td className="py-2.5 pl-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold tabular-nums text-[12px] w-10 text-right" style={{ color }}>{pct(seller.attainment)}</span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--pl-chart-bar-track)' }}>
                          <div className="h-full rounded-full m-bar-grow" style={{
                            width: `${barPct * 100}%`,
                            background: `linear-gradient(90deg, ${color}66, ${color})`,
                            animationDelay: `${idx * 30 + 200}ms`,
                          }} />
                        </div>
                      </div>
                    </td>
                    {(['core', 'import', 'emerging', 'combined'] as const).map(gate => (
                      <td key={gate} className="py-2.5 text-center">
                        <GateStatusBadge status={getGateStatus(seller.bbiGates, gate)} />
                      </td>
                    ))}
                    <td className="py-2.5 text-right">
                      <Sparkline data={seller.weeklyAttainment} color={color} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LightSectionCard>
    </div>
  );
}

// ── Visibility Tab (enhanced with heat-map) ──────
function VisibilityTab() {
  useEffect(() => { injectStyles(); }, []);

  const [view, setView] = useState<'seller' | 'manager'>('seller');
  const [selectedSeller, setSelectedSeller] = useState(SELLERS[0]);
  const [selectedHometown, setSelectedHometown] = useState(HOMETOWNS[0].id);

  const hometownSellers = SELLERS.filter(s => s.hometown === selectedHometown);
  const avgAtt = hometownSellers.reduce((s, r) => s + r.attainment, 0) / hometownSellers.length;

  // Attainment range for heat-map coloring
  const attMin = Math.min(...SELLERS.map(s => s.attainment));
  const attMax = Math.max(...SELLERS.map(s => s.attainment));

  return (
    <div className="space-y-6 m-fade-slide">
      {/* View toggle (enhanced pill style) */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--pl-hover)', border: '1px solid var(--pl-border)' }}>
        {(['seller', 'manager'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="flex-1 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all"
            style={{
              background: view === v ? `linear-gradient(135deg, ${ACT5_ACCENT}15, ${ACT5_ACCENT}08)` : 'transparent',
              color: view === v ? ACT5_ACCENT : 'var(--pl-text-muted)',
              boxShadow: view === v ? `0 1px 4px ${ACT5_ACCENT}15` : 'none',
            }}
          >
            {v === 'seller' ? 'Seller View' : 'Manager View'}
          </button>
        ))}
      </div>

      {view === 'seller' ? (
        <div className="m-fade-slide" key="seller-view">
          {/* Seller selector (heat-map colored pills) */}
          <div className="flex flex-wrap gap-2 mb-4">
            {SELLERS.slice(0, 12).map(s => {
              const isSelected = selectedSeller.id === s.id;
              const pillColor = s.attainment >= 1.0 ? '#22C55E' : s.attainment >= 0.85 ? '#F59E0B' : '#F87171';
              return (
                <button key={s.id} onClick={() => setSelectedSeller(s)}
                  className="px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5"
                  style={{
                    background: isSelected ? `${ACT5_ACCENT}15` : heatColor(s.attainment, attMin, attMax),
                    color: isSelected ? ACT5_ACCENT : 'var(--pl-text-muted)',
                    border: `1px solid ${isSelected ? `${ACT5_ACCENT}40` : `${pillColor}20`}`,
                    boxShadow: isSelected ? `0 0 8px ${ACT5_ACCENT}15` : 'none',
                  }}
                >
                  <StatusDot status={s.attainment >= 1.0 ? 'unlocked' : s.attainment >= 0.85 ? 'at-risk' : 'locked'} size={5} />
                  {s.name.split(' ')[0]}
                </button>
              );
            })}
          </div>

          <LightSectionCard title={`${selectedSeller.name} — Attainment Snapshot`}>
            <AttainmentRing seller={selectedSeller} />

            {/* Gate progress bars */}
            <div className="mt-5 space-y-1">
              <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--pl-text-faint)' }}>Gate Progress</div>
              {BBI_GATES.map((gate, i) => {
                const val = selectedSeller.bbiGates[gate.name];
                const status = getGateStatus(selectedSeller.bbiGates, gate.name);
                return (
                  <div key={gate.name} className="flex items-center gap-3">
                    <StatusDot status={status} size={7} />
                    <div className="flex-1">
                      <ProgressBar value={val} max={1.0} color={gate.color} label={gate.label} delay={i * 100} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gate cards grid */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BBI_GATES.map(gate => {
                const status = getGateStatus(selectedSeller.bbiGates, gate.name);
                return (
                  <div key={gate.name} className="rounded-xl border p-3 text-center transition-all hover:shadow-md"
                    style={{
                      borderColor: status === 'unlocked' ? `${gate.color}40` : 'var(--pl-border)',
                      background: status === 'unlocked'
                        ? `linear-gradient(135deg, ${gate.color}08, ${gate.color}03)`
                        : 'var(--pl-card)',
                    }}
                  >
                    <div className="text-xs font-bold mb-1.5" style={{ color: gate.color }}>{gate.label}</div>
                    <GateStatusBadge status={status} />
                    <div className="mt-1.5 text-xs" style={{ color: 'var(--pl-text-faint)' }}>{gate.multiplier}x</div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>
        </div>
      ) : (
        <div className="m-fade-slide" key="manager-view">
          {/* Hometown selector (heat-map colored) */}
          <div className="flex flex-wrap gap-2 mb-4">
            {HOMETOWNS.map(ht => {
              const htSellers = SELLERS.filter(s => s.hometown === ht.id);
              const htAvg = htSellers.reduce((s, r) => s + r.attainment, 0) / htSellers.length;
              return (
                <button key={ht.id} onClick={() => setSelectedHometown(ht.id)}
                  className="px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5"
                  style={{
                    background: selectedHometown === ht.id ? `${ACT5_ACCENT}15` : heatColor(htAvg, attMin, attMax),
                    color: selectedHometown === ht.id ? ACT5_ACCENT : 'var(--pl-text-muted)',
                    border: `1px solid ${selectedHometown === ht.id ? `${ACT5_ACCENT}40` : 'var(--pl-border)'}`,
                    boxShadow: selectedHometown === ht.id ? `0 0 8px ${ACT5_ACCENT}15` : 'none',
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: heatTextColor(htAvg, attMin, attMax) }} />
                  {ht.name}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <LightKpiCard label="Avg Attainment" value={pct(avgAtt)} accent={ACT5_ACCENT} sub={`${hometownSellers.length} reps`} stagger={0} />
            <LightKpiCard label="All Gates Unlocked"
              value={String(hometownSellers.filter(s => countUnlockedGates(s.bbiGates) === 4).length)}
              accent="#22C55E" sub="Full bonus eligible" stagger={1} />
            <LightKpiCard label="At-Risk"
              value={String(hometownSellers.filter(s => s.attainment < 0.85 && s.attainment >= 0.75).length)}
              accent="#F59E0B" sub="Needs coaching" stagger={2} />
          </div>

          <LightSectionCard title={`${HOMETOWNS.find(h => h.id === selectedHometown)?.name ?? ''} — Team Summary`}>
            <div className="space-y-1.5">
              {hometownSellers.map((seller, idx) => {
                const color = seller.attainment >= 1.0 ? '#22C55E' : seller.attainment >= 0.85 ? '#F59E0B' : '#F87171';
                const gates = countUnlockedGates(seller.bbiGates);
                const barPct = Math.min(seller.attainment / 1.2, 1);
                return (
                  <div key={seller.id}
                    className="flex items-center gap-3 py-2.5 rounded-xl px-3 transition-all m-fade-slide"
                    style={{
                      background: `linear-gradient(90deg, ${heatColor(seller.attainment, attMin, attMax)}, var(--pl-chart-bar-track))`,
                      animationDelay: `${idx * 50}ms`,
                      border: `1px solid ${color}12`,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}35`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = `${color}12`)}
                  >
                    {/* Name */}
                    <div className="w-28 font-medium text-[12px] flex items-center gap-2" style={{ color: 'var(--pl-text)' }}>
                      <StatusDot status={seller.attainment >= 1.0 ? 'unlocked' : seller.attainment >= 0.85 ? 'at-risk' : 'locked'} />
                      {seller.name}
                    </div>

                    {/* Attainment bar */}
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-[13px] tabular-nums w-11 text-right font-bold" style={{ color }}>{pct(seller.attainment)}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--pl-chart-bar-track)' }}>
                        <div className="h-full rounded-full m-bar-grow" style={{
                          width: `${barPct * 100}%`,
                          background: `linear-gradient(90deg, ${color}66, ${color})`,
                          animationDelay: `${idx * 50 + 200}ms`,
                        }} />
                      </div>
                    </div>

                    {/* Gate dots */}
                    <div className="flex gap-1.5">
                      {(['core', 'import', 'emerging', 'combined'] as const).map(gate => {
                        const s = getGateStatus(seller.bbiGates, gate);
                        return (
                          <div key={gate} className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold transition-transform hover:scale-125"
                            style={{
                              background: s === 'unlocked' ? 'rgba(34,197,94,0.18)' : s === 'at-risk' ? 'rgba(245,158,11,0.18)' : 'rgba(248,113,113,0.12)',
                              color: s === 'unlocked' ? '#22C55E' : s === 'at-risk' ? '#F59E0B' : '#F87171',
                              boxShadow: s === 'unlocked' ? '0 0 4px rgba(34,197,94,0.25)' : 'none',
                            }}>
                            {s === 'unlocked' ? '\u2713' : s === 'at-risk' ? '!' : '\u2717'}
                          </div>
                        );
                      })}
                    </div>

                    {/* Sparkline */}
                    <Sparkline data={seller.weeklyAttainment} color={color} />
                  </div>
                );
              })}
            </div>
          </LightSectionCard>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────
export default function MeasurementsPage() {
  const [activeTab, setActiveTab] = useState<MeasurementsTab>('attainment');
  const [hometownFilter, setHometownFilter] = useState('all');

  useEffect(() => { injectStyles(); }, []);

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Header (enhanced with gradient accent bar) */}
      <div className="mt-6 mb-5 relative">
        <div className="absolute -left-2 top-0 w-1 h-full rounded-full" style={{ background: `linear-gradient(180deg, ${ACT5_ACCENT}, ${ACT5_ACCENT}20)` }} />
        <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: ACT5_ACCENT }}>
          Sales Comp Management &middot; Measurements
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          Measurements
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          Category attainment gates and seller performance visibility
        </p>
      </div>

      {/* Tab Bar (enhanced with icons and gradient active state) */}
      <div className="flex gap-0 mb-6 rounded-xl overflow-hidden" style={{ background: 'var(--pl-hover)', border: '1px solid var(--pl-border)' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 px-4 py-3 text-[12px] font-semibold transition-all flex items-center justify-center gap-2"
            style={{
              background: activeTab === tab.id
                ? `linear-gradient(135deg, ${ACT5_ACCENT}12, ${ACT5_ACCENT}06)`
                : 'transparent',
              borderBottom: activeTab === tab.id ? `2px solid ${ACT5_ACCENT}` : '2px solid transparent',
              color: activeTab === tab.id ? ACT5_ACCENT : 'var(--pl-text-muted)',
            }}
          >
            <span style={{ fontSize: 14, opacity: activeTab === tab.id ? 1 : 0.4 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hometown filter (shown only on attainment tab) */}
      {activeTab === 'attainment' && (
        <div className="flex flex-wrap gap-2 mb-5 m-fade-slide">
          <button
            onClick={() => setHometownFilter('all')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: hometownFilter === 'all' ? `linear-gradient(135deg, ${ACT5_ACCENT}18, ${ACT5_ACCENT}08)` : 'var(--pl-chart-bar-track)',
              color: hometownFilter === 'all' ? ACT5_ACCENT : 'var(--pl-text-muted)',
              border: `1px solid ${hometownFilter === 'all' ? `${ACT5_ACCENT}40` : 'var(--pl-border)'}`,
              boxShadow: hometownFilter === 'all' ? `0 0 6px ${ACT5_ACCENT}12` : 'none',
            }}
          >
            All Hometowns
          </button>
          {HOMETOWNS.map(ht => (
            <button
              key={ht.id}
              onClick={() => setHometownFilter(ht.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: hometownFilter === ht.id ? `linear-gradient(135deg, ${ACT5_ACCENT}18, ${ACT5_ACCENT}08)` : 'var(--pl-chart-bar-track)',
                color: hometownFilter === ht.id ? ACT5_ACCENT : 'var(--pl-text-muted)',
                border: `1px solid ${hometownFilter === ht.id ? `${ACT5_ACCENT}40` : 'var(--pl-border)'}`,
                boxShadow: hometownFilter === ht.id ? `0 0 6px ${ACT5_ACCENT}12` : 'none',
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
